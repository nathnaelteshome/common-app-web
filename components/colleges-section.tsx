import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Star, MapPin, Users, BookOpen, ArrowRight } from "lucide-react"
import Image from "next/image"

const colleges = [
  {
    name: "ADDIS ABABA INSTITUTE OF TECHNOLOGY UNIVERSITY",
    location: "Mekelle",
    rating: 5.0,
    fields: 200,
    students: "20,000+",
    image: "/placeholder.svg?height=200&width=300&query=modern university building with glass facade",
  },
  {
    name: "MEKELLE UNIVERSITY",
    location: "Mekelle",
    rating: 4.5,
    fields: 200,
    students: "20,000+",
    image: "/placeholder.svg?height=200&width=300&query=university entrance gate with arch",
  },
  {
    name: "GONDER UNIVERSITY",
    location: "Gonder",
    rating: 4.5,
    fields: 200,
    students: "20,000+",
    image: "/placeholder.svg?height=200&width=300&query=historic university building with stone architecture",
  },
  {
    name: "JIMMA UNIVERSITY",
    location: "Jimma",
    rating: 4.5,
    fields: 200,
    students: "20,000+",
    image: "/placeholder.svg?height=200&width=300&query=green university campus with mountains",
  },
  {
    name: "BAHIRDAR UNIVERSITY",
    location: "Bahirdar",
    rating: 4.5,
    fields: 200,
    students: "20,000+",
    image: "/placeholder.svg?height=200&width=300&query=modern university building with red brick",
  },
  {
    name: "AKSUM UNIVERSITY",
    location: "Aksum",
    rating: 4.5,
    fields: 200,
    students: "20,000+",
    image: "/placeholder.svg?height=200&width=300&query=ancient university building with traditional architecture",
  },
]

export function CollegesSection() {
  return (
    <section className="py-8 md:py-16 px-4 bg-white">
      <div className="container mx-auto">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-8 md:mb-12 gap-4">
          <div className="text-center lg:text-left">
            <div className="inline-block bg-purple-100 text-purple-800 px-3 md:px-4 py-2 rounded-full text-xs md:text-sm font-medium mb-4">
              TOP POPULAR COLLEGES
            </div>
            <h2 className="text-2xl md:text-4xl font-bold text-primary font-sora">
              If You Are A{" "}
              <span className="relative">
                Student<span className="absolute -bottom-2 left-0 w-full h-3 bg-yellow-200 -z-10"></span>
              </span>{" "}
              You Can Apply With Us.
            </h2>
          </div>
          <Button className="bg-primary hover:bg-primary/90 text-white hidden lg:flex">
            See More
            <ArrowRight className="ml-2 w-4 h-4" />
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 md:gap-8">
          {colleges.map((college, index) => (
            <Card
              key={index}
              className="overflow-hidden hover:shadow-lg transition-shadow border-2 border-dashed border-gray-200"
            >
              <div className="relative">
                <Image
                  src={college.image || "/placeholder.svg"}
                  alt={college.name}
                  width={300}
                  height={200}
                  className="w-full h-40 md:h-48 object-cover"
                />
                <div className="absolute bottom-4 left-4 bg-primary text-white px-2 md:px-3 py-1 rounded-full text-xs md:text-sm flex items-center gap-1">
                  <MapPin className="w-3 h-3" />
                  {college.location}
                </div>
              </div>

              <CardContent className="p-4 md:p-6">
                <div className="flex items-center gap-1 mb-2">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-3 h-3 md:w-4 md:h-4 ${
                        i < Math.floor(college.rating) ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
                      }`}
                    />
                  ))}
                  <span className="text-xs md:text-sm text-gray-600 ml-1">{college.rating}k</span>
                </div>

                <h3 className="font-bold text-gray-800 mb-3 md:mb-4 text-xs md:text-sm leading-tight">
                  {college.name}
                </h3>

                <div className="flex items-center justify-between text-xs md:text-sm text-gray-600 mb-3 md:mb-4">
                  <div className="flex items-center gap-1">
                    <BookOpen className="w-3 h-3 md:w-4 md:h-4" />
                    <span>{college.fields} Fields</span>
                  </div>
                  <span>R/E</span>
                  <div className="flex items-center gap-1">
                    <Users className="w-3 h-3 md:w-4 md:h-4" />
                    <span className="hidden sm:inline">Students </span>
                    <span>{college.students}</span>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex -space-x-2">
                    <div className="w-6 h-6 md:w-8 md:h-8 rounded-full bg-blue-400 border-2 border-white"></div>
                    <div className="w-6 h-6 md:w-8 md:h-8 rounded-full bg-green-400 border-2 border-white"></div>
                    <div className="w-6 h-6 md:w-8 md:h-8 rounded-full bg-yellow-400 border-2 border-white"></div>
                    <div className="w-6 h-6 md:w-8 md:h-8 rounded-full bg-purple-400 border-2 border-white"></div>
                  </div>
                  <span className="text-xs md:text-sm text-gray-600">Enrolled</span>
                  <Button size="sm" className="bg-primary hover:bg-primary/90 text-white text-xs md:text-sm">
                    Enroll
                    <ArrowRight className="ml-1 w-3 h-3" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="lg:hidden mt-6 md:mt-8 text-center">
          <Button className="bg-primary hover:bg-primary/90 text-white">
            See More
            <ArrowRight className="ml-2 w-4 h-4" />
          </Button>
        </div>
      </div>
    </section>
  )
}
