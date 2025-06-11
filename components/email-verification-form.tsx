"use client"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent } from "@/components/ui/card"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { emailVerificationSchema, type EmailVerificationData } from "@/lib/validations/auth"
import { authService } from "@/lib/auth-service"
import { useAuthStore } from "@/store/auth-store"

export function EmailVerificationForm() {
  const [email, setEmail] = useState("")
  const [isResending, setIsResending] = useState(false)
  const router = useRouter()
  const searchParams = useSearchParams()
  const { setLoading, setError, error } = useAuthStore()

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<EmailVerificationData>({
    resolver: zodResolver(emailVerificationSchema),
  })

  useEffect(() => {
    const emailParam = searchParams.get("email")
    if (emailParam) {
      setEmail(decodeURIComponent(emailParam))
    }
  }, [searchParams])

  const onSubmit = async (data: EmailVerificationData) => {
    try {
      setLoading(true)
      setError(null)

      await authService.verifyEmail(data)

      // Redirect to success page
      router.push("/auth/verification-success")
    } catch (error) {
      console.error("Verification error:", error)
      // Redirect to error page
      router.push("/auth/verification-error")
    } finally {
      setLoading(false)
    }
  }

  const handleResend = async () => {
    if (!email) return

    try {
      setIsResending(true)
      setError(null)

      await authService.resendVerificationCode(email)

      // Show success message or toast
      alert("Verification code sent successfully!")
    } catch (error) {
      setError(error instanceof Error ? error.message : "Failed to resend code")
    } finally {
      setIsResending(false)
    }
  }

  return (
    <div className="max-w-md mx-auto">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-primary mb-4">Email Verification</h2>
        <p className="text-gray-600 mb-2">
          We've sent an verification to <span className="font-semibold text-primary">{email || "your email"}</span> to
          verify your email address and activate your account.
        </p>
      </div>

      <Card>
        <CardContent className="p-8">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {error && <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">{error}</div>}

            <div>
              <Label htmlFor="verificationCode">Verification Code</Label>
              <Input
                id="verificationCode"
                {...register("verificationCode")}
                placeholder="Enter 6-digit code"
                maxLength={6}
                className={`text-center text-lg tracking-widest ${errors.verificationCode ? "border-red-500" : ""}`}
              />
              {errors.verificationCode && (
                <p className="text-red-500 text-sm mt-1">{errors.verificationCode.message}</p>
              )}
            </div>

            <Button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-primary hover:bg-primary/90 text-white py-3 text-lg"
            >
              {isSubmitting ? "Verifying..." : "Verify My Account →"}
            </Button>

            <div className="text-center">
              <p className="text-sm text-gray-600">
                Didn't receive any code?{" "}
                <button
                  type="button"
                  onClick={handleResend}
                  disabled={isResending || !email}
                  className="text-primary hover:underline disabled:opacity-50"
                >
                  {isResending ? "Sending..." : "Resends"}
                </button>
              </p>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
