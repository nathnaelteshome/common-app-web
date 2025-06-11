// ============================================================================
// MOCK DATA - FRONTEND ONLY
// ============================================================================
// This file contains all mock data for the frontend application
// In a real application, this data would come from API endpoints

import type { User, StudentProfile, UniversityProfile } from "@/lib/validations/auth"

// ============================================================================
// USER DATA
// ============================================================================

export interface MockUser extends User {
  password: string // Only for frontend testing purposes
}

export const mockUsers: MockUser[] = [
  // Student Users
  {
    id: "student-1",
    email: "student@test.com",
    password: "Student123",
    role: "student",
    isEmailVerified: true,
    profile: {
      firstName: "John",
      lastName: "Doe",
      username: "johndoe",
      phoneNumber: "+251911223344",
      dateOfBirth: "01/15/2000",
      avatar: "/placeholder.svg?height=100&width=100",
    } as StudentProfile,
    createdAt: new Date("2024-01-01T00:00:00Z"),
    updatedAt: new Date("2024-01-20T10:00:00Z"),
  },
  {
    id: "student-2",
    email: "jane.smith@test.com",
    password: "Student456",
    role: "student",
    isEmailVerified: true,
    profile: {
      firstName: "Jane",
      lastName: "Smith",
      username: "janesmith",
      phoneNumber: "+251922334455",
      dateOfBirth: "03/22/1999",
      avatar: "/placeholder.svg?height=100&width=100",
    } as StudentProfile,
    createdAt: new Date("2024-01-05T00:00:00Z"),
    updatedAt: new Date("2024-01-22T14:20:00Z"),
  },

  // University Admin Users
  {
    id: "university-1",
    email: "admin@aait.edu.et",
    password: "Admin123",
    role: "university",
    isEmailVerified: true,
    profile: {
      collegeName: "Addis Ababa Institute of Technology",
      address1: "King George VI Street",
      address2: "Arat Kilo Campus",
      country: "Ethiopia",
      city: "Addis Ababa",
      postcode: "1000",
      phone1: "+251115517430",
      phone2: "+251115518964",
      documents: "accreditation-certificate",
      fieldOfStudies: "Engineering and Technology",
      campusImage: "/placeholder.svg?height=300&width=500",
      isVerified: true,
    } as UniversityProfile,
    createdAt: new Date("2023-12-01T00:00:00Z"),
    updatedAt: new Date("2024-01-18T15:30:00Z"),
  },
  {
    id: "university-2",
    email: "admin@mu.edu.et",
    password: "Admin456",
    role: "university",
    isEmailVerified: true,
    profile: {
      collegeName: "Mekelle University",
      address1: "Mekelle University Main Campus",
      address2: "Endayesus Area",
      country: "Ethiopia",
      city: "Mekelle",
      postcode: "1871",
      phone1: "+251344409304",
      phone2: "+251344409305",
      documents: "accreditation-certificate",
      fieldOfStudies: "Medicine and Health Sciences",
      campusImage: "/placeholder.svg?height=300&width=500",
      isVerified: true,
    } as UniversityProfile,
    createdAt: new Date("2023-11-15T00:00:00Z"),
    updatedAt: new Date("2024-01-19T11:45:00Z"),
  },

  // System Admin Users
  {
    id: "system-admin-1",
    email: "sysadmin@commonapply.com",
    password: "SysAdmin123",
    role: "admin",
    isEmailVerified: true,
    profile: {
      firstName: "System",
      lastName: "Administrator",
      permissions: [
        "manage_universities",
        "manage_users",
        "view_analytics",
        "manage_payments",
        "manage_notifications",
        "manage_surveys",
        "system_monitoring",
      ],
    },
    createdAt: new Date("2023-10-01T00:00:00Z"),
    updatedAt: new Date("2024-01-25T12:00:00Z"),
  },
]

// ============================================================================
// SYSTEM ADMIN DATA
// ============================================================================

export interface SystemMetrics {
  totalUsers: number
  totalUniversities: number
  totalApplications: number
  totalRevenue: number
  activeUsers: number
  systemUptime: string
  averageResponseTime: number
  errorRate: number
}

export const mockSystemMetrics: SystemMetrics = {
  totalUsers: 15420,
  totalUniversities: 45,
  totalApplications: 8932,
  totalRevenue: 2456780,
  activeUsers: 1234,
  systemUptime: "99.9%",
  averageResponseTime: 245,
  errorRate: 0.02,
}

export interface UniversityData {
  id: string
  name: string
  email: string
  status: "active" | "inactive" | "pending" | "suspended"
  lastUpdated: string
  dataAccuracy: number
  totalPrograms: number
  totalApplications: number
  adminContact: string
  verificationStatus: "verified" | "pending" | "rejected"
}

export const mockUniversityData: UniversityData[] = [
  {
    id: "uni-1",
    name: "Addis Ababa Institute of Technology",
    email: "admin@aait.edu.et",
    status: "active",
    lastUpdated: "2024-01-25T10:00:00Z",
    dataAccuracy: 98.5,
    totalPrograms: 15,
    totalApplications: 1250,
    adminContact: "+251115517430",
    verificationStatus: "verified",
  },
  {
    id: "uni-2",
    name: "Mekelle University",
    email: "admin@mu.edu.et",
    status: "active",
    lastUpdated: "2024-01-24T15:30:00Z",
    dataAccuracy: 95.2,
    totalPrograms: 12,
    totalApplications: 980,
    adminContact: "+251344409304",
    verificationStatus: "verified",
  },
  {
    id: "uni-3",
    name: "Hawassa University",
    email: "admin@hu.edu.et",
    status: "pending",
    lastUpdated: "2024-01-20T09:15:00Z",
    dataAccuracy: 87.3,
    totalPrograms: 8,
    totalApplications: 0,
    adminContact: "+251462206341",
    verificationStatus: "pending",
  },
]

export interface PaymentLog {
  id: string
  studentId: string
  studentName: string
  applicationId: string
  universityName: string
  amount: number
  currency: string
  status: "completed" | "pending" | "failed" | "refunded"
  paymentMethod: string
  transactionId: string
  timestamp: string
  receiptGenerated: boolean
  gatewayResponse: string
}

export const mockPaymentLogs: PaymentLog[] = [
  {
    id: "pay-1",
    studentId: "student-1",
    studentName: "John Doe",
    applicationId: "app-1",
    universityName: "Addis Ababa Institute of Technology",
    amount: 500,
    currency: "USD",
    status: "completed",
    paymentMethod: "Credit Card",
    transactionId: "txn_1234567890",
    timestamp: "2024-01-25T14:30:00Z",
    receiptGenerated: true,
    gatewayResponse: "SUCCESS",
  },
  {
    id: "pay-2",
    studentId: "student-2",
    studentName: "Jane Smith",
    applicationId: "app-2",
    universityName: "Mekelle University",
    amount: 400,
    currency: "USD",
    status: "completed",
    paymentMethod: "Bank Transfer",
    transactionId: "txn_0987654321",
    timestamp: "2024-01-24T11:15:00Z",
    receiptGenerated: true,
    gatewayResponse: "SUCCESS",
  },
]

export interface NotificationTemplate {
  id: string
  name: string
  type: "email" | "sms" | "push"
  category: "application" | "payment" | "system" | "reminder"
  subject: string
  content: string
  variables: string[]
  isActive: boolean
  createdAt: string
  lastModified: string
  usageCount: number
}

export const mockNotificationTemplates: NotificationTemplate[] = [
  {
    id: "template-1",
    name: "Application Accepted",
    type: "email",
    category: "application",
    subject: "Congratulations! Your application has been accepted",
    content:
      "Dear {{studentName}}, we are pleased to inform you that your application to {{universityName}} for {{programName}} has been accepted. Please check your dashboard for next steps.",
    variables: ["studentName", "universityName", "programName"],
    isActive: true,
    createdAt: "2024-01-01T00:00:00Z",
    lastModified: "2024-01-15T10:00:00Z",
    usageCount: 245,
  },
  {
    id: "template-2",
    name: "Payment Confirmation",
    type: "email",
    category: "payment",
    subject: "Payment Confirmation - Application Fee",
    content:
      "Dear {{studentName}}, your payment of {{amount}} {{currency}} for application {{applicationId}} has been successfully processed. Transaction ID: {{transactionId}}",
    variables: ["studentName", "amount", "currency", "applicationId", "transactionId"],
    isActive: true,
    createdAt: "2024-01-01T00:00:00Z",
    lastModified: "2024-01-10T14:20:00Z",
    usageCount: 892,
  },
]

export interface SystemLog {
  id: string
  level: "info" | "warning" | "error" | "critical"
  category: "authentication" | "payment" | "application" | "system" | "security"
  message: string
  details: string
  userId?: string
  ipAddress: string
  timestamp: string
  resolved: boolean
}

export const mockSystemLogs: SystemLog[] = [
  {
    id: "log-1",
    level: "error",
    category: "payment",
    message: "Payment gateway timeout",
    details: "Payment processing failed due to gateway timeout for transaction txn_1234567890",
    userId: "student-1",
    ipAddress: "192.168.1.100",
    timestamp: "2024-01-25T15:45:00Z",
    resolved: false,
  },
  {
    id: "log-2",
    level: "warning",
    category: "system",
    message: "High memory usage detected",
    details: "System memory usage exceeded 85% threshold",
    ipAddress: "server-01",
    timestamp: "2024-01-25T14:30:00Z",
    resolved: true,
  },
]

export interface Survey {
  id: string
  title: string
  description: string
  type: "feedback" | "satisfaction" | "improvement" | "custom"
  status: "draft" | "active" | "completed" | "archived"
  targetAudience: "students" | "universities" | "all"
  questions: {
    id: string
    type: "text" | "rating" | "multiple-choice" | "yes-no"
    question: string
    options?: string[]
    required: boolean
  }[]
  responses: number
  createdAt: string
  expiresAt?: string
}

export const mockSurveys: Survey[] = [
  {
    id: "survey-1",
    title: "Application Process Feedback",
    description: "Help us improve the application process",
    type: "feedback",
    status: "active",
    targetAudience: "students",
    questions: [
      {
        id: "q1",
        type: "rating",
        question: "How would you rate the overall application process?",
        required: true,
      },
      {
        id: "q2",
        type: "text",
        question: "What improvements would you suggest?",
        required: false,
      },
    ],
    responses: 156,
    createdAt: "2024-01-15T00:00:00Z",
    expiresAt: "2024-02-15T23:59:59Z",
  },
]

// ============================================================================
// ADMIN APPLICATION DATA
// ============================================================================

export interface AdminApplication {
  id: string
  studentId: string
  studentName: string
  studentEmail: string
  programId: string
  programName: string
  status: "submitted" | "under-review" | "accepted" | "rejected" | "waitlisted"
  submittedAt: string
  lastReviewed?: string
  reviewedBy?: string
  score?: number
  priority: "high" | "medium" | "low"
  paymentStatus: "pending" | "paid" | "failed"
  applicationFee: number
  documents: {
    id: string
    name: string
    type: string
    status: "pending" | "verified" | "rejected"
    reviewNotes?: string
  }[]
  formData: Record<string, any>
  eligibilityScore: number
  autoFilterResult: "eligible" | "ineligible" | "review-required"
  tags: string[]
}

export const mockAdminApplications: AdminApplication[] = [
  {
    id: "admin-app-1",
    studentId: "student-1",
    studentName: "John Doe",
    studentEmail: "john.doe@email.com",
    programId: "1",
    programName: "Computer Science and Engineering",
    status: "submitted",
    submittedAt: "2024-01-15T10:00:00Z",
    priority: "high",
    paymentStatus: "paid",
    applicationFee: 500,
    documents: [
      {
        id: "doc-1",
        name: "Transcript",
        type: "academic",
        status: "verified",
      },
      {
        id: "doc-2",
        name: "Personal Statement",
        type: "essay",
        status: "pending",
      },
    ],
    formData: {
      gpa: 3.8,
      testScore: 1450,
      extracurriculars: ["Programming Club", "Volunteer Work"],
    },
    eligibilityScore: 85,
    autoFilterResult: "eligible",
    tags: ["high-achiever", "stem-background"],
  },
  {
    id: "admin-app-2",
    studentId: "student-2",
    studentName: "Jane Smith",
    studentEmail: "jane.smith@email.com",
    programId: "1",
    programName: "Computer Science and Engineering",
    status: "under-review",
    submittedAt: "2024-01-18T14:30:00Z",
    lastReviewed: "2024-01-20T09:00:00Z",
    reviewedBy: "admin-1",
    score: 78,
    priority: "medium",
    paymentStatus: "paid",
    applicationFee: 500,
    documents: [
      {
        id: "doc-3",
        name: "Transcript",
        type: "academic",
        status: "verified",
      },
    ],
    formData: {
      gpa: 3.6,
      testScore: 1380,
      extracurriculars: ["Debate Team"],
    },
    eligibilityScore: 78,
    autoFilterResult: "eligible",
    tags: ["good-candidate"],
  },
]

// ============================================================================
// ADMISSION FORMS DATA
// ============================================================================

export interface FormField {
  id: string
  type: "text" | "email" | "number" | "textarea" | "select" | "radio" | "checkbox" | "file" | "date"
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
  conditionalDisplay?: {
    dependsOn: string
    value: any
    operator: "equals" | "not-equals" | "contains" | "greater-than" | "less-than"
  }
}

export interface ConditionalRule {
  id: string
  condition: {
    fieldId: string
    operator: "equals" | "not-equals" | "contains" | "greater-than" | "less-than"
    value: any
  }
  action: {
    type: "show" | "hide" | "require" | "disable"
    targetFieldId: string
  }
}

export interface AdmissionForm {
  id: string
  name: string
  programId: string
  programName: string
  isActive: boolean
  createdAt: string
  lastModified: string
  sections: {
    id: string
    title: string
    description?: string
    fields: FormField[]
    conditionalLogic?: ConditionalRule[]
  }[]
  settings: {
    allowSave: boolean
    requirePayment: boolean
    applicationFee: number
    deadline: string
    maxApplications?: number
  }
}

export const mockAdmissionForms: AdmissionForm[] = [
  {
    id: "form-1",
    name: "Computer Science Application Form",
    programId: "1",
    programName: "Computer Science and Engineering",
    isActive: true,
    createdAt: "2024-01-01T00:00:00Z",
    lastModified: "2024-01-15T10:00:00Z",
    sections: [
      {
        id: "section-1",
        title: "Personal Information",
        fields: [
          {
            id: "firstName",
            type: "text",
            label: "First Name",
            required: true,
          },
          {
            id: "lastName",
            type: "text",
            label: "Last Name",
            required: true,
          },
          {
            id: "email",
            type: "email",
            label: "Email Address",
            required: true,
          },
        ],
      },
      {
        id: "section-2",
        title: "Academic Information",
        fields: [
          {
            id: "gpa",
            type: "number",
            label: "GPA",
            required: true,
            validation: {
              min: 0,
              max: 4,
              message: "GPA must be between 0 and 4",
            },
          },
          {
            id: "testScore",
            type: "number",
            label: "SAT Score",
            required: true,
            validation: {
              min: 400,
              max: 1600,
              message: "SAT score must be between 400 and 1600",
            },
          },
        ],
      },
    ],
    settings: {
      allowSave: true,
      requirePayment: true,
      applicationFee: 500,
      deadline: "2024-08-15T23:59:59Z",
    },
  },
]

// ============================================================================
// ANNOUNCEMENTS DATA
// ============================================================================

export interface Announcement {
  id: string
  title: string
  content: string
  type: "general" | "deadline" | "requirement" | "event"
  priority: "high" | "medium" | "low"
  targetAudience: "all" | "applicants" | "accepted" | "specific-program"
  programIds?: string[]
  isPublished: boolean
  publishedAt?: string
  expiresAt?: string
  createdBy: string
  attachments?: {
    id: string
    name: string
    url: string
    type: string
  }[]
}

export const mockAnnouncements: Announcement[] = [
  {
    id: "ann-1",
    title: "Application Deadline Extended",
    content:
      "We are pleased to announce that the application deadline for Computer Science programs has been extended to August 30th, 2024.",
    type: "deadline",
    priority: "high",
    targetAudience: "specific-program",
    programIds: ["1"],
    isPublished: true,
    publishedAt: "2024-01-20T10:00:00Z",
    expiresAt: "2024-08-30T23:59:59Z",
    createdBy: "admin-1",
  },
  {
    id: "ann-2",
    title: "New Scholarship Opportunities",
    content:
      "We are excited to announce new merit-based scholarships for incoming students. Applications are now open.",
    type: "general",
    priority: "medium",
    targetAudience: "all",
    isPublished: true,
    publishedAt: "2024-01-18T15:00:00Z",
    createdBy: "admin-1",
  },
]

// ============================================================================
// ELIGIBILITY CRITERIA DATA
// ============================================================================

export interface EligibilityCriteria {
  id: string
  programId: string
  programName: string
  criteria: {
    id: string
    field: string
    operator: "equals" | "not-equals" | "greater-than" | "less-than" | "contains" | "in-range"
    value: any
    weight: number
    required: boolean
  }[]
  minimumScore: number
  isActive: boolean
}

export const mockEligibilityCriteria: EligibilityCriteria[] = [
  {
    id: "criteria-1",
    programId: "1",
    programName: "Computer Science and Engineering",
    criteria: [
      {
        id: "gpa-req",
        field: "gpa",
        operator: "greater-than",
        value: 3.0,
        weight: 40,
        required: true,
      },
      {
        id: "test-score-req",
        field: "testScore",
        operator: "greater-than",
        value: 1200,
        weight: 35,
        required: true,
      },
      {
        id: "math-courses",
        field: "mathCourses",
        operator: "greater-than",
        value: 3,
        weight: 25,
        required: false,
      },
    ],
    minimumScore: 70,
    isActive: true,
  },
]

// ============================================================================
// SURVEY DATA
// ============================================================================

export interface SurveyResponse {
  id: string
  surveyId: string
  studentId: string
  studentEmail: string
  responses: {
    questionId: string
    answer: any
  }[]
  submittedAt: string
  applicationId?: string
}

export const mockSurveyResponses: SurveyResponse[] = [
  {
    id: "response-1",
    surveyId: "survey-1",
    studentId: "student-1",
    studentEmail: "john.doe@email.com",
    responses: [
      {
        questionId: "q1",
        answer: 4,
      },
      {
        questionId: "q2",
        answer: "The form was easy to use but could use better validation messages.",
      },
      {
        questionId: "q3",
        answer: "Search Engine",
      },
    ],
    submittedAt: "2024-01-22T16:30:00Z",
    applicationId: "app-1",
  },
]

// ============================================================================
// STUDENT DATA
// ============================================================================

export const mockStudentProfile = {
  id: "student-1",
  firstName: "John",
  lastName: "Doe",
  email: "john.doe@email.com",
  phone: "+251911123456",
  dateOfBirth: "2000-05-15",
  address: "123 Main Street",
  city: "Addis Ababa",
  country: "Ethiopia",
  bio: "Aspiring computer science student passionate about technology and innovation.",
  avatar: "/placeholder.svg?height=100&width=100",
  highSchool: "Addis Ababa Preparatory School",
  graduationYear: "2018",
  gpa: "3.8",
}

export const mockApplications = [
  {
    id: "app-1",
    universityName: "Addis Ababa University",
    universityLogo: "/placeholder.svg?height=60&width=60",
    program: "Computer Science",
    status: "accepted",
    submittedDate: "2024-01-15",
    lastUpdated: "2024-02-01",
    progress: 100,
    requirements: [
      { name: "Transcripts", status: "completed", required: true },
      { name: "Personal Statement", status: "completed", required: true },
      { name: "Letters of Recommendation", status: "completed", required: true },
      { name: "Test Scores", status: "completed", required: false },
    ],
    tuitionFee: 25000,
    applicationFee: 500,
    deadline: "2024-03-01",
    notes: "Congratulations! You have been accepted to our Computer Science program.",
  },
  {
    id: "app-2",
    universityName: "Jimma University",
    universityLogo: "/placeholder.svg?height=60&width=60",
    program: "Software Engineering",
    status: "pending",
    submittedDate: "2024-01-20",
    lastUpdated: "2024-01-25",
    progress: 85,
    requirements: [
      { name: "Transcripts", status: "completed", required: true },
      { name: "Personal Statement", status: "completed", required: true },
      { name: "Letters of Recommendation", status: "pending", required: true },
      { name: "Portfolio", status: "missing", required: false },
    ],
    tuitionFee: 22000,
    applicationFee: 400,
    deadline: "2024-02-15",
    notes: "Application under review. Please submit remaining documents.",
  },
]

export const mockNotifications = [
  {
    id: "notif-1",
    title: "Application Status Update",
    message: "Your application to Addis Ababa University has been accepted!",
    type: "application",
    isRead: false,
    createdAt: "2024-02-01T10:00:00Z",
    actionUrl: "/student/applications/app-1",
  },
  {
    id: "notif-2",
    title: "Document Required",
    message: "Please submit your letters of recommendation for Jimma University",
    type: "document",
    isRead: false,
    createdAt: "2024-01-30T14:30:00Z",
    actionUrl: "/student/applications/app-2",
  },
]

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

// Helper function to find user by email and password
export function findUserByCredentials(email: string, password: string): MockUser | null {
  console.log("Searching for user with email:", email)
  console.log(
    "Available users:",
    mockUsers.map((u) => ({ email: u.email, role: u.role })),
  )

  const user = mockUsers.find((user) => user.email === email && user.password === password)
  console.log("Found user:", user ? `${user.email} (${user.role})` : "null")

  return user || null
}

// Helper function to find user by ID
export function findUserById(id: string): MockUser | null {
  return mockUsers.find((user) => user.id === id) || null
}

// Helper function to find user by email
export function findUserByEmail(email: string): MockUser | null {
  console.log("Searching for user with email:", email)
  const user = mockUsers.find((user) => user.email === email)
  console.log("Found user by email:", user ? `${user.email} (${user.role})` : "null")
  return user || null
}

// Helper function to get all users by role
export function getUsersByRole(role: "student" | "university" | "admin"): MockUser[] {
  return mockUsers.filter((user) => user.role === role)
}
