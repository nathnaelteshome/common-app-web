"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, Clock, DollarSign, Users, Calendar, BookOpen, GraduationCap, Zap } from "lucide-react"
import { programTypes, degreeTypes } from "@/data/universities-data"
import { programSearchService } from "@/lib/search-service"

export function ProgramBrowser() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedType, setSelectedType] = useState("")
  const [selectedDegree, setSelectedDegree] = useState("")
  const [programs, setPrograms] = useState<any[]>([])
  const [isSearching, setIsSearching] = useState(false)
  const [searchStats, setSearchStats] = useState<{
    searchTime: number
    totalResults: number
  } | null>(null)

  // Load all programs initially
  useEffect(() => {
    handleSearch()
  }, [])

  const handleSearch = async () => {
    setIsSearching(true)
    const startTime = performance.now()

    try {
      let results

      if (searchQuery.trim()) {
        // Use advanced search algorithm
        const searchResults = programSearchService.search(searchQuery, {
          maxResults: 100,
          boostFactors: {
            name: 5.0,
            type: 3.0,
            description: 1.5,
            location: 1.0,
          },
        })
        results = searchResults.map((r) => r.item)
      } else {
        // Get all programs when no search query
        const allResults = programSearchService.search("", {
          maxResults: 100,
          minScore: 0,
        })
        results = allResults.map((r) => r.item)
      }

      // Apply filters
      if (selectedType) {
        results = results.filter((program: any) => program.type === selectedType)
      }

      if (selectedDegree) {
        results = results.filter((program: any) => program.degree === selectedDegree)
      }

      const endTime = performance.now()
      const searchTime = Math.round(endTime - startTime)

      setSearchStats({
        searchTime,
        totalResults: results.length,
      })

      setPrograms(results)
    } catch (error) {
      console.error("Program search error:", error)
      setPrograms([])
    } finally {
      setIsSearching(false)
    }
  }

  const clearFilters = () => {
    setSearchQuery("")
    setSelectedType("")
    setSelectedDegree("")
    setSearchStats(null)
    // Reload all programs
    setTimeout(() => handleSearch(), 100)
  }

  return (
    <div className="space-y-6">
      {/* Search and Filters */}
      <Card>
        <CardContent className="p-6">
          {/* Search Stats */}
          {searchStats && (
            <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="flex items-center gap-4 text-sm text-blue-800">
                <div className="flex items-center gap-1">
                  <Zap className="w-4 h-4" />
                  <span className="font-medium">{searchStats.searchTime}ms</span>
                </div>
                <div className="flex items-center gap-1">
                  <Search className="w-4 h-4" />
                  <span>{searchStats.totalResults} programs found</span>
                </div>
                <div className="text-xs text-blue-600">Advanced Multi-Stage Search Algorithm</div>
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                type="text"
                placeholder="Search programs..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
                onKeyPress={(e) => e.key === "Enter" && handleSearch()}
              />
            </div>

            <Select value={selectedType} onValueChange={setSelectedType}>
              <SelectTrigger>
                <SelectValue placeholder="Program Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                {programTypes.map((type) => (
                  <SelectItem key={type} value={type}>
                    {type}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={selectedDegree} onValueChange={setSelectedDegree}>
              <SelectTrigger>
                <SelectValue placeholder="Degree Level" />
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

            <div className="flex gap-2">
              <Button
                onClick={handleSearch}
                disabled={isSearching}
                className="bg-primary hover:bg-primary/90 text-white flex-1"
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
              <Button variant="outline" onClick={clearFilters}>
                Clear
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Results Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-primary">Available Programs</h2>
        <span className="text-gray-600">{programs.length} programs found</span>
      </div>

      {/* Programs Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {programs.map((program) => (
          <Card key={program.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="text-lg leading-tight">{program.name}</CardTitle>
                  <div className="flex items-center gap-2 mt-2">
                    <Badge variant="secondary">{program.type}</Badge>
                    <Badge variant="outline">{program.degree}</Badge>
                  </div>
                  {program.universityName && <p className="text-sm text-gray-600 mt-1">{program.universityName}</p>}
                </div>
                <GraduationCap className="w-6 h-6 text-primary" />
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 text-sm mb-4 line-clamp-2">{program.description}</p>

              <div className="space-y-2 mb-4">
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-1 text-gray-600">
                    <Clock className="w-4 h-4" />
                    <span>Duration</span>
                  </div>
                  <span className="font-medium">{program.duration}</span>
                </div>

                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-1 text-gray-600">
                    <DollarSign className="w-4 h-4" />
                    <span>Tuition</span>
                  </div>
                  <span className="font-medium">${program.tuitionFee?.toLocaleString()}</span>
                </div>

                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-1 text-gray-600">
                    <Users className="w-4 h-4" />
                    <span>Available Seats</span>
                  </div>
                  <span className="font-medium">{program.availableSeats}</span>
                </div>

                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-1 text-gray-600">
                    <Calendar className="w-4 h-4" />
                    <span>Deadline</span>
                  </div>
                  <span className="font-medium">{program.applicationDeadline}</span>
                </div>
              </div>

              <div className="mb-4">
                <p className="text-sm text-gray-600 mb-2">Requirements:</p>
                <div className="flex flex-wrap gap-1">
                  {program.requirements?.slice(0, 3).map((req: string) => (
                    <Badge key={req} variant="outline" className="text-xs">
                      {req}
                    </Badge>
                  ))}
                  {program.requirements?.length > 3 && (
                    <Badge variant="outline" className="text-xs">
                      +{program.requirements.length - 3} more
                    </Badge>
                  )}
                </div>
              </div>

              <Button className="w-full bg-primary hover:bg-primary/90 text-white">
                <BookOpen className="w-4 h-4 mr-2" />
                Apply Now
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      {programs.length === 0 && !isSearching && (
        <div className="text-center py-12">
          <BookOpen className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-600 mb-2">No Programs Found</h3>
          <p className="text-gray-500">Try adjusting your search criteria to find more programs.</p>
        </div>
      )}
    </div>
  )
}
