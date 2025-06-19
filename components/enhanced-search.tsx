"use client"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Search, Filter, X, MapPin, GraduationCap, Building, Clock, Zap } from "lucide-react"
import { universityApi } from "@/lib/api/universities"
import { apiUtils } from "@/lib/api/client"
import type { University } from "@/lib/api/types"

interface SearchFilters {
  query: string
  programType: string
  universityType: string
  fieldOfStudies: string
  establishedYear: string
}

interface EnhancedSearchProps {
  onSearch: (filters: SearchFilters, results?: any) => void
  onClearFilters: () => void
  resultCount?: number
  searchMode?: "universities" | "programs" | "both"
}

export function EnhancedSearch({
  onSearch,
  onClearFilters,
  resultCount,
  searchMode = "universities",
}: EnhancedSearchProps) {
  const [filters, setFilters] = useState<SearchFilters>({
    query: "",
    programType: "",
    universityType: "",
    fieldOfStudies: "",
    establishedYear: "",
  })

  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false)
  const [suggestions, setSuggestions] = useState<string[]>([])
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [isSearching, setIsSearching] = useState(false)
  const [programTypes, setProgramTypes] = useState<string[]>([])
  const [searchStats, setSearchStats] = useState<{
    searchTime: number
    totalResults: number
    algorithmUsed: string
  } | null>(null)

  const searchInputRef = useRef<HTMLInputElement>(null)
  const suggestionsRef = useRef<HTMLDivElement>(null)

  // Debounced suggestions using API
  useEffect(() => {
    const timer = setTimeout(async () => {
      if (filters.query.length >= 2) {
        try {
          const response = await universityApi.listUniversities({
            search: filters.query,
            limit: 6,
            active: 'true',
            verified: 'true'
          })
          
          if (response.success && response.data) {
            const suggestions = response.data.universities.map(uni => uni.name)
            setSuggestions(suggestions)
            setShowSuggestions(true)
          }
        } catch (error) {
          console.error("Error fetching suggestions:", error)
          setSuggestions([])
          setShowSuggestions(false)
        }
      } else {
        setSuggestions([])
        setShowSuggestions(false)
      }
    }, 300)

    return () => clearTimeout(timer)
  }, [filters.query, searchMode])

  // Fetch program types on component mount
  useEffect(() => {
    const fetchProgramTypes = async () => {
      try {
        // For now, we'll extract program types from universities
        const response = await universityApi.listUniversities({
          page: 1,
          limit: 100,
          active: 'true',
          verified: 'true'
        })
        
        if (response.success && response.data) {
          const types = new Set<string>()
          response.data.universities.forEach(university => {
            university.programs.forEach(program => {
              if (program.type) {
                types.add(program.type)
              }
            })
          })
          setProgramTypes(Array.from(types).sort())
        }
      } catch (error) {
        console.error("Error fetching program types:", error)
        // Fallback to static data
        setProgramTypes([
          "Engineering", "Business", "Computer Science", "Medicine", "Law", 
          "Arts", "Science", "Education", "Agriculture", "Social Sciences"
        ])
      }
    }
    
    fetchProgramTypes()
  }, [])

  // Click outside to close suggestions
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        suggestionsRef.current &&
        !suggestionsRef.current.contains(event.target as Node) &&
        searchInputRef.current &&
        !searchInputRef.current.contains(event.target as Node)
      ) {
        setShowSuggestions(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  const handleSearch = async () => {
    setIsSearching(true)
    const startTime = performance.now()

    try {
      const searchParams: any = {
        page: 1,
        limit: 50,
        active: 'true',
        verified: 'true',
      }

      // Add search query if provided
      if (filters.query.trim()) {
        searchParams.search = filters.query.trim()
      }

      // Add university type filter
      if (filters.universityType && filters.universityType !== "all") {
        searchParams.type = filters.universityType
      }

      // Note: API supports city parameter, but we're using regions in our UI
      // We'll let the search parameter handle location matching instead
      // since the API searches in university profile description which may contain location info

      // Add sorting
      searchParams.sortBy = "name"
      searchParams.sortOrder = "asc"

      const response = await universityApi.listUniversities(searchParams)
      
      let results: University[] = []
      let algorithmUsed = "University API Search"

      if (response.success && response.data) {
        results = response.data.universities || []

        // Apply client-side filters for program type, field of studies, and established year
        if (filters.programType && filters.programType !== "all") {
          results = results.filter((university) =>
            university.programs?.some((program) => program.type === filters.programType)
          )
        }

        if (filters.fieldOfStudies && filters.fieldOfStudies !== "all") {
          results = results.filter((university) => {
            const profile = university.profile
            if (!profile) return false
            return profile.field_of_studies?.toLowerCase().includes(filters.fieldOfStudies.toLowerCase())
          })
        }

        if (filters.establishedYear && filters.establishedYear !== "all") {
          results = results.filter((university) => {
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

        algorithmUsed += ` (${searchMode})`
      }

      const endTime = performance.now()
      const searchTime = Math.round(endTime - startTime)

      setSearchStats({
        searchTime,
        totalResults: results.length,
        algorithmUsed,
      })

      onSearch(filters, results)
      setShowSuggestions(false)
    } catch (error) {
      console.error("Search error:", error)
      setSearchStats({
        searchTime: 0,
        totalResults: 0,
        algorithmUsed: "Search Failed"
      })
      onSearch(filters, [])
    } finally {
      setIsSearching(false)
    }
  }

  const handleClearFilters = () => {
    setFilters({
      query: "",
      programType: "",
      universityType: "",
      fieldOfStudies: "",
      establishedYear: "",
    })
    setSuggestions([])
    setShowSuggestions(false)
    setSearchStats(null)
    onClearFilters()
  }

  const handleSuggestionClick = (suggestion: string) => {
    setFilters({ ...filters, query: suggestion })
    setShowSuggestions(false)
    // Auto-search when suggestion is selected
    setTimeout(() => handleSearch(), 100)
  }

  const hasActiveFilters = Object.values(filters).some((value) => value !== "")

  return (
    <Card className="mb-8">
      <CardContent className="p-6">
        {/* Search Stats */}
        {searchStats && (
          <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg">
            <div className="flex items-center gap-4 text-sm text-green-800">
              <div className="flex items-center gap-1">
                <Zap className="w-4 h-4" />
                <span className="font-medium">{searchStats.searchTime}ms</span>
              </div>
              <div className="flex items-center gap-1">
                <Search className="w-4 h-4" />
                <span>{searchStats.totalResults} results</span>
              </div>
              <div className="flex items-center gap-1">
                <Clock className="w-4 h-4" />
                <span className="text-xs">{searchStats.algorithmUsed}</span>
              </div>
            </div>
          </div>
        )}

        {/* Main Search Bar */}
        <div className="flex flex-col md:flex-row gap-4 mb-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              ref={searchInputRef}
              type="text"
              placeholder={`Search ${searchMode === "programs" ? "programs" : searchMode === "universities" ? "universities" : "universities and programs"}...`}
              value={filters.query}
              onChange={(e) => setFilters({ ...filters, query: e.target.value })}
              className="pl-10 border-gray-300 focus:border-primary"
              onKeyPress={(e) => e.key === "Enter" && handleSearch()}
              onFocus={() => filters.query.length >= 2 && setShowSuggestions(true)}
            />

            {/* Search Suggestions */}
            {showSuggestions && suggestions.length > 0 && (
              <div
                ref={suggestionsRef}
                className="absolute top-full left-0 right-0 z-50 mt-1 bg-white border border-gray-200 rounded-md shadow-lg max-h-60 overflow-y-auto"
              >
                {suggestions.map((suggestion, index) => (
                  <button
                    key={index}
                    className="w-full px-4 py-2 text-left hover:bg-gray-50 focus:bg-gray-50 focus:outline-none border-b border-gray-100 last:border-b-0"
                    onClick={() => handleSuggestionClick(suggestion)}
                  >
                    <div className="flex items-center gap-2">
                      <Search className="w-3 h-3 text-gray-400" />
                      <span className="text-sm">{suggestion}</span>
                    </div>
                  </button>
                ))}
              </div>
            )}
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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 p-4 bg-gray-50 rounded-lg">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Program Type</label>
              <Select
                value={filters.programType}
                onValueChange={(value) => setFilters({ ...filters, programType: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="All Programs" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Programs</SelectItem>
                  {programTypes.map((type) => (
                    <SelectItem key={type} value={type}>
                      {type}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Field of Studies</label>
              <Select value={filters.fieldOfStudies} onValueChange={(value) => setFilters({ ...filters, fieldOfStudies: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="All Fields" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Fields</SelectItem>
                  <SelectItem value="Engineering">Engineering and Technology</SelectItem>
                  <SelectItem value="Health">Health Sciences</SelectItem>
                  <SelectItem value="Business">Business and Management</SelectItem>
                  <SelectItem value="Science">Applied Sciences and Technology</SelectItem>
                  <SelectItem value="Social">Social Sciences</SelectItem>
                  <SelectItem value="Arts">Arts and Humanities</SelectItem>
                  <SelectItem value="Agriculture">Agriculture</SelectItem>
                  <SelectItem value="Medicine">Medicine and Health Sciences</SelectItem>
                  <SelectItem value="Architecture">Architecture and Design</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">University Type</label>
              <Select
                value={filters.universityType}
                onValueChange={(value) => setFilters({ ...filters, universityType: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="All Types" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="Public">Public</SelectItem>
                  <SelectItem value="Private">Private</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Established Year</label>
              <Select
                value={filters.establishedYear}
                onValueChange={(value) => setFilters({ ...filters, establishedYear: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="All Years" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Years</SelectItem>
                  <SelectItem value="before-1970">Before 1970</SelectItem>
                  <SelectItem value="1970-1990">1970 - 1990</SelectItem>
                  <SelectItem value="1990-2000">1990 - 2000</SelectItem>
                  <SelectItem value="after-2000">After 2000</SelectItem>
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
                {filters.query && (
                  <Badge variant="secondary" className="bg-primary/10 text-primary">
                    <Search className="w-3 h-3 mr-1" />
                    {filters.query}
                  </Badge>
                )}
                {filters.programType && (
                  <Badge variant="secondary" className="bg-primary/10 text-primary">
                    <GraduationCap className="w-3 h-3 mr-1" />
                    {filters.programType}
                  </Badge>
                )}
                {filters.fieldOfStudies && (
                  <Badge variant="secondary" className="bg-primary/10 text-primary">
                    <GraduationCap className="w-3 h-3 mr-1" />
                    {filters.fieldOfStudies}
                  </Badge>
                )}
                {filters.universityType && (
                  <Badge variant="secondary" className="bg-primary/10 text-primary">
                    <Building className="w-3 h-3 mr-1" />
                    {filters.universityType}
                  </Badge>
                )}
                {filters.establishedYear && (
                  <Badge variant="secondary" className="bg-primary/10 text-primary">
                    <Clock className="w-3 h-3 mr-1" />
                    {filters.establishedYear === "before-1970" ? "Before 1970" : 
                     filters.establishedYear === "1970-1990" ? "1970-1990" :
                     filters.establishedYear === "1990-2000" ? "1990-2000" :
                     filters.establishedYear === "after-2000" ? "After 2000" : filters.establishedYear}
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
              {resultCount} {resultCount === 1 ? "result" : "results"} found
            </span>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
