import { Download, Maximize2 } from 'lucide-react';
import { motion } from 'motion/react';
import type { Wallpaper } from '../types';

interface HeroProps {
  wallpaper: Wallpaper;
  onOpen: (wallpaper: Wallpaper) => void;
}

export default function Hero({ wallpaper, onOpen }: HeroProps) {
  if (!wallpaper) return null;

  // Extract a cleaner title from copyright if possible
  const titleParts = wallpaper.copyright.split(' (©');
  const title = titleParts[0];
  const copyrightText =
    titleParts.length > 1 ? `© ${titleParts[1]?.replace(')', '')}` : wallpaper.copyright;

  return (
    <section className="relative w-full h-[85vh] min-h-150 flex items-end overflow-hidden">
      <motion.div
        initial={{ opacity: 0, scale: 1.05 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1.2, ease: 'easeOut' }}
        className="absolute inset-0"
      >
        <img
          src={wallpaper.url}
          alt={title}
          className="w-full h-full object-cover"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-linear-to-t from-zinc-950 via-zinc-950/40 to-transparent" />
      </motion.div>

      <div className="relative z-10 w-full max-w-7xl mx-auto px-6 pb-24 flex flex-col md:flex-row md:items-end justify-between gap-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="max-w-3xl"
        >
          <span className="inline-block px-3 py-1 mb-6 text-xs font-medium tracking-widest uppercase bg-white/10 backdrop-blur-md rounded-full border border-white/10 text-zinc-300">
            Today's Feature
          </span>
          <h2 className="text-4xl md:text-6xl lg:text-7xl font-serif font-medium leading-tight text-white mb-4 drop-shadow-lg">
            {title}
          </h2>
          <p className="text-zinc-400 text-sm md:text-base font-light tracking-wide max-w-xl">
            {copyrightText}
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="flex items-center gap-4 shrink-0"
        >
          <button
            type="button"
            onClick={() => onOpen(wallpaper)}
            className="w-12 h-12 flex items-center justify-center rounded-full bg-white/10 backdrop-blur-md border border-white/10 text-white hover:bg-white hover:text-zinc-950 transition-all group"
            aria-label="View Fullscreen"
          >
            <Maximize2 className="w-5 h-5 group-hover:scale-110 transition-transform" />
          </button>
          <a
            href={wallpaper.url}
            target="_blank"
            rel="noreferrer"
            className="h-12 px-6 flex items-center justify-center gap-2 rounded-full bg-white text-zinc-950 font-medium hover:bg-zinc-200 transition-colors"
          >
            <Download className="w-4 h-4" />
            <span>Download</span>
          </a>
        </motion.div>
      </div>
    </section>
  );
}
