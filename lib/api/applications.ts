import { api } from "./client"
import { APPLICATION_ENDPOINTS, ADMIN_ENDPOINTS, SYSTEM_ADMIN_ENDPOINTS } from "./endpoints"
import type { ApiResponse, PaginatedResponse } from "./types"

// Application Types based on backend response structure
export interface Application {
  id: string
  status: "draft" | "submitted" | "under_review" | "accepted" | "rejected" | "waitlisted" | "withdrawn"
  submittedAt: string
  program: {
    id: string
    name: string
    university: {
      id: string
      name: string
      short_name: string
      slug: string
      profile_id: string
      is_active: boolean
      created_at: string
      updated_at: string
    }
  }
  hasPayment: boolean
}

export interface ApplicationDetail {
  id: string
  student_id: string
  university_id: string
  program_id: string
  status: "draft" | "submitted" | "under_review" | "accepted" | "rejected" | "waitlisted" | "withdrawn"
  personal_statement: string
  academic_history: Array<{
    gpa: number
    degree: string
    end_date: string
    start_date: string
    institution: string
    is_completed: boolean
    field_of_study: string
  }>
  documents: {
    essay: boolean
    portfolio: boolean
    transcript: boolean
    recommendation: boolean
  }
  payment_status: "pending" | "completed" | "failed"
  payment_id: string | null
  application_fee: number
  submitted_at: string
  reviewed_at: string | null
  reviewed_by: string | null
  decision_notes: string | null
  score: number
  priority: "low" | "medium" | "high"
  eligibility_score: number
  auto_filter_result: "eligible" | "not_eligible"
  tags: string[]
  form_data: {
    gpa: number
    testScore: number
    extracurriculars: string[]
  }
  progress: number
  deadline: string
  created_at: string
  updated_at: string
  student: {
    id: string
    email: string
    role: string
    is_email_verified: boolean
    is_active: boolean
    created_at: string
    updated_at: string
    studentProfile: {
      id: string
      user_id: string
      first_name: string
      last_name: string
      username: string
      phone_number: string
      date_of_birth: string
      nationality: string
      avatar_url: string
      address: {
        city: string
        region: string
        street: string
        country: string
        postal_code: string
      }
      emergency_contact: {
        name: string
        email: string
        phone: string
        relationship: string
      }
      education: {
        gpa: number
        high_school: string
        graduation_year: number
      }
      preferences: {
        regions: string[]
        max_tuition: number
        program_types: string[]
      }
      bio: string
      created_at: string
      updated_at: string
    }
  }
  program: {
    id: string
    university_id: string
    name: string
    type: string
    duration: string
    degree: string
    description: string
    requirements: string[]
    tuition_fee: number
    application_fee: number
    available_seats: number
    application_deadline: string
    is_active: boolean
    created_at: string
    updated_at: string
    university: {
      id: string
      name: string
      short_name: string
      slug: string
      profile_id: string
      is_active: boolean
      created_at: string
      updated_at: string
    }
  }
  payment?: {
    id: string
    application_id: string
    student_id: string
    university_id: string
    amount: number
    currency: string
    method: "credit_card" | "bank_transfer" | "mobile_money"
    status: "pending" | "completed" | "failed" | "refunded"
    transaction_id: string
    gateway: string
    gateway_response: Record<string, any>
    fees: number
    receipt_url: string
    refund_reason: string | null
    processed_at: string
    created_at: string
    updated_at: string
  }
}

export interface CreateApplicationRequest {
  universityId: string
  programId: string
  personalStatement?: string
  academicHistory?: Array<{
    gpa: number
    degree: string
    end_date: string
    start_date: string
    institution: string
    is_completed: boolean
    field_of_study: string
  }>
  personalInfo?: {
    firstName: string
    lastName: string
    email: string
    phone: string
  }
  essays?: Record<string, string>
  applicationFee?: number
  deadline?: string
}

// Application API Service - Complete CRUD Operations
export class ApplicationApi {
  /**
   * List applications
   * GET /api/v1/applications
   */
  static async listApplications(params?: {
    page?: number
    limit?: number
    status?: string
    universityId?: string
    programId?: string
    studentId?: string
    sortBy?: string
    sortOrder?: "asc" | "desc"
  }): Promise<ApiResponse<PaginatedResponse<Application>>> {
    return api.get<PaginatedResponse<Application>>(APPLICATION_ENDPOINTS.LIST, params)
  }

  /**
   * Create application
   * POST /api/v1/applications
   */
  static async createApplication(
    applicationData: CreateApplicationRequest
  ): Promise<ApiResponse<ApplicationDetail>> {
    return api.post<ApplicationDetail>(APPLICATION_ENDPOINTS.CREATE, applicationData)
  }

  /**
   * Get application by ID
   * GET /api/v1/applications/:id
   */
  static async getApplication(id: string): Promise<ApiResponse<ApplicationDetail>> {
    return api.get<ApplicationDetail>(APPLICATION_ENDPOINTS.GET(id))
  }

  /**
   * Update application
   * PUT /api/v1/applications/:id
   */
  static async updateApplication(
    id: string, 
    applicationData: Partial<CreateApplicationRequest>
  ): Promise<ApiResponse<ApplicationDetail>> {
    return api.put<ApplicationDetail>(APPLICATION_ENDPOINTS.UPDATE(id), applicationData)
  }

  /**
   * Submit application
   * POST /api/v1/applications/:id/submit
   */
  static async submitApplication(id: string): Promise<ApiResponse<ApplicationDetail>> {
    return api.post<ApplicationDetail>(APPLICATION_ENDPOINTS.SUBMIT(id), {})
  }

  /**
   * Delete application (Not yet implemented on backend)
   * DELETE /api/v1/applications/:id
   */
  static async deleteApplication(id: string): Promise<ApiResponse<{ message: string }>> {
    return api.delete<{ message: string }>(APPLICATION_ENDPOINTS.DELETE(id))
  }

  /**
   * Withdraw application (Not yet implemented on backend)
   * POST /api/v1/applications/:id/withdraw
   */
  static async withdrawApplication(id: string): Promise<ApiResponse<ApplicationDetail>> {
    return api.post<ApplicationDetail>(APPLICATION_ENDPOINTS.WITHDRAW(id), {})
  }

  /**
   * Upload documents (Not yet implemented on backend)
   * POST /api/v1/applications/:id/documents
   */
  static async uploadDocument(
    id: string, 
    file: File, 
    documentType: string
  ): Promise<ApiResponse<{ documentUrl: string }>> {
    return api.upload<{ documentUrl: string }>(APPLICATION_ENDPOINTS.UPLOAD_DOCUMENT(id), file, { type: documentType })
  }

  /**
   * Download application (Not yet implemented on backend)
   * GET /api/v1/applications/:id/download
   */
  static async downloadApplication(id: string): Promise<ApiResponse<{ downloadUrl: string }>> {
    return api.get<{ downloadUrl: string }>(APPLICATION_ENDPOINTS.DOWNLOAD(id))
  }

  // ========== ADMIN METHODS ==========

  /**
   * List applications for university admin (filtered by university)
   * GET /api/v1/admin/applications
   */
  static async listUniversityApplications(params?: {
    page?: number
    limit?: number
    status?: string
    programId?: string
    studentId?: string
    sortBy?: string
    sortOrder?: "asc" | "desc"
    search?: string
  }): Promise<ApiResponse<PaginatedResponse<Application>>> {
    return api.get<PaginatedResponse<Application>>(ADMIN_ENDPOINTS.APPLICATIONS, params)
  }

  /**
   * Update application status (Admin only)
   * PUT /api/v1/admin/applications/:id/status
   */
  static async updateApplicationStatus(
    id: string,
    status: "accepted" | "rejected" | "waitlisted" | "under_review",
    reason?: string,
    notes?: string
  ): Promise<ApiResponse<ApplicationDetail>> {
    return api.put<ApplicationDetail>(ADMIN_ENDPOINTS.UPDATE_APPLICATION_STATUS(id), {
      status,
      reason,
      notes
    })
  }

  /**
   * Bulk update application statuses (Admin only)
   * PUT /api/v1/admin/applications/bulk-status
   */
  static async bulkUpdateApplicationStatus(
    applicationIds: string[],
    status: "accepted" | "rejected" | "waitlisted" | "under_review",
    reason?: string
  ): Promise<ApiResponse<{ updated: number; failed: number }>> {
    return api.put<{ updated: number; failed: number }>(ADMIN_ENDPOINTS.BULK_UPDATE_STATUS, {
      applicationIds,
      status,
      reason
    })
  }

  /**
   * Get application statistics for university admin
   * GET /api/v1/admin/applications/stats
   */
  static async getUniversityApplicationStats(): Promise<ApiResponse<{
    total: number
    byStatus: Record<string, number>
    byProgram: Array<{ programId: string; programName: string; count: number }>
    recentActivity: Array<{
      date: string
      submitted: number
      reviewed: number
      accepted: number
      rejected: number
    }>
    paymentStats: {
      totalRevenue: number
      paidApplications: number
      pendingPayments: number
      averageFee: number
    }
  }>> {
    return api.get<any>(ADMIN_ENDPOINTS.APPLICATION_STATS)
  }

  /**
   * Export applications data (Admin only)
   * GET /api/v1/admin/applications/export
   */
  static async exportApplications(params?: {
    format?: "csv" | "xlsx" | "pdf"
    status?: string
    programId?: string
    dateFrom?: string
    dateTo?: string
  }): Promise<ApiResponse<{ downloadUrl: string }>> {
    return api.get<{ downloadUrl: string }>(ADMIN_ENDPOINTS.EXPORT_APPLICATIONS, params)
  }

  // ========== SYSTEM ADMIN METHODS ==========

  /**
   * List all applications across all universities (System Admin only)
   * GET /api/v1/system-admin/applications
   */
  static async listAllApplications(params?: {
    page?: number
    limit?: number
    status?: string
    universityId?: string
    programId?: string
    studentId?: string
    sortBy?: string
    sortOrder?: "asc" | "desc"
    search?: string
  }): Promise<ApiResponse<PaginatedResponse<Application>>> {
    return api.get<PaginatedResponse<Application>>(SYSTEM_ADMIN_ENDPOINTS.APPLICATIONS, params)
  }

  /**
   * Get system-wide application statistics (System Admin only)
   * GET /api/v1/system-admin/applications/stats
   */
  static async getSystemApplicationStats(): Promise<ApiResponse<{
    total: number
    byStatus: Record<string, number>
    byUniversity: Array<{ universityId: string; universityName: string; count: number }>
    byProgram: Array<{ programId: string; programName: string; universityName: string; count: number }>
    recentActivity: Array<{
      date: string
      submitted: number
      reviewed: number
      accepted: number
      rejected: number
    }>
    paymentStats: {
      totalRevenue: number
      paidApplications: number
      pendingPayments: number
      averageFee: number
      revenueByUniversity: Array<{ universityId: string; universityName: string; revenue: number }>
    }
    performance: {
      averageProcessingTime: number
      acceptanceRate: number
      conversionRate: number
    }
  }>> {
    return api.get<any>(SYSTEM_ADMIN_ENDPOINTS.APPLICATION_STATS)
  }
}

// Export individual methods for convenience
export const applicationApi = {
  // Student methods
  listApplications: ApplicationApi.listApplications,
  createApplication: ApplicationApi.createApplication,
  getApplication: ApplicationApi.getApplication,
  updateApplication: ApplicationApi.updateApplication,
  submitApplication: ApplicationApi.submitApplication,
  deleteApplication: ApplicationApi.deleteApplication,
  withdrawApplication: ApplicationApi.withdrawApplication,
  uploadDocument: ApplicationApi.uploadDocument,
  downloadApplication: ApplicationApi.downloadApplication,
  
  // University Admin methods
  listUniversityApplications: ApplicationApi.listUniversityApplications,
  updateApplicationStatus: ApplicationApi.updateApplicationStatus,
  bulkUpdateApplicationStatus: ApplicationApi.bulkUpdateApplicationStatus,
  getUniversityApplicationStats: ApplicationApi.getUniversityApplicationStats,
  exportApplications: ApplicationApi.exportApplications,
  
  // System Admin methods
  listAllApplications: ApplicationApi.listAllApplications,
  getSystemApplicationStats: ApplicationApi.getSystemApplicationStats,
}