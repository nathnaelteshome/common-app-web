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
            // Check if program ID looks like a UUID
            const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(programId)
            
            if (!isUuid) {
              // If it's not a UUID, try multiple fallback approaches
              console.warn("Program ID is not a UUID, attempting fallback:", programId)
              console.log("Available programs:", universityData.programs)
              
              if (universityData.programs && universityData.programs.length > 0) {
                let fallbackProgram = null
                const numericId = parseInt(programId)
                
                // Try different approaches to find the program
                
                // 1. Check if any program has this exact ID (string or number)
                fallbackProgram = universityData.programs.find(p => 
                  p.id === programId || 
                  p.id === numericId || 
                  String(p.id) === programId
                )
                
                // 2. If not found, try 1-based index
                if (!fallbackProgram && numericId > 0 && numericId <= universityData.programs.length) {
                  fallbackProgram = universityData.programs[numericId - 1]
                  console.log(`Trying 1-based index ${numericId}:`, fallbackProgram)
                }
                
                // 3. If not found, try 0-based index
                if (!fallbackProgram && numericId >= 0 && numericId < universityData.programs.length) {
                  fallbackProgram = universityData.programs[numericId]
                  console.log(`Trying 0-based index ${numericId}:`, fallbackProgram)
                }
                
                // 4. If still not found, try to find by name or other properties
                if (!fallbackProgram) {
                  // Log available program IDs for debugging
                  console.log("Available program IDs:", universityData.programs.map(p => ({
                    id: p.id,
                    name: p.name,
                    type: typeof p.id
                  })))
                  
                  setError(`Program not found. Available programs: ${universityData.programs.map(p => `${p.name} (ID: ${p.id})`).join(', ')}. Requested ID: ${programId}`)
                } else {
                  console.log("Found fallback program:", fallbackProgram)
                  setSelectedProgramId(fallbackProgram.id)
                }
              } else {
                setError(`No programs available for this university. Program ID: ${programId}`)
              }
            } else {
              // Verify the program exists using program API
              try {
                console.log("Fetching program with UUID:", programId)
                const programResponse = await programApi.getProgram(programId)
                console.log("Program API response:", programResponse)
                
                if (programResponse.success && programResponse.data) {
                  // Verify the program belongs to the selected university
                  if (programResponse.data.university.id === universityId) {
                    setSelectedProgramId(programId)
                  } else {
                    setError(`Program belongs to ${programResponse.data.university.name}, not the selected university`)
                  }
                } else {
                  console.error("Program not found or API error:", programResponse)
                  setError(`Program not found (ID: ${programId})`)
                }
              } catch (programError) {
                console.error("Error fetching program:", programError)
                if (apiUtils.isApiError(programError)) {
                  const errorMsg = apiUtils.getErrorMessage(programError)
                  setError(`Failed to load program: ${errorMsg} (ID: ${programId})`)
                } else {
                  setError(`Network error while loading program (ID: ${programId})`)
                }
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
