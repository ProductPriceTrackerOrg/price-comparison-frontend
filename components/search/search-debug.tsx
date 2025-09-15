"use client";

interface SearchDebugProps {
  rawProducts: any[];
  filteredProducts: any[];
  loading: boolean;
  pagination: {
    current_page: number;
    total_pages: number;
    total_items: number;
    items_per_page: number;
  };
  filters: {
    priceRange: [number, number];
    selectedRetailers: string[];
    inStockOnly: boolean;
    sortBy: string;
  };
}

export function SearchDebug({
  rawProducts,
  filteredProducts,
  loading,
  pagination,
  filters,
}: SearchDebugProps) {
  if (process.env.NODE_ENV !== "development") {
    return null;
  }

  return (
    <div className="mt-8 p-4 bg-gray-50 border border-gray-200 rounded-lg text-xs font-mono overflow-auto max-h-96">
      <h3 className="font-bold mb-2 text-sm">Search Debug Info</h3>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <h4 className="font-bold">State:</h4>
          <p>Loading: {loading ? "true" : "false"}</p>
          <p>Raw products: {rawProducts.length}</p>
          <p>Filtered products: {filteredProducts.length}</p>
          <p>Current page: {pagination.current_page}</p>
          <p>Total pages: {pagination.total_pages}</p>
          <p>Total items: {pagination.total_items}</p>
          <p>Items per page: {pagination.items_per_page}</p>
        </div>
        <div>
          <h4 className="font-bold">Filters:</h4>
          <p>Price range: ${filters.priceRange[0]} - ${filters.priceRange[1]}</p>
          <p>Sort by: {filters.sortBy}</p>
          <p>In stock only: {filters.inStockOnly ? "true" : "false"}</p>
          <p>
            Selected retailers:{" "}
            {filters.selectedRetailers.length === 0
              ? "None"
              : filters.selectedRetailers.join(", ")}
          </p>
        </div>
      </div>

      {rawProducts.length > 0 && (
        <div className="mt-4">
          <h4 className="font-bold">First Product Sample:</h4>
          <pre className="bg-gray-100 p-2 overflow-auto max-h-40">
            {JSON.stringify(rawProducts[0], null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
}