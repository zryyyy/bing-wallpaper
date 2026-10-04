import assert from 'node:assert/strict';
import { test } from 'node:test';
import { createHistoryPager, groupByMonth, previousMonth } from '../src/lib/history.ts';
import { API_BASE_URL, filterWallpapers, sortWallpapers } from '../src/lib/wallpapers.ts';
import type { Wallpaper } from '../src/types.ts';

function wallpaper(date: string, copyright = `Wallpaper ${date}`): Wallpaper {
  return { date, copyright, url: `https://example.com/${date}.jpg` };
}

type Fixture = Wallpaper[] | number | Error | (() => Promise<Response>);

function setup(fixtures: Record<string, Fixture>) {
  const calls: string[] = [];
  const controller = new AbortController();
  const fetcher: typeof fetch = async (input, options) => {
    assert.equal(options?.signal, controller.signal);
    const path = String(input).replace(`${API_BASE_URL}/`, '');
    calls.push(path);
    const fixture = fixtures[path];
    assert.notEqual(fixture, undefined, `Unexpected request: ${path}`);
    if (fixture instanceof Error) throw fixture;
    if (typeof fixture === 'function') return fixture();
    if (typeof fixture === 'number') return new Response(null, { status: fixture });
    return Response.json(fixture);
  };
  return { pager: createHistoryPager(controller.signal, fetcher), calls, controller };
}

test('month pagination crosses the year boundary', () => {
  assert.equal(previousMonth('2025-01'), '2024-12');
  assert.equal(previousMonth('2024-12'), '2024-11');
  assert.equal(previousMonth('2024-03'), '2024-02');
});

test('sort, deduplicate and group records by descending month; search only supplied records', () => {
  const records = sortWallpapers([
    wallpaper('20240901'),
    wallpaper('20241001', 'Old title'),
    wallpaper('20241002', 'Mountain'),
    wallpaper('20241001', 'New title'),
  ]);
  assert.deepEqual(
    records.map((item) => item.date),
    ['20241002', '20241001', '20240901'],
  );
  assert.deepEqual(
    groupByMonth(records).map(([month]) => month),
    ['2024-10', '2024-09'],
  );
  assert.equal(records[1]?.copyright, 'New title');
  assert.deepEqual(filterWallpapers(records, ' MOUNTAIN '), [records[0]]);
  assert.deepEqual(filterWallpapers(records, '202409'), [records[2]]);
  assert.deepEqual(filterWallpapers(records, 'not loaded'), []);
});

test('uses the newest recent record to load a complete month and retains only one prefetched page', async () => {
  const october = [wallpaper('20241001'), wallpaper('20241002')];
  const { pager, calls } = setup({
    'en-SG.json': [wallpaper('20240930'), wallpaper('20241002')],
    '2024-10/en-SG.json': october,
    '2024-09/en-SG.json': [wallpaper('20240930')],
  });
  assert.deepEqual(pager.take(), []);
  const page = await pager.prefetch();
  assert.deepEqual(
    page?.map((item) => item.date),
    ['20241002', '20241001'],
  );
  await pager.prefetch();
  assert.deepEqual(calls, ['en-SG.json', '2024-10/en-SG.json']);
  assert.deepEqual(pager.take(), page);
  assert.deepEqual(pager.take(), []);
  await pager.prefetch();
  await pager.prefetch();
  assert.deepEqual(calls, ['en-SG.json', '2024-10/en-SG.json', '2024-09/en-SG.json']);
});

test('concurrent prefetch and append consumers share the same request', async () => {
  let resolve: (response: Response) => void = () => {};
  const delayed = new Promise<Response>((done) => {
    resolve = done;
  });
  const { pager, calls } = setup({
    'en-SG.json': () => delayed,
    '2024-01/en-SG.json': [wallpaper('20240102')],
  });
  const first = pager.prefetch();
  const second = pager.prefetch();
  assert.equal(first, second);
  resolve(Response.json([wallpaper('20240102')]));
  await Promise.all([first, second]);
  assert.deepEqual(calls, ['en-SG.json', '2024-01/en-SG.json']);
  assert.equal(pager.hasMore, true);
  pager.take();
  assert.equal(pager.hasMore, false);
  assert.equal(await pager.prefetch(), null);
  assert.equal(calls.length, 2);
});

test('skips 404 and empty months, then stops at January 2024', async () => {
  const { pager, calls } = setup({
    'en-SG.json': [wallpaper('20240401')],
    '2024-04/en-SG.json': [wallpaper('20240401')],
    '2024-03/en-SG.json': 404,
    '2024-02/en-SG.json': [],
    '2024-01/en-SG.json': [wallpaper('20240102')],
  });
  await pager.prefetch();
  pager.take();
  assert.equal((await pager.prefetch())?.[0]?.date, '20240102');
  pager.take();
  assert.equal(pager.hasMore, false);
  assert.equal(await pager.prefetch(), null);
  assert.deepEqual(calls, [
    'en-SG.json',
    '2024-04/en-SG.json',
    '2024-03/en-SG.json',
    '2024-02/en-SG.json',
    '2024-01/en-SG.json',
  ]);
});

test('an empty oldest month exhausts history without requests before the lower bound', async () => {
  const { pager, calls } = setup({
    'en-SG.json': [wallpaper('20240101')],
    '2024-01/en-SG.json': 404,
  });
  assert.equal(await pager.prefetch(), null);
  assert.equal(pager.hasMore, false);
  assert.equal(calls.length, 2);
});

for (const [name, failure] of [
  ['server error', 500],
  ['network error', new Error('offline')],
  ['malformed JSON', async () => new Response('{broken')],
  ['invalid record', async () => Response.json([{ date: 'invalid' }])],
  ['wrong month', [wallpaper('20240201')]],
] satisfies [string, Fixture][]) {
  test(`retries the same month after ${name}, preserving previously consumed content`, async () => {
    const fixtures: Record<string, Fixture> = {
      'en-SG.json': [wallpaper('20240201')],
      '2024-02/en-SG.json': [wallpaper('20240201')],
      '2024-01/en-SG.json': failure,
    };
    const { pager, calls } = setup(fixtures);
    await pager.prefetch();
    const displayed = pager.take();
    await assert.rejects(pager.prefetch());
    assert.equal(pager.hasMore, true);
    assert.deepEqual(displayed, [wallpaper('20240201')]);
    fixtures['2024-01/en-SG.json'] = [wallpaper('20240102')];
    await pager.prefetch();
    assert.deepEqual(pager.take(), [wallpaper('20240102')]);
    assert.deepEqual(calls.slice(-2), ['2024-01/en-SG.json', '2024-01/en-SG.json']);
  });
}

test('a failed initial recent request is retryable and an empty recent feed ends cleanly', async () => {
  const fixtures: Record<string, Fixture> = { 'en-SG.json': 503 };
  const { pager, calls } = setup(fixtures);
  await assert.rejects(pager.prefetch());
  fixtures['en-SG.json'] = [];
  assert.equal(await pager.prefetch(), null);
  assert.equal(pager.hasMore, false);
  assert.deepEqual(calls, ['en-SG.json', 'en-SG.json']);
});

test('abort prevents a late response from advancing the old session', async () => {
  let resolve: (response: Response) => void = () => {};
  const delayed = new Promise<Response>((done) => {
    resolve = done;
  });
  const { pager, controller, calls } = setup({ 'en-SG.json': () => delayed });
  const request = pager.prefetch();
  controller.abort();
  resolve(Response.json([wallpaper('20241001')]));
  await assert.rejects(request, { name: 'AbortError' });
  await assert.rejects(pager.prefetch(), { name: 'AbortError' });
  assert.throws(() => pager.take(), { name: 'AbortError' });
  assert.deepEqual(calls, ['en-SG.json']);
});
