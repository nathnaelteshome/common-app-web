import { api } from "./client"
import { AUTH_ENDPOINTS } from "./endpoints"
import type {
  LoginRequest,
  LoginResponse,
  RegisterRequest,
  RegisterResponse,
  RefreshTokenRequest,
  RefreshTokenResponse,
  ForgotPasswordRequest,
  ForgotPasswordResponse,
  ResetPasswordRequest,
  ResetPasswordResponse,
  ApiResponse,
  User,
} from "./types"

// Authentication API Service
export class AuthApi {
  /**
   * User login
   * POST /api/v1/auth/login
   */
  static async login(credentials: LoginRequest): Promise<ApiResponse<LoginResponse>> {
    const response = await api.post<LoginResponse>(AUTH_ENDPOINTS.LOGIN, credentials)

    // Store tokens after successful login
    if (response.success && response.data) {
      api.setTokens(response.data.accessToken, response.data.refreshToken)
    }

    return response
  }

  /**
   * User registration
   * POST /api/v1/auth/register
   */
  static async register(userData: RegisterRequest): Promise<ApiResponse<RegisterResponse>> {
    return api.post<RegisterResponse>(AUTH_ENDPOINTS.REGISTER, userData)
  }

  /**
   * Refresh access token
   * POST /api/v1/auth/refresh
   */
  static async refreshToken(refreshTokenData: RefreshTokenRequest): Promise<ApiResponse<RefreshTokenResponse>> {
    const response = await api.post<RefreshTokenResponse>(AUTH_ENDPOINTS.REFRESH, refreshTokenData)

    // Update stored tokens after successful refresh
    if (response.success && response.data) {
      api.setTokens(response.data.accessToken, response.data.refreshToken)
    }

    return response
  }

  /**
   * User logout
   * POST /api/v1/auth/logout
   */
  static async logout(): Promise<ApiResponse<{ message: string }>> {
    try {
      const response = await api.post<{ message: string }>(AUTH_ENDPOINTS.LOGOUT)
      return response
    } finally {
      // Always clear tokens, even if logout request fails
      api.clearTokens()
    }
  }

  /**
   * Forgot password
   * POST /api/v1/auth/forgot-password
   */
  static async forgotPassword(emailData: ForgotPasswordRequest): Promise<ApiResponse<ForgotPasswordResponse>> {
    return api.post<ForgotPasswordResponse>(AUTH_ENDPOINTS.FORGOT_PASSWORD, emailData)
  }

  /**
   * Reset password
   * POST /api/v1/auth/reset-password
   */
  static async resetPassword(resetData: ResetPasswordRequest): Promise<ApiResponse<ResetPasswordResponse>> {
    return api.post<ResetPasswordResponse>(AUTH_ENDPOINTS.RESET_PASSWORD, resetData)
  }

  /**
   * Verify email
   * POST /api/v1/auth/verify-email
   */
  static async verifyEmail(token: string, email: string): Promise<ApiResponse<{ message: string }>> {
    return api.post<{ message: string }>(AUTH_ENDPOINTS.VERIFY_EMAIL, { token, email })
  }

  /**
   * Resend verification email
   * POST /api/v1/auth/resend-verification
   */
  static async resendVerification(email: string): Promise<ApiResponse<{ message: string }>> {
    return api.post<{ message: string }>(AUTH_ENDPOINTS.RESEND_VERIFICATION, { email })
  }

  /**
   * Change password (authenticated user)
   * POST /api/v1/auth/change-password
   */
  static async changePassword(passwordData: {
    currentPassword: string
    newPassword: string
    confirmPassword: string
  }): Promise<ApiResponse<{ message: string }>> {
    return api.post<{ message: string }>(AUTH_ENDPOINTS.CHANGE_PASSWORD, passwordData)
  }

  /**
   * Get current user info
   * GET /api/v1/auth/me
   */
  static async getCurrentUser(): Promise<ApiResponse<User>> {
    return api.get<User>(AUTH_ENDPOINTS.ME)
  }

  /**
   * Check if user is authenticated
   */
  static isAuthenticated(): boolean {
    const { accessToken } = api.getTokens()
    return !!accessToken
  }

  /**
   * Get current user role from token
   */
  static getCurrentUserRole(): string | null {
    const { accessToken } = api.getTokens()
    if (!accessToken) return null

    try {
      const payload = JSON.parse(atob(accessToken.split(".")[1]))
      return payload.role || null
    } catch {
      return null
    }
  }

  /**
   * Check if current user has specific role
   */
  static hasRole(role: string): boolean {
    const currentRole = AuthApi.getCurrentUserRole()
    return currentRole === role
  }

  /**
   * Check if current user is admin
   */
  static isAdmin(): boolean {
    return AuthApi.hasRole("admin")
  }

  /**
   * Check if current user is student
   */
  static isStudent(): boolean {
    return AuthApi.hasRole("student")
  }

  /**
   * Check if current user is university
   */
  static isUniversity(): boolean {
    return AuthApi.hasRole("university")
  }
}

// Export individual methods for convenience
export const authApi = {
  login: AuthApi.login,
  register: AuthApi.register,
  refreshToken: AuthApi.refreshToken,
  logout: AuthApi.logout,
  forgotPassword: AuthApi.forgotPassword,
  resetPassword: AuthApi.resetPassword,
  verifyEmail: AuthApi.verifyEmail,
  resendVerification: AuthApi.resendVerification,
  changePassword: AuthApi.changePassword,
  getCurrentUser: AuthApi.getCurrentUser,
  isAuthenticated: AuthApi.isAuthenticated,
  getCurrentUserRole: AuthApi.getCurrentUserRole,
  hasRole: AuthApi.hasRole,
  isAdmin: AuthApi.isAdmin,
  isStudent: AuthApi.isStudent,
  isUniversity: AuthApi.isUniversity,
}
