import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Star, MapPin, Users, BookOpen, ArrowRight, X } from "lucide-react"
import Image from "next/image"

const colleges = [
  {
    id: 1,
    name: "ADDIS ABABA INSTITUTE OF TECHNOLOGY UNIVERSITY",
    location: "Mekelle",
    rating: 5.0,
    fields: 200,
    students: "20,000+",
    image: "/placeholder.svg?height=200&width=300&query=modern university building with glass facade",
  },
  {
    id: 2,
    name: "MEKELLE UNIVERSITY",
    location: "Mekelle",
    rating: 4.5,
    fields: 200,
    students: "20,000+",
    image: "/placeholder.svg?height=200&width=300&query=university entrance gate with arch",
  },
  {
    id: 3,
    name: "GONDER UNIVERSITY",
    location: "Gonder",
    rating: 4.5,
    fields: 200,
    students: "20,000+",
    image: "/placeholder.svg?height=200&width=300&query=historic university building with stone architecture",
  },
  {
    id: 4,
    name: "JIMMA UNIVERSITY",
    location: "Jimma",
    rating: 4.5,
    fields: 200,
    students: "20,000+",
    image: "/placeholder.svg?height=200&width=300&query=green university campus with mountains",
  },
  {
    id: 5,
    name: "BAHIRDAR UNIVERSITY",
    location: "Bahirdar",
    rating: 4.5,
    fields: 200,
    students: "20,000+",
    image: "/placeholder.svg?height=200&width=300&query=modern university building with red brick",
  },
  {
    id: 6,
    name: "AKSUM UNIVERSITY",
    location: "Aksum",
    rating: 4.5,
    fields: 200,
    students: "20,000+",
    image: "/placeholder.svg?height=200&width=300&query=ancient university building with traditional architecture",
  },
]

const activeFilters = [
  { id: 1, label: "AAU", type: "university" },
  { id: 2, label: "Software Engineering", type: "program" },
  { id: 3, label: "Medicine School", type: "program" },
]

export function CollegeGrid() {
  return (
    <div>
      {/* Results Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
        <div className="mb-4 sm:mb-0">
          <h2 className="text-xl font-semibold text-gray-800">200 results found</h2>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-600">Latest</span>
          <Button variant="outline" size="sm" className="bg-primary text-white border-primary">
            Latest
          </Button>
        </div>
      </div>

      {/* Active Filters */}
      <div className="flex flex-wrap gap-2 mb-6">
        {activeFilters.map((filter) => (
          <Badge key={filter.id} variant="secondary" className="flex items-center gap-2 px-3 py-1">
            {filter.label}
            <X className="w-3 h-3 cursor-pointer hover:text-red-500" />
          </Badge>
        ))}
      </div>

      {/* College Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {colleges.map((college) => (
          <Card key={college.id} className="overflow-hidden hover:shadow-lg transition-shadow">
            <div className="relative">
              <Image
                src={college.image || "/placeholder.svg"}
                alt={college.name}
                width={300}
                height={200}
                className="w-full h-48 object-cover"
              />
              <div className="absolute bottom-4 left-4 bg-primary text-white px-3 py-1 rounded-full text-sm flex items-center gap-1">
                <MapPin className="w-3 h-3" />
                {college.location}
              </div>
            </div>

            <CardContent className="p-6">
              <div className="flex items-center gap-1 mb-2">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-4 h-4 ${
                      i < Math.floor(college.rating) ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
                    }`}
                  />
                ))}
                <span className="text-sm text-gray-600 ml-1">{college.rating}</span>
              </div>

              <h3 className="font-bold text-gray-800 mb-4 text-sm leading-tight">{college.name}</h3>

              <div className="flex items-center justify-between text-sm text-gray-600 mb-4">
                <div className="flex items-center gap-1">
                  <BookOpen className="w-4 h-4" />
                  <span>{college.fields} Fields</span>
                </div>
                <span>R/E</span>
                <div className="flex items-center gap-1">
                  <Users className="w-4 h-4" />
                  <span>Students {college.students}</span>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex -space-x-2">
                  <div className="w-8 h-8 rounded-full bg-blue-400 border-2 border-white"></div>
                  <div className="w-8 h-8 rounded-full bg-green-400 border-2 border-white"></div>
                  <div className="w-8 h-8 rounded-full bg-yellow-400 border-2 border-white"></div>
                  <div className="w-8 h-8 rounded-full bg-purple-400 border-2 border-white"></div>
                </div>
                <span className="text-sm text-gray-600">Enrolled</span>
                <Button size="sm" className="bg-primary hover:bg-primary/90 text-white">
                  Enroll
                  <ArrowRight className="ml-1 w-3 h-3" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Load More */}
      <div className="text-center mt-8">
        <Button variant="outline" className="border-primary text-primary hover:bg-primary hover:text-white">
          Load More Colleges
        </Button>
      </div>
    </div>
  )
}
