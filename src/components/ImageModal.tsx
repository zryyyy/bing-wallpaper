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
          className="fixed inset-0 z-100 flex items-center justify-center bg-zinc-950/95 backdrop-blur-xl p-4 md:p-8"
          onClick={onClose}
        >
          <button
            type="button"
            onClick={onClose}
            className="absolute top-6 right-6 w-12 h-12 flex items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors z-50 border border-white/10"
          >
            <X className="w-6 h-6" />
          </button>

          <motion.div
            initial={{ scale: 0.95, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 20 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="relative w-fit h-fit max-w-[90vw] max-h-[90vh] flex flex-col bg-zinc-900 rounded-3xl overflow-hidden shadow-2xl border border-white/10"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative grow min-h-0 bg-zinc-900/50 flex items-center justify-center">
              <img
                src={wallpaper.url}
                alt={title}
                className="max-w-full max-h-[70vh] h-auto w-auto object-contain"
                referrerPolicy="no-referrer"
              />
            </div>

            <div className="p-6 md:p-8 bg-zinc-900 flex flex-col md:flex-row justify-between items-start md:items-center gap-6 border-t border-white/5">
              <div className="max-w-3xl">
                <h2 className="text-2xl md:text-3xl font-serif font-medium text-white mb-2">
                  {title}
                </h2>
                <div className="flex flex-wrap items-center gap-4 text-sm text-zinc-400">
                  <div className="flex items-center gap-1.5 font-mono">
                    <Calendar className="w-4 h-4" />
                    <span>{formatDate(wallpaper.date)}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Info className="w-4 h-4" />
                    <span>{copyrightText}</span>
                  </div>
                </div>
              </div>

              <a
                href={wallpaper.url}
                target="_blank"
                rel="noopener noreferrer"
                className="shrink-0 px-6 py-3 flex items-center gap-2 rounded-full bg-white text-zinc-950 font-medium hover:bg-zinc-200 transition-colors"
              >
                <Download className="w-4 h-4" />
                <span>Download</span>
              </a>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
