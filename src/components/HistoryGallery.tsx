import { Loader2 } from 'lucide-react';
import { useEffect, useMemo, useRef } from 'react';
import WallpaperCard from '@/components/WallpaperCard.tsx';
import { useHistoryWallpapers } from '@/hooks/useHistoryWallpapers.ts';
import { groupByMonth } from '@/lib/history.ts';
import { filterWallpapers } from '@/lib/wallpapers.ts';
import type { Wallpaper } from '@/types.ts';

interface HistoryGalleryProps {
  searchQuery: string;
  onOpen: (wallpaper: Wallpaper) => void;
}

function formatMonth(month: string): string {
  return new Date(`${month}-01T00:00:00Z`).toLocaleDateString('en-US', {
    month: 'long',
    year: 'numeric',
    timeZone: 'UTC',
  });
}

export default function HistoryGallery({ searchQuery, onOpen }: HistoryGalleryProps) {
  const searching = Boolean(searchQuery.trim());
  const { wallpapers, loading, loadingMore, hasMore, error, prefetch, loadMore } =
    useHistoryWallpapers(searching);
  const sentinel = useRef<HTMLDivElement>(null);
  const groups = useMemo(
    () => groupByMonth(filterWallpapers(wallpapers, searchQuery)),
    [wallpapers, searchQuery],
  );

  useEffect(() => {
    const target = sentinel.current;
    if (
      !target ||
      wallpapers.length === 0 ||
      searching ||
      loading ||
      loadingMore ||
      error ||
      !hasMore ||
      typeof IntersectionObserver === 'undefined'
    ) {
      return;
    }

    let active = true;
    const prefetchObserver = new IntersectionObserver(
      (entries) => {
        if (active && entries.some((entry) => entry.isIntersecting)) prefetch();
      },
      { rootMargin: '0px 0px 1200px 0px' },
    );
    const appendObserver = new IntersectionObserver(
      (entries) => {
        if (active && entries.some((entry) => entry.isIntersecting)) loadMore(true);
      },
      { rootMargin: '0px 0px 300px 0px' },
    );
    prefetchObserver.observe(target);
    appendObserver.observe(target);
    return () => {
      active = false;
      prefetchObserver.disconnect();
      appendObserver.disconnect();
    };
    // Re-observe the moved sentinel after each append, even when it stays in view.
  }, [searching, loading, loadingMore, error, hasMore, wallpapers.length, prefetch, loadMore]);

  return (
    <section className="mx-auto max-w-7xl px-6 py-16" aria-label="Global wallpaper history">
      <div className="mb-12">
        <h2 className="font-serif text-3xl text-white/90">Global History</h2>
        <p className="mt-3 text-sm text-zinc-400">Explore global wallpapers, month by month.</p>
        <p className="mt-2 text-sm text-zinc-500">
          Search covers loaded history only.{' '}
          {searching
            ? 'Automatic loading is paused while searching. Load earlier months to search more.'
            : 'Scroll down to discover earlier months.'}
        </p>
      </div>

      <div className="space-y-16">
        {groups.map(([month, monthWallpapers]) => (
          <section key={month} aria-labelledby={`month-${month}`}>
            <div className="mb-8 flex items-center gap-6">
              <h3 id={`month-${month}`} className="shrink-0 font-serif text-2xl text-white/90">
                <time dateTime={month}>{formatMonth(month)}</time>
              </h3>
              <div className="h-px grow bg-white/10" />
            </div>
            <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
              {monthWallpapers.map((wallpaper, index) => (
                <WallpaperCard
                  key={wallpaper.date}
                  wallpaper={wallpaper}
                  index={index}
                  onOpen={onOpen}
                />
              ))}
            </div>
          </section>
        ))}
      </div>

      {!loading && groups.length === 0 && (searching || !error) && (
        <p className="py-16 text-center text-zinc-400">
          {searching ? 'No matches in loaded history.' : 'No history is available yet.'}
        </p>
      )}

      <div ref={sentinel} className="h-px" aria-hidden="true" />
      <div className="flex min-h-32 flex-col items-center justify-center gap-4 pt-8 text-sm text-zinc-400">
        <div role="status" aria-live="polite">
          {loading || loadingMore ? (
            <p className="flex items-center gap-2">
              <Loader2 className="size-5 animate-spin" />
              {loading ? 'Loading history...' : 'Loading earlier wallpapers...'}
            </p>
          ) : error ? (
            <p>Unable to load history. {error}</p>
          ) : !hasMore ? (
            <p>You've reached the beginning of available history.</p>
          ) : null}
        </div>
        {!loading && !loadingMore && (error || hasMore) && (
          <button
            type="button"
            onClick={() => loadMore()}
            className="rounded-full border border-white/15 px-5 py-2 text-zinc-200 transition-colors hover:bg-white/10 focus-visible:outline-2 focus-visible:outline-white"
          >
            {error ? 'Retry' : 'Load earlier months'}
          </button>
        )}
      </div>
    </section>
  );
}
