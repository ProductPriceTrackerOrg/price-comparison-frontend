"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";
import { SearchSuggestions } from "@/components/search/search-suggestions";

export function GlobalSearchBar() {
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [showSuggestions, setShowSuggestions] = useState<boolean>(false);
  const searchContainerRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  // Close suggestions when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        searchContainerRef.current &&
        !searchContainerRef.current.contains(event.target as Node)
      ) {
        setShowSuggestions(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleSearch = () => {
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setShowSuggestions(false);
    }
  };

  const handleSuggestionSelect = (suggestion: string) => {
    setSearchQuery(suggestion);
    router.push(`/search?q=${encodeURIComponent(suggestion)}`);
    setShowSuggestions(false);
  };

  return (
    <div className="w-full max-w-xl relative" ref={searchContainerRef}>
      <div className="flex bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden transition-all duration-200 hover:shadow-md">
        <div className="relative flex-1">
          <Input
            type="text"
            placeholder="Search for products, brands, or categories..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onFocus={() => setShowSuggestions(true)}
            onKeyPress={(e) => e.key === "Enter" && handleSearch()}
            className="h-10 pl-10 pr-4 rounded-none border-0 focus-visible:ring-0 focus-visible:ring-offset-0 transition-all duration-200"
          />
          <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
        </div>
        <Button
          onClick={handleSearch}
          className="h-10 rounded-none bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 px-4"
        >
          <Search className="h-4 w-4" />
        </Button>
      </div>

      {showSuggestions && searchQuery.trim().length > 0 && (
        <SearchSuggestions
          query={searchQuery}
          onSelect={handleSuggestionSelect}
          onClose={() => setShowSuggestions(false)}
        />
      )}
    </div>
  );
}
