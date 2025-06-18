"use client"

import { useState, useEffect, useMemo } from "react"
import { useSearchParams } from "next/navigation"
import { Header } from "@/components/header"
import { CollegeHero } from "@/components/college-hero"
import { EnhancedSearch } from "@/components/enhanced-search"
import { UniversitySort } from "@/components/university-sort"
import { EnhancedUniversityGrid } from "@/components/enhanced-university-grid"
import { ProgramBrowser } from "@/components/program-browser"
import { Footer } from "@/components/footer"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { getUniversities, sortUniversities, getUniversitiesByCategory } from "@/data/universities-data"
import { universitySearchService } from "@/lib/search-service"
import type { University } from "@/data/universities-data"

export default function CollegesPage() {
  const searchParams = useSearchParams()
  const [universities, setUniversities] = useState<University[]>([])
  const [sortBy, setSortBy] = useState("applicants-desc")
  const [activeTab, setActiveTab] = useState("universities")
  const [isLoading, setIsLoading] = useState(true)

  // Memoize search parameters to prevent unnecessary re-renders
  const searchQuery = useMemo(() => searchParams.get("search"), [searchParams])
  const category = useMemo(() => searchParams.get("category"), [searchParams])

  // Initialize universities data
  useEffect(() => {
    const allUniversities = getUniversities()
    let results = allUniversities

    // Handle category filtering first
    if (category) {
      results = getUniversitiesByCategory(category)
    }

    // Then handle search query
    if (searchQuery && !category) {
      const searchResults = universitySearchService.search(searchQuery)
      results = searchResults.map((r) => r.item)
    }

    // If both category and search query exist, filter the category results by search
    if (category && searchQuery) {
      const categoryResults = getUniversitiesByCategory(category)
      const searchResults = universitySearchService.search(searchQuery, categoryResults)
      results = searchResults.map((r) => r.item)
    }

    const sorted = sortUniversities(results, sortBy)
    setUniversities(sorted)
    setIsLoading(false)
  }, [searchQuery, category, sortBy])

  const handleSearch = (filters: any, searchResults?: University[]) => {
    if (searchResults) {
      // Use advanced search results
      const sorted = sortUniversities(searchResults, sortBy)
      setUniversities(sorted)
    } else {
      // Fallback to basic filtering
      let results = getUniversities()

      if (filters.query) {
        const searchResults = universitySearchService.search(filters.query)
        results = searchResults.map((r) => r.item)
      }

      // Apply additional filters
      if (filters.programType) {
        results = results.filter((uni) => uni.programs.some((program) => program.type === filters.programType))
      }

      if (filters.location) {
        results = results.filter((uni) => uni.region === filters.location)
      }

      if (filters.universityType) {
        results = results.filter((uni) => uni.type === filters.universityType)
      }

      if (filters.degreeType) {
        results = results.filter((uni) => uni.programs.some((program) => program.degree === filters.degreeType))
      }

      const sorted = sortUniversities(results, sortBy)
      setUniversities(sorted)
    }
  }

  const handleClearFilters = () => {
    const allUniversities = getUniversities()
    const sorted = sortUniversities(allUniversities, sortBy)
    setUniversities(sorted)
  }

  const handleSortChange = (newSortBy: string) => {
    setSortBy(newSortBy)
    // Re-sort current universities with new sort criteria
    setUniversities((prev) => sortUniversities([...prev], newSortBy))
  }

  if (isLoading) {
    return (
      <div className="min-h-screen">
        <Header />
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-gray-600">Loading universities...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen">
      <Header />
      <CollegeHero />
      <div className="bg-gray-50 py-8">
        <div className="container mx-auto px-4">
          {/* Show category filter info if active */}
          {category && (
            <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-blue-900">Browsing: {category}</h3>
                  <p className="text-blue-700">Showing universities with programs in {category}</p>
                </div>
                <button
                  onClick={handleClearFilters}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                >
                  Clear Filter
                </button>
              </div>
            </div>
          )}

          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <TabsList className="grid w-full sm:w-auto grid-cols-2">
                <TabsTrigger value="universities">Universities</TabsTrigger>
                <TabsTrigger value="programs">Programs</TabsTrigger>
              </TabsList>
            </div>

            <TabsContent value="universities" className="space-y-6">
              <EnhancedSearch
                onSearch={handleSearch}
                onClearFilters={handleClearFilters}
                resultCount={universities.length}
                searchMode="universities"
              />

              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <h2 className="text-2xl font-bold text-primary">
                  Universities & Colleges
                  {category && <span className="text-lg font-normal text-gray-600 ml-2">- {category}</span>}
                </h2>
                <UniversitySort sortBy={sortBy} onSortChange={handleSortChange} />
              </div>

              <EnhancedUniversityGrid universities={universities} />
            </TabsContent>

            <TabsContent value="programs" className="space-y-6">
              <ProgramBrowser />
            </TabsContent>
          </Tabs>
        </div>
      </div>
      <Footer />
    </div>
  )
}
