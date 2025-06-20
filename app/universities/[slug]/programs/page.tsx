"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Breadcrumb } from "@/components/breadcrumb"
import { universityApi } from "@/lib/api/universities"
import { programApi } from "@/lib/api/programs"
import { apiUtils } from "@/lib/api/client"
import { toast } from "sonner"
import type { University } from "@/lib/api/types"
import type { Program } from "@/lib/api/programs"
import { Skeleton } from "@/components/ui/skeleton"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Clock, DollarSign, Users, Calendar, BookOpen, GraduationCap, MapPin, Star } from "lucide-react"
import Link from "next/link"

export default function UniversityProgramsPage() {
  const params = useParams()
  const router = useRouter()
  const [university, setUniversity] = useState<University | null>(null)
  const [programs, setPrograms] = useState<Program[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchUniversityAndPrograms = async () => {
      try {
        setLoading(true)
        const slug = params.slug as string
        
        // Fetch university details
        const universityResponse = await universityApi.getUniversityBySlug(slug)

        if (!universityResponse.success || !universityResponse.data) {
          setError("University not found")
          return
        }

        const universityData = universityResponse.data
        setUniversity(universityData)

        // Fetch university programs using programs API
        try {
          const programsResponse = await programApi.listPrograms({
            universityId: universityData.id,
            limit: 50,
            sortBy: "name",
            sortOrder: "asc"
          })
          if (programsResponse.success && programsResponse.data) {
            setPrograms(programsResponse.data.programs)
          } else {
            // Use programs from university data if API call fails
            setPrograms(universityData.programs || [])
          }
        } catch (programsError) {
          console.error("Error fetching programs:", programsError)
          // Use programs from university data as fallback
          setPrograms(universityData.programs || [])
        }

      } catch (err) {
        console.error("Error fetching university:", err)
        if (apiUtils.isApiError(err)) {
          setError(apiUtils.getErrorMessage(err))
        } else {
          setError("Failed to load university information")
        }
      } finally {
        setLoading(false)
      }
    }

    fetchUniversityAndPrograms()
  }, [params.slug])

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <div className="space-y-6">
            <Skeleton className="h-8 w-64" />
            <div className="grid gap-6">
              {[1, 2, 3].map((i) => (
                <Card key={i}>
                  <CardContent className="p-6">
                    <div className="space-y-4">
                      <Skeleton className="h-6 w-3/4" />
                      <Skeleton className="h-4 w-full" />
                      <Skeleton className="h-4 w-2/3" />
                      <div className="flex gap-2">
                        <Skeleton className="h-8 w-20" />
                        <Skeleton className="h-8 w-20" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
        <Footer />
      </div>
    )
  }

  if (error || !university) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <Card className="text-center py-12">
            <CardContent>
              <h1 className="text-2xl font-bold text-gray-900 mb-4">University Not Found</h1>
              <p className="text-gray-600 mb-6">The university you're looking for doesn't exist or has been moved.</p>
              <Button onClick={() => router.push("/colleges")} className="bg-primary hover:bg-primary/90 text-white">
                Browse All Universities
              </Button>
            </CardContent>
          </Card>
        </div>
        <Footer />
      </div>
    )
  }

  const breadcrumbItems = [
    { label: "Home", href: "/" },
    { label: "Universities", href: "/colleges" },
    { label: university.name, href: `/universities/${university.slug}` },
    { label: "Programs", href: `/universities/${university.slug}/programs` },
  ]

  const groupedPrograms = programs.reduce(
    (acc, program) => {
      const type = program.level || program.type || "Other"
      if (!acc[type]) {
        acc[type] = []
      }
      acc[type].push(program)
      return acc
    },
    {} as Record<string, Program[]>,
  )

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <div className="container mx-auto px-4 py-8">
        <Breadcrumb items={breadcrumbItems} />

        {/* University Header */}
        <div className="mt-6 mb-8">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-16 h-16 bg-primary/10 rounded-lg flex items-center justify-center">
              <GraduationCap className="w-8 h-8 text-primary" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">{university.name}</h1>
              <div className="flex items-center gap-4 text-gray-600 mt-2">
                <div className="flex items-center gap-1">
                  <MapPin className="w-4 h-4" />
                  <span>{university.profile.address.city}, {university.profile.address.region}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  <span>4.5</span>
                </div>
                <Badge variant="outline">University</Badge>
              </div>
            </div>
          </div>
          <p className="text-gray-600 max-w-3xl">{university.profile.description}</p>
        </div>

        {/* Programs Overview */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BookOpen className="w-5 h-5" />
              Programs Overview
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">{programs.length}</div>
                <div className="text-sm text-gray-600">Total Programs</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">{Object.keys(groupedPrograms).length}</div>
                <div className="text-sm text-gray-600">Program Categories</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">
                  {programs.reduce((sum, program) => sum + (program.applicationCount || 0), 0)}
                </div>
                <div className="text-sm text-gray-600">Total Applications</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">
                  ${programs.length > 0 ? Math.min(...programs.map((p) => p.tuitionFee || 0)).toLocaleString() : '0'}+
                </div>
                <div className="text-sm text-gray-600">Starting From</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Programs by Category */}
        <div className="space-y-8">
          {Object.entries(groupedPrograms).map(([type, programs]) => (
            <Card key={type}>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BookOpen className="w-5 h-5 text-primary" />
                  {type} Programs ({programs.length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-6">
                  {programs.map((program) => (
                    <div
                      key={program.id}
                      className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow bg-white"
                    >
                      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex items-start justify-between mb-3">
                            <h3 className="font-semibold text-xl text-gray-900">{program.name}</h3>
                            <Badge variant="outline" className="ml-2">
                              {program.type}
                            </Badge>
                          </div>

                          <p className="text-gray-600 mb-4 leading-relaxed">{program.description}</p>

                          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                            <div className="flex items-center gap-2">
                              <Clock className="w-4 h-4 text-gray-400" />
                              <span className="text-sm text-gray-600">{program.duration} years</span>
                            </div>

                            <div className="flex items-center gap-2">
                              <DollarSign className="w-4 h-4 text-gray-400" />
                              <span className="text-sm text-gray-600">${program.tuitionFee.toLocaleString()} {program.currency}/year</span>
                            </div>

                            <div className="flex items-center gap-2">
                              <Users className="w-4 h-4 text-gray-400" />
                              <span className="text-sm text-gray-600">{program.applicationCount} applications</span>
                            </div>

                            <div className="flex items-center gap-2">
                              <Calendar className="w-4 h-4 text-gray-400" />
                              <span className="text-sm text-gray-600">
                                Due: {new Date(program.applicationDeadline).toLocaleDateString()}
                              </span>
                            </div>
                          </div>

                          {/* Requirements */}
                          <div>
                            <span className="text-sm font-medium text-gray-700">Requirements: </span>
                            <div className="flex flex-wrap gap-2 mt-2">
                              {program.requirements.map((req, index) => (
                                <Badge key={index} variant="secondary" className="text-xs">
                                  {req}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        </div>

                        <div className="flex flex-col gap-3 lg:w-auto w-full">
                          <Button variant="outline" size="sm" className="w-full lg:w-auto" asChild>
                            <Link href={`/universities/${university.slug}/programs/${program.id}`}>View Details</Link>
                          </Button>

                          <Button
                            size="sm"
                            className="w-full lg:w-auto bg-primary hover:bg-primary/90 text-white"
                            asChild
                          >
                            <Link href={`/apply?university=${university.id}&program=${program.id}`}>Apply Now</Link>
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Back to University */}
        <div className="mt-8 text-center">
          <Button variant="outline" asChild>
            <Link href={`/universities/${university.slug}`}>← Back to {university.shortName} Overview</Link>
          </Button>
        </div>
      </div>

      <Footer />
    </div>
  )
}
