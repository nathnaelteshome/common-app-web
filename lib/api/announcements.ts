import { ApiClient } from "./client"
import { ANNOUNCEMENT_ENDPOINTS } from "./endpoints"
import type {
  Announcement,
  AnnouncementCreateRequest,
  AnnouncementUpdateRequest,
  AnnouncementComment,
  AnnouncementCommentCreateRequest,
  AnnouncementStats,
  AnnouncementsResponse,
  AnnouncementFilters,
  ApiResponse,
} from "./types"

export class AnnouncementService {
  private client: ApiClient

  constructor(client: ApiClient) {
    this.client = client
  }

  async getAnnouncements(filters?: AnnouncementFilters): Promise<AnnouncementsResponse> {
    const params = new URLSearchParams()
    
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          if (Array.isArray(value)) {
            value.forEach(v => params.append(key, v.toString()))
          } else {
            params.append(key, value.toString())
          }
        }
      })
    }

    const queryString = params.toString()
    const url = queryString ? `${ANNOUNCEMENT_ENDPOINTS.LIST}?${queryString}` : ANNOUNCEMENT_ENDPOINTS.LIST
    
    return this.client.get<AnnouncementsResponse>(url)
  }

  async getAnnouncement(id: string): Promise<Announcement> {
    return this.client.get<Announcement>(ANNOUNCEMENT_ENDPOINTS.GET(id))
  }

  async createAnnouncement(data: AnnouncementCreateRequest): Promise<Announcement> {
    return this.client.post<Announcement>(ANNOUNCEMENT_ENDPOINTS.CREATE, data)
  }

  async updateAnnouncement(id: string, data: Partial<AnnouncementUpdateRequest>): Promise<Announcement> {
    return this.client.put<Announcement>(ANNOUNCEMENT_ENDPOINTS.UPDATE(id), data)
  }

  async deleteAnnouncement(id: string): Promise<void> {
    return this.client.delete(ANNOUNCEMENT_ENDPOINTS.DELETE(id))
  }

  async publishAnnouncement(id: string): Promise<Announcement> {
    return this.client.post<Announcement>(ANNOUNCEMENT_ENDPOINTS.PUBLISH(id))
  }

  async archiveAnnouncement(id: string): Promise<Announcement> {
    return this.client.post<Announcement>(ANNOUNCEMENT_ENDPOINTS.ARCHIVE(id))
  }

  async pinAnnouncement(id: string): Promise<Announcement> {
    return this.client.post<Announcement>(ANNOUNCEMENT_ENDPOINTS.PIN(id))
  }

  async unpinAnnouncement(id: string): Promise<Announcement> {
    return this.client.post<Announcement>(ANNOUNCEMENT_ENDPOINTS.UNPIN(id))
  }

  async getAnnouncementsByAudience(audience: string, filters?: AnnouncementFilters): Promise<AnnouncementsResponse> {
    const params = new URLSearchParams()
    
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          if (Array.isArray(value)) {
            value.forEach(v => params.append(key, v.toString()))
          } else {
            params.append(key, value.toString())
          }
        }
      })
    }

    const queryString = params.toString()
    const url = queryString 
      ? `${ANNOUNCEMENT_ENDPOINTS.GET_BY_AUDIENCE(audience)}?${queryString}` 
      : ANNOUNCEMENT_ENDPOINTS.GET_BY_AUDIENCE(audience)
    
    return this.client.get<AnnouncementsResponse>(url)
  }

  async getAnnouncementsByType(type: string, filters?: AnnouncementFilters): Promise<AnnouncementsResponse> {
    const params = new URLSearchParams()
    
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          if (Array.isArray(value)) {
            value.forEach(v => params.append(key, v.toString()))
          } else {
            params.append(key, value.toString())
          }
        }
      })
    }

    const queryString = params.toString()
    const url = queryString 
      ? `${ANNOUNCEMENT_ENDPOINTS.GET_BY_TYPE(type)}?${queryString}` 
      : ANNOUNCEMENT_ENDPOINTS.GET_BY_TYPE(type)
    
    return this.client.get<AnnouncementsResponse>(url)
  }

  async getActiveAnnouncements(filters?: AnnouncementFilters): Promise<AnnouncementsResponse> {
    const params = new URLSearchParams()
    
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          if (Array.isArray(value)) {
            value.forEach(v => params.append(key, v.toString()))
          } else {
            params.append(key, value.toString())
          }
        }
      })
    }

    const queryString = params.toString()
    const url = queryString 
      ? `${ANNOUNCEMENT_ENDPOINTS.GET_ACTIVE}?${queryString}` 
      : ANNOUNCEMENT_ENDPOINTS.GET_ACTIVE
    
    return this.client.get<AnnouncementsResponse>(url)
  }

  async getPinnedAnnouncements(): Promise<Announcement[]> {
    return this.client.get<Announcement[]>(ANNOUNCEMENT_ENDPOINTS.GET_PINNED)
  }

  async markAnnouncementRead(id: string): Promise<void> {
    return this.client.post(ANNOUNCEMENT_ENDPOINTS.MARK_READ(id))
  }

  // Comment management
  async addComment(announcementId: string, data: AnnouncementCommentCreateRequest): Promise<AnnouncementComment> {
    return this.client.post<AnnouncementComment>(
      ANNOUNCEMENT_ENDPOINTS.ADD_COMMENT(announcementId), 
      data
    )
  }

  async updateComment(
    announcementId: string, 
    commentId: string, 
    data: { content: string }
  ): Promise<AnnouncementComment> {
    return this.client.put<AnnouncementComment>(
      ANNOUNCEMENT_ENDPOINTS.UPDATE_COMMENT(announcementId, commentId), 
      data
    )
  }

  async deleteComment(announcementId: string, commentId: string): Promise<void> {
    return this.client.delete(ANNOUNCEMENT_ENDPOINTS.DELETE_COMMENT(announcementId, commentId))
  }

  // Statistics
  async getAnnouncementStats(): Promise<AnnouncementStats> {
    return this.client.get<AnnouncementStats>(ANNOUNCEMENT_ENDPOINTS.GET_STATS)
  }
}

// Export singleton instance
export const announcementService = new AnnouncementService(new ApiClient())

// Export utility functions for common operations
export const announcementUtils = {
  isExpired: (announcement: Announcement): boolean => {
    if (!announcement.expiryDate) return false
    return new Date(announcement.expiryDate) < new Date()
  },

  isActive: (announcement: Announcement): boolean => {
    if (announcement.status !== "published") return false
    if (announcement.expiryDate && new Date(announcement.expiryDate) < new Date()) return false
    return true
  },

  getTypeColor: (type: Announcement["type"]): string => {
    const colors = {
      general: "bg-blue-100 text-blue-800",
      urgent: "bg-red-100 text-red-800", 
      deadline: "bg-orange-100 text-orange-800",
      event: "bg-purple-100 text-purple-800",
      maintenance: "bg-yellow-100 text-yellow-800",
      celebration: "bg-green-100 text-green-800",
    }
    return colors[type] || colors.general
  },

  getPriorityColor: (priority: Announcement["priority"]): string => {
    const colors = {
      low: "bg-green-100 text-green-800",
      medium: "bg-yellow-100 text-yellow-800", 
      high: "bg-red-100 text-red-800",
    }
    return colors[priority] || colors.medium
  },

  getStatusColor: (status: Announcement["status"]): string => {
    const colors = {
      draft: "bg-gray-100 text-gray-800",
      published: "bg-green-100 text-green-800",
      scheduled: "bg-blue-100 text-blue-800",
      archived: "bg-yellow-100 text-yellow-800",
    }
    return colors[status] || colors.draft
  },

  formatDate: (dateString: string): string => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  },

  getReadTime: (content: string): number => {
    const wordsPerMinute = 200
    const wordCount = content.split(" ").length
    return Math.ceil(wordCount / wordsPerMinute)
  },
}