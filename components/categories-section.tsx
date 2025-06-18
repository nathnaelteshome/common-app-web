"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Heart, Palette, Atom, Users, Layers, Briefcase, Shield, Scale, Video } from "lucide-react"
import Link from "next/link"
import { universityApi } from "@/lib/api/universities"
import type { University } from "@/lib/api/types"

const categories = [
  {
    title: "Health and Medicine",
    icon: Heart,
    bgColor: "bg-blue-100",
    iconColor: "text-blue-600",
    programType: "Health and Medicine",
  },
  {
    title: "Arts and Humanities",
    icon: Palette,
    bgColor: "bg-pink-100",
    iconColor: "text-pink-600",
    programType: "Arts and Humanities",
  },
  {
    title: "Science and Technology",
    icon: Atom,
    bgColor: "bg-green-100",
    iconColor: "text-green-600",
    programType: "Science and Technology",
  },
  {
    title: "Social Sciences",
    icon: Users,
    bgColor: "bg-yellow-100",
    iconColor: "text-yellow-600",
    programType: "Social Sciences",
  },
  {
    title: "Multidisciplinary",
    icon: Layers,
    bgColor: "bg-purple-100",
    iconColor: "text-purple-600",
    programType: "Multidisciplinary",
  },
  {
    title: "Business and Management",
    icon: Briefcase,
    bgColor: "bg-red-100",
    iconColor: "text-red-600",
    programType: "Business and Management",
  },
  {
    title: "Inclusive",
    icon: Shield,
    bgColor: "bg-indigo-100",
    iconColor: "text-indigo-600",
    programType: "Inclusive",
  },
  {
    title: "Law and Governance",
    icon: Scale,
    bgColor: "bg-orange-100",
    iconColor: "text-orange-600",
    programType: "Law and Governance",
  },
  {
    title: "Video & Photography",
    icon: Video,
    bgColor: "bg-cyan-100",
    iconColor: "text-cyan-600",
    programType: "Video & Photography",
  },
]

export function CategoriesSection() {
  const [universities, setUniversities] = useState<University[]>([])
  const [loading, setLoading] = useState(true)

  // Fetch universities on component mount
  useEffect(() => {
    const fetchUniversities = async () => {
      try {
        const response = await universityApi.listUniversities({
          page: 1,
          limit: 100, // Get more universities for accurate counts
          active: true,
          verified: true,
        })

        if (response.success && response.data) {
          setUniversities(response.data.universities || [])
        }
      } catch (error) {
        console.error("Error fetching universities for categories:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchUniversities()
  }, [])

  // Calculate university count for each category
  const getCategoryCount = (programType: string) => {
    if (loading) return 0
    
    return universities.filter(university => 
      university.programs?.some(program => program.type === programType)
    ).length
  }

  return (
    <section className="py-8 md:py-16 px-4 bg-white">
      <div className="container mx-auto">
        <div className="text-center mb-8 md:mb-12">
          <div className="inline-block bg-purple-100 text-purple-800 px-3 md:px-4 py-2 rounded-full text-xs md:text-sm font-medium mb-4">
            CATEGORIES
          </div>
          <h2 className="text-2xl md:text-4xl font-bold text-primary mb-4 font-sora">Browse By Categories</h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
          {categories.map((category, index) => {
            const universityCount = getCategoryCount(category.programType)
            
            return (
              <Link
                key={index}
                href={`/colleges?programType=${encodeURIComponent(category.programType)}&category=${encodeURIComponent(category.title)}`}
                className="block"
              >
                <Card className="hover:shadow-lg transition-all duration-300 cursor-pointer group hover:scale-105">
                  <CardContent className="p-4 md:p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3 md:gap-4">
                        <div
                          className={`w-10 h-10 md:w-12 md:h-12 rounded-full ${category.bgColor} flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}
                        >
                          <category.icon className={`w-5 h-5 md:w-6 md:h-6 ${category.iconColor}`} />
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-800 group-hover:text-primary transition-colors text-sm md:text-base">
                            {category.title}
                          </h3>
                          {!loading && (
                            <p className="text-xs md:text-sm text-gray-500 mt-1">
                              {universityCount} {universityCount === 1 ? 'university' : 'universities'}
                            </p>
                          )}
                        </div>
                      </div>
                      {loading && (
                        <div className="w-4 h-4 border-2 border-gray-300 border-t-primary rounded-full animate-spin"></div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </Link>
            )
          })}
        </div>
      </div>
    </section>
  )
}
