import { useCallback, useEffect, useRef, useState } from 'react';
import { createHistoryPager } from '@/lib/history.ts';
import { sortWallpapers } from '@/lib/wallpapers.ts';
import type { Wallpaper } from '@/types.ts';

interface HistoryState {
  wallpapers: Wallpaper[];
  loading: boolean;
  loadingMore: boolean;
  hasMore: boolean;
  error: string | null;
}

const INITIAL_STATE: HistoryState = {
  wallpapers: [],
  loading: true,
  loadingMore: false,
  hasMore: true,
  error: null,
};

export function useHistoryWallpapers(paused: boolean) {
  const [state, setState] = useState(INITIAL_STATE);
  const pausedRef = useRef(paused);
  const actions = useRef({ prefetch: () => {}, loadMore: (_automatic: boolean) => {} });

  useEffect(() => {
    pausedRef.current = paused;
  }, [paused]);

  useEffect(() => {
    const controller = new AbortController();
    const pager = createHistoryPager(controller.signal);
    let appending = false;
    let initialized = false;

    function reportError(error: unknown) {
      if (controller.signal.aborted) return;
      setState((current) => ({
        ...current,
        error: error instanceof Error ? error.message : 'Unable to load history.',
      }));
    }

    async function prefetch() {
      if (pausedRef.current || !pager.hasMore) return;
      try {
        await pager.prefetch();
        if (!controller.signal.aborted) {
          setState((current) => ({ ...current, hasMore: pager.hasMore }));
        }
      } catch (error) {
        reportError(error);
      }
    }

    async function loadMore(automatic: boolean) {
      if (appending || !pager.hasMore || (automatic && pausedRef.current)) return;
      appending = true;
      setState((current) => ({
        ...current,
        error: null,
        loading: !initialized,
        loadingMore: initialized,
      }));
      try {
        await pager.prefetch();
        if (controller.signal.aborted || (automatic && pausedRef.current)) return;
        const wallpapers = pager.take();
        initialized = true;
        setState((current) => ({
          ...current,
          wallpapers: sortWallpapers([...current.wallpapers, ...wallpapers]),
          hasMore: pager.hasMore,
          error: null,
        }));
      } catch (error) {
        reportError(error);
      } finally {
        appending = false;
        if (!controller.signal.aborted) {
          setState((current) => ({ ...current, loading: false, loadingMore: false }));
        }
      }
    }

    actions.current = { prefetch, loadMore };
    setState(INITIAL_STATE);
    void loadMore(false);
    return () => controller.abort();
  }, []);

  const prefetch = useCallback(() => actions.current.prefetch(), []);
  const loadMore = useCallback((automatic = false) => actions.current.loadMore(automatic), []);

  return { ...state, prefetch, loadMore };
}
