import { Calendar, Download, Info, X } from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';
import { useEffect } from 'react';
import type { Wallpaper } from '@/types.ts';

interface ImageModalProps {
  wallpaper: Wallpaper | null;
  onClose: () => void;
}

export default function ImageModal({ wallpaper, onClose }: ImageModalProps) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (wallpaper) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    } else {
      document.body.style.overflow = 'auto';
    }
    return () => {
      document.body.style.overflow = 'auto';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [wallpaper, onClose]);

  const titleParts = wallpaper?.copyright.split(' (©') || [];
  const title = titleParts[0] || '';
  const copyrightText =
    titleParts.length > 1 ? `© ${titleParts[1]?.replace(')', '')}` : wallpaper?.copyright || '';

  const formatDate = (dateString: string) => {
    if (dateString.length !== 8) return dateString;
    const year = dateString.substring(0, 4);
    const month = dateString.substring(4, 6);
    const day = dateString.substring(6, 8);
    return new Date(`${year}-${month}-${day}`).toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    });
  };

  return (
    <AnimatePresence>
      {wallpaper && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed inset-0 z-100 flex items-center justify-center bg-zinc-950/95 p-4 backdrop-blur-xl md:p-8"
          onClick={onClose}
        >
          <button
            type="button"
            onClick={onClose}
            className="absolute top-6 right-6 z-50 flex size-12 items-center justify-center rounded-full border border-white/10 bg-white/10 text-white transition-colors hover:bg-white/20"
          >
            <X className="size-6" />
          </button>

          <motion.div
            initial={{ scale: 0.95, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 20 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="relative flex size-fit max-h-[90vh] max-w-[90vw] flex-col overflow-hidden rounded-3xl border border-white/10 bg-zinc-900 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative flex min-h-0 grow items-center justify-center bg-zinc-900/50">
              <img
                src={wallpaper.url}
                alt={title}
                className="size-auto max-h-[70vh] max-w-full object-contain"
                referrerPolicy="no-referrer"
              />
            </div>

            <div className="flex flex-col items-start justify-between gap-6 border-white/5 border-t bg-zinc-900 p-6 md:flex-row md:items-center md:p-8">
              <div className="max-w-3xl">
                <h2 className="mb-2 font-medium font-serif text-2xl text-white md:text-3xl">
                  {title}
                </h2>
                <div className="flex flex-wrap items-center gap-4 text-sm text-zinc-400">
                  <div className="flex items-center gap-1.5 font-mono">
                    <Calendar className="size-4" />
                    <span>{formatDate(wallpaper.date)}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Info className="size-4" />
                    <span>{copyrightText}</span>
                  </div>
                </div>
              </div>

              <a
                href={wallpaper.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex shrink-0 items-center gap-2 rounded-full bg-white px-6 py-3 font-medium text-zinc-950 transition-colors hover:bg-zinc-200"
              >
                <Download className="size-4" />
                <span>Download</span>
              </a>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
