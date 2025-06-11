"use client"

import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { CheckCircle } from "lucide-react"

export function VerificationSuccess() {
  const router = useRouter()

  const handleContinue = () => {
    router.push("/auth/sign-in")
  }

  return (
    <div className="max-w-md mx-auto text-center">
      <div className="mb-8">
        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle className="w-12 h-12 text-green-600" />
        </div>

        <h2 className="text-2xl font-bold text-green-600 mb-4">SUCCESS!</h2>

        <div className="space-y-2 text-gray-600">
          <p className="font-semibold">Congratulations!</p>
          <p>You can proceed to login page and fill out your necessary information.</p>
        </div>
      </div>

      <Button onClick={handleContinue} className="bg-green-600 hover:bg-green-700 text-white px-8 py-3 text-lg">
        Continue
      </Button>
    </div>
  )
}
