import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Star, MapPin, Users, ArrowRight } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import type { University } from "@/lib/api/types"

interface RelatedUniversitiesProps {
  currentUniversity: University
}

export function RelatedUniversities({ currentUniversity }: RelatedUniversitiesProps) {
  // For now, return empty since we need to implement API call for related universities
  // This would need to fetch universities from the same region via API
  const relatedUniversities: University[] = []

  if (relatedUniversities.length === 0) {
    return null
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Similar Universities</CardTitle>
        <p className="text-sm text-gray-600">Other universities in {currentUniversity.profile.address.region}</p>
      </CardHeader>
      <CardContent className="space-y-4">
        {relatedUniversities.map((university) => (
          <div key={university.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
            <div className="flex gap-3">
              <div className="relative w-16 h-16 rounded-lg overflow-hidden flex-shrink-0">
                <Image
                  src={university.profile.campus_image || "/placeholder.svg"}
                  alt={university.name}
                  fill
                  className="object-cover"
                />
              </div>

              <div className="flex-1 min-w-0">
                <h4 className="font-semibold text-gray-900 text-sm mb-1 truncate">{university.name}</h4>

                <div className="flex items-center gap-1 mb-2">
                  <MapPin className="w-3 h-3 text-gray-400" />
                  <span className="text-xs text-gray-600">{university.profile.address.city}</span>
                </div>

                <div className="flex items-center gap-2 mb-2">
                  <div className="flex items-center gap-1">
                    <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                    <span className="text-xs text-gray-600">{university.profile.rankings.rating}</span>
                  </div>

                  <Badge variant="outline" className="text-xs px-1 py-0">
                    {university.profile.university_type}
                  </Badge>
                </div>

                <div className="flex items-center gap-4 text-xs text-gray-600 mb-3">
                  <div className="flex items-center gap-1">
                    <Users className="w-3 h-3" />
                    <span>{university.profile.total_students.toLocaleString()}</span>
                  </div>
                  <div>{university.programs.length} programs</div>
                </div>

                <Button variant="outline" size="sm" className="w-full text-xs" asChild>
                  <Link href={`/universities/${university.slug}`}>
                    View Details
                    <ArrowRight className="w-3 h-3 ml-1" />
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        ))}

        <Button variant="ghost" className="w-full text-sm" asChild>
          <Link href={`/colleges?region=${encodeURIComponent(currentUniversity.profile.address.region)}`}>
            View All Universities in {currentUniversity.profile.address.region}
            <ArrowRight className="w-4 h-4 ml-2" />
          </Link>
        </Button>
      </CardContent>
    </Card>
  )
}
