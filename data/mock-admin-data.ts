export interface AdmissionForm {
  id: string
  name: string
  description: string
  type: string
  status: "draft" | "published" | "archived"
  fields: FormField[]
  submissions: number
  completionRate: number
  createdAt: string
  updatedAt: string
  createdBy: string
}

export interface FormField {
  id: string
  type: string
  label: string
  placeholder?: string
  required: boolean
  options?: string[]
  validation?: {
    minLength?: number
    maxLength?: number
    pattern?: string
    min?: number
    max?: number
  }
  conditionalLogic?: {
    action: "show" | "hide" | "require"
    conditions: Array<{
      field: string
      operator: string
      value: string
    }>
    logic: "and" | "or"
  }[]
}

export interface AdminApplication {
  id: string
  studentName: string
  studentEmail: string
  programName: string
  status: "submitted" | "under-review" | "accepted" | "rejected" | "waitlisted"
  priority: "high" | "medium" | "low"
  eligibilityScore: number
  submittedAt: string
  applicationFee: number
  paymentStatus: "paid" | "pending" | "failed"
  documents: string[]
  tags: string[]
}

export interface Announcement {
  id: string
  title: string
  content: string
  type: "general" | "urgent" | "deadline" | "event"
  targetAudience: "all" | "students" | "applicants" | "accepted"
  status: "draft" | "published" | "scheduled"
  publishDate: string
  createdAt: string
  createdBy: string
  views: number
  attachments?: string[]
}

export interface PaymentRecord {
  id: string
  applicationId: string
  studentName: string
  amount: number
  currency: string
  method: "credit_card" | "bank_transfer" | "mobile_money"
  status: "completed" | "pending" | "failed" | "refunded"
  transactionId: string
  processedAt: string
  gateway: string
  fees: number
}

export interface SurveyResponse {
  id: string
  surveyId: string
  respondentId: string
  responses: Record<string, any>
  submittedAt: string
  completionTime: number
  source: "email" | "web" | "mobile"
}

export interface EligibilityCriteria {
  id: string
  name: string
  description: string
  rules: Array<{
    field: string
    operator: "greater_than" | "less_than" | "equals" | "contains"
    value: string | number
    weight: number
  }>
  minimumScore: number
  isActive: boolean
  createdAt: string
  updatedAt: string
}

// Mock Data
export const mockAdmissionForms: AdmissionForm[] = [
  {
    id: "form_1",
    name: "Undergraduate Application Form",
    description: "Standard application form for undergraduate programs",
    type: "undergraduate",
    status: "published",
    fields: [
      {
        id: "field_1",
        type: "text",
        label: "Full Name",
        required: true,
      },
      {
        id: "field_2",
        type: "email",
        label: "Email Address",
        required: true,
      },
      {
        id: "field_3",
        type: "select",
        label: "Preferred Program",
        required: true,
        options: ["Computer Science", "Engineering", "Business", "Medicine"],
      },
      {
        id: "field_4",
        type: "file",
        label: "Academic Transcripts",
        required: true,
      },
    ],
    submissions: 1247,
    completionRate: 87,
    createdAt: "2024-01-15T10:00:00Z",
    updatedAt: "2024-01-20T14:30:00Z",
    createdBy: "admin_1",
  },
  {
    id: "form_2",
    name: "Graduate Application Form",
    description: "Application form for graduate and postgraduate programs",
    type: "graduate",
    status: "published",
    fields: [
      {
        id: "field_5",
        type: "text",
        label: "Full Name",
        required: true,
      },
      {
        id: "field_6",
        type: "email",
        label: "Email Address",
        required: true,
      },
      {
        id: "field_7",
        type: "select",
        label: "Degree Level",
        required: true,
        options: ["Master's", "PhD", "Professional Doctorate"],
      },
      {
        id: "field_8",
        type: "textarea",
        label: "Research Proposal",
        required: true,
      },
    ],
    submissions: 543,
    completionRate: 92,
    createdAt: "2024-01-10T09:00:00Z",
    updatedAt: "2024-01-18T16:45:00Z",
    createdBy: "admin_1",
  },
  {
    id: "form_3",
    name: "International Student Application",
    description: "Specialized form for international student applications",
    type: "international",
    status: "draft",
    fields: [
      {
        id: "field_9",
        type: "text",
        label: "Full Name",
        required: true,
      },
      {
        id: "field_10",
        type: "select",
        label: "Country of Origin",
        required: true,
        options: ["USA", "UK", "Canada", "Australia", "Germany", "Other"],
      },
      {
        id: "field_11",
        type: "file",
        label: "Passport Copy",
        required: true,
      },
      {
        id: "field_12",
        type: "file",
        label: "English Proficiency Test",
        required: true,
      },
    ],
    submissions: 0,
    completionRate: 0,
    createdAt: "2024-01-25T11:00:00Z",
    updatedAt: "2024-01-25T11:00:00Z",
    createdBy: "admin_1",
  },
]

export const mockAdminApplications: AdminApplication[] = [
  {
    id: "app_1",
    studentName: "John Doe",
    studentEmail: "john.doe@email.com",
    programName: "Computer Science",
    status: "submitted",
    priority: "high",
    eligibilityScore: 95,
    submittedAt: "2024-01-20T10:30:00Z",
    applicationFee: 50,
    paymentStatus: "paid",
    documents: ["transcript.pdf", "recommendation.pdf", "essay.pdf"],
    tags: ["high-achiever", "scholarship-eligible"],
  },
  {
    id: "app_2",
    studentName: "Jane Smith",
    studentEmail: "jane.smith@email.com",
    programName: "Engineering",
    status: "under-review",
    priority: "medium",
    eligibilityScore: 88,
    submittedAt: "2024-01-19T14:15:00Z",
    applicationFee: 50,
    paymentStatus: "paid",
    documents: ["transcript.pdf", "portfolio.pdf"],
    tags: ["international", "stem"],
  },
  {
    id: "app_3",
    studentName: "Mike Johnson",
    studentEmail: "mike.johnson@email.com",
    programName: "Business Administration",
    status: "accepted",
    priority: "low",
    eligibilityScore: 82,
    submittedAt: "2024-01-18T09:45:00Z",
    applicationFee: 50,
    paymentStatus: "paid",
    documents: ["transcript.pdf", "work-experience.pdf"],
    tags: ["working-professional"],
  },
]

export const mockAnnouncements: Announcement[] = [
  {
    id: "ann_1",
    title: "Application Deadline Extended",
    content:
      "We are pleased to announce that the application deadline for Fall 2024 has been extended to March 15, 2024.",
    type: "deadline",
    targetAudience: "all",
    status: "published",
    publishDate: "2024-01-20T10:00:00Z",
    createdAt: "2024-01-20T09:30:00Z",
    createdBy: "admin_1",
    views: 1250,
  },
  {
    id: "ann_2",
    title: "New Scholarship Program Available",
    content: "We are excited to introduce our new merit-based scholarship program for outstanding students.",
    type: "general",
    targetAudience: "students",
    status: "published",
    publishDate: "2024-01-18T14:00:00Z",
    createdAt: "2024-01-18T13:45:00Z",
    createdBy: "admin_1",
    views: 890,
  },
]

export const mockPaymentRecords: PaymentRecord[] = [
  {
    id: "pay_1",
    applicationId: "app_1",
    studentName: "John Doe",
    amount: 50,
    currency: "USD",
    method: "credit_card",
    status: "completed",
    transactionId: "txn_123456789",
    processedAt: "2024-01-20T10:35:00Z",
    gateway: "stripe",
    fees: 2.5,
  },
  {
    id: "pay_2",
    applicationId: "app_2",
    studentName: "Jane Smith",
    amount: 50,
    currency: "USD",
    method: "bank_transfer",
    status: "completed",
    transactionId: "txn_987654321",
    processedAt: "2024-01-19T14:20:00Z",
    gateway: "bank",
    fees: 1.0,
  },
]

export const mockEligibilityCriteria: EligibilityCriteria[] = [
  {
    id: "criteria_1",
    name: "Undergraduate Eligibility",
    description: "Standard eligibility criteria for undergraduate programs",
    rules: [
      {
        field: "gpa",
        operator: "greater_than",
        value: 3.0,
        weight: 40,
      },
      {
        field: "sat_score",
        operator: "greater_than",
        value: 1200,
        weight: 30,
      },
      {
        field: "extracurricular_activities",
        operator: "greater_than",
        value: 2,
        weight: 20,
      },
      {
        field: "recommendation_letters",
        operator: "greater_than",
        value: 1,
        weight: 10,
      },
    ],
    minimumScore: 70,
    isActive: true,
    createdAt: "2024-01-15T10:00:00Z",
    updatedAt: "2024-01-20T14:30:00Z",
  },
]
