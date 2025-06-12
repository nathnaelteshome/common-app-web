"use client"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Search, Filter, X, MapPin, GraduationCap, Building, Clock, Zap } from "lucide-react"
import { programTypes, regions, degreeTypes } from "@/data/universities-data"
import { universitySearchService, programSearchService, getSearchSuggestions } from "@/lib/search-service"

interface SearchFilters {
  query: string
  programType: string
  location: string
  universityType: string
  degreeType: string
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
    location: "",
    universityType: "",
    degreeType: "",
  })

  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false)
  const [suggestions, setSuggestions] = useState<string[]>([])
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [isSearching, setIsSearching] = useState(false)
  const [searchStats, setSearchStats] = useState<{
    searchTime: number
    totalResults: number
    algorithmUsed: string
  } | null>(null)

  const searchInputRef = useRef<HTMLInputElement>(null)
  const suggestionsRef = useRef<HTMLDivElement>(null)

  // Debounced suggestions
  useEffect(() => {
    const timer = setTimeout(() => {
      if (filters.query.length >= 2) {
        const suggestions = getSearchSuggestions(filters.query)
        const combined =
          searchMode === "programs"
            ? suggestions.programs
            : searchMode === "universities"
              ? suggestions.universities
              : [...suggestions.universities.slice(0, 3), ...suggestions.programs.slice(0, 3)]

        setSuggestions(combined.slice(0, 6))
        setShowSuggestions(true)
      } else {
        setSuggestions([])
        setShowSuggestions(false)
      }
    }, 300)

    return () => clearTimeout(timer)
  }, [filters.query, searchMode])

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
    if (!filters.query.trim()) return

    setIsSearching(true)
    const startTime = performance.now()

    try {
      let results
      let algorithmUsed = "Advanced Multi-Stage Search"

      if (searchMode === "universities") {
        const searchResults = universitySearchService.search(filters.query, {
          maxResults: 50,
          boostFactors: {
            name: 4.0,
            type: 2.5,
            location: 2.0,
            description: 1.0,
          },
        })
        results = searchResults.map((r) => r.item)
        algorithmUsed += " (Universities)"
      } else if (searchMode === "programs") {
        const searchResults = programSearchService.search(filters.query, {
          maxResults: 50,
          boostFactors: {
            name: 5.0,
            type: 3.0,
            description: 1.5,
            location: 1.0,
          },
        })
        results = searchResults.map((r) => r.item)
        algorithmUsed += " (Programs)"
      }

      // Apply additional filters
      if (results && filters.programType) {
        results = results.filter(
          (item: any) =>
            item.programs?.some((p: any) => p.type === filters.programType) || item.type === filters.programType,
        )
      }

      if (results && filters.location) {
        results = results.filter((item: any) => item.region === filters.location || item.location === filters.location)
      }

      if (results && filters.universityType) {
        results = results.filter((item: any) => item.type === filters.universityType)
      }

      if (results && filters.degreeType) {
        results = results.filter(
          (item: any) =>
            item.programs?.some((p: any) => p.degree === filters.degreeType) || item.degree === filters.degreeType,
        )
      }

      const endTime = performance.now()
      const searchTime = Math.round(endTime - startTime)

      setSearchStats({
        searchTime,
        totalResults: results?.length || 0,
        algorithmUsed,
      })

      onSearch(filters, results)
      setShowSuggestions(false)
    } catch (error) {
      console.error("Search error:", error)
    } finally {
      setIsSearching(false)
    }
  }

  const handleClearFilters = () => {
    setFilters({
      query: "",
      programType: "",
      location: "",
      universityType: "",
      degreeType: "",
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
              disabled={isSearching || !filters.query.trim()}
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
              <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
              <Select value={filters.location} onValueChange={(value) => setFilters({ ...filters, location: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="All Locations" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Locations</SelectItem>
                  {regions.map((region) => (
                    <SelectItem key={region} value={region}>
                      {region}
                    </SelectItem>
                  ))}
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
              <label className="block text-sm font-medium text-gray-700 mb-2">Degree Type</label>
              <Select
                value={filters.degreeType}
                onValueChange={(value) => setFilters({ ...filters, degreeType: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="All Degrees" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Degrees</SelectItem>
                  {degreeTypes.map((degree) => (
                    <SelectItem key={degree} value={degree}>
                      {degree}
                    </SelectItem>
                  ))}
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
                {filters.location && (
                  <Badge variant="secondary" className="bg-primary/10 text-primary">
                    <MapPin className="w-3 h-3 mr-1" />
                    {filters.location}
                  </Badge>
                )}
                {filters.universityType && (
                  <Badge variant="secondary" className="bg-primary/10 text-primary">
                    <Building className="w-3 h-3 mr-1" />
                    {filters.universityType}
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
