import { api } from "./client"
import { UNIVERSITY_ENDPOINTS } from "./endpoints"
import type { University, Program, ApiResponse, PaginatedResponse, SearchFilters, SearchResult } from "./types"

// University API Service - Complete CRUD Operations
export class UniversityApi {
  /**
   * List universities
   * GET /api/v1/universities
   */
  static async listUniversities(params?: {
    page?: number
    limit?: number
    search?: string
    country?: string
    city?: string
    isVerified?: boolean
    isActive?: boolean
    programType?: string
    sortBy?: string
    sortOrder?: "asc" | "desc"
  }): Promise<ApiResponse<PaginatedResponse<University>>> {
    return api.get<PaginatedResponse<University>>(UNIVERSITY_ENDPOINTS.LIST, params)
  }

  /**
   * Create university (System Admin only)
   * POST /api/v1/universities
   */
  static async createUniversity(
    universityData: Omit<University, "id" | "createdAt" | "updatedAt">,
  ): Promise<ApiResponse<University>> {
    return api.post<University>(UNIVERSITY_ENDPOINTS.CREATE, universityData)
  }

  /**
   * Get university by ID
   * GET /api/v1/universities/:id
   */
  static async getUniversity(id: string): Promise<ApiResponse<University>> {
    return api.get<University>(UNIVERSITY_ENDPOINTS.GET(id))
  }

  /**
   * Get university by slug
   * GET /api/v1/universities/slug/:slug
   */
  static async getUniversityBySlug(slug: string): Promise<ApiResponse<University>> {
    return api.get<University>(UNIVERSITY_ENDPOINTS.GET_BY_SLUG(slug))
  }

  /**
   * Update university
   * PUT /api/v1/universities/:id
   */
  static async updateUniversity(id: string, universityData: Partial<University>): Promise<ApiResponse<University>> {
    return api.put<University>(UNIVERSITY_ENDPOINTS.UPDATE(id), universityData)
  }

  /**
   * Delete university (System Admin only)
   * DELETE /api/v1/universities/:id
   */
  static async deleteUniversity(id: string): Promise<ApiResponse<{ message: string }>> {
    return api.delete<{ message: string }>(UNIVERSITY_ENDPOINTS.DELETE(id))
  }

  /**
   * Verify university (System Admin only)
   * PUT /api/v1/universities/:id/verify
   */
  static async verifyUniversity(id: string, verified: boolean, notes?: string): Promise<ApiResponse<University>> {
    return api.put<University>(UNIVERSITY_ENDPOINTS.VERIFY(id), { isVerified: verified, verificationNotes: notes })
  }

  /**
   * Deactivate university (System Admin only)
   * PUT /api/v1/universities/:id/deactivate
   */
  static async deactivateUniversity(id: string, reason?: string): Promise<ApiResponse<University>> {
    return api.put<University>(UNIVERSITY_ENDPOINTS.DEACTIVATE(id), { reason })
  }

  /**
   * Search universities
   * GET /api/v1/universities/search
   */
  static async searchUniversities(filters: SearchFilters): Promise<ApiResponse<SearchResult>> {
    return api.get<SearchResult>(UNIVERSITY_ENDPOINTS.SEARCH, filters)
  }

  /**
   * Get university programs
   * GET /api/v1/universities/:id/programs
   */
  static async getUniversityPrograms(id: string): Promise<ApiResponse<Program[]>> {
    return api.get<Program[]>(UNIVERSITY_ENDPOINTS.PROGRAMS(id))
  }

  /**
   * Add program to university
   * POST /api/v1/universities/:id/programs
   */
  static async addProgram(id: string, programData: Omit<Program, "id">): Promise<ApiResponse<Program>> {
    return api.post<Program>(UNIVERSITY_ENDPOINTS.ADD_PROGRAM(id), programData)
  }

  /**
   * Update university program
   * PUT /api/v1/universities/:id/programs/:programId
   */
  static async updateProgram(
    id: string,
    programId: string,
    programData: Partial<Program>,
  ): Promise<ApiResponse<Program>> {
    return api.put<Program>(UNIVERSITY_ENDPOINTS.UPDATE_PROGRAM(id, programId), programData)
  }

  /**
   * Delete university program
   * DELETE /api/v1/universities/:id/programs/:programId
   */
  static async deleteProgram(id: string, programId: string): Promise<ApiResponse<{ message: string }>> {
    return api.delete<{ message: string }>(UNIVERSITY_ENDPOINTS.DELETE_PROGRAM(id, programId))
  }

  /**
   * Upload university image
   * POST /api/v1/universities/:id/images
   */
  static async uploadImage(id: string, file: File, imageType?: string): Promise<ApiResponse<{ imageUrl: string }>> {
    return api.upload<{ imageUrl: string }>(UNIVERSITY_ENDPOINTS.UPLOAD_IMAGE(id), file, { type: imageType })
  }

  /**
   * Delete university image
   * DELETE /api/v1/universities/:id/images/:imageId
   */
  static async deleteImage(id: string, imageId: string): Promise<ApiResponse<{ message: string }>> {
    return api.delete<{ message: string }>(UNIVERSITY_ENDPOINTS.DELETE_IMAGE(id, imageId))
  }

  /**
   * Bulk verify universities (System Admin only)
   * PUT /api/v1/universities/bulk-verify
   */
  static async bulkVerifyUniversities(updates: {
    universityIds: string[]
    isVerified: boolean
    notes?: string
  }): Promise<ApiResponse<{ updated: number }>> {
    return api.put<{ updated: number }>(UNIVERSITY_ENDPOINTS.BULK_VERIFY, updates)
  }

  /**
   * Export universities (Admin only)
   * GET /api/v1/universities/export
   */
  static async exportUniversities(params?: {
    format?: "csv" | "xlsx"
    isVerified?: boolean
    country?: string
  }): Promise<ApiResponse<{ downloadUrl: string }>> {
    return api.get<{ downloadUrl: string }>(UNIVERSITY_ENDPOINTS.EXPORT, params)
  }
}

// Export individual methods for convenience
export const universityApi = {
  listUniversities: UniversityApi.listUniversities,
  createUniversity: UniversityApi.createUniversity,
  getUniversity: UniversityApi.getUniversity,
  getUniversityBySlug: UniversityApi.getUniversityBySlug,
  updateUniversity: UniversityApi.updateUniversity,
  deleteUniversity: UniversityApi.deleteUniversity,
  verifyUniversity: UniversityApi.verifyUniversity,
  deactivateUniversity: UniversityApi.deactivateUniversity,
  searchUniversities: UniversityApi.searchUniversities,
  getUniversityPrograms: UniversityApi.getUniversityPrograms,
  addProgram: UniversityApi.addProgram,
  updateProgram: UniversityApi.updateProgram,
  deleteProgram: UniversityApi.deleteProgram,
  uploadImage: UniversityApi.uploadImage,
  deleteImage: UniversityApi.deleteImage,
  bulkVerifyUniversities: UniversityApi.bulkVerifyUniversities,
  exportUniversities: UniversityApi.exportUniversities,
}
