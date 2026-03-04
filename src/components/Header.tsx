import { Globe, Search } from 'lucide-react';
import { COUNTRIES, type CountryCode } from '@/types';

interface HeaderProps {
  country: CountryCode;
  setCountry: (country: CountryCode) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

export default function Header({ country, setCountry, searchQuery, setSearchQuery }: HeaderProps) {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 px-6 py-4 flex items-center justify-between bg-zinc-950/60 backdrop-blur-xl border-b border-white/5">
      <div className="flex items-center gap-2">
        <h1 className="font-serif text-xl font-semibold tracking-wide text-white">
          Bing<span className="text-zinc-400 font-sans font-light text-lg ml-1">Gallery</span>
        </h1>
      </div>

      <div className="flex items-center gap-6">
        <div className="relative group">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500 group-focus-within:text-zinc-300 transition-colors" />
          <input
            type="text"
            placeholder="Search wallpapers..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-64 bg-zinc-900/50 border border-white/10 rounded-full py-2 pl-10 pr-4 text-sm text-zinc-200 placeholder:text-zinc-600 focus:outline-none focus:border-white/20 focus:bg-zinc-900 transition-all"
          />
        </div>

        <div className="relative flex items-center gap-2">
          <Globe className="w-4 h-4 text-zinc-500" />
          <select
            value={country}
            onChange={(e) => setCountry(e.target.value as CountryCode)}
            className="appearance-none bg-transparent text-sm font-medium text-zinc-300 hover:text-white focus:outline-none cursor-pointer pr-4"
          >
            {Object.entries(COUNTRIES).map(([code, name]) => (
              <option key={code} value={code} className="bg-zinc-900 text-zinc-300">
                {name} ({code})
              </option>
            ))}
          </select>
        </div>
      </div>
    </header>
  );
}
