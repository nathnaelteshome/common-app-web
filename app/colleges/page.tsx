"use client"

import { useState, useEffect } from "react"
import { Header } from "@/components/header"
import { CollegeHero } from "@/components/college-hero"
import { EnhancedSearch } from "@/components/enhanced-search"
import { UniversitySort } from "@/components/university-sort"
import { EnhancedUniversityGrid } from "@/components/enhanced-university-grid"
import { ProgramBrowser } from "@/components/program-browser"
import { Footer } from "@/components/footer"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { getUniversities, sortUniversities } from "@/data/universities-data"
import { universitySearchService } from "@/lib/search-service"
import type { University } from "@/data/universities-data"

export default function CollegesPage() {
  const [universities, setUniversities] = useState<University[]>(getUniversities())
  const [sortBy, setSortBy] = useState("applicants-desc")
  const [activeTab, setActiveTab] = useState("universities")

  useEffect(() => {
    const sorted = sortUniversities(universities, sortBy)
    setUniversities(sorted)
  }, [sortBy])

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
  }

  return (
    <div className="min-h-screen">
      <Header />
      <CollegeHero />
      <div className="bg-gray-50 py-8">
        <div className="container mx-auto px-4">
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
                <h2 className="text-2xl font-bold text-primary">Universities & Colleges</h2>
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
