import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent } from "@/components/ui/card";

export default function FavoritesLoading() {
  return (
    <div className="container max-w-7xl py-10">
      <div className="flex justify-between items-center mb-6">
        <Skeleton className="h-10 w-60" />
        <Skeleton className="h-10 w-32" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <Card key={i} className="overflow-hidden">
            <CardContent className="p-0">
              <div className="flex border-b">
                <div className="w-1/3 bg-gray-50 p-4 flex items-center justify-center">
                  <Skeleton className="h-20 w-20" />
                </div>
                <div className="w-2/3 p-4 space-y-2">
                  <Skeleton className="h-5 w-full" />
                  <Skeleton className="h-5 w-2/3" />
                  <div className="flex items-baseline space-x-2">
                    <Skeleton className="h-5 w-24" />
                    <Skeleton className="h-4 w-20" />
                  </div>
                  <Skeleton className="h-3 w-32" />
                </div>
              </div>

              <div className="flex border-t">
                <Skeleton className="flex-1 h-10 m-2" />
                <div className="w-px bg-gray-200"></div>
                <Skeleton className="flex-1 h-10 m-2" />
                <div className="w-px bg-gray-200"></div>
                <Skeleton className="flex-1 h-10 m-2" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
