import { Loader2 } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import Gallery from '@/components/Gallery.tsx';
import Header from '@/components/Header.tsx';
import Hero from '@/components/Hero.tsx';
import HistoryGallery from '@/components/HistoryGallery.tsx';
import ImageModal from '@/components/ImageModal.tsx';
import { fetchWallpapers, filterWallpapers } from '@/lib/wallpapers.ts';
import type { GallerySelection, Wallpaper } from '@/types.ts';

function App() {
  const [country, setCountry] = useState<GallerySelection>('en-US');
  const [wallpapers, setWallpapers] = useState<Wallpaper[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedImage, setSelectedImage] = useState<Wallpaper | null>(null);

  useEffect(() => {
    if (country === 'history') return;
    const controller = new AbortController();
    setLoading(true);
    fetchWallpapers(`${country}.json`, controller.signal)
      .then((data) => {
        if (!controller.signal.aborted) setWallpapers(data);
      })
      .catch((error) => {
        if (controller.signal.aborted) return;
        console.error('Error fetching wallpapers:', error);
        setWallpapers([]);
      })
      .finally(() => {
        if (!controller.signal.aborted) setLoading(false);
      });
    return () => controller.abort();
  }, [country]);

  const filteredWallpapers = useMemo(
    () => filterWallpapers(wallpapers, searchQuery),
    [wallpapers, searchQuery],
  );

  function changeSelection(selection: GallerySelection) {
    if (selection === country) return;
    setSelectedImage(null);
    setWallpapers([]);
    setLoading(true);
    setCountry(selection);
    window.scrollTo({ top: 0, behavior: 'instant' });
  }

  const latestWallpaper = filteredWallpapers.length > 0 ? filteredWallpapers[0] : null;
  const galleryWallpapers = filteredWallpapers.slice(1);

  return (
    <div className="min-h-screen bg-zinc-950 font-sans text-zinc-50 selection:bg-white/20">
      <Header
        country={country}
        setCountry={changeSelection}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
      />

      <main className="pt-16">
        {country === 'history' ? (
          <HistoryGallery searchQuery={searchQuery} onOpen={setSelectedImage} />
        ) : loading ? (
          <div className="flex h-[85vh] flex-col items-center justify-center gap-4 text-zinc-500">
            <Loader2 className="size-8 animate-spin text-white/50" />
            <p className="font-medium tracking-wide">Loading gallery...</p>
          </div>
        ) : (
          <>
            {latestWallpaper && <Hero wallpaper={latestWallpaper} onOpen={setSelectedImage} />}

            <Gallery
              wallpapers={latestWallpaper ? galleryWallpapers : filteredWallpapers}
              onOpen={setSelectedImage}
            />
          </>
        )}
      </main>

      <ImageModal wallpaper={selectedImage} onClose={() => setSelectedImage(null)} />

      <footer className="mt-12 border-white/5 border-t py-12 text-center">
        <p className="font-medium text-sm text-zinc-500">
          Bing Wallpapers Gallery &copy; 2026 - {new Date().getFullYear()}
        </p>
        <p className="mt-2 text-xs text-zinc-600">
          All images are copyright to their respective owners.
        </p>
      </footer>
    </div>
  );
}

export default App;
