"use client"

import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { XCircle } from "lucide-react"

export function VerificationError() {
  const router = useRouter()

  const handleTryAgain = () => {
    router.back()
  }

  return (
    <div className="max-w-md mx-auto text-center">
      <div className="mb-8">
        <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <XCircle className="w-12 h-12 text-red-600" />
        </div>

        <h2 className="text-2xl font-bold text-red-600 mb-4">ERROR!</h2>

        <div className="space-y-2 text-gray-600">
          <p className="font-semibold">Thank you for your request.</p>
          <p>We are unable to continue the process.</p>
          <p>Please try again to complete the request.</p>
        </div>
      </div>

      <Button onClick={handleTryAgain} className="bg-red-600 hover:bg-red-700 text-white px-8 py-3 text-lg">
        Try Again
      </Button>
    </div>
  )
}
