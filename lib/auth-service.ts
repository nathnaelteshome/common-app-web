import type { User, SignInData, StudentRegistrationData, UniversityRegistrationData } from "@/lib/validations/auth"
import { findUserByCredentials, findUserById, findUserByEmail } from "@/data/mock-data"
import { verificationService } from "@/lib/services/verification-service"

// Frontend-only authentication service
// In a real application, this would make API calls to your backend

class AuthService {
  private currentUser: User | null = null

  async signIn(data: SignInData): Promise<{ user: User; token: string }> {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 1000))

    console.log("Attempting sign in with:", data.email)

    const user = findUserByCredentials(data.email, data.password)
    console.log("Found user:", user ? `${user.email} (${user.role})` : "null")

    if (!user) {
      console.error("No user found with credentials:", data.email)
      throw new Error("Invalid email or password")
    }

    if (!user.isEmailVerified) {
      throw new Error("Please verify your email before signing in")
    }

    // Check if university user is verified
    if (user.role === "university") {
      const profile = user.profile as any
      if (!profile?.isVerified) {
        // University is not verified yet, redirect to verification status
        const verificationRequest = verificationService.getVerificationRequestByUniversityId(user.id)
        if (verificationRequest) {
          throw new Error(`VERIFICATION_PENDING:${verificationRequest.id}`)
        } else {
          throw new Error("Your university verification is still pending. Please wait for admin approval.")
        }
      }
    }

    // Remove password from user object before returning
    const { password, ...userWithoutPassword } = user
    this.currentUser = userWithoutPassword

    const token = `mock_token_${user.id}`

    // Store in localStorage for persistence
    if (typeof window !== "undefined") {
      localStorage.setItem("auth_token", token)
      localStorage.setItem("current_user", JSON.stringify(userWithoutPassword))

      // Also set as cookie for middleware access
      document.cookie = `auth_token=${token}; path=/; max-age=${60 * 60 * 24 * 7}` // 7 days
    }

    console.log("Sign in successful for:", userWithoutPassword.email)

    return {
      user: userWithoutPassword,
      token,
    }
  }

  async signUp(data: StudentRegistrationData | UniversityRegistrationData): Promise<{ message: string }> {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 1500))

    // In a real app, this would make an API call to create the user
    // For frontend demo, we'll just simulate success
    return {
      message: "Account created successfully. Please check your email for verification.",
    }
  }

  async verifyEmail(code: string): Promise<{ message: string }> {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 800))

    // Simulate email verification
    if (code === "123456") {
      return {
        message: "Email verified successfully",
      }
    }

    throw new Error("Invalid verification code")
  }

  async resendVerificationCode(email: string): Promise<{ message: string }> {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 500))

    return {
      message: "Verification code sent to your email",
    }
  }

  async sendPasswordResetEmail(email: string): Promise<{ message: string }> {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 1000))

    // Check if user exists
    const user = findUserByEmail(email)
    if (!user) {
      throw new Error("No account found with this email address")
    }

    // In a real app, this would send an actual email
    console.log(`Password reset email sent to: ${email}`)
    console.log("Reset code: 123456") // For testing purposes

    return {
      message: "Password reset instructions sent to your email",
    }
  }

  async resetPasswordWithCode(data: { resetCode: string; email: string; password: string }): Promise<{
    message: string
  }> {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 1200))

    // Validate reset code (in real app, this would be stored in database)
    if (data.resetCode !== "123456") {
      throw new Error("Invalid or expired reset code")
    }

    // Check if user exists
    const user = findUserByEmail(data.email)
    if (!user) {
      throw new Error("No account found with this email address")
    }

    // In a real app, this would update the password in the database
    console.log(`Password reset successful for: ${data.email}`)

    return {
      message: "Password reset successfully",
    }
  }

  async getCurrentUser(): Promise<User | null> {
    if (typeof window === "undefined") return null

    try {
      const token = localStorage.getItem("auth_token")
      const storedUser = localStorage.getItem("current_user")

      if (!token || !storedUser) {
        return null
      }

      // Extract user ID from token
      const userId = token.replace("mock_token_", "")
      const user = findUserById(userId)

      if (!user) {
        this.signOut()
        return null
      }

      // Additional verification check for university users
      if (user.role === "university") {
        const profile = user.profile as any
        if (!profile?.isVerified) {
          // University verification status might have changed, check again
          const isVerified = verificationService.isUniversityVerified(user.id)
          if (!isVerified) {
            // Still not verified, user should not have access
            console.log("University user not verified, signing out")
            this.signOut()
            return null
          }
        }
      }

      // Remove password from user object
      const { password, ...userWithoutPassword } = user
      this.currentUser = userWithoutPassword
      return userWithoutPassword
    } catch (error) {
      console.error("Error getting current user:", error)
      this.signOut()
      return null
    }
  }

  async signOut(): Promise<void> {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 300))

    this.currentUser = null

    if (typeof window !== "undefined") {
      localStorage.removeItem("auth_token")
      localStorage.removeItem("current_user")

      // Remove auth cookie
      document.cookie = "auth_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT"
    }
  }

  // Method to check if current user can access admin features
  canAccessAdminFeatures(): boolean {
    if (!this.currentUser) return false

    if (this.currentUser.role === "university") {
      const profile = this.currentUser.profile as any
      return profile?.isVerified === true
    }

    return this.currentUser.role === "admin"
  }
}

export const authService = new AuthService()
