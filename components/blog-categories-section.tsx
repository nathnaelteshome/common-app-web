"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { BookOpen, Users, GraduationCap, Building, Heart, Scale, Globe, Lightbulb } from "lucide-react"
import Link from "next/link"
import { blogApi } from "@/lib/api/blog"
import type { BlogCategory } from "@/lib/api/types"

const categoryIcons: Record<string, any> = {
  "University News": BookOpen,
  "Student Life": Users,
  "Academic": GraduationCap,
  "Campus": Building,
  "Health": Heart,
  "Legal": Scale,
  "International": Globe,
  "Tips": Lightbulb,
}

const categoryColors: Record<string, { bg: string; text: string; icon: string }> = {
  "University News": { bg: "bg-blue-100", text: "text-blue-800", icon: "text-blue-600" },
  "Student Life": { bg: "bg-green-100", text: "text-green-800", icon: "text-green-600" },
  "Academic": { bg: "bg-purple-100", text: "text-purple-800", icon: "text-purple-600" },
  "Campus": { bg: "bg-orange-100", text: "text-orange-800", icon: "text-orange-600" },
  "Health": { bg: "bg-red-100", text: "text-red-800", icon: "text-red-600" },
  "Legal": { bg: "bg-gray-100", text: "text-gray-800", icon: "text-gray-600" },
  "International": { bg: "bg-cyan-100", text: "text-cyan-800", icon: "text-cyan-600" },
  "Tips": { bg: "bg-yellow-100", text: "text-yellow-800", icon: "text-yellow-600" },
}

export function BlogCategoriesSection() {
  const [categories, setCategories] = useState<BlogCategory[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await blogApi.listCategories()
        
        if (response.success && response.data) {
          setCategories(response.data.categories)
        }
      } catch (error) {
        console.error("Error fetching blog categories:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchCategories()
  }, [])

  const getCategoryIcon = (categoryName: string) => {
    return categoryIcons[categoryName] || BookOpen
  }

  const getCategoryColors = (categoryName: string) => {
    return categoryColors[categoryName] || categoryColors["University News"]
  }

  if (loading) {
    return (
      <section className="py-8 md:py-16 px-4 bg-white">
        <div className="container mx-auto">
          <div className="text-center mb-8 md:mb-12">
            <div className="inline-block bg-purple-100 text-purple-800 px-3 md:px-4 py-2 rounded-full text-xs md:text-sm font-medium mb-4">
              CATEGORIES
            </div>
            <h2 className="text-2xl md:text-4xl font-bold text-primary mb-4 font-sora">Browse Blog Categories</h2>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
              <Card key={i} className="animate-pulse">
                <CardContent className="p-4 md:p-6">
                  <div className="flex items-center gap-3 md:gap-4">
                    <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-gray-200"></div>
                    <div className="flex-1">
                      <div className="h-4 bg-gray-200 rounded mb-2"></div>
                      <div className="h-3 bg-gray-200 rounded w-2/3"></div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
    )
  }

  if (categories.length === 0) {
    return (
      <section className="py-8 md:py-16 px-4 bg-white">
        <div className="container mx-auto text-center">
          <div className="inline-block bg-purple-100 text-purple-800 px-3 md:px-4 py-2 rounded-full text-xs md:text-sm font-medium mb-4">
            CATEGORIES
          </div>
          <h2 className="text-2xl md:text-4xl font-bold text-primary mb-4 font-sora">Browse Blog Categories</h2>
          <p className="text-gray-600">No blog categories available at the moment.</p>
        </div>
      </section>
    )
  }

  return (
    <section className="py-8 md:py-16 px-4 bg-white">
      <div className="container mx-auto">
        <div className="text-center mb-8 md:mb-12">
          <div className="inline-block bg-purple-100 text-purple-800 px-3 md:px-4 py-2 rounded-full text-xs md:text-sm font-medium mb-4">
            CATEGORIES
          </div>
          <h2 className="text-2xl md:text-4xl font-bold text-primary mb-4 font-sora">Browse Blog Categories</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Explore our blog posts organized by topics that matter to students and universities
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          {categories.map((category) => {
            const IconComponent = getCategoryIcon(category.name)
            const colors = getCategoryColors(category.name)
            
            return (
              <Link
                key={category.id}
                href={`/blog?category=${encodeURIComponent(category.slug)}`}
                className="block"
              >
                <Card className="hover:shadow-lg transition-all duration-300 cursor-pointer group hover:scale-105">
                  <CardContent className="p-4 md:p-6">
                    <div className="flex items-center gap-3 md:gap-4">
                      <div
                        className={`w-10 h-10 md:w-12 md:h-12 rounded-full ${colors.bg} flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}
                      >
                        <IconComponent className={`w-5 h-5 md:w-6 md:h-6 ${colors.icon}`} />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-800 group-hover:text-primary transition-colors text-sm md:text-base mb-1">
                          {category.name}
                        </h3>
                        <div className="flex items-center gap-2">
                          <Badge variant="secondary" className={`${colors.bg} ${colors.text} text-xs`}>
                            {category.postCount} {category.postCount === 1 ? 'post' : 'posts'}
                          </Badge>
                        </div>
                        {category.description && (
                          <p className="text-xs text-gray-500 mt-2 line-clamp-2">
                            {category.description}
                          </p>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            )
          })}
        </div>

        <div className="text-center mt-8">
          <Link
            href="/blog"
            className="inline-flex items-center px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
          >
            <BookOpen className="w-4 h-4 mr-2" />
            View All Posts
          </Link>
        </div>
      </div>
    </section>
  )
}