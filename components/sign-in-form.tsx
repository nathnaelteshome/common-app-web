"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Eye, EyeOff, AlertCircle } from "lucide-react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { signInSchema, type SignInData } from "@/lib/validations/auth"
import { authService } from "@/lib/auth-service"
import { useAuthStore } from "@/store/auth-store"
import Link from "next/link"
import { toast } from "sonner"

export function SignInForm() {
  const [showPassword, setShowPassword] = useState(false)
  const router = useRouter()
  const { setUser, setLoading, setError, error } = useAuthStore()

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SignInData>({
    resolver: zodResolver(signInSchema),
  })

  const onSubmit = async (data: SignInData) => {
    try {
      setLoading(true)
      setError(null)

      const result = await authService.signIn(data)
      setUser(result.user)

      toast.success("Sign in successful!")

      // Redirect based on user role
      switch (result.user.role) {
        case "student":
          router.push("/student/dashboard")
          break
        case "university":
          router.push("/admin/dashboard")
          break
        case "admin":
          router.push("/system-admin/dashboard")
          break
        default:
          router.push("/")
      }
    } catch (error) {
      console.error("Sign in error:", error)

      const errorMessage = error instanceof Error ? error.message : "Sign in failed"

      // Handle verification pending error
      if (errorMessage.startsWith("VERIFICATION_PENDING:")) {
        const requestId = errorMessage.split(":")[1]
        toast.info("Your university verification is still pending")
        router.push(`/admin/verification/status?requestId=${requestId}`)
        return
      }

      setError(errorMessage)
      toast.error(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl font-bold text-center">SIGN IN</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {error && (
          <div className="flex items-center gap-2 p-3 text-sm text-red-600 bg-red-50 border border-red-200 rounded-md">
            <AlertCircle className="w-4 h-4" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="Enter your email"
              {...register("email")}
              className={errors.email ? "border-red-500" : ""}
            />
            {errors.email && <p className="text-red-500 text-sm">{errors.email.message}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
                {...register("password")}
                className={errors.password ? "border-red-500" : ""}
              />
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="absolute right-2 top-1/2 transform -translate-y-1/2"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </Button>
            </div>
            {errors.password && <p className="text-red-500 text-sm">{errors.password.message}</p>}
          </div>

          <div className="flex items-center justify-between">
            <Link href="/auth/forgot-password" className="text-sm text-primary hover:underline">
              Forgot password?
            </Link>
          </div>

          <Button type="submit" disabled={isSubmitting} className="w-full">
            {isSubmitting ? "Signing in..." : "SIGN IN"}
          </Button>
        </form>

        <div className="text-center text-sm">
          <span className="text-gray-600">Don't have an account? </span>
          <Link href="/auth/create-account" className="text-primary hover:underline">
            Create Account
          </Link>
        </div>

        {/* Test Credentials */}
        <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <h3 className="font-semibold text-blue-800 mb-2">Test Credentials</h3>
          <div className="text-xs text-blue-700 space-y-1">
            <p>
              <strong>Student:</strong> student@test.com / Student123
            </p>
            <p>
              <strong>University:</strong> admin@aait.edu.et / Admin123
            </p>
            <p>
              {/* <strong>System Admin:</strong> sysadmin@commonapply.com / SysAdmin123 */}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
