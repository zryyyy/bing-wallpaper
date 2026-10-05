import type { Wallpaper } from '../types.ts';
import { fetchWallpapers } from './wallpapers.ts';

export const FIRST_HISTORY_MONTH = '2024-01';

export function wallpaperMonth(date: string): string {
  return `${date.slice(0, 4)}-${date.slice(4, 6)}`;
}

export function previousMonth(month: string): string {
  const year = Number(month.slice(0, 4));
  const value = Number(month.slice(5, 7));
  return value === 1 ? `${year - 1}-12` : `${year}-${String(value - 1).padStart(2, '0')}`;
}

export function groupByMonth(wallpapers: Wallpaper[]): [string, Wallpaper[]][] {
  const groups = new Map<string, Wallpaper[]>();
  for (const wallpaper of wallpapers) {
    const month = wallpaperMonth(wallpaper.date);
    const group = groups.get(month) ?? [];
    group.push(wallpaper);
    groups.set(month, group);
  }
  return [...groups];
}

// One session owns its cursor, in-flight request and single unpublished month.
export function createHistoryPager(signal: AbortSignal, fetcher: typeof fetch = fetch) {
  let cursor: string | undefined;
  let buffered: Wallpaper[] | null = null;
  let pending: Promise<Wallpaper[] | null> | null = null;
  let exhausted = false;

  async function findNextMonth(): Promise<Wallpaper[] | null> {
    signal.throwIfAborted();
    if (cursor === undefined) {
      const recent = await fetchWallpapers('en-SG.json', signal, false, fetcher);
      signal.throwIfAborted();
      if (!recent[0]) {
        exhausted = true;
        return null;
      }
      cursor = wallpaperMonth(recent[0].date);
    }

    while (cursor >= FIRST_HISTORY_MONTH) {
      const month = cursor;
      const wallpapers = await fetchWallpapers(`${month}/en-SG.json`, signal, true, fetcher);
      signal.throwIfAborted();
      // A bad archive must be retried, rather than silently losing a month.
      if (wallpapers.some((wallpaper) => wallpaperMonth(wallpaper.date) !== month)) {
        throw new Error('Unexpected month in wallpaper data.');
      }
      cursor = previousMonth(month);
      exhausted = cursor < FIRST_HISTORY_MONTH;
      if (wallpapers.length > 0) {
        buffered = wallpapers;
        return buffered;
      }
    }
    exhausted = true;
    return null;
  }

  return {
    get hasMore() {
      return buffered !== null || !exhausted;
    },
    prefetch(): Promise<Wallpaper[] | null> {
      if (signal.aborted) return Promise.reject(signal.reason);
      if (buffered) return Promise.resolve(buffered);
      if (pending) return pending;
      if (exhausted) return Promise.resolve(null);
      pending = findNextMonth().finally(() => {
        pending = null;
      });
      return pending;
    },
    take(): Wallpaper[] {
      signal.throwIfAborted();
      const result = buffered ?? [];
      buffered = null;
      return result;
    },
  };
}
