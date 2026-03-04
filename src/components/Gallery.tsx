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
      <div className="w-full py-32 flex flex-col items-center justify-center text-zinc-500">
        <p className="text-lg font-medium">No wallpapers found for your search.</p>
        <p className="text-sm mt-2">Please try a different keyword or date.</p>
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
    <section className="max-w-7xl mx-auto px-6 py-24">
      <div className="mb-12 flex items-center justify-between">
        <h3 className="text-3xl font-serif text-white/90">Recent Collection</h3>
        <div className="h-px bg-white/10 grow ml-8" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {wallpapers.map((wallpaper, index) => {
          const titleParts = wallpaper.copyright.split(' (©');
          const title = titleParts[0];

          return (
            <motion.div
              key={wallpaper.date}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.05 }}
              className="group relative aspect-4/3 rounded-2xl overflow-hidden cursor-pointer bg-zinc-900 border border-white/5"
              onClick={() => onOpen(wallpaper)}
            >
              <img
                src={wallpaper.url}
                alt={title}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                referrerPolicy="no-referrer"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-linear-to-t from-zinc-950/90 via-zinc-950/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

              <div className="absolute inset-0 p-6 flex flex-col justify-end translate-y-4 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-all duration-300">
                <div className="flex items-center gap-2 text-zinc-400 text-xs font-mono mb-2">
                  <Calendar className="w-3 h-3" />
                  <span>{formatDate(wallpaper.date)}</span>
                </div>
                <h4 className="text-white font-medium text-lg leading-snug line-clamp-2 mb-1">
                  {title}
                </h4>
              </div>

              <div className="absolute top-4 right-4 w-8 h-8 rounded-full bg-black/40 backdrop-blur-md flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 border border-white/10">
                <Maximize2 className="w-4 h-4 text-white" />
              </div>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}
