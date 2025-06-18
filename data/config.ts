// Data configuration and constants
export const DATA_CONFIG = {
  // Application statuses
  APPLICATION_STATUSES: ["submitted", "under-review", "accepted", "rejected", "waitlisted"] as const,

  // Application priorities
  APPLICATION_PRIORITIES: ["high", "medium", "low"] as const,

  // Payment statuses
  PAYMENT_STATUSES: ["pending", "paid", "failed"] as const,

  // Announcement types
  ANNOUNCEMENT_TYPES: ["general", "urgent", "deadline", "event", "maintenance", "celebration"] as const,

  // Announcement statuses
  ANNOUNCEMENT_STATUSES: ["draft", "published", "scheduled", "archived"] as const,

  // Target audiences
  TARGET_AUDIENCES: ["all", "students", "applicants", "accepted", "staff", "specific"] as const,

  // Reminder types
  REMINDER_TYPES: ["deadline", "review", "follow_up", "payment", "document", "interview", "orientation"] as const,

  // Survey types
  SURVEY_TYPES: ["feedback", "satisfaction", "improvement", "custom", "exit", "onboarding"] as const,

  // Question types
  QUESTION_TYPES: ["text", "rating", "multiple_choice", "yes_no", "scale", "textarea"] as const,

  // Default pagination
  PAGINATION: {
    DEFAULT_PAGE_SIZE: 10,
    MAX_PAGE_SIZE: 100,
    DEFAULT_PAGE: 1,
  },

  // Date formats
  DATE_FORMATS: {
    DISPLAY: "MMM dd, yyyy",
    INPUT: "yyyy-MM-dd",
    DATETIME: "yyyy-MM-dd HH:mm:ss",
    ISO: "yyyy-MM-dd'T'HH:mm:ss.SSS'Z'",
  },

  // File upload limits
  FILE_UPLOAD: {
    MAX_SIZE: 10 * 1024 * 1024, //10MB
    ALLOWED_TYPES: [
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      "image/jpeg",
      "image/png",
      "image/gif",
    ],
    MAX_FILES: 5,
  },

  // Notification settings
  NOTIFICATIONS: {
    DEFAULT_CHANNELS: ["email", "inApp"],
    RETRY_ATTEMPTS: 3,
    BATCH_SIZE: 100,
  },

  // Search settings
  SEARCH: {
    MIN_QUERY_LENGTH: 2,
    MAX_RESULTS: 50,
    DEBOUNCE_DELAY: 300,
  },

  // Cache settings
  CACHE: {
    DEFAULT_TTL: 5 * 60 * 1000, // 5 minutes
    MAX_ENTRIES: 1000,
  },
} as const

// Type definitions based on config
export type ApplicationStatus = (typeof DATA_CONFIG.APPLICATION_STATUSES)[number]
export type ApplicationPriority = (typeof DATA_CONFIG.APPLICATION_PRIORITIES)[number]
export type PaymentStatus = (typeof DATA_CONFIG.PAYMENT_STATUSES)[number]
export type AnnouncementType = (typeof DATA_CONFIG.ANNOUNCEMENT_TYPES)[number]
export type AnnouncementStatus = (typeof DATA_CONFIG.ANNOUNCEMENT_STATUSES)[number]
export type TargetAudience = (typeof DATA_CONFIG.TARGET_AUDIENCES)[number]
export type ReminderType = (typeof DATA_CONFIG.REMINDER_TYPES)[number]
export type SurveyType = (typeof DATA_CONFIG.SURVEY_TYPES)[number]
export type QuestionType = (typeof DATA_CONFIG.QUESTION_TYPES)[number]

// Utility functions
export const getStatusColor = (status: ApplicationStatus): string => {
  const colors = {
    submitted: "bg-purple-100 text-purple-800",
    "under-review": "bg-blue-100 text-blue-800",
    accepted: "bg-green-100 text-green-800",
    rejected: "bg-red-100 text-red-800",
    waitlisted: "bg-yellow-100 text-yellow-800",
  }
  return colors[status] || "bg-gray-100 text-gray-800"
}

export const getPriorityColor = (priority: ApplicationPriority): string => {
  const colors = {
    high: "bg-red-100 text-red-800",
    medium: "bg-yellow-100 text-yellow-800",
    low: "bg-green-100 text-green-800",
  }
  return colors[priority] || "bg-gray-100 text-gray-800"
}

export const getAnnouncementTypeColor = (type: AnnouncementType): string => {
  const colors = {
    general: "bg-blue-100 text-blue-800",
    urgent: "bg-red-100 text-red-800",
    deadline: "bg-orange-100 text-orange-800",
    event: "bg-purple-100 text-purple-800",
    maintenance: "bg-gray-100 text-gray-800",
    celebration: "bg-green-100 text-green-800",
  }
  return colors[type] || "bg-gray-100 text-gray-800"
}

export const formatDate = (date: string | Date, format: keyof typeof DATA_CONFIG.DATE_FORMATS = "DISPLAY"): string => {
  const d = new Date(date)

  switch (format) {
    case "DISPLAY":
      return d.toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "2-digit",
      })
    case "INPUT":
      return d.toISOString().split("T")[0]
    case "DATETIME":
      return d.toLocaleString("en-US")
    case "ISO":
      return d.toISOString()
    default:
      return d.toLocaleDateString()
  }
}

export const isValidFileType = (file: File): boolean => {
  return DATA_CONFIG.FILE_UPLOAD.ALLOWED_TYPES.includes(file.type)
}

export const isValidFileSize = (file: File): boolean => {
  return file.size <= DATA_CONFIG.FILE_UPLOAD.MAX_SIZE
}

export const validateFile = (file: File): { valid: boolean; error?: string } => {
  if (!isValidFileType(file)) {
    return { valid: false, error: "Invalid file type" }
  }

  if (!isValidFileSize(file)) {
    return { valid: false, error: "File size too large" }
  }

  return { valid: true }
}
