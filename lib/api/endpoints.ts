// Base API configuration
export const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:3001"
export const API_VERSION = "v1"
export const API_PREFIX = `/api/${API_VERSION}`

// Authentication Endpoints
export const AUTH_ENDPOINTS = {
  LOGIN: `${API_PREFIX}/auth/login`,
  REGISTER: `${API_PREFIX}/auth/register`,
  REFRESH: `${API_PREFIX}/auth/refresh`,
  LOGOUT: `${API_PREFIX}/auth/logout`,
  FORGOT_PASSWORD: `${API_PREFIX}/auth/forgot-password`,
  RESET_PASSWORD: `${API_PREFIX}/auth/reset-password`,
  VERIFY_EMAIL: `${API_PREFIX}/auth/verify-email`,
  RESEND_VERIFICATION: `${API_PREFIX}/auth/resend-verification`,
  CHANGE_PASSWORD: `${API_PREFIX}/auth/change-password`,
  ME: `${API_PREFIX}/auth/me`,
} as const

// User Management Endpoints - Complete CRUD
export const USER_ENDPOINTS = {
  PROFILE: `${API_PREFIX}/users/profile`,
  UPDATE_PROFILE: `${API_PREFIX}/users/profile`,
  UPLOAD_AVATAR: `${API_PREFIX}/users/avatar`,
  GET_USER: (id: string) => `${API_PREFIX}/users/${id}`,
  UPDATE_USER: (id: string) => `${API_PREFIX}/users/${id}`,
  DELETE_USER: (id: string) => `${API_PREFIX}/users/${id}`,
  LIST_USERS: `${API_PREFIX}/users`,
  UPDATE_ROLE: (id: string) => `${API_PREFIX}/users/${id}/role`,
  DEACTIVATE_USER: (id: string) => `${API_PREFIX}/users/${id}/deactivate`,
  ACTIVATE_USER: (id: string) => `${API_PREFIX}/users/${id}/activate`,
} as const

// Application Endpoints - Complete CRUD
export const APPLICATION_ENDPOINTS = {
  LIST: `${API_PREFIX}/applications`,
  CREATE: `${API_PREFIX}/applications`,
  GET: (id: string) => `${API_PREFIX}/applications/${id}`,
  UPDATE: (id: string) => `${API_PREFIX}/applications/${id}`,
  DELETE: (id: string) => `${API_PREFIX}/applications/${id}`,
  SUBMIT: (id: string) => `${API_PREFIX}/applications/${id}/submit`,
  UPDATE_STATUS: (id: string) => `${API_PREFIX}/applications/${id}/status`,
  WITHDRAW: (id: string) => `${API_PREFIX}/applications/${id}/withdraw`,
  DUPLICATE: (id: string) => `${API_PREFIX}/applications/${id}/duplicate`,
  UPLOAD_DOCUMENT: (id: string) => `${API_PREFIX}/applications/${id}/documents`,
  DELETE_DOCUMENT: (id: string, docId: string) => `${API_PREFIX}/applications/${id}/documents/${docId}`,
  GET_BY_STUDENT: (studentId: string) => `${API_PREFIX}/applications/student/${studentId}`,
  GET_BY_UNIVERSITY: (universityId: string) => `${API_PREFIX}/applications/university/${universityId}`,
  BULK_UPDATE: `${API_PREFIX}/applications/bulk-update`,
  EXPORT: `${API_PREFIX}/applications/export`,
} as const

// University Endpoints - Complete CRUD
export const UNIVERSITY_ENDPOINTS = {
  LIST: `${API_PREFIX}/universities`,
  CREATE: `${API_PREFIX}/universities`,
  GET: (id: string) => `${API_PREFIX}/universities/${id}`,
  GET_BY_SLUG: (slug: string) => `${API_PREFIX}/universities/slug/${slug}`,
  UPDATE: (id: string) => `${API_PREFIX}/universities/${id}`,
  DELETE: (id: string) => `${API_PREFIX}/universities/${id}`,
  VERIFY: (id: string) => `${API_PREFIX}/universities/${id}/verify`,
  DEACTIVATE: (id: string) => `${API_PREFIX}/universities/${id}/deactivate`,
  SEARCH: `${API_PREFIX}/universities/search`,
  PROGRAMS: (id: string) => `${API_PREFIX}/universities/${id}/programs`,
  ADD_PROGRAM: (id: string) => `${API_PREFIX}/universities/${id}/programs`,
  UPDATE_PROGRAM: (id: string, programId: string) => `${API_PREFIX}/universities/${id}/programs/${programId}`,
  DELETE_PROGRAM: (id: string, programId: string) => `${API_PREFIX}/universities/${id}/programs/${programId}`,
  UPLOAD_IMAGE: (id: string) => `${API_PREFIX}/universities/${id}/images`,
  DELETE_IMAGE: (id: string, imageId: string) => `${API_PREFIX}/universities/${id}/images/${imageId}`,
  BULK_VERIFY: `${API_PREFIX}/universities/bulk-verify`,
  EXPORT: `${API_PREFIX}/universities/export`,
} as const

// Payment Endpoints
export const PAYMENT_ENDPOINTS = {
  LIST: `${API_PREFIX}/payments`,
  CREATE: `${API_PREFIX}/payments`,
  GET: (id: string) => `${API_PREFIX}/payments/${id}`,
  UPDATE_STATUS: (id: string) => `${API_PREFIX}/payments/${id}/status`,
  REFUND: (id: string) => `${API_PREFIX}/payments/${id}/refund`,
  GET_BY_APPLICATION: (applicationId: string) => `${API_PREFIX}/payments/application/${applicationId}`,
  GET_BY_STUDENT: (studentId: string) => `${API_PREFIX}/payments/student/${studentId}`,
  WEBHOOK: `${API_PREFIX}/payments/webhook`,
} as const

// Form Management Endpoints
export const FORM_ENDPOINTS = {
  TEMPLATES: `${API_PREFIX}/forms/templates`,
  CREATE_TEMPLATE: `${API_PREFIX}/forms/templates`,
  GET_TEMPLATE: (id: string) => `${API_PREFIX}/forms/templates/${id}`,
  UPDATE_TEMPLATE: (id: string) => `${API_PREFIX}/forms/templates/${id}`,
  DELETE_TEMPLATE: (id: string) => `${API_PREFIX}/forms/templates/${id}`,
  SUBMISSIONS: `${API_PREFIX}/forms/submissions`,
  GET_SUBMISSION: (id: string) => `${API_PREFIX}/forms/submissions/${id}`,
  CREATE_SUBMISSION: `${API_PREFIX}/forms/submissions`,
} as const

// Notification Endpoints
export const NOTIFICATION_ENDPOINTS = {
  LIST: `${API_PREFIX}/notifications`,
  GET: (id: string) => `${API_PREFIX}/notifications/${id}`,
  MARK_READ: (id: string) => `${API_PREFIX}/notifications/${id}/read`,
  MARK_ALL_READ: `${API_PREFIX}/notifications/mark-all-read`,
  DELETE: (id: string) => `${API_PREFIX}/notifications/${id}`,
  SETTINGS: `${API_PREFIX}/notifications/settings`,
  UPDATE_SETTINGS: `${API_PREFIX}/notifications/settings`,
} as const

// File Upload Endpoints
export const FILE_ENDPOINTS = {
  UPLOAD: `${API_PREFIX}/files/upload`,
  GET: (id: string) => `${API_PREFIX}/files/${id}`,
  DELETE: (id: string) => `${API_PREFIX}/files/${id}`,
  DOWNLOAD: (id: string) => `${API_PREFIX}/files/${id}/download`,
} as const

// Search Endpoints
export const SEARCH_ENDPOINTS = {
  UNIVERSITIES: `${API_PREFIX}/search/universities`,
  PROGRAMS: `${API_PREFIX}/search/programs`,
  SUGGESTIONS: `${API_PREFIX}/search/suggestions`,
  FILTERS: `${API_PREFIX}/search/filters`,
} as const

// Admin Endpoints
export const ADMIN_ENDPOINTS = {
  DASHBOARD: `${API_PREFIX}/admin/dashboard`,
  STATS: `${API_PREFIX}/admin/stats`,
  USERS: `${API_PREFIX}/admin/users`,
  APPLICATIONS: `${API_PREFIX}/admin/applications`,
  UNIVERSITIES: `${API_PREFIX}/admin/universities`,
  PAYMENTS: `${API_PREFIX}/admin/payments`,
  REPORTS: `${API_PREFIX}/admin/reports`,
  SETTINGS: `${API_PREFIX}/admin/settings`,
  LOGS: `${API_PREFIX}/admin/logs`,
} as const

// System Admin Endpoints
export const SYSTEM_ADMIN_ENDPOINTS = {
  DASHBOARD: `${API_PREFIX}/system-admin/dashboard`,
  USERS: `${API_PREFIX}/system-admin/users`,
  UNIVERSITIES: `${API_PREFIX}/system-admin/universities`,
  VERIFICATION: `${API_PREFIX}/system-admin/verification`,
  PAYMENTS: `${API_PREFIX}/system-admin/payments`,
  SYSTEM_SETTINGS: `${API_PREFIX}/system-admin/settings`,
  AUDIT_LOGS: `${API_PREFIX}/system-admin/audit-logs`,
  MAINTENANCE: `${API_PREFIX}/system-admin/maintenance`,
} as const
