"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Search, Filter, X, Calendar, Tag, User } from "lucide-react"
import { blogApi } from "@/lib/api/blog"
import type { BlogCategory, BlogPost } from "@/lib/api/types"

interface BlogSearchFilters {
  search: string
  category: string
  author: string
  sortBy: string
  sortOrder: string
}

interface BlogSearchFilterProps {
  onSearch: (filters: BlogSearchFilters, results?: BlogPost[]) => void
  onClearFilters: () => void
  resultCount?: number
  initialFilters?: Partial<BlogSearchFilters>
}

export function BlogSearchFilter({
  onSearch,
  onClearFilters,
  resultCount,
  initialFilters = {}
}: BlogSearchFilterProps) {
  const [filters, setFilters] = useState<BlogSearchFilters>({
    search: initialFilters.search || "",
    category: initialFilters.category || "",
    author: initialFilters.author || "",
    sortBy: initialFilters.sortBy || "published_at",
    sortOrder: initialFilters.sortOrder || "desc",
  })

  const [categories, setCategories] = useState<BlogCategory[]>([])
  const [authors, setAuthors] = useState<string[]>([])
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false)
  const [isSearching, setIsSearching] = useState(false)

  // Fetch categories and authors for filter options
  useEffect(() => {
    const fetchFilterOptions = async () => {
      try {
        // Fetch categories
        const categoriesResponse = await blogApi.listCategories({ active: true })
        if (categoriesResponse.success && categoriesResponse.data) {
          setCategories(categoriesResponse.data.categories)
        }

        // Fetch recent posts to get unique authors
        const postsResponse = await blogApi.listPosts({
          status: "published",
          limit: 50,
          sortBy: "published_at",
          sortOrder: "desc"
        })
        
        if (postsResponse.success && postsResponse.data) {
          const uniqueAuthors = Array.from(
            new Set(postsResponse.data.posts.map(post => post.author))
          ).filter(Boolean)
          setAuthors(uniqueAuthors)
        }
      } catch (error) {
        console.error("Error fetching filter options:", error)
      }
    }

    fetchFilterOptions()
  }, [])

  const handleSearch = async () => {
    setIsSearching(true)

    try {
      const searchParams: any = {
        page: 1,
        limit: 20,
        status: "published",
        sortBy: filters.sortBy,
        sortOrder: filters.sortOrder,
      }

      // Add search query if provided
      if (filters.search.trim()) {
        searchParams.search = filters.search.trim()
      }

      // Add category filter
      if (filters.category) {
        searchParams.category = filters.category
      }

      // Add author filter
      if (filters.author) {
        searchParams.author = filters.author
      }

      const response = await blogApi.listPosts(searchParams)
      
      if (response.success && response.data) {
        onSearch(filters, response.data.posts)
      } else {
        onSearch(filters, [])
      }
    } catch (error) {
      console.error("Error searching blog posts:", error)
      onSearch(filters, [])
    } finally {
      setIsSearching(false)
    }
  }

  const handleClearFilters = () => {
    setFilters({
      search: "",
      category: "",
      author: "",
      sortBy: "published_at",
      sortOrder: "desc",
    })
    setShowAdvancedFilters(false)
    onClearFilters()
  }

  const hasActiveFilters = Object.values(filters).some((value, index) => {
    // Skip sortBy and sortOrder as they have default values
    if (index >= 3) return false
    return value !== ""
  })

  return (
    <Card className="mb-8">
      <CardContent className="p-6">
        {/* Main Search Bar */}
        <div className="flex flex-col md:flex-row gap-4 mb-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              type="text"
              placeholder="Search blog posts..."
              value={filters.search}
              onChange={(e) => setFilters({ ...filters, search: e.target.value })}
              className="pl-10 border-gray-300 focus:border-primary"
              onKeyPress={(e) => e.key === "Enter" && handleSearch()}
            />
          </div>

          <div className="flex gap-2">
            <Button
              onClick={handleSearch}
              disabled={isSearching}
              className="bg-primary hover:bg-primary/90 text-white"
            >
              {isSearching ? (
                <>
                  <div className="w-4 h-4 mr-2 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Searching...
                </>
              ) : (
                <>
                  <Search className="w-4 h-4 mr-2" />
                  Search
                </>
              )}
            </Button>
            <Button
              variant="outline"
              onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
              className="border-primary text-primary hover:bg-primary hover:text-white"
            >
              <Filter className="w-4 h-4 mr-2" />
              Filters
            </Button>
          </div>
        </div>

        {/* Advanced Filters */}
        {showAdvancedFilters && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-gray-50 rounded-lg">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
              <Select
                value={filters.category}
                onValueChange={(value) => setFilters({ ...filters, category: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="All Categories" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All Categories</SelectItem>
                  {categories.map((category) => (
                    <SelectItem key={category.id} value={category.slug}>
                      {category.name} ({category.postCount})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Author</label>
              <Select
                value={filters.author}
                onValueChange={(value) => setFilters({ ...filters, author: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="All Authors" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All Authors</SelectItem>
                  {authors.map((author) => (
                    <SelectItem key={author} value={author}>
                      {author}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Sort By</label>
              <Select
                value={`${filters.sortBy}-${filters.sortOrder}`}
                onValueChange={(value) => {
                  const [sortBy, sortOrder] = value.split('-')
                  setFilters({ ...filters, sortBy, sortOrder })
                }}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="published_at-desc">Latest First</SelectItem>
                  <SelectItem value="published_at-asc">Oldest First</SelectItem>
                  <SelectItem value="title-asc">Title A-Z</SelectItem>
                  <SelectItem value="title-desc">Title Z-A</SelectItem>
                  <SelectItem value="view_count-desc">Most Viewed</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        )}

        {/* Active Filters & Results */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mt-4 gap-4">
          <div className="flex flex-wrap items-center gap-2">
            {hasActiveFilters && (
              <>
                <span className="text-sm text-gray-600">Active filters:</span>
                {filters.search && (
                  <Badge variant="secondary" className="bg-primary/10 text-primary">
                    <Search className="w-3 h-3 mr-1" />
                    {filters.search}
                  </Badge>
                )}
                {filters.category && (
                  <Badge variant="secondary" className="bg-primary/10 text-primary">
                    <Tag className="w-3 h-3 mr-1" />
                    {categories.find(c => c.slug === filters.category)?.name || filters.category}
                  </Badge>
                )}
                {filters.author && (
                  <Badge variant="secondary" className="bg-primary/10 text-primary">
                    <User className="w-3 h-3 mr-1" />
                    {filters.author}
                  </Badge>
                )}
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleClearFilters}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <X className="w-3 h-3 mr-1" />
                  Clear all
                </Button>
              </>
            )}
          </div>
          {resultCount !== undefined && (
            <span className="text-sm text-gray-600">
              {resultCount} {resultCount === 1 ? "post" : "posts"} found
            </span>
          )}
        </div>
      </CardContent>
    </Card>
  )
}