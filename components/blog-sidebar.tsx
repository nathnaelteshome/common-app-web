"use client"

import type React from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ChevronRight } from "lucide-react"
import { useState, useEffect } from "react"
import { blogApi } from "@/lib/api/blog"
import type { BlogCategory } from "@/lib/api/types"
import { useRouter, useSearchParams } from "next/navigation"

export function BlogSidebar() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [categories, setCategories] = useState<BlogCategory[]>([])
  const [loading, setLoading] = useState(true)
  const currentCategory = searchParams.get("category")

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await blogApi.listCategories()
        if (response.success && response.data) {
          setCategories(response.data.categories)
        }
      } catch (error) {
        console.error("Error fetching categories:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchCategories()
  }, [])

  const handleCategoryClick = (categorySlug: string) => {
    router.push(`/blog?category=${categorySlug}`)
  }

  return (
    <div className="space-y-6">
      {/* Blog Categories */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-gray-800">CATEGORIES</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="space-y-0">
            {loading ? (
              <div className="p-4 text-center text-gray-500">Loading categories...</div>
            ) : categories.length > 0 ? (
              categories.map((category) => (
                <div
                  key={category.id}
                  onClick={() => handleCategoryClick(category.slug)}
                  className={`p-4 border-b border-gray-100 last:border-b-0 hover:bg-gray-50 cursor-pointer transition-colors ${
                    currentCategory === category.slug ? "bg-primary text-white hover:bg-primary/90" : ""
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className={`font-medium ${
                      currentCategory === category.slug ? "text-white" : "text-gray-700"
                    }`}>
                      {category.name}
                    </span>
                    <ChevronRight className={`w-4 h-4 ${
                      currentCategory === category.slug ? "text-white" : "text-gray-400"
                    }`} />
                  </div>
                </div>
              ))
            ) : (
              <div className="p-4 text-center text-gray-500">No categories available</div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
