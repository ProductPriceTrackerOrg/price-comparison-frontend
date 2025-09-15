"use client";

import { useEffect, useState, useRef } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Search, TrendingUp, Clock, Loader2 } from "lucide-react";
import { useDebounce } from "use-debounce";
import api from "@/lib/api"; // Your centralized axios client

interface SearchSuggestionsProps {
  query: string;
  onSelect: (suggestion: string) => void;
  onClose: () => void;
}

export function SearchSuggestions({
  query,
  onSelect,
  onClose,
}: SearchSuggestionsProps) {
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [debouncedQuery] = useDebounce(query, 300); // 300ms debounce delay
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (debouncedQuery.length < 2) {
      setSuggestions([]);
      return;
    }

    const fetchSuggestions = async () => {
      setLoading(true);
      try {
        const response = await api.get<{ suggestions: string[] }>(
          `/api/v1/search/autocomplete`,
          {
            params: { q: debouncedQuery },
          }
        );
        setSuggestions(response.data.suggestions || []);
      } catch (error) {
        console.error("Failed to fetch search suggestions:", error);
        // Fallback to client-side filtering if the API fails
        const fallbackSuggestions = [
          "Samsung Galaxy S24 Ultra",
          "Samsung Galaxy S24",
          "Samsung Galaxy S23",
          "Samsung Galaxy Watch",
          "Samsung Galaxy Buds",
          "Samsung Galaxy Tab",
          "Samsung Monitor",
          "Samsung TV",
        ]
          .filter((item) =>
            item.toLowerCase().includes(debouncedQuery.toLowerCase())
          )
          .slice(0, 8);

        setSuggestions(fallbackSuggestions);
      } finally {
        setLoading(false);
      }
    };

    fetchSuggestions();
  }, [debouncedQuery]);

  // If there's no query or no suggestions, don't render the component
  if (debouncedQuery.length < 2 && !loading && suggestions.length === 0) {
    return null;
  }

  return (
    <Card
      className="absolute top-full left-0 right-0 mt-2 z-50 max-h-80 overflow-y-auto shadow-lg"
      ref={containerRef}
    >
      <CardContent className="p-0">
        <div className="p-3 border-b bg-gray-50">
          <div className="text-sm text-gray-600 flex items-center">
            <Search className="h-4 w-4 mr-2" />
            {loading ? "Searching..." : "Search suggestions"}
          </div>
        </div>

        {loading ? (
          <div className="flex items-center justify-center p-4">
            <Loader2 className="h-5 w-5 text-blue-500 animate-spin mr-2" />
            <span className="text-gray-600">Loading suggestions...</span>
          </div>
        ) : suggestions.length > 0 ? (
          suggestions.map((suggestion, index) => (
            <div
              key={index}
              className="flex items-center space-x-3 p-3 hover:bg-gray-50 cursor-pointer border-b last:border-b-0 transition-colors"
              onClick={() => onSelect(suggestion)}
            >
              <Search className="h-4 w-4 text-gray-400" />
              <span
                className="flex-1 text-gray-900"
                dangerouslySetInnerHTML={{
                  __html: highlightMatch(suggestion, debouncedQuery),
                }}
              />
              <TrendingUp className="h-4 w-4 text-gray-400" />
            </div>
          ))
        ) : debouncedQuery.length >= 2 ? (
          <div className="p-4 text-gray-500 text-center">
            No suggestions found for "{debouncedQuery}"
          </div>
        ) : null}

        <div className="p-3 bg-gray-50 border-t">
          <div className="text-xs text-gray-500 flex items-center">
            <Clock className="h-3 w-3 mr-1" />
            Recent searches and trending products
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// Helper function to highlight the matched part of the suggestion
function highlightMatch(text: string, query: string): string {
  if (!query) return text;

  const lowerText = text.toLowerCase();
  const lowerQuery = query.toLowerCase();
  const index = lowerText.indexOf(lowerQuery);

  if (index === -1) return text;

  return (
    text.substring(0, index) +
    `<span class="font-semibold text-blue-600">${text.substring(
      index,
      index + query.length
    )}</span>` +
    text.substring(index + query.length)
  );
}
