import { Loader2 } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import Gallery from '@/components/Gallery.tsx';
import Header from '@/components/Header.tsx';
import Hero from '@/components/Hero.tsx';
import ImageModal from '@/components/ImageModal.tsx';
import type { CountryCode, Wallpaper } from '@/types.ts';

const API_BASE_URL =
  'https://raw.githubusercontent.com/zryyyy/bing-wallpaper/refs/heads/master/img';

function App() {
  const [country, setCountry] = useState<CountryCode>('en-US');
  const [wallpapers, setWallpapers] = useState<Wallpaper[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedImage, setSelectedImage] = useState<Wallpaper | null>(null);

  useEffect(() => {
    const fetchWallpapers = async () => {
      setLoading(true);
      const response = await fetch(`${API_BASE_URL}/${country}.json`);

      if (!response.ok) {
        throw new Error('Failed to fetch wallpapers');
      }

      const data: Wallpaper[] = await response.json();
      const sortedData = data.sort((a, b) => b.date.localeCompare(a.date));
      setWallpapers(sortedData);
      setLoading(false);
    };

    fetchWallpapers()
      .catch((error) => {
        console.error('Error fetching wallpapers:', error);
        setWallpapers([]);
      })
      .finally(() => setLoading(false));
  }, [country]);

  const filteredWallpapers = useMemo(() => {
    if (!searchQuery.trim()) return wallpapers;

    const query = searchQuery.toLowerCase();
    return wallpapers.filter(
      (wp) => wp.copyright.toLowerCase().includes(query) || wp.date.includes(query),
    );
  }, [wallpapers, searchQuery]);

  const latestWallpaper = filteredWallpapers.length > 0 ? filteredWallpapers[0] : null;
  const galleryWallpapers = filteredWallpapers.slice(1);

  return (
    <div className="min-h-screen bg-zinc-950 font-sans text-zinc-50 selection:bg-white/20">
      <Header
        country={country}
        setCountry={setCountry}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
      />

      <main className="pt-16">
        {loading ? (
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
