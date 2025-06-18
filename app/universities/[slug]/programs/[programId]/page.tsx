"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Breadcrumb } from "@/components/breadcrumb"
import { getUniversityBySlug } from "@/data/universities-data"
import type University, { Program } from "@/data/universities-data"
import { Skeleton } from "@/components/ui/skeleton"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Clock, DollarSign, Users, Calendar, BookOpen, GraduationCap, MapPin, Star, CheckCircle } from "lucide-react"
import Link from "next/link"

export default function ProgramDetailPage() {
  const params = useParams()
  const router = useRouter()
  const [university, setUniversity] = useState<University | null>(null)
  const [program, setProgram] = useState<Program | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        const slug = params.slug as string
        const programId = params.programId as string

        const universityData = getUniversityBySlug(slug)

        if (!universityData) {
          setError("University not found")
          return
        }

        const programData = universityData.programs.find((p) => p.id === programId)

        if (!programData) {
          setError("Program not found")
          return
        }

        setUniversity(universityData)
        setProgram(programData)
      } catch (err) {
        setError("Failed to load program information")
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [params.slug, params.programId])

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <div className="space-y-6">
            <Skeleton className="h-8 w-64" />
            <Card>
              <CardContent className="p-6">
                <div className="space-y-4">
                  <Skeleton className="h-8 w-3/4" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-2/3" />
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
        <Footer />
      </div>
    )
  }

  if (error || !university || !program) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <Card className="text-center py-12">
            <CardContent>
              <h1 className="text-2xl font-bold text-gray-900 mb-4">Program Not Found</h1>
              <p className="text-gray-600 mb-6">The program you're looking for doesn't exist or has been moved.</p>
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
    { label: program.name, href: `/universities/${university.slug}/programs/${program.id}` },
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <div className="container mx-auto px-4 py-8">
        <Breadcrumb items={breadcrumbItems} />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Program Header */}
            <Card>
              <CardContent className="p-6">
                <div className="flex items-start gap-4 mb-4">
                  <div className="w-16 h-16 bg-primary/10 rounded-lg flex items-center justify-center">
                    <BookOpen className="w-8 h-8 text-primary" />
                  </div>
                  <div className="flex-1">
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">{program.name}</h1>
                    <div className="flex items-center gap-2 mb-2">
                      <Badge variant="outline">{program.degree}</Badge>
                      <Badge>{program.type}</Badge>
                    </div>
                    <div className="flex items-center gap-4 text-gray-600">
                      <div className="flex items-center gap-1">
                        <GraduationCap className="w-4 h-4" />
                        <span>{university.name}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <MapPin className="w-4 h-4" />
                        <span>{university.location}</span>
                      </div>
                    </div>
                  </div>
                </div>
                <p className="text-gray-600 leading-relaxed">{program.description}</p>
              </CardContent>
            </Card>

            {/* Program Details */}
            <Card>
              <CardHeader>
                <CardTitle>Program Details</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-6">
                  <div className="flex items-center gap-3">
                    <Clock className="w-5 h-5 text-primary" />
                    <div>
                      <div className="font-medium">Duration</div>
                      <div className="text-gray-600">{program.duration}</div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <DollarSign className="w-5 h-5 text-primary" />
                    <div>
                      <div className="font-medium">Tuition Fee</div>
                      <div className="text-gray-600">${program.tuitionFee.toLocaleString()}/year</div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <Users className="w-5 h-5 text-primary" />
                    <div>
                      <div className="font-medium">Available Seats</div>
                      <div className="text-gray-600">{program.availableSeats} seats</div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <Calendar className="w-5 h-5 text-primary" />
                    <div>
                      <div className="font-medium">Application Deadline</div>
                      <div className="text-gray-600">{new Date(program.applicationDeadline).toLocaleDateString()}</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Requirements */}
            <Card>
              <CardHeader>
                <CardTitle>Admission Requirements</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {program.requirements.map((req, index) => (
                    <div key={index} className="flex items-center gap-3">
                      <CheckCircle className="w-5 h-5 text-green-500" />
                      <span>{req}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Apply Now Card */}
            <Card>
              <CardHeader>
                <CardTitle>Apply Now</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary mb-1">${program.tuitionFee.toLocaleString()}</div>
                  <div className="text-sm text-gray-600">per year</div>
                </div>

                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Available Seats:</span>
                    <span className="font-medium">{program.availableSeats}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Application Deadline:</span>
                    <span className="font-medium">{new Date(program.applicationDeadline).toLocaleDateString()}</span>
                  </div>
                </div>

                <Button className="w-full bg-primary hover:bg-primary/90 text-white" asChild>
                  <Link href={`/apply?university=${university.id}&program=${program.id}`}>Apply for this Program</Link>
                </Button>

                <Button variant="outline" className="w-full" asChild>
                  <Link href={`/universities/${university.slug}`}>View University Profile</Link>
                </Button>
              </CardContent>
            </Card>

            {/* University Info */}
            <Card>
              <CardHeader>
                <CardTitle>About {university.shortName}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    <span className="text-sm">{university.rating} Rating</span>
                  </div>
                  <div className="text-sm text-gray-600">{university.totalStudents.toLocaleString()} students</div>
                  <div className="text-sm text-gray-600">Established {university.establishedYear}</div>
                  <div className="text-sm text-gray-600">{university.acceptanceRate}% acceptance rate</div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  )
}
