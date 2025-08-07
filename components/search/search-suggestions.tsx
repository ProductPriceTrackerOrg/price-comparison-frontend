"use client"

import { useEffect, useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Search, TrendingUp, Clock } from "lucide-react"

interface SearchSuggestionsProps {
  query: string
  onSelect: (suggestion: string) => void
  onClose: () => void
}

export function SearchSuggestions({ query, onSelect, onClose }: SearchSuggestionsProps) {
  const [suggestions, setSuggestions] = useState<string[]>([])

  useEffect(() => {
    // Mock API call - replace with actual search suggestions API
    const mockSuggestions = [
      "Samsung Galaxy S24 Ultra",
      "Samsung Galaxy S24",
      "Samsung Galaxy S23",
      "Samsung Galaxy Watch",
      "Samsung Galaxy Buds",
      "Samsung Galaxy Tab",
      "Samsung Monitor",
      "Samsung TV",
    ]
      .filter((item) => item.toLowerCase().includes(query.toLowerCase()))
      .slice(0, 8)

    setSuggestions(mockSuggestions)
  }, [query])

  if (suggestions.length === 0) return null

  return (
    <Card className="absolute top-full left-0 right-0 mt-2 z-50 max-h-80 overflow-y-auto shadow-lg">
      <CardContent className="p-0">
        <div className="p-3 border-b bg-gray-50">
          <div className="text-sm text-gray-600 flex items-center">
            <Search className="h-4 w-4 mr-2" />
            Search suggestions
          </div>
        </div>
        {suggestions.map((suggestion, index) => (
          <div
            key={index}
            className="flex items-center space-x-3 p-3 hover:bg-gray-50 cursor-pointer border-b last:border-b-0 transition-colors"
            onClick={() => onSelect(suggestion)}
          >
            <Search className="h-4 w-4 text-gray-400" />
            <span className="flex-1 text-gray-900">{suggestion}</span>
            <TrendingUp className="h-4 w-4 text-gray-400" />
          </div>
        ))}
        <div className="p-3 bg-gray-50 border-t">
          <div className="text-xs text-gray-500 flex items-center">
            <Clock className="h-3 w-3 mr-1" />
            Recent searches and trending products
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
