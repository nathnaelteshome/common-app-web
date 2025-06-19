// Main API exports
export * from "./types"
export * from "./endpoints"
export * from "./client"
export * from "./auth"
export * from "./users"
export * from "./applications"
export * from "./universities"
export * from "./payments"
export * from "./notifications"
export * from "./announcements"

// Re-export commonly used APIs
export { authApi } from "./auth"
export { userApi } from "./users"
export { applicationApi } from "./applications"
export { universityApi } from "./universities"
export { announcementService } from "./announcements"
export { api, apiUtils } from "./client"

// API configuration
export const API_CONFIG = {
  BASE_URL: process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:3001",
  VERSION: "v1",
  TIMEOUT: 30000,
  MAX_FILE_SIZE: 10 * 1024 * 1024, // 10MB
  ALLOWED_FILE_TYPES: {
    documents: [
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ],
    images: ["image/jpeg", "image/jpg", "image/png", "image/gif"],
  },
} as const

// API status constants
export const API_STATUS = {
  SUCCESS: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  VALIDATION_ERROR: 422,
  INTERNAL_ERROR: 500,
} as const

// Common API response messages
export const API_MESSAGES = {
  SUCCESS: "Operation completed successfully",
  CREATED: "Resource created successfully",
  UPDATED: "Resource updated successfully",
  DELETED: "Resource deleted successfully",
  NOT_FOUND: "Resource not found",
  UNAUTHORIZED: "Authentication required",
  FORBIDDEN: "Insufficient permissions",
  VALIDATION_ERROR: "Validation failed",
  INTERNAL_ERROR: "Internal server error",
} as const
