import { Calendar, Maximize2 } from 'lucide-react';
import { motion } from 'motion/react';
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

  const formatDate = (dateString: string) => {
    if (dateString.length !== 8) return dateString;
    const year = dateString.substring(0, 4);
    const month = dateString.substring(4, 6);
    const day = dateString.substring(6, 8);
    return new Date(`${year}-${month}-${day}`).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  return (
    <section className="mx-auto max-w-7xl px-6 py-24">
      <div className="mb-12 flex items-center justify-between">
        <h3 className="font-serif text-3xl text-white/90">Recent Collection</h3>
        <div className="ml-8 h-px grow bg-white/10" />
      </div>

      <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
        {wallpapers.map((wallpaper, index) => {
          const titleParts = wallpaper.copyright.split(' (©');
          const title = titleParts[0];

          return (
            <motion.div
              key={wallpaper.date}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.05 }}
              className="group relative aspect-4/3 cursor-pointer overflow-hidden rounded-2xl border border-white/5 bg-zinc-900"
              onClick={() => onOpen(wallpaper)}
            >
              <img
                src={wallpaper.url}
                alt={title}
                className="size-full object-cover transition-transform duration-700 group-hover:scale-105"
                referrerPolicy="no-referrer"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-linear-to-t from-zinc-950/90 via-zinc-950/20 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

              <div className="absolute inset-0 flex translate-y-4 flex-col justify-end p-6 opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
                <div className="mb-2 flex items-center gap-2 font-mono text-xs text-zinc-400">
                  <Calendar className="size-3" />
                  <span>{formatDate(wallpaper.date)}</span>
                </div>
                <h4 className="mb-1 line-clamp-2 font-medium text-lg text-white leading-snug">
                  {title}
                </h4>
              </div>

              <div className="absolute top-4 right-4 flex size-8 items-center justify-center rounded-full border border-white/10 bg-black/40 opacity-0 backdrop-blur-md transition-opacity duration-300 group-hover:opacity-100">
                <Maximize2 className="size-4 text-white" />
              </div>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}
