import { api } from "./client"
import { PAYMENT_ENDPOINTS } from "./endpoints"
import type { Payment, ApiResponse, PaginatedResponse } from "./types"

// Payment API Service
export class PaymentApi {
  /**
   * List payments
   * GET /api/v1/payments
   */
  static async listPayments(params?: {
    page?: number
    limit?: number
    status?: string
    studentId?: string
    applicationId?: string
    sortBy?: string
    sortOrder?: "asc" | "desc"
  }): Promise<ApiResponse<PaginatedResponse<Payment>>> {
    return api.get<PaginatedResponse<Payment>>(PAYMENT_ENDPOINTS.LIST, params)
  }

  /**
   * Create payment
   * POST /api/v1/payments
   */
  static async createPayment(paymentData: {
    applicationId: string
    amount: number
    currency: string
    paymentMethod: "credit_card" | "debit_card" | "bank_transfer" | "paypal"
    paymentDetails?: any
  }): Promise<ApiResponse<Payment>> {
    return api.post<Payment>(PAYMENT_ENDPOINTS.CREATE, paymentData)
  }

  /**
   * Get payment by ID
   * GET /api/v1/payments/:id
   */
  static async getPayment(id: string): Promise<ApiResponse<Payment>> {
    return api.get<Payment>(PAYMENT_ENDPOINTS.GET(id))
  }

  /**
   * Update payment status
   * PUT /api/v1/payments/:id/status
   */
  static async updatePaymentStatus(
    id: string,
    status: "pending" | "processing" | "completed" | "failed" | "refunded",
    transactionId?: string,
  ): Promise<ApiResponse<Payment>> {
    return api.put<Payment>(PAYMENT_ENDPOINTS.UPDATE_STATUS(id), { status, transactionId })
  }

  /**
   * Refund payment
   * POST /api/v1/payments/:id/refund
   */
  static async refundPayment(id: string, reason?: string): Promise<ApiResponse<Payment>> {
    return api.post<Payment>(PAYMENT_ENDPOINTS.REFUND(id), { reason })
  }

  /**
   * Get payments by application
   * GET /api/v1/payments/application/:applicationId
   */
  static async getPaymentsByApplication(applicationId: string): Promise<ApiResponse<Payment[]>> {
    return api.get<Payment[]>(PAYMENT_ENDPOINTS.GET_BY_APPLICATION(applicationId))
  }

  /**
   * Get payments by student
   * GET /api/v1/payments/student/:studentId
   */
  static async getPaymentsByStudent(studentId: string): Promise<ApiResponse<Payment[]>> {
    return api.get<Payment[]>(PAYMENT_ENDPOINTS.GET_BY_STUDENT(studentId))
  }
}

// Export individual methods for convenience
export const paymentApi = {
  listPayments: PaymentApi.listPayments,
  createPayment: PaymentApi.createPayment,
  getPayment: PaymentApi.getPayment,
  updatePaymentStatus: PaymentApi.updatePaymentStatus,
  refundPayment: PaymentApi.refundPayment,
  getPaymentsByApplication: PaymentApi.getPaymentsByApplication,
  getPaymentsByStudent: PaymentApi.getPaymentsByStudent,
}
