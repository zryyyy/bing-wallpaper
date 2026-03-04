import { Loader2 } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import Gallery from '@/components/Gallery.tsx';
import Header from '@/components/Header.tsx';
import Hero from '@/components/Hero.tsx';
import ImageModal from '@/components/ImageModal.tsx';
import type { CountryCode, Wallpaper } from '@/types.ts';

function App() {
  const [country, setCountry] = useState<CountryCode>('en-US');
  const [wallpapers, setWallpapers] = useState<Wallpaper[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedImage, setSelectedImage] = useState<Wallpaper | null>(null);

  useEffect(() => {
    const fetchWallpapers = async () => {
      setLoading(true);
      const response = await fetch(
        `https://raw.githubusercontent.com/zryyyy/bing-wallpaper/refs/heads/master/img/${country}.json`,
      );

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
    <div className="min-h-screen bg-zinc-950 text-zinc-50 font-sans selection:bg-white/20">
      <Header
        country={country}
        setCountry={setCountry}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
      />

      <main className="pt-16">
        {loading ? (
          <div className="h-[85vh] flex flex-col items-center justify-center text-zinc-500 gap-4">
            <Loader2 className="w-8 h-8 animate-spin text-white/50" />
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

      <footer className="py-12 text-center border-t border-white/5 mt-12">
        <p className="text-zinc-500 text-sm font-medium">
          Bing Wallpapers Gallery &copy; 2026 - {new Date().getFullYear()}
        </p>
        <p className="text-zinc-600 text-xs mt-2">
          All images are copyright to their respective owners.
        </p>
      </footer>
    </div>
  );
}

export default App;
