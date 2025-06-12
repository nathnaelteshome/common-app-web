"use client"

import type React from "react"

import { useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Eye, EyeOff, Loader2, AlertCircle } from "lucide-react"
import Link from "next/link"
import { useAuthStore } from "@/store/auth-store"
import { authService } from "@/lib/auth-service"
import { signInSchema } from "@/lib/validations/auth"
import { toast } from "sonner"

export function SignInForm() {
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  })

  const router = useRouter()
  const searchParams = useSearchParams()
  const redirectUrl = searchParams.get("redirect")
  const { setUser, setLoading } = useAuthStore()

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
    if (error) setError(null) // Clear error when user starts typing
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setIsLoading(true)
    setLoading(true)

    try {
      // Validate form data
      const validatedData = signInSchema.parse(formData)

      // Sign in user
      const { user, token } = await authService.signIn(validatedData)

      // Update auth store
      setUser(user)

      toast.success("Successfully signed in!")

      // Redirect based on user role or redirect URL
      if (redirectUrl) {
        router.push(redirectUrl)
      } else if (user.role === "university") {
        router.push("/admin/dashboard")
      } else if (user.role === "student") {
        router.push("/student/dashboard")
      } else if (user.role === "admin") {
        router.push("/system-admin/dashboard")
      } else {
        router.push("/")
      }
    } catch (error) {
      console.error("Sign in error:", error)
      if (error instanceof Error) {
        setError(error.message)
        toast.error(error.message)
      } else {
        setError("An unexpected error occurred")
        toast.error("An unexpected error occurred")
      }
    } finally {
      setIsLoading(false)
      setLoading(false)
    }
  }

  // Helper function to fill test credentials
  const fillTestCredentials = (role: "student" | "university" | "admin") => {
    const credentials = {
      student: { email: "student@test.com", password: "Student123" },
      university: { email: "admin@aait.edu.et", password: "Admin123" },
      admin: { email: "sysadmin@commonapply.com", password: "SysAdmin123" },
    }

    setFormData(credentials[role])
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl font-bold text-center">Welcome back</CardTitle>
        <CardDescription className="text-center">Enter your credentials to access your account</CardDescription>
      </CardHeader>
      <CardContent>
        {/* Test Credentials Helper */}
        <div className="mb-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
          <h3 className="text-sm font-medium text-blue-900 mb-2">Test Credentials</h3>
          <div className="space-y-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="w-full text-xs"
              onClick={() => fillTestCredentials("student")}
            >
              Student: student@test.com
            </Button>
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="w-full text-xs"
              onClick={() => fillTestCredentials("university")}
            >
              University: admin@aait.edu.et
            </Button>
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="w-full text-xs"
              onClick={() => fillTestCredentials("admin")}
            >
              System Admin: sysadmin@commonapply.com
            </Button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              name="email"
              type="email"
              placeholder="Enter your email"
              value={formData.email}
              onChange={handleInputChange}
              required
              disabled={isLoading}
              className="w-full"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <div className="relative">
              <Input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
                value={formData.password}
                onChange={handleInputChange}
                required
                disabled={isLoading}
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
          </div>

          <div className="flex items-center justify-between">
            <div className="text-sm">
              <Link href="/auth/forgot-password" className="text-[#0a5eb2] hover:text-[#0a5eb2]/80 hover:underline">
                Forgot your password?
              </Link>
            </div>
          </div>

          <Button type="submit" className="w-full bg-[#0a5eb2] hover:bg-[#0a5eb2]/90" disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Signing in...
              </>
            ) : (
              "Sign In"
            )}
          </Button>

          <div className="text-center text-sm text-gray-600">
            Don't have an account?{" "}
            <Link
              href="/auth/create-account"
              className="text-[#0a5eb2] hover:text-[#0a5eb2]/80 hover:underline font-medium"
            >
              Create one here
            </Link>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
