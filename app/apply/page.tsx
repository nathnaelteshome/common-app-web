"use client"

import { useEffect, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { ApplicationFlow } from "@/components/application-flow"
import { GuestApplicationPrompt } from "@/components/guest-application-prompt"
import { useAuthStore } from "@/store/auth-store"
import { getUniversities } from "@/data/universities-data"
import type { University } from "@/data/universities-data"

export default function ApplyPage() {
  const { isAuthenticated, user } = useAuthStore()
  const router = useRouter()
  const searchParams = useSearchParams()
  const [selectedUniversity, setSelectedUniversity] = useState<University | null>(null)
  const [selectedProgramId, setSelectedProgramId] = useState<string | null>(null)

  useEffect(() => {
    const universityId = searchParams.get("university")
    const programId = searchParams.get("program")

    if (universityId) {
      const universities = getUniversities()
      const university = universities.find((u) => u.id === universityId)
      if (university) {
        setSelectedUniversity(university)
        if (programId) {
          setSelectedProgramId(programId)
        }
      }
    }
  }, [searchParams])

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
