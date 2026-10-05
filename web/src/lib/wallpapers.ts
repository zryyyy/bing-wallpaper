import type { Wallpaper } from '../types.ts';

export const API_BASE_URL =
  'https://raw.githubusercontent.com/zryyyy/bing-wallpaper/refs/heads/master/img';

export function sortWallpapers(wallpapers: Wallpaper[]): Wallpaper[] {
  return [...new Map(wallpapers.map((wallpaper) => [wallpaper.date, wallpaper])).values()].sort(
    (a, b) => b.date.localeCompare(a.date),
  );
}

export function filterWallpapers(wallpapers: Wallpaper[], searchQuery: string): Wallpaper[] {
  const query = searchQuery.trim().toLowerCase();
  if (!query) return wallpapers;
  return wallpapers.filter(
    (wallpaper) =>
      wallpaper.copyright.toLowerCase().includes(query) || wallpaper.date.includes(query),
  );
}

export async function fetchWallpapers(
  path: string,
  signal: AbortSignal,
  allowMissing = false,
  fetcher: typeof fetch = fetch,
): Promise<Wallpaper[]> {
  const response = await fetcher(`${API_BASE_URL}/${path}`, { signal });
  if (allowMissing && response.status === 404) return [];
  if (!response.ok) throw new Error(`Failed to load wallpapers (${response.status}).`);

  const data: unknown = await response.json();
  if (
    !Array.isArray(data) ||
    !data.every(
      (item): item is Wallpaper =>
        typeof item === 'object' &&
        item !== null &&
        'date' in item &&
        typeof item.date === 'string' &&
        /^\d{4}(0[1-9]|1[0-2])(0[1-9]|[12]\d|3[01])$/.test(item.date) &&
        'url' in item &&
        typeof item.url === 'string' &&
        'copyright' in item &&
        typeof item.copyright === 'string',
    )
  ) {
    throw new Error('Invalid wallpaper data.');
  }
  return sortWallpapers(data);
}
