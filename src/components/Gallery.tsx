import WallpaperCard from '@/components/WallpaperCard.tsx';
import type { Wallpaper } from '@/types.ts';

interface GalleryProps {
  wallpapers: Wallpaper[];
  onOpen: (wallpaper: Wallpaper) => void;
}

export default function Gallery({ wallpapers, onOpen }: GalleryProps) {
  if (wallpapers.length === 0) {
    return (
      <div className="flex w-full flex-col items-center justify-center py-32 text-zinc-500">
        <p className="font-medium text-lg">No wallpapers found for your search.</p>
        <p className="mt-2 text-sm">Please try a different keyword or date.</p>
      </div>
    );
  }

  return (
    <section className="mx-auto max-w-7xl px-6 py-24">
      <div className="mb-12 flex items-center justify-between">
        <h3 className="font-serif text-3xl text-white/90">Recent Collection</h3>
        <div className="ml-8 h-px grow bg-white/10" />
      </div>

      <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
        {wallpapers.map((wallpaper, index) => (
          <WallpaperCard key={wallpaper.date} wallpaper={wallpaper} index={index} onOpen={onOpen} />
        ))}
      </div>
    </section>
  );
}
