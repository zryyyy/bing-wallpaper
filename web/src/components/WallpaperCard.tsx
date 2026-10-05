import { Calendar, Maximize2 } from 'lucide-react';
import { motion } from 'motion/react';
import type { Wallpaper } from '@/types.ts';

interface WallpaperCardProps {
  wallpaper: Wallpaper;
  index: number;
  onOpen: (wallpaper: Wallpaper) => void;
}

export default function WallpaperCard({ wallpaper, index, onOpen }: WallpaperCardProps) {
  const title = wallpaper.copyright.split(' (©')[0];
  const formatDate = (dateString: string) => {
    if (dateString.length !== 8) return dateString;
    const year = dateString.substring(0, 4);
    const month = dateString.substring(4, 6);
    const day = dateString.substring(6, 8);
    return new Date(`${year}-${month}-${day}`).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      timeZone: 'UTC',
    });
  };

  return (
    <motion.button
      type="button"
      aria-label={`View ${title}`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: Math.min(index, 5) * 0.05 }}
      className="group relative block aspect-4/3 w-full cursor-pointer overflow-hidden rounded-2xl border border-white/5 bg-zinc-900 text-left"
      onClick={() => onOpen(wallpaper)}
    >
      <img
        src={wallpaper.url}
        alt={title}
        className="size-full object-cover transition-transform duration-700 group-hover:scale-105"
        referrerPolicy="no-referrer"
        loading="lazy"
      />
      <span className="absolute inset-0 bg-linear-to-t from-zinc-950/90 via-zinc-950/20 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100 group-focus-visible:opacity-100" />

      <span className="absolute inset-0 flex translate-y-4 flex-col justify-end p-6 opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100 group-focus-visible:translate-y-0 group-focus-visible:opacity-100">
        <span className="mb-2 flex items-center gap-2 font-mono text-xs text-zinc-400">
          <Calendar className="size-3" />
          <span>{formatDate(wallpaper.date)}</span>
        </span>
        <span className="mb-1 line-clamp-2 font-medium text-lg text-white leading-snug">
          {title}
        </span>
      </span>

      <span className="absolute top-4 right-4 flex size-8 items-center justify-center rounded-full border border-white/10 bg-black/40 opacity-0 backdrop-blur-md transition-opacity duration-300 group-hover:opacity-100 group-focus-visible:opacity-100">
        <Maximize2 className="size-4 text-white" />
      </span>
    </motion.button>
  );
}
