// API Response Types
export interface ApiResponse<T = any> {
  success: boolean
  data?: T
  message?: string
  error?: string
  errors?: Record<string, string[]>
}

export interface PaginatedResponse<T> {
  data: T[]
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
    hasNext: boolean
    hasPrev: boolean
  }
}

// Authentication Types
export interface LoginRequest {
  email: string
  password: string
}

export interface LoginResponse {
  user: User
  accessToken: string
  refreshToken: string
  expiresIn: number
}

export interface RegisterRequest {
  email: string
  password: string
  role: "student" | "university" | "admin"
  profile: StudentProfile | UniversityProfile | AdminProfile
}

export interface RegisterResponse {
  user: User
  message: string
  verificationRequired: boolean
}

export interface RefreshTokenRequest {
  refreshToken: string
}

export interface RefreshTokenResponse {
  accessToken: string
  refreshToken: string
  expiresIn: number
}

export interface ForgotPasswordRequest {
  email: string
}

export interface ForgotPasswordResponse {
  message: string
  resetTokenSent: boolean
}

export interface ResetPasswordRequest {
  resetToken: string
  email: string
  password: string
  confirmPassword: string
}

export interface ResetPasswordResponse {
  message: string
  success: boolean
}

// User Types
export interface User {
  id: string
  email: string
  role: "student" | "university" | "admin"
  isEmailVerified: boolean
  isActive: boolean
  profile: StudentProfile | UniversityProfile | AdminProfile
  createdAt: string
  updatedAt: string
}

export interface StudentProfile {
  firstName: string
  lastName: string
  username: string
  phoneNumber: string
  dateOfBirth: string
  avatar?: string
  address?: {
    street: string
    city: string
    state: string
    country: string
    zipCode: string
  }
}

export interface UniversityProfile {
  collegeName: string
  address1: string
  address2?: string
  country: string
  city: string
  postcode: string
  phone1: string
  phone2?: string
  documents: string
  fieldOfStudies: string
  campusImage?: string
  isVerified: boolean
  website?: string
  description?: string
  establishedYear?: number
}

export interface AdminProfile {
  firstName: string
  lastName: string
  permissions: string[]
  department?: string
}

// Application Types
export interface Application {
  id: string
  studentId: string
  universityId: string
  programId: string
  status: "draft" | "submitted" | "under_review" | "accepted" | "rejected" | "waitlisted"
  submittedAt?: string
  reviewedAt?: string
  documents: ApplicationDocument[]
  personalStatement?: string
  academicHistory: AcademicRecord[]
  paymentStatus: "pending" | "paid" | "failed" | "refunded"
  paymentId?: string
  createdAt: string
  updatedAt: string
}

export interface ApplicationDocument {
  id: string
  type: "transcript" | "recommendation" | "essay" | "certificate" | "other"
  fileName: string
  fileUrl: string
  uploadedAt: string
  verified: boolean
}

export interface AcademicRecord {
  institution: string
  degree: string
  fieldOfStudy: string
  gpa: number
  startDate: string
  endDate?: string
  isCompleted: boolean
}

// University Types
export interface University {
  id: string
  name: string
  slug: string
  description: string
  location: {
    address: string
    city: string
    state: string
    country: string
    coordinates?: {
      lat: number
      lng: number
    }
  }
  contact: {
    email: string
    phone: string
    website: string
  }
  programs: Program[]
  admissionRequirements: AdmissionRequirement[]
  tuitionFees: TuitionFee[]
  rankings?: UniversityRanking[]
  images: string[]
  isVerified: boolean
  isActive: boolean
  createdAt: string
  updatedAt: string
}

export interface Program {
  id: string
  name: string
  degree: "bachelor" | "master" | "phd" | "certificate"
  duration: number
  durationUnit: "months" | "years"
  description: string
  requirements: string[]
  tuitionFee: number
  currency: string
  isActive: boolean
}

export interface AdmissionRequirement {
  type: "gpa" | "test_score" | "document" | "experience"
  description: string
  isRequired: boolean
  minimumValue?: number
}

export interface TuitionFee {
  programType: string
  domesticFee: number
  internationalFee: number
  currency: string
  additionalFees?: {
    name: string
    amount: number
  }[]
}

export interface UniversityRanking {
  organization: string
  rank: number
  year: number
  category?: string
}

// Payment Types
export interface Payment {
  id: string
  applicationId: string
  studentId: string
  amount: number
  currency: string
  status: "pending" | "processing" | "completed" | "failed" | "refunded"
  paymentMethod: "credit_card" | "debit_card" | "bank_transfer" | "paypal"
  transactionId?: string
  gatewayResponse?: any
  createdAt: string
  updatedAt: string
}

// Form Types
export interface FormTemplate {
  id: string
  name: string
  description: string
  fields: FormField[]
  isActive: boolean
  createdBy: string
  createdAt: string
  updatedAt: string
}

export interface FormField {
  id: string
  type: "text" | "email" | "number" | "select" | "multiselect" | "textarea" | "file" | "date" | "checkbox"
  label: string
  placeholder?: string
  required: boolean
  options?: string[]
  validation?: {
    min?: number
    max?: number
    pattern?: string
    message?: string
  }
  conditionalLogic?: {
    dependsOn: string
    condition: "equals" | "not_equals" | "contains"
    value: any
  }
}

// Notification Types
export interface Notification {
  id: string
  userId: string
  type:
    | "application_status"
    | "payment_confirmation"
    | "document_required"
    | "deadline_reminder"
    | "system_announcement"
  title: string
  message: string
  isRead: boolean
  actionUrl?: string
  createdAt: string
}

// Search Types
export interface SearchFilters {
  query?: string
  location?: string
  programType?: string[]
  tuitionRange?: {
    min: number
    max: number
  }
  ranking?: number
  page?: number
  limit?: number
  sortBy?: "name" | "ranking" | "tuition" | "location"
  sortOrder?: "asc" | "desc"
}

export interface SearchResult {
  universities: University[]
  filters: {
    locations: string[]
    programTypes: string[]
    tuitionRange: {
      min: number
      max: number
    }
  }
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
}

// File Upload Types
export interface FileUploadResponse {
  fileId: string
  fileName: string
  fileUrl: string
  fileSize: number
  mimeType: string
  uploadedAt: string
}

// Error Types
export interface ApiError {
  code: string
  message: string
  details?: any
  timestamp: string
  path: string
}
