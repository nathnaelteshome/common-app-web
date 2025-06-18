"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Star, MapPin, Users, BookOpen, ArrowRight } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { universityApi } from "@/lib/api/universities"
import { toast } from "sonner"
import type { University } from "@/lib/api/types"

export function CollegesSection() {
  const [universities, setUniversities] = useState<University[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchUniversities = async () => {
      try {
        setIsLoading(true)
        
        const params = {
          page: 1,
          limit: 6, // Show top 6 universities
          active: true,
          verified: true,
          sortBy: 'created_at',
          sortOrder: 'desc' as const,
        }

        const response = await universityApi.listUniversities(params)
        
        if (response.success && response.data) {
          setUniversities(response.data.universities || [])
        } else {
          toast.error("Failed to load universities")
          setUniversities([])
        }
      } catch (error) {
        console.error("Error fetching universities:", error)
        toast.error("Failed to load universities")
        setUniversities([])
      } finally {
        setIsLoading(false)
      }
    }
    
    fetchUniversities()
  }, [])

  if (isLoading) {
    return (
      <section className="py-8 md:py-16 px-4 bg-white">
        <div className="container mx-auto">
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
              <p className="text-gray-600">Loading universities...</p>
            </div>
          </div>
        </div>
      </section>
    )
  }

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
          <Button className="bg-primary hover:bg-primary/90 text-white hidden lg:flex" asChild>
            <Link href="/colleges">
              See More
              <ArrowRight className="ml-2 w-4 h-4" />
            </Link>
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 md:gap-8">
          {universities.map((university, index) => (
            <Card
              key={university.id}
              className="overflow-hidden hover:shadow-lg transition-shadow border-2 border-dashed border-gray-200"
            >
              <div className="relative">
                <Image
                  src={university.profile.campus_image || "/placeholder.svg"}
                  alt={university.name}
                  width={300}
                  height={200}
                  className="w-full h-40 md:h-48 object-cover"
                />
                <div className="absolute bottom-4 left-4 bg-primary text-white px-2 md:px-3 py-1 rounded-full text-xs md:text-sm flex items-center gap-1">
                  <MapPin className="w-3 h-3" />
                  {university.profile.address.city}
                </div>
              </div>

              <CardContent className="p-4 md:p-6">
                <div className="flex items-center gap-1 mb-2">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-3 h-3 md:w-4 md:h-4 ${
                        i < Math.floor(university.profile.rankings.rating) ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
                      }`}
                    />
                  ))}
                  <span className="text-xs md:text-sm text-gray-600 ml-1">{university.profile.rankings.rating}</span>
                </div>

                <h3 className="font-bold text-gray-800 mb-3 md:mb-4 text-xs md:text-sm leading-tight">
                  {university.name}
                </h3>

                <div className="flex items-center justify-between text-xs md:text-sm text-gray-600 mb-3 md:mb-4">
                  <div className="flex items-center gap-1">
                    <BookOpen className="w-3 h-3 md:w-4 md:h-4" />
                    <span>{university.programs?.length || 0} Programs</span>
                  </div>
                  <span>{university.profile.university_type.charAt(0)}</span>
                  <div className="flex items-center gap-1">
                    <Users className="w-3 h-3 md:w-4 md:h-4" />
                    <span className="hidden sm:inline">Students </span>
                    <span>{university.profile.total_students.toLocaleString()}</span>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex -space-x-2">
                    <div className="w-6 h-6 md:w-8 md:h-8 rounded-full bg-blue-400 border-2 border-white"></div>
                    <div className="w-6 h-6 md:w-8 md:h-8 rounded-full bg-green-400 border-2 border-white"></div>
                    <div className="w-6 h-6 md:w-8 md:h-8 rounded-full bg-yellow-400 border-2 border-white"></div>
                    <div className="w-6 h-6 md:w-8 md:h-8 rounded-full bg-purple-400 border-2 border-white"></div>
                  </div>
                  <Button size="sm" className="bg-primary hover:bg-primary/90 text-white text-xs md:text-sm" asChild>
                    <Link href={`/universities/${university.slug}`}>
                      View Details
                      <ArrowRight className="ml-1 w-3 h-3" />
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="lg:hidden mt-6 md:mt-8 text-center">
          <Button className="bg-primary hover:bg-primary/90 text-white" asChild>
            <Link href="/colleges">
              See More
              <ArrowRight className="ml-2 w-4 h-4" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  )
}
