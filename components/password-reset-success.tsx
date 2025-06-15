"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckCircle, Home, LogIn, Timer } from "lucide-react"
import Link from "next/link"

export function PasswordResetSuccess() {
  const [countdown, setCountdown] = useState(10)
  const router = useRouter()

  useEffect(() => {
    // Clear the reset email from session storage
    if (typeof window !== "undefined") {
      sessionStorage.removeItem("reset_email")
    }

    // Countdown timer
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer)
          router.push("/auth/sign-in")
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [router])

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader className="space-y-1">
        <div className="flex justify-center mb-4">
          <CheckCircle className="h-16 w-16 text-green-500" />
        </div>
        <CardTitle className="text-2xl font-bold text-center">Password Reset Successful</CardTitle>
        <CardDescription className="text-center">
          Your password has been reset successfully. You can now sign in with your new password.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex justify-center items-center text-sm text-gray-500">
          <Timer className="mr-1 h-4 w-4" />
          <span>Redirecting to sign in page in {countdown} seconds...</span>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Button variant="outline" className="flex items-center justify-center" asChild>
            <Link href="/">
              <Home className="mr-2 h-4 w-4" />
              Home
            </Link>
          </Button>

          <Button className="bg-[#0a5eb2] hover:bg-[#0a5eb2]/90 flex items-center justify-center" asChild>
            <Link href="/auth/sign-in">
              <LogIn className="mr-2 h-4 w-4" />
              Sign In
            </Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
