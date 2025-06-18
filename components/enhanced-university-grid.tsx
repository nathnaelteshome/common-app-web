import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Star, MapPin, Users, BookOpen, ArrowRight, TrendingUp, Building, Calendar } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import type University from "@/data/universities-data"
import { checkDomainOfScale } from "recharts/types/util/ChartUtils"

interface EnhancedUniversityGridProps {
  universities: University[]
}

export function EnhancedUniversityGrid({ universities }: EnhancedUniversityGridProps) {
  if (universities.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <BookOpen className="w-12 h-12 text-gray-400" />
        </div>
        <h3 className="text-xl font-semibold text-gray-800 mb-2">No Universities Found</h3>
        <p className="text-gray-600">Try adjusting your search criteria or filters to find more results.</p>
      </div>
    )
  }
  console.log("universities enhanced",universities)

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
      {universities.map((university) => (
        <Card key={university.id} className="overflow-hidden hover:shadow-lg transition-shadow group">
          <div className="relative">
            <Image
              src={university.profile.campus_image || "/placeholder.svg"}
              alt={university.name}
              width={400}
              height={200}
              className="w-full h-48 object-cover"
            />
            <div className="absolute top-4 left-4 flex gap-2">
              <Badge variant="secondary" className="bg-white/90 text-gray-800">
                <Building className="w-3 h-3 mr-1" />
                {university.type}
              </Badge>
            </div>
            <div className="absolute bottom-4 left-4 bg-primary text-white px-3 py-1 rounded-full text-sm flex items-center gap-1">
              <MapPin className="w-3 h-3" />
              {university.location}
            </div>
          </div>

          <CardContent className="p-6">
            <div className="flex items-center gap-1 mb-2">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`w-4 h-4 ${
                    i < Math.floor(university.rating) ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
                  }`}
                />
              ))}
              <span className="text-sm text-gray-600 ml-1">{university.rating}</span>
            </div>

            <h3 className="font-bold text-gray-800 mb-3 text-sm leading-tight group-hover:text-primary transition-colors">
              {university.name}
            </h3>

            <div className="space-y-2 mb-4">
              <div className="flex items-center justify-between text-xs text-gray-600">
                <div className="flex items-center gap-1">
                  <TrendingUp className="w-3 h-3" />
                  <span>{university.applicationCount.toLocaleString()} Applicants</span>
                </div>
                <span className="text-green-600 font-medium">{university.acceptanceRate}% Acceptance</span>
              </div>

              <div className="flex items-center justify-between text-xs text-gray-600">
                <div className="flex items-center gap-1">
                  <Users className="w-3 h-3" />
                  <span>{university.applicationCount.toLocaleString()} Students</span>
                </div>
                <div className="flex items-center gap-1">
                  <BookOpen className="w-3 h-3" />
                  <span>{university.programCount.toLocaleString()} Programs</span>
                </div>
              </div>

              <div className="flex items-center gap-1 text-xs text-gray-600">
                <Calendar className="w-3 h-3" />
                <span>Est. {university.establishedYear}</span>
              </div>
            </div>

            <div className="mb-4">
              <p className="text-xs text-gray-600 mb-2">Popular Programs:</p>
              <div className="flex flex-wrap gap-1">
                {/* {university.programs.slice(0, 2).map((program) => (
                  <Badge key={program.id} variant="outline" className="text-xs">
                    {program.name}
                  </Badge>
                ))}
                {university.programs.length > 2 && (
                  <Badge variant="outline" className="text-xs">
                    +{university.programs.length - 2} more
                  </Badge>
                )} */}
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex -space-x-2">
                <div className="w-6 h-6 bg-blue-400 rounded-full border-2 border-white"></div>
                <div className="w-6 h-6 bg-green-400 rounded-full border-2 border-white"></div>
                <div className="w-6 h-6 bg-yellow-400 rounded-full border-2 border-white"></div>
                <div className="w-6 h-6 bg-purple-400 rounded-full border-2 border-white"></div>
              </div>
              <span className="text-xs text-gray-600">Active Students</span>
              <Link href={`/universities/${university.slug}`}>
                <Button size="sm" className="bg-primary hover:bg-primary/90 text-white">
                  View Details
                  <ArrowRight className="ml-1 w-3 h-3" />
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
