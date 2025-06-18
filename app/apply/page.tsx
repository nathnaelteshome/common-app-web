"use client"

import { useEffect, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { ApplicationFlow } from "@/components/application-flow"
import { GuestApplicationPrompt } from "@/components/guest-application-prompt"
import { useAuthStore } from "@/store/auth-store"
import { getUniversities } from "@/data/universities-data"
import type University from "@/data/universities-data"
import { Button } from "@/components/ui/button"

export default function ApplyPage() {
  const { isAuthenticated, user } = useAuthStore()
  const router = useRouter()
  const searchParams = useSearchParams()
  const [selectedUniversity, setSelectedUniversity] = useState<University | null>(null)
  const [selectedProgramId, setSelectedProgramId] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    try {
      setIsLoading(true)
      const universityId = searchParams.get("university")
      const programId = searchParams.get("program")

      if (universityId) {
        const universities = getUniversities()
        const university = universities.find((u) => u.id === universityId)
        if (university) {
          setSelectedUniversity(university)
          if (programId) {
            // Verify the program exists
            const program = university.programs?.find((p) => p.id === programId)
            if (program) {
              setSelectedProgramId(programId)
            } else {
              setError("Selected program not found")
            }
          } else {
            setError("University not found")
          }
        } else {
          setError("University not found")
        }
      }
    } catch (err) {
      setError("Failed to load university data")
    } finally {
      setIsLoading(false)
    }
  }, [searchParams])

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <p>Loading...</p>
          </div>
        </div>
        <Footer />
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <p className="text-red-600 mb-4">{error}</p>
            <Button asChild>
              <a href="/colleges">Browse Universities</a>
            </Button>
          </div>
        </div>
        <Footer />
      </div>
    )
  }

  // If user is not authenticated, show the guest prompt
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <GuestApplicationPrompt university={selectedUniversity} programId={selectedProgramId} />
        <Footer />
      </div>
    )
  }

  // If user is authenticated but not a student, redirect
  if (user?.role !== "student") {
    router.push("/unauthorized")
    return null
  }

  // Show the application flow for authenticated students
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <ApplicationFlow university={selectedUniversity} programId={selectedProgramId} />
      <Footer />
    </div>
  )
}
