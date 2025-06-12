"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Loader2, AlertCircle, Eye, EyeOff, ArrowLeft } from "lucide-react"
import Link from "next/link"
import { authService } from "@/lib/auth-service"
import { newPasswordSchema } from "@/lib/validations/auth"
import { toast } from "sonner"

export function ResetPasswordForm() {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [formData, setFormData] = useState({
    resetCode: "",
    password: "",
    confirmPassword: "",
    email: "",
  })
  const router = useRouter()

  useEffect(() => {
    // Get email from session storage
    if (typeof window !== "undefined") {
      const email = sessionStorage.getItem("reset_email")
      if (email) {
        setFormData((prev) => ({ ...prev, email }))
      }
    }
  }, [])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
    if (error) setError(null) // Clear error when user starts typing
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setIsLoading(true)

    try {
      // Validate form data
      const validatedData = newPasswordSchema.parse(formData)

      // Reset password
      const result = await authService.resetPasswordWithCode({
        resetCode: validatedData.resetCode,
        password: validatedData.password,
        email: formData.email,
      })

      toast.success(result.message)

      // Redirect to success page
      router.push("/auth/password-reset-success")
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
        <CardTitle className="text-2xl font-bold text-center">Reset Password</CardTitle>
        <CardDescription className="text-center">
          Enter the verification code sent to your email and create a new password
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

          {formData.email ? (
            <Alert className="bg-blue-50 text-blue-800 border-blue-200">
              <AlertDescription>
                Reset code has been sent to <strong>{formData.email}</strong>
              </AlertDescription>
            </Alert>
          ) : (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                No email found. Please go back to the{" "}
                <Link href="/auth/forgot-password" className="underline">
                  forgot password page
                </Link>
                .
              </AlertDescription>
            </Alert>
          )}

          <div className="space-y-2">
            <Label htmlFor="resetCode">Reset Code</Label>
            <Input
              id="resetCode"
              name="resetCode"
              type="text"
              placeholder="Enter 6-digit code"
              value={formData.resetCode}
              onChange={handleInputChange}
              required
              disabled={isLoading || !formData.email}
              className="w-full"
              maxLength={6}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">New Password</Label>
            <div className="relative">
              <Input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                placeholder="Enter new password"
                value={formData.password}
                onChange={handleInputChange}
                required
                disabled={isLoading || !formData.email}
                className="w-full pr-10"
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                onClick={() => setShowPassword(!showPassword)}
                disabled={isLoading}
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4 text-gray-400" />
                ) : (
                  <Eye className="h-4 w-4 text-gray-400" />
                )}
              </Button>
            </div>
            <p className="text-xs text-gray-500">
              Password must be at least 8 characters and include uppercase, lowercase, and numbers
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="confirmPassword">Confirm Password</Label>
            <div className="relative">
              <Input
                id="confirmPassword"
                name="confirmPassword"
                type={showConfirmPassword ? "text" : "password"}
                placeholder="Confirm new password"
                value={formData.confirmPassword}
                onChange={handleInputChange}
                required
                disabled={isLoading || !formData.email}
                className="w-full pr-10"
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                disabled={isLoading}
              >
                {showConfirmPassword ? (
                  <EyeOff className="h-4 w-4 text-gray-400" />
                ) : (
                  <Eye className="h-4 w-4 text-gray-400" />
                )}
              </Button>
            </div>
          </div>

          <Button
            type="submit"
            className="w-full bg-[#0a5eb2] hover:bg-[#0a5eb2]/90"
            disabled={isLoading || !formData.email}
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Resetting Password...
              </>
            ) : (
              "Reset Password"
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
