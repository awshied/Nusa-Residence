import { Search, X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useEffect, useRef, useState } from "react";

interface SearchBarProps {
  onSearch?: (query: string) => void;
  placeholder?: string;
}

const SearchBar = ({
  onSearch,
  placeholder = "Cari Tempat Penginapan...",
}: SearchBarProps) => {
  const navigate = useNavigate();
  const [query, setQuery] = useState<string>("");
  const [isFocused, setIsFocused] = useState<boolean>(false);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    try {
      const saved = localStorage.getItem("recentSearches");
      if (saved) {
        setRecentSearches(JSON.parse(saved));
      }
    } catch (error) {
      console.error("Gagal memuat pencarian:", error);
    }
  }, []);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setIsFocused(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const saveSearch = (searchQuery: string): void => {
    if (!searchQuery.trim()) return;
    const updated = [
      searchQuery,
      ...recentSearches.filter((s) => s !== searchQuery),
    ].slice(0, 5);
    setRecentSearches(updated);
    try {
      localStorage.setItem("recentSearches", JSON.stringify(updated));
    } catch (error) {
      console.error("Gagal menyimpan pencarian:", error);
    }
  };

  const handleSearch = (): void => {
    if (!query.trim()) return;
    saveSearch(query);
    if (onSearch) {
      onSearch(query);
    } else {
      navigate(`/residences?search=${encodeURIComponent(query)}`);
    }
    setIsFocused(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>): void => {
    if (e.key === "Enter") {
      handleSearch();
    }
    if (e.key === "Escape") {
      setIsFocused(false);
      inputRef.current?.blur();
    }
  };

  const handleRecentClick = (term: string): void => {
    setQuery(term);
    saveSearch(term);
    if (onSearch) {
      onSearch(term);
    } else {
      navigate(`/residences?search=${encodeURIComponent(term)}`);
    }
    setIsFocused(false);
  };

  const clearRecentSearches = (): void => {
    setRecentSearches([]);
    try {
      localStorage.removeItem("recentSearches");
    } catch (error) {
      console.error("Gagal menghapus pencarian:", error);
    }
  };

  const showDropdown =
    isFocused && query.length === 0 && recentSearches.length > 0;

  return (
    <div ref={containerRef} className="relative">
      <div className="flex items-center rounded-full overflow-hidden bg-base-200">
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={handleKeyDown}
          onFocus={() => setIsFocused(true)}
          placeholder={placeholder}
          className="flex-1 pl-6 pr-3 py-2 font-medium font-mona bg-transparent outline-none text-neutral/70 placeholder:text-neutral/40"
        />
        {query ? (
          <button
            onClick={() => {
              setQuery("");
              inputRef.current?.focus();
            }}
            className="py-2 pr-2 bg-transparent outline-none text-neutral/70 border-none transition cursor-pointer"
          >
            <X size={16} />
          </button>
        ) : null}
        <button
          onClick={handleSearch}
          className="btn btn-circle bg-neutral hover:bg-neutral/90 text-base-200 transition"
        >
          <Search size={18} />
        </button>
      </div>

      {showDropdown && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-base-300 rounded-lg shadow-lg border border-base-100 z-50">
          <div className="p-2">
            <div className="flex justify-between items-center px-2 py-1">
              <span className="text-xs text-base-content">
                Pencarian Terbaru
              </span>
              <button
                onClick={clearRecentSearches}
                className="btn btn-xs btn-ghost hover:underline"
              >
                Hapus
              </button>
            </div>
            <div className="flex flex-wrap gap-1 mt-1">
              {recentSearches.map((term, idx) => (
                <button
                  key={idx}
                  onClick={() => handleRecentClick(term)}
                  className="btn btn-xs btn-circle transition"
                >
                  {term}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchBar;
