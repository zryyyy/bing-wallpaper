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
    <header className="fixed inset-x-0 top-0 z-50 flex w-full items-center justify-between gap-2 border-white/5 border-b bg-zinc-950/60 px-6 py-4 backdrop-blur-xl">
      <div className="flex items-center gap-2">
        <h1 className="font-semibold font-serif text-white text-xl tracking-wide">
          Bing<span className="ml-1 font-light font-sans text-lg text-zinc-400">Gallery</span>
        </h1>
      </div>

      <div className="flex items-center gap-2 md:gap-6">
        <div className="group relative">
          <Search className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-zinc-500 transition-colors group-focus-within:text-zinc-300" />
          <input
            type="text"
            placeholder="Search wallpapers..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-28 rounded-full border border-white/10 bg-zinc-900/50 py-2 pl-10 text-sm text-zinc-200 transition-all placeholder:w-12 placeholder:text-zinc-600 focus:border-white/20 focus:bg-zinc-900 focus:outline-none sm:w-64 placeholder:sm:w-auto"
          />
        </div>

        <div className="relative flex cursor-pointer items-center gap-2 text-zinc-400 hover:text-zinc-200">
          <Globe className="hidden size-4 sm:block" />
          <span className="w-24 truncate font-medium text-sm sm:w-auto">
            {COUNTRIES[country]} ({country})
          </span>
          <select
            value={country}
            onChange={(e) => setCountry(e.target.value as CountryCode)}
            aria-label="Country"
            className="absolute inset-0 size-full cursor-pointer opacity-0"
          >
            {Object.entries(COUNTRIES).map(([code, name]) => (
              <option key={code} value={code}>
                {name} ({code})
              </option>
            ))}
          </select>
        </div>
      </div>
    </header>
  );
}
