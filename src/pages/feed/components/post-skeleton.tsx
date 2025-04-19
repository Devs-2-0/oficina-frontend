import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

export function PostSkeleton() {
  return (
    <Card>
      <CardHeader className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <Skeleton className="h-5 w-[250px]" />
            <Skeleton className="h-4 w-[180px]" />
          </div>
          <Skeleton className="h-8 w-8" />
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-[80%]" />
        </div>

        <div className="grid grid-cols-2 gap-2">
          <Skeleton className="aspect-video w-full" />
          <Skeleton className="aspect-video w-full" />
        </div>
      </CardContent>
      <CardFooter className="justify-between">
        <div className="flex items-center gap-4">
          <Skeleton className="h-4 w-[60px]" />
          <Skeleton className="h-4 w-[60px]" />
        </div>
        <Skeleton className="h-8 w-[120px]" />
      </CardFooter>
    </Card>
  )
} 