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
    <section className="relative flex h-[85vh] min-h-150 w-full items-end overflow-hidden">
      <motion.div
        initial={{ opacity: 0, scale: 1.05 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1.2, ease: 'easeOut' }}
        className="absolute inset-0"
      >
        <img
          src={wallpaper.url}
          alt={title}
          className="size-full object-cover"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-linear-to-t from-zinc-950 via-zinc-950/40 to-transparent" />
      </motion.div>

      <div className="relative z-10 mx-auto flex w-full max-w-7xl flex-col justify-between gap-8 px-6 pb-24 md:flex-row md:items-end">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="max-w-3xl"
        >
          <span className="mb-6 inline-block rounded-full border border-white/10 bg-white/10 px-3 py-1 font-medium text-xs text-zinc-300 uppercase tracking-widest backdrop-blur-md">
            Today's Feature
          </span>
          <h2 className="mb-4 font-medium font-serif text-4xl text-white leading-tight drop-shadow-lg md:text-6xl lg:text-7xl">
            {title}
          </h2>
          <p className="max-w-xl font-light text-sm text-zinc-400 tracking-wide md:text-base">
            {copyrightText}
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="flex shrink-0 items-center gap-4"
        >
          <button
            type="button"
            onClick={() => onOpen(wallpaper)}
            className="group flex size-12 items-center justify-center rounded-full border border-white/10 bg-white/10 text-white backdrop-blur-md transition-all hover:bg-white hover:text-zinc-950"
            aria-label="View Fullscreen"
          >
            <Maximize2 className="size-5 transition-transform group-hover:scale-110" />
          </button>
          <a
            href={wallpaper.url}
            target="_blank"
            rel="noreferrer"
            className="flex h-12 items-center justify-center gap-2 rounded-full bg-white px-6 font-medium text-zinc-950 transition-colors hover:bg-zinc-200"
          >
            <Download className="size-4" />
            <span>Download</span>
          </a>
        </motion.div>
      </div>
    </section>
  );
}
