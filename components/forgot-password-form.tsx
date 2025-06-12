"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Loader2, AlertCircle, ArrowLeft, Mail } from "lucide-react"
import Link from "next/link"
import { authService } from "@/lib/auth-service"
import { passwordResetSchema } from "@/lib/validations/auth"
import { toast } from "sonner"

export function ForgotPasswordForm() {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [email, setEmail] = useState("")
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setSuccess(null)
    setIsLoading(true)

    try {
      // Validate email
      const validatedData = passwordResetSchema.parse({ email })

      // Send password reset email
      const result = await authService.sendPasswordResetEmail(email)

      setSuccess(result.message)
      toast.success(result.message)

      // Store email in session storage for the reset page
      if (typeof window !== "undefined") {
        sessionStorage.setItem("reset_email", email)
      }

      // Redirect to reset password page after a short delay
      setTimeout(() => {
        router.push("/auth/reset-password")
      }, 2000)
    } catch (error) {
      console.error("Password reset error:", error)
      if (error instanceof Error) {
        setError(error.message)
        toast.error(error.message)
      } else {
        setError("An unexpected error occurred")
        toast.error("An unexpected error occurred")
      }
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl font-bold text-center">Forgot Password</CardTitle>
        <CardDescription className="text-center">
          Enter your email address and we'll send you a password reset link
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {success && (
            <Alert className="bg-green-50 text-green-800 border-green-200">
              <Mail className="h-4 w-4" />
              <AlertDescription>{success}</AlertDescription>
            </Alert>
          )}

          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="Enter your email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={isLoading || !!success}
              className="w-full"
            />
          </div>

          <Button type="submit" className="w-full bg-[#0a5eb2] hover:bg-[#0a5eb2]/90" disabled={isLoading || !!success}>
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Sending...
              </>
            ) : (
              "Send Reset Instructions"
            )}
          </Button>

          <div className="text-center text-sm">
            <Link
              href="/auth/sign-in"
              className="text-[#0a5eb2] hover:text-[#0a5eb2]/80 hover:underline inline-flex items-center"
            >
              <ArrowLeft className="mr-1 h-3 w-3" />
              Back to Sign In
            </Link>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
