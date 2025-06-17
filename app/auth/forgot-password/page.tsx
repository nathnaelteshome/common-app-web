"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { ArrowLeft, Mail, Shield, Clock, CheckCircle } from "lucide-react"
import { toast } from "sonner"

export default function ForgotPasswordPage() {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [isEmailSent, setIsEmailSent] = useState(false)
  const [resendCooldown, setResendCooldown] = useState(0)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!email) {
      toast.error("Please enter your email address")
      return
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      toast.error("Please enter a valid email address")
      return
    }

    setIsLoading(true)

    try {
      // Simulate API call for password reset
      await new Promise((resolve) => setTimeout(resolve, 2000))

      // Simulate successful response
      setIsEmailSent(true)
      setResendCooldown(60) // 60 seconds cooldown

      // Start countdown
      const countdown = setInterval(() => {
        setResendCooldown((prev) => {
          if (prev <= 1) {
            clearInterval(countdown)
            return 0
          }
          return prev - 1
        })
      }, 1000)

      toast.success("Password reset email sent successfully!")
    } catch (error) {
      toast.error("Failed to send password reset email. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleResendEmail = async () => {
    if (resendCooldown > 0) return

    setIsLoading(true)

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))

      setResendCooldown(60)

      // Start countdown
      const countdown = setInterval(() => {
        setResendCooldown((prev) => {
          if (prev <= 1) {
            clearInterval(countdown)
            return 0
          }
          return prev - 1
        })
      }, 1000)

      toast.success("Password reset email sent again!")
    } catch (error) {
      toast.error("Failed to resend email. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  if (isEmailSent) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          <Card>
            <CardHeader className="text-center">
              <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
                <CheckCircle className="w-8 h-8 text-green-600" />
              </div>
              <CardTitle className="text-2xl font-bold">Check Your Email</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="text-center">
                <p className="text-gray-600 mb-4">We've sent a password reset link to:</p>
                <p className="font-medium text-gray-900 bg-gray-100 p-3 rounded-lg">{email}</p>
              </div>

              <Alert>
                <Mail className="h-4 w-4" />
                <AlertDescription>
                  Click the link in the email to reset your password. The link will expire in 1 hour for security
                  reasons.
                </AlertDescription>
              </Alert>

              <div className="space-y-4">
                <div className="text-center">
                  <p className="text-sm text-gray-600 mb-2">Didn't receive the email?</p>
                  <Button
                    variant="outline"
                    onClick={handleResendEmail}
                    disabled={isLoading || resendCooldown > 0}
                    className="w-full"
                  >
                    {isLoading ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-900 mr-2" />
                        Sending...
                      </>
                    ) : resendCooldown > 0 ? (
                      <>
                        <Clock className="w-4 h-4 mr-2" />
                        Resend in {resendCooldown}s
                      </>
                    ) : (
                      <>
                        <Mail className="w-4 h-4 mr-2" />
                        Resend Email
                      </>
                    )}
                  </Button>
                </div>

                <div className="text-center">
                  <Button variant="ghost" asChild>
                    <Link href="/auth/sign-in">
                      <ArrowLeft className="w-4 h-4 mr-2" />
                      Back to Sign In
                    </Link>
                  </Button>
                </div>
              </div>

              <div className="bg-blue-50 p-4 rounded-lg">
                <h4 className="font-medium text-blue-900 mb-2">Security Tips:</h4>
                <ul className="text-sm text-blue-800 space-y-1">
                  <li>• Check your spam/junk folder if you don't see the email</li>
                  <li>• The reset link expires in 1 hour</li>
                  <li>• Only use the most recent reset link if you request multiple</li>
                  <li>• Contact support if you continue having issues</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <Card>
          <CardHeader className="text-center">
            <div className="mx-auto w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
              <Shield className="w-8 h-8 text-blue-600" />
            </div>
            <CardTitle className="text-2xl font-bold">Reset Your Password</CardTitle>
            <p className="text-gray-600">Enter your email address and we'll send you a link to reset your password.</p>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <Label htmlFor="email">Email Address</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email address"
                  required
                  className="mt-1"
                />
              </div>

              <Button type="submit" disabled={isLoading} className="w-full bg-[#0a5eb2] hover:bg-[#0a5eb2]/90">
                {isLoading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                    Sending Reset Link...
                  </>
                ) : (
                  <>
                    <Mail className="w-4 h-4 mr-2" />
                    Send Reset Link
                  </>
                )}
              </Button>

              <div className="text-center">
                <Button variant="ghost" asChild>
                  <Link href="/auth/sign-in">
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back to Sign In
                  </Link>
                </Button>
              </div>
            </form>

            <div className="mt-6 bg-gray-50 p-4 rounded-lg">
              <h4 className="font-medium text-gray-900 mb-2">Having trouble?</h4>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Make sure you're using the email associated with your account</li>
                <li>• Check that your email address is spelled correctly</li>
                <li>• Contact support if you no longer have access to your email</li>
              </ul>
              <div className="mt-3">
                <Button variant="outline" size="sm" asChild>
                  <Link href="/contact">Contact Support</Link>
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
