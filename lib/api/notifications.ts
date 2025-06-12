import { api } from "./client"
import { NOTIFICATION_ENDPOINTS } from "./endpoints"
import type { Notification, ApiResponse, PaginatedResponse } from "./types"

// Notification API Service
export class NotificationApi {
  /**
   * List notifications
   * GET /api/v1/notifications
   */
  static async listNotifications(params?: {
    page?: number
    limit?: number
    isRead?: boolean
    type?: string
    sortBy?: string
    sortOrder?: "asc" | "desc"
  }): Promise<ApiResponse<PaginatedResponse<Notification>>> {
    return api.get<PaginatedResponse<Notification>>(NOTIFICATION_ENDPOINTS.LIST, params)
  }

  /**
   * Get notification by ID
   * GET /api/v1/notifications/:id
   */
  static async getNotification(id: string): Promise<ApiResponse<Notification>> {
    return api.get<Notification>(NOTIFICATION_ENDPOINTS.GET(id))
  }

  /**
   * Mark notification as read
   * PUT /api/v1/notifications/:id/read
   */
  static async markAsRead(id: string): Promise<ApiResponse<Notification>> {
    return api.put<Notification>(NOTIFICATION_ENDPOINTS.MARK_READ(id))
  }

  /**
   * Mark all notifications as read
   * PUT /api/v1/notifications/mark-all-read
   */
  static async markAllAsRead(): Promise<ApiResponse<{ message: string }>> {
    return api.put<{ message: string }>(NOTIFICATION_ENDPOINTS.MARK_ALL_READ)
  }

  /**
   * Delete notification
   * DELETE /api/v1/notifications/:id
   */
  static async deleteNotification(id: string): Promise<ApiResponse<{ message: string }>> {
    return api.delete<{ message: string }>(NOTIFICATION_ENDPOINTS.DELETE(id))
  }

  /**
   * Get notification settings
   * GET /api/v1/notifications/settings
   */
  static async getNotificationSettings(): Promise<ApiResponse<any>> {
    return api.get<any>(NOTIFICATION_ENDPOINTS.SETTINGS)
  }

  /**
   * Update notification settings
   * PUT /api/v1/notifications/settings
   */
  static async updateNotificationSettings(settings: any): Promise<ApiResponse<any>> {
    return api.put<any>(NOTIFICATION_ENDPOINTS.UPDATE_SETTINGS, settings)
  }
}

// Export individual methods for convenience
export const notificationApi = {
  listNotifications: NotificationApi.listNotifications,
  getNotification: NotificationApi.getNotification,
  markAsRead: NotificationApi.markAsRead,
  markAllAsRead: NotificationApi.markAllAsRead,
  deleteNotification: NotificationApi.deleteNotification,
  getNotificationSettings: NotificationApi.getNotificationSettings,
  updateNotificationSettings: NotificationApi.updateNotificationSettings,
}
