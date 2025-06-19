"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useAuthStore } from "@/store/auth-store"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Search, Plus, X, Star, MapPin, Users, GraduationCap, Building, Calendar, TrendingUp } from "lucide-react"
import Link from "next/link"
import { universities } from "@/data/universities-data"
import { mockComparisons } from "@/data/mock-student-data"

export default function UniversityComparison() {
  const { user, isAuthenticated } = useAuthStore()
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState("")
  const [comparisonList, setComparisonList] = useState(mockComparisons)

  useEffect(() => {
    if (!isAuthenticated || user?.role !== "student") {
      router.push("/auth/sign-in")
    }
  }, [isAuthenticated, user, router])

  if (!isAuthenticated || user?.role !== "student") {
    return null
  }

  useEffect(() => {
    if (searchQuery.length >= 2) {
      handleSearch(searchQuery)
    } else {
      setSearchResults([])
    }
  }, [searchQuery])

  const addToComparison = async (universityId: string) => {
    if (comparisonList.length >= 4) {
      toast.error("You can only compare up to 4 universities")
      return
    }
    
    if (comparisonList.find((comp) => comp.universityId === universityId)) {
      toast.error("University already in comparison")
      return
    }
    
    try {
      const response = await universityApi.getUniversity(universityId)
      if (response.success && response.data) {
        const newComparison: ComparisonItem = {
          id: `comp-${Date.now()}`,
          universityId,
          addedAt: new Date().toISOString(),
          university: response.data,
        }
        
        const updatedList = [...comparisonList, newComparison]
        setComparisonList(updatedList)
        
        // Save to localStorage
        const universityIds = updatedList.map(item => item.universityId)
        localStorage.setItem(`comparisons_${user?.id}`, JSON.stringify(universityIds))
        
        toast.success("University added to comparison")
      }
    } catch (error) {
      console.error("Error adding university:", error)
      toast.error("Failed to add university")
    }
  }

  const removeFromComparison = (universityId: string) => {
    const updatedList = comparisonList.filter((comp) => comp.universityId !== universityId)
    setComparisonList(updatedList)
    
    // Save to localStorage
    const universityIds = updatedList.map(item => item.universityId)
    localStorage.setItem(`comparisons_${user?.id}`, JSON.stringify(universityIds))
    
    toast.success("University removed from comparison")
  }

  const clearComparison = () => {
    setComparisonList([])
    localStorage.removeItem(`comparisons_${user?.id}`)
    toast.success("All comparisons cleared")
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <div className="container mx-auto px-4 py-8">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Compare Universities</h1>
            <p className="text-gray-600">Compare up to 4 universities side by side to make informed decisions</p>
          </div>
          {comparisonList.length > 0 && (
            <Button variant="outline" onClick={clearComparison}>
              <X className="w-4 h-4 mr-2" />
              Clear All
            </Button>
          )}
        </div>

        {/* Add Universities Section */}
        {comparisonList.length < 4 && (
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Plus className="w-5 h-5" />
                Add Universities to Compare ({comparisonList.length}/4)
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    type="text"
                    placeholder="Search universities to add..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-h-60 overflow-y-auto">
                  {availableUniversities.slice(0, 9).map((university) => (
                    <div
                      key={university.id}
                      className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50"
                    >
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-900">{university.name}</h4>
                        <p className="text-sm text-gray-600">{university.location}</p>
                      </div>
                      <Button size="sm" onClick={() => addToComparison(university.id)}>
                        <Plus className="w-4 h-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Comparison Table */}
        {comparedUniversities.length > 0 ? (
          <Card>
            <CardHeader>
              <CardTitle>University Comparison</CardTitle>
            </CardHeader>
            <CardContent className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-48">Criteria</TableHead>
                    {comparedUniversities.map((university) => (
                      <TableHead key={university.id} className="text-center min-w-48">
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <h3 className="font-semibold text-sm">{university.name}</h3>
                            <Button variant="ghost" size="sm" onClick={() => removeFromComparison(university.id)}>
                              <X className="w-4 h-4" />
                            </Button>
                          </div>
                          <img
                            src={university.image || "/placeholder.svg"}
                            alt={university.name}
                            className="w-full h-24 object-cover rounded-md"
                          />
                        </div>
                      </TableHead>
                    ))}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell className="font-medium">
                      <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4 text-gray-500" />
                        Location
                      </div>
                    </TableCell>
                    {comparedUniversities.map((university) => (
                      <TableCell key={university.id} className="text-center">
                        {university.location}
                      </TableCell>
                    ))}
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">
                      <div className="flex items-center gap-2">
                        <Building className="w-4 h-4 text-gray-500" />
                        Type
                      </div>
                    </TableCell>
                    {comparedUniversities.map((university) => (
                      <TableCell key={university.id} className="text-center">
                        <Badge variant="outline">{university.type}</Badge>
                      </TableCell>
                    ))}
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">
                      <div className="flex items-center gap-2">
                        <Star className="w-4 h-4 text-gray-500" />
                        Rating
                      </div>
                    </TableCell>
                    {comparedUniversities.map((university) => (
                      <TableCell key={university.id} className="text-center">
                        <div className="flex items-center justify-center gap-1">
                          <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                          <span className="font-medium">{university.rating}</span>
                        </div>
                      </TableCell>
                    ))}
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">
                      <div className="flex items-center gap-2">
                        <Users className="w-4 h-4 text-gray-500" />
                        Students
                      </div>
                    </TableCell>
                    {comparedUniversities.map((university) => (
                      <TableCell key={university.id} className="text-center">
                        {university.totalStudents?.toLocaleString() || "N/A"}
                      </TableCell>
                    ))}
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">
                      <div className="flex items-center gap-2">
                        <TrendingUp className="w-4 h-4 text-gray-500" />
                        Applicants
                      </div>
                    </TableCell>
                    {comparedUniversities.map((university) => (
                      <TableCell key={university.id} className="text-center">
                        <span className="font-medium text-[#0a5eb2]">
                          {university.totalApplicants?.toLocaleString() || "N/A"}
                        </span>
                      </TableCell>
                    ))}
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-gray-500" />
                        Established
                      </div>
                    </TableCell>
                    {comparedUniversities.map((university) => (
                      <TableCell key={university.id} className="text-center">
                        {university.establishedYear || "N/A"}
                      </TableCell>
                    ))}
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">
                      <div className="flex items-center gap-2">
                        <GraduationCap className="w-4 h-4 text-gray-500" />
                        Programs
                      </div>
                    </TableCell>
                    {comparedUniversities.map((university) => (
                      <TableCell key={university.id} className="text-center">
                        <div className="space-y-1">
                          {university.programs.slice(0, 3).map((program) => (
                            <Badge key={program.id} variant="outline" className="text-xs block">
                              {program.name}
                            </Badge>
                          ))}
                          {university.programs.length > 3 && (
                            <span className="text-xs text-gray-500">+{university.programs.length - 3} more</span>
                          )}
                        </div>
                      </TableCell>
                    ))}
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Actions</TableCell>
                    {comparedUniversities.map((university) => (
                      <TableCell key={university.id} className="text-center">
                        <div className="space-y-2">
                          <Button size="sm" className="w-full bg-[#0a5eb2] hover:bg-[#0a5eb2]/90" asChild>
                            <Link href={`/colleges/${university.id}`}>View Details</Link>
                          </Button>
                          <Button variant="outline" size="sm" className="w-full" asChild>
                            <Link href={`/student/applications/new?university=${university.id}`}>Apply Now</Link>
                          </Button>
                        </div>
                      </TableCell>
                    ))}
                  </TableRow>
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        ) : (
          <Card className="text-center py-12">
            <CardContent>
              <TrendingUp className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No universities to compare</h3>
              <p className="text-gray-600 mb-6">
                Add universities from the search above to start comparing them side by side.
              </p>
              <Button className="bg-[#0a5eb2] hover:bg-[#0a5eb2]/90" asChild>
                <Link href="/colleges">
                  <Search className="w-4 h-4 mr-2" />
                  Browse Universities
                </Link>
              </Button>
            </CardContent>
          </Card>
        )}
      </div>

      <Footer />
    </div>
  )
}
