"use client"

import { useState, useEffect, useMemo } from "react"
import { useSearchParams } from "next/navigation"
import { Header } from "@/components/header"
import { CollegeHero } from "@/components/college-hero"
import { EnhancedSearch } from "@/components/enhanced-search"
import { UniversitySort } from "@/components/university-sort"
import { EnhancedUniversityGrid } from "@/components/enhanced-university-grid"
import { Footer } from "@/components/footer"
import { universityApi } from "@/lib/api/universities"
import { apiUtils } from "@/lib/api/client"
import { toast } from "sonner"
import type { University } from "@/lib/api/types"

export default function CollegesPage() {
  const searchParams = useSearchParams()
  const [universities, setUniversities] = useState<University[]>([])
  const [sortBy, setSortBy] = useState("applicants-desc")
  const [isLoading, setIsLoading] = useState(true)
  
  // Memoize search parameters to prevent unnecessary re-renders
  const searchQuery = useMemo(() => searchParams.get("search"), [searchParams])
  const category = useMemo(() => searchParams.get("category"), [searchParams])
  const programType = useMemo(() => searchParams.get("programType"), [searchParams])
  
  // Initialize universities data
  useEffect(() => {
    const fetchUniversities = async () => {
      try {
        setIsLoading(true)
        
        // Prepare API parameters
        const params: any = {
          page: 1,
          limit: 50, // Adjust based on needs
          active: 'true',
          verified: 'true',
        }
        
        // Add search query if provided
        if (searchQuery) {
          params.search = searchQuery
        }
        
        // Add sorting
        const [sortField, sortOrder] = sortBy.split('-')
        if (sortField === 'applicants') {
          params.sortBy = 'created_at' // Fallback to creation date since applications sorting isn't supported
        } else if (sortField === 'name') {
          params.sortBy = 'name'
        } else {
          params.sortBy = 'created_at'
        }
        params.sortOrder = sortOrder || 'desc'
        
        const response = await universityApi.listUniversities(params)
        
        if (response.success && response.data) {
          let universities = response.data.universities || []
          
          // Apply client-side filtering for program type if specified
          if (programType) {
            universities = universities.filter(university => 
              university.programs?.some(program => program.type === programType)
            )
          }
          
          console.log("universities response 2",universities)
          // Apply client-side sorting if sorting by applicants (since API doesn't support it)
          if (sortField === 'applicants') {
            universities = [...universities].sort((a, b) => {
              const aCount = a.applicationCount || 0
              const bCount = b.applicationCount || 0
              return sortOrder === 'desc' ? bCount - aCount : aCount - bCount
            })
          }
          
          setUniversities(universities)
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
  }, [searchQuery, category, programType, sortBy])
  
  const handleSearch = async (filters: any, searchResults?: University[]) => {
    if (searchResults) {
      setUniversities(searchResults)
      return
    }

    try {
      setIsLoading(true)
      
      const params: any = {
        page: 1,
        limit: 50,
        active: 'true',
        verified: 'true',
      }

      // Apply filters
      if (filters.query) {
        params.search = filters.query
      }

      // Note: Location filtering is now handled client-side in enhanced-search component
      // since our UI uses regions but API expects cities

      if (filters.universityType) {
        // Map frontend type to backend type
        params.type = filters.universityType
      }

      // Add sorting
      const [sortField, sortOrder] = sortBy.split('-')
      if (sortField === 'applicants') {
        params.sortBy = 'created_at' // Fallback to creation date since applications sorting isn't supported
      } else if (sortField === 'name') {
        params.sortBy = 'name'
      } else {
        params.sortBy = 'created_at'
      }
      params.sortOrder = sortOrder || 'desc'

      const response = await universityApi.listUniversities(params)
      
      if (response.success && response.data) {
        let universities = response.data.universities || []
        
        // Apply client-side filtering for program type
        if (filters.programType && filters.programType !== "all") {
          universities = universities.filter((university) =>
            university.programs?.some((program) => program.type === filters.programType)
          )
        }

        // Apply client-side filtering for field of studies
        if (filters.fieldOfStudies && filters.fieldOfStudies !== "all") {
          universities = universities.filter((university) => {
            const profile = university.profile
            if (!profile) return false
            return profile.field_of_studies?.toLowerCase().includes(filters.fieldOfStudies.toLowerCase())
          })
        }

        // Apply client-side filtering for established year
        if (filters.establishedYear && filters.establishedYear !== "all") {
          universities = universities.filter((university) => {
            const profile = university.profile
            if (!profile) return false
            const year = profile.established_year
            
            switch (filters.establishedYear) {
              case "before-1970":
                return year < 1970
              case "1970-1990":
                return year >= 1970 && year < 1990
              case "1990-2000":
                return year >= 1990 && year < 2000
              case "after-2000":
                return year >= 2000
              default:
                return true
            }
          })
        }
        
        // Apply client-side sorting if sorting by applicants (since API doesn't support it)
        if (sortField === 'applicants') {
          universities = [...universities].sort((a, b) => {
            const aCount = a.applicationCount || 0
            const bCount = b.applicationCount || 0
            return sortOrder === 'desc' ? bCount - aCount : aCount - bCount
          })
        }
        
        setUniversities(universities)
      } else {
        toast.error("Search failed")
        setUniversities([])
      }
    } catch (error) {
      console.error("Error searching universities:", error)
      toast.error("Search failed")
      setUniversities([])
    } finally {
      setIsLoading(false)
    }
  }

  const handleClearFilters = async () => {
    try {
      setIsLoading(true)
      
      const params = {
        page: 1,
        limit: 50,
        active: 'true',
        verified: 'true',
        sortBy: 'created_at',
        sortOrder: 'desc' as const,
      }

      const response = await universityApi.listUniversities(params)
      
      if (response.success && response.data) {
        setUniversities(response.data.universities || [])
      }
    } catch (error) {
      console.error("Error clearing filters:", error)
      toast.error("Failed to load universities")
    } finally {
      setIsLoading(false)
    }
  }

  const handleSortChange = (newSortBy: string) => {
    setSortBy(newSortBy)
    // Trigger re-fetch with new sort criteria (handled by useEffect)
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
  console.log("universities 2",universities)

  return (
    <div className="min-h-screen">
      <Header />
      <CollegeHero />
      <div className="bg-gray-50 py-8">
        <div className="container mx-auto px-4">
          {/* Show category filter info if active */}
          {(category || programType) && (
            <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-blue-900">
                    Browsing: {category || programType}
                  </h3>
                  <p className="text-blue-700">
                    Showing universities with programs in {category || programType}
                  </p>
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

          <div className="space-y-6">
            <EnhancedSearch
              onSearch={handleSearch}
              onClearFilters={handleClearFilters}
              resultCount={universities.length}
              searchMode="universities"
            />

            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <h2 className="text-2xl font-bold text-primary">
                Universities & Colleges
                {(category || programType) && <span className="text-lg font-normal text-gray-600 ml-2">- {category || programType}</span>}
              </h2>
              <UniversitySort sortBy={sortBy} onSortChange={handleSortChange} />
            </div>

            <EnhancedUniversityGrid universities={universities} />
          </div>
        </div>
      </div>
      <Footer />
    </div>
  )
}
