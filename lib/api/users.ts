import { api } from "./client"
import { USER_ENDPOINTS } from "./endpoints"
import type { User, StudentProfile, UniversityProfile, AdminProfile, ApiResponse, PaginatedResponse } from "./types"

// User API Service - Complete CRUD Operations
export class UserApi {
  /**
   * Get user profile
   * GET /api/v1/users/profile
   */
  static async getProfile(): Promise<ApiResponse<User>> {
    return api.get<User>(USER_ENDPOINTS.PROFILE)
  }

  /**
   * Update user profile
   * PUT /api/v1/users/profile
   */
  static async updateProfile(
    profileData: Partial<StudentProfile | UniversityProfile | AdminProfile>,
  ): Promise<ApiResponse<User>> {
    return api.put<User>(USER_ENDPOINTS.UPDATE_PROFILE, profileData)
  }

  /**
   * Upload user avatar
   * POST /api/v1/users/avatar
   */
  static async uploadAvatar(file: File): Promise<ApiResponse<{ avatarUrl: string }>> {
    return api.upload<{ avatarUrl: string }>(USER_ENDPOINTS.UPLOAD_AVATAR, file)
  }

  /**
   * Get user by ID (Admin only)
   * GET /api/v1/users/:id
   */
  static async getUser(id: string): Promise<ApiResponse<User>> {
    return api.get<User>(USER_ENDPOINTS.GET_USER(id))
  }

  /**
   * Update user (Admin only)
   * PUT /api/v1/users/:id
   */
  static async updateUser(id: string, userData: Partial<User>): Promise<ApiResponse<User>> {
    return api.put<User>(USER_ENDPOINTS.UPDATE_USER(id), userData)
  }

  /**
   * Delete user (Admin only)
   * DELETE /api/v1/users/:id
   */
  static async deleteUser(id: string): Promise<ApiResponse<{ message: string }>> {
    return api.delete<{ message: string }>(USER_ENDPOINTS.DELETE_USER(id))
  }

  /**
   * List users (Admin only)
   * GET /api/v1/users
   */
  static async listUsers(params?: {
    page?: number
    limit?: number
    role?: string
    search?: string
    isActive?: boolean
    sortBy?: string
    sortOrder?: "asc" | "desc"
  }): Promise<ApiResponse<PaginatedResponse<User>>> {
    return api.get<PaginatedResponse<User>>(USER_ENDPOINTS.LIST_USERS, params)
  }

  /**
   * Update user role (Admin only)
   * PUT /api/v1/users/:id/role
   */
  static async updateUserRole(id: string, role: "student" | "university" | "admin"): Promise<ApiResponse<User>> {
    return api.put<User>(USER_ENDPOINTS.UPDATE_ROLE(id), { role })
  }

  /**
   * Deactivate user (Admin only)
   * PUT /api/v1/users/:id/deactivate
   */
  static async deactivateUser(id: string, reason?: string): Promise<ApiResponse<User>> {
    return api.put<User>(USER_ENDPOINTS.DEACTIVATE_USER(id), { reason })
  }

  /**
   * Activate user (Admin only)
   * PUT /api/v1/users/:id/activate
   */
  static async activateUser(id: string): Promise<ApiResponse<User>> {
    return api.put<User>(USER_ENDPOINTS.ACTIVATE_USER(id), {})
  }
}

// Export individual methods for convenience
export const userApi = {
  getProfile: UserApi.getProfile,
  updateProfile: UserApi.updateProfile,
  uploadAvatar: UserApi.uploadAvatar,
  getUser: UserApi.getUser,
  updateUser: UserApi.updateUser,
  deleteUser: UserApi.deleteUser,
  listUsers: UserApi.listUsers,
  updateUserRole: UserApi.updateUserRole,
  deactivateUser: UserApi.deactivateUser,
  activateUser: UserApi.activateUser,
}
