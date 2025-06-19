import type { User, SignInData, StudentRegistrationData, UniversityRegistrationData } from "@/lib/validations/auth"
import { AuthApi } from "@/lib/api/auth"
import { apiUtils } from "@/lib/api/client"

// Authentication service integrated with backend API

class AuthService {
  private currentUser: User | null = null

  // Helper method to convert MM/DD/YYYY to ISO-8601 DateTime format (YYYY-MM-DDTHH:mm:ss.sssZ)
  private convertDateToISO(dateString: string): string {
    try {
      let dateOnly = ''
      
      // Handle both MM/DD/YYYY and YYYY-MM-DD formats
      if (dateString.includes('-')) {
        // Already in ISO date format
        dateOnly = dateString
      } else if (dateString.includes('/')) {
        const [month, day, year] = dateString.split('/')
        // Pad month and day with leading zeros if needed
        const paddedMonth = month.padStart(2, '0')
        const paddedDay = day.padStart(2, '0')
        dateOnly = `${year}-${paddedMonth}-${paddedDay}`
      } else {
        // If neither format matches, return as-is and let backend handle validation
        return dateString
      }
      
      // Convert to full ISO-8601 DateTime format with midnight UTC
      return `${dateOnly}T00:00:00.000Z`
    } catch (error) {
      console.error('Error converting date format:', error)
      return dateString
    }
  }

  async signIn(data: SignInData): Promise<{ user: User; token: string }> {
    try {
      const response = await AuthApi.login({ 
        email: data.email, 
        password: data.password 
      })

      if (!response.success || !response.data) {
        throw new Error("Login failed")
      }

      const { user, accessToken } = response.data
      this.currentUser = user

      // Store user data in localStorage for persistence
      if (typeof window !== "undefined") {
        localStorage.setItem("current_user", JSON.stringify(user))
        // Also set as cookie for middleware access
        document.cookie = `auth_token=${accessToken}; path=/; max-age=${60 * 60 * 24 * 7}` // 7 days
      }

      return {
        user,
        token: accessToken,
      }
    } catch (error) {
      if (apiUtils.isApiError(error)) {
        throw new Error(apiUtils.getErrorMessage(error))
      }
      throw new Error("Login failed. Please try again.")
    }
  }

  async signUp(data: StudentRegistrationData | UniversityRegistrationData): Promise<{ user: User; token: string; message: string }> {
    try {
      // Transform data to match backend API format
      const registerData = {
        email: data.email,
        password: data.password,
        role: data.role,
        profile: data.role === "student" ? {
          firstName: (data as StudentRegistrationData).firstName,
          lastName: (data as StudentRegistrationData).lastName,
          username: (data as StudentRegistrationData).username,
          phone_number: (data as StudentRegistrationData).phoneNumber,
          date_of_birth: this.convertDateToISO((data as StudentRegistrationData).dateOfBirth),
          nationality: "US", // Default nationality since not in form
          bio: "" // Default empty bio since not in form
        } : {
          collegeName: (data as UniversityRegistrationData).universityName,
          universityType: (data as UniversityRegistrationData).universityType,
          website: (data as UniversityRegistrationData).website,
          description: (data as UniversityRegistrationData).description,
          establishedYear: (data as UniversityRegistrationData).establishedYear,
          fieldOfStudies: (data as UniversityRegistrationData).fieldOfStudies,
          address: {
            street: (data as UniversityRegistrationData).address.street,
            city: (data as UniversityRegistrationData).address.city,
            state: (data as UniversityRegistrationData).address.state,
            zipCode: (data as UniversityRegistrationData).address.zipCode,
            country: (data as UniversityRegistrationData).address.country || "USA"
          },
          contact: {
            phone: (data as UniversityRegistrationData).contact.phone,
            email: (data as UniversityRegistrationData).contact.email,
            admissions_email: (data as UniversityRegistrationData).contact.admissions_email
          }
        }
      }

      const response = await AuthApi.register(registerData)
      
      if (!response.success) {
        throw new Error("Registration failed")
      }

      // Automatically sign in the user after successful registration
      const loginResponse = await this.signIn({
        email: data.email,
        password: data.password
      })

      return {
        user: loginResponse.user,
        token: loginResponse.token,
        message: "Account created successfully. You are now signed in!",
      }
    } catch (error) {
      if (apiUtils.isApiError(error)) {
        throw new Error(apiUtils.getErrorMessage(error))
      }
      throw new Error("Registration failed. Please try again.")
    }
  }

  async verifyEmail(code: string, email: string): Promise<{ message: string }> {
    try {
      const response = await AuthApi.verifyEmail(code, email)
      
      if (!response.success) {
        throw new Error("Email verification failed")
      }

      return {
        message: "Email verified successfully",
      }
    } catch (error) {
      if (apiUtils.isApiError(error)) {
        throw new Error(apiUtils.getErrorMessage(error))
      }
      throw new Error("Email verification failed. Please try again.")
    }
  }

  async resendVerificationCode(email: string): Promise<{ message: string }> {
    try {
      const response = await AuthApi.resendVerification(email)
      
      if (!response.success) {
        throw new Error("Failed to resend verification code")
      }

      return {
        message: "Verification code sent to your email",
      }
    } catch (error) {
      if (apiUtils.isApiError(error)) {
        throw new Error(apiUtils.getErrorMessage(error))
      }
      throw new Error("Failed to resend verification code. Please try again.")
    }
  }

  async sendPasswordResetEmail(email: string): Promise<{ message: string }> {
    try {
      const response = await AuthApi.forgotPassword({ email })
      
      if (!response.success) {
        throw new Error("Failed to send password reset email")
      }

      return {
        message: "Password reset instructions sent to your email",
      }
    } catch (error) {
      if (apiUtils.isApiError(error)) {
        throw new Error(apiUtils.getErrorMessage(error))
      }
      throw new Error("Failed to send password reset email. Please try again.")
    }
  }

  async resetPasswordWithCode(data: { resetCode: string; email: string; password: string }): Promise<{
    message: string
  }> {
    try {
      const response = await AuthApi.resetPassword({
        token: data.resetCode,
        email: data.email,
        password: data.password
      })
      
      if (!response.success) {
        throw new Error("Password reset failed")
      }

      return {
        message: "Password reset successfully",
      }
    } catch (error) {
      if (apiUtils.isApiError(error)) {
        throw new Error(apiUtils.getErrorMessage(error))
      }
      throw new Error("Password reset failed. Please try again.")
    }
  }

  async getCurrentUser(): Promise<User | null> {
    if (typeof window === "undefined") return null

    try {
      // Check if user is authenticated
      if (!AuthApi.isAuthenticated()) {
        return null
      }

      // Try to get user from localStorage first (for performance)
      const storedUser = localStorage.getItem("current_user")
      if (storedUser) {
        const user = JSON.parse(storedUser)
        this.currentUser = user
        return user
      }

      // If no stored user, fetch from API
      const response = await AuthApi.getCurrentUser()
      if (response.success && response.data) {
        const user = response.data
        this.currentUser = user
        
        // Store in localStorage
        localStorage.setItem("current_user", JSON.stringify(user))
        
        return user
      }

      return null
    } catch (error) {
      console.error("Error getting current user:", error)
      this.signOut()
      return null
    }
  }

  async signOut(): Promise<void> {
    try {
      // Call API logout endpoint
      await AuthApi.logout()
    } catch (error) {
      console.error("Logout API call failed:", error)
      // Continue with local cleanup even if API call fails
    } finally {
      // Always clear local data
      this.currentUser = null

      if (typeof window !== "undefined") {
        localStorage.removeItem("current_user")
        // Remove auth cookie
        document.cookie = "auth_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT"
      }
    }
  }

  // Method to check if current user can access admin features
  canAccessAdminFeatures(): boolean {
    return AuthApi.isAdmin() || AuthApi.isUniversity()
  }

  // Helper methods for role checking
  isAuthenticated(): boolean {
    return AuthApi.isAuthenticated()
  }

  isStudent(): boolean {
    return AuthApi.isStudent()
  }

  isUniversity(): boolean {
    return AuthApi.isUniversity()
  }

  isAdmin(): boolean {
    return AuthApi.isAdmin()
  }

  getCurrentUserRole(): string | null {
    return AuthApi.getCurrentUserRole()
  }
}

export const authService = new AuthService()
