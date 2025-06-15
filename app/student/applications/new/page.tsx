"use client"

import { useEffect, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { useAuthStore } from "@/store/auth-store"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { ApplicationFlow } from "@/components/application-flow"
import { universities } from "@/data/universities-data"

export default function NewApplicationPage() {
  const { user, isAuthenticated } = useAuthStore()
  const router = useRouter()
  const searchParams = useSearchParams()
  const [initialData, setInitialData] = useState<{
    university: any
    programId: string | null
  }>({
    university: null,
    programId: null,
  })

  useEffect(() => {
    if (!isAuthenticated || user?.role !== "student") {
      router.push("/auth/sign-in")
      return
    }

    // Get pre-selected university and program from URL params
    const universityId = searchParams.get("university")
    const programId = searchParams.get("program")

    if (universityId) {
      const university = universities.find((u) => u.id === universityId)
      setInitialData({
        university: university || null,
        programId,
      })
    }
  }, [isAuthenticated, user, router, searchParams])

  if (!isAuthenticated || user?.role !== "student") {
    return null
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <ApplicationFlow university={initialData.university} programId={initialData.programId} />
      <Footer />
    </div>
  )
}
