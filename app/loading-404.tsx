import { Card, CardContent } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

export default function Loading404() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl shadow-xl">
        <CardContent className="p-8 text-center">
          {/* Illustration skeleton */}
          <div className="relative w-64 h-64 mx-auto mb-8">
            <Skeleton className="w-full h-full rounded-full" />
          </div>

          {/* Title skeleton */}
          <Skeleton className="h-10 w-3/4 mx-auto mb-4" />

          {/* Description skeleton */}
          <Skeleton className="h-6 w-full max-w-md mx-auto mb-2" />
          <Skeleton className="h-6 w-2/3 max-w-md mx-auto mb-8" />

          {/* Search skeleton */}
          <div className="flex gap-2 max-w-md mx-auto mb-8">
            <Skeleton className="h-10 flex-1" />
            <Skeleton className="h-10 w-10" />
          </div>

          {/* Buttons skeleton */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8">
            <Skeleton className="h-11 w-[140px]" />
            <Skeleton className="h-11 w-[140px]" />
            <Skeleton className="h-11 w-[140px]" />
          </div>

          {/* Footer skeleton */}
          <div className="pt-8 border-t border-gray-200">
            <Skeleton className="h-4 w-48 mx-auto" />
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
