"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { UniversityProfile } from "@/components/university-profile"
import { ProgramsList } from "@/components/programs-list"
import { AdmissionRequirements } from "@/components/admission-requirements"
import { UniversityGallery } from "@/components/university-gallery"
import { ApplicationCTA } from "@/components/application-cta"
import { RelatedUniversities } from "@/components/related-universities"
import { Breadcrumb } from "@/components/breadcrumb"
import { getUniversityBySlug } from "@/data/universities-data"
import type { University } from "@/data/universities-data"
import { Skeleton } from "@/components/ui/skeleton"
import { Card, CardContent } from "@/components/ui/card"

export default function UniversityDetailPage() {
  const params = useParams()
  const router = useRouter()
  const [university, setUniversity] = useState<University | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchUniversity = async () => {
      try {
        setLoading(true)
        const slug = params.slug as string
        const universityData = getUniversityBySlug(slug)

        if (!universityData) {
          setError("University not found")
          return
        }

        setUniversity(universityData)
      } catch (err) {
        setError("Failed to load university information")
      } finally {
        setLoading(false)
      }
    }

    fetchUniversity()
  }, [params.slug])

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
                  <Skeleton className="h-64 w-full" />
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

  if (error || !university) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <Card className="text-center py-12">
            <CardContent>
              <h1 className="text-2xl font-bold text-gray-900 mb-4">University Not Found</h1>
              <p className="text-gray-600 mb-6">The university you're looking for doesn't exist or has been moved.</p>
              <button
                onClick={() => router.push("/colleges")}
                className="bg-primary text-white px-6 py-2 rounded-lg hover:bg-primary/90"
              >
                Browse All Universities
              </button>
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
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <div className="container mx-auto px-4 py-8">
        <Breadcrumb items={breadcrumbItems} />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            <UniversityProfile university={university} />
            <UniversityGallery university={university} />
            <ProgramsList university={university} />
            <AdmissionRequirements university={university} />
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <ApplicationCTA university={university} />
            <RelatedUniversities currentUniversity={university} />
          </div>
        </div>
      </div>

      <Footer />
    </div>
  )
}
