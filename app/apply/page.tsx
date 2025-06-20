"use client"

import { useEffect, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { ApplicationFlow } from "@/components/application-flow"
import { GuestApplicationPrompt } from "@/components/guest-application-prompt"
import { useAuthStore } from "@/store/auth-store"
import { universityApi } from "@/lib/api/universities"
import { programApi } from "@/lib/api/programs"
import { apiUtils } from "@/lib/api/client"
import { toast } from "sonner"
import type { University } from "@/lib/api/types"
import type { Program } from "@/lib/api/programs"
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
    const fetchData = async () => {
      try {
        setIsLoading(true)
        setError(null)
        const universityId = searchParams.get("university")
        const programId = searchParams.get("program")

        if (universityId) {
          // Fetch university details from API
          const universityResponse = await universityApi.getUniversity(universityId)
          
          if (!universityResponse.success || !universityResponse.data) {
            setError("University not found")
            return
          }

          const universityData = universityResponse.data
          setSelectedUniversity(universityData)

          if (programId) {
            // Verify the program exists using program API
            try {
              const programResponse = await programApi.getProgram(programId)
              if (programResponse.success && programResponse.data) {
                // Verify the program belongs to the selected university
                if (programResponse.data.university.id === universityId) {
                  setSelectedProgramId(programId)
                } else {
                  setError("Selected program does not belong to this university")
                }
              } else {
                setError("Selected program not found")
              }
            } catch (programError) {
              console.error("Error fetching program:", programError)
              if (apiUtils.isApiError(programError)) {
                setError(apiUtils.getErrorMessage(programError))
              } else {
                setError("Selected program not found")
              }
            }
          }
        } else {
          setError("Please select a university and program to apply")
        }
      } catch (err) {
        console.error("Error fetching data:", err)
        if (apiUtils.isApiError(err)) {
          setError(apiUtils.getErrorMessage(err))
        } else {
          setError("Failed to load application data")
        }
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
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
