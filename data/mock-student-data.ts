export interface StudentApplication {
  id: string
  universityId: string
  universityName: string
  programId: string
  programName: string
  status: "draft" | "submitted" | "under_review" | "interview_scheduled" | "accepted" | "rejected" | "waitlisted"
  submittedAt: string
  lastUpdated: string
  deadline: string
  applicationFee: number
  paymentStatus: "pending" | "paid" | "failed"
  documents: {
    transcript: boolean
    recommendation: boolean
    essay: boolean
    portfolio: boolean
  }
  progress: number
}

export interface StudentNotification {
  id: string
  type: "application" | "payment" | "deadline" | "announcement"
  title: string
  message: string
  timestamp: string
  read: boolean
  urgent: boolean
  applicationId?: string
}

export interface UniversityComparison {
  id: string
  universityId: string
  addedAt: string
}

export interface StudentProfile {
  id: string
  firstName: string
  lastName: string
  email: string
  phone: string
  dateOfBirth: string
  nationality: string
  address: {
    street: string
    city: string
    region: string
    postalCode: string
  }
  education: {
    highSchool: string
    graduationYear: number
    gpa: number
  }
  preferences: {
    programTypes: string[]
    regions: string[]
    maxTuition: number
  }
}

export interface PaymentRecord {
  id: string
  applicationId: string
  amount: number
  currency: string
  method: "credit_card" | "bank_transfer" | "mobile_money"
  status: "pending" | "completed" | "failed" | "refunded"
  transactionId: string
  timestamp: string
  receipt?: string
}

export interface SurveyResponse {
  id: string
  surveyId: string
  responses: Record<string, any>
  submittedAt: string
  anonymous: boolean
}

// Mock data for student dashboard
export const mockStudentProfile: StudentProfile = {
  id: "student-001",
  firstName: "Abebe",
  lastName: "Kebede",
  email: "abebe.kebede@email.com",
  phone: "+251911234567",
  dateOfBirth: "2000-05-15",
  nationality: "Ethiopian",
  address: {
    street: "123 Bole Road",
    city: "Addis Ababa",
    region: "Addis Ababa",
    postalCode: "1000",
  },
  education: {
    highSchool: "Addis Ababa Preparatory School",
    graduationYear: 2018,
    gpa: 3.8,
  },
  preferences: {
    programTypes: ["Engineering", "Computer Science"],
    regions: ["Addis Ababa", "Oromia"],
    maxTuition: 50000,
  },
}

export const mockApplications: StudentApplication[] = [
  {
    id: "app-001",
    universityId: "aau",
    universityName: "Addis Ababa University",
    programId: "cs-001",
    programName: "Computer Science",
    status: "under_review",
    submittedAt: "2024-01-15T10:00:00Z",
    lastUpdated: "2024-01-20T14:30:00Z",
    deadline: "2024-03-01T23:59:59Z",
    applicationFee: 500,
    paymentStatus: "paid",
    documents: {
      transcript: true,
      recommendation: true,
      essay: true,
      portfolio: false,
    },
    progress: 85,
  },
  {
    id: "app-002",
    universityId: "ait",
    universityName: "Addis Ababa Institute of Technology",
    programId: "ee-001",
    programName: "Electrical Engineering",
    status: "accepted",
    submittedAt: "2024-01-10T09:00:00Z",
    lastUpdated: "2024-01-25T16:45:00Z",
    deadline: "2024-02-28T23:59:59Z",
    applicationFee: 600,
    paymentStatus: "paid",
    documents: {
      transcript: true,
      recommendation: true,
      essay: true,
      portfolio: true,
    },
    progress: 100,
  },
  {
    id: "app-003",
    universityId: "ju",
    universityName: "Jimma University",
    programId: "med-001",
    programName: "Medicine",
    status: "draft",
    submittedAt: "",
    lastUpdated: "2024-01-22T11:15:00Z",
    deadline: "2024-04-15T23:59:59Z",
    applicationFee: 800,
    paymentStatus: "pending",
    documents: {
      transcript: false,
      recommendation: false,
      essay: false,
      portfolio: false,
    },
    progress: 25,
  },
]

export const mockNotifications: StudentNotification[] = [
  {
    id: "notif-001",
    type: "application",
    title: "Application Status Update",
    message: "Your application to Addis Ababa Institute of Technology has been accepted!",
    timestamp: "2024-01-25T16:45:00Z",
    read: false,
    urgent: true,
    applicationId: "app-002",
  },
  {
    id: "notif-002",
    type: "deadline",
    title: "Application Deadline Reminder",
    message: "Your application to Addis Ababa University is due in 5 days.",
    timestamp: "2024-01-24T09:00:00Z",
    read: true,
    urgent: true,
    applicationId: "app-001",
  },
  {
    id: "notif-003",
    type: "payment",
    title: "Payment Confirmation",
    message: "Your application fee payment of 600 ETB has been processed successfully.",
    timestamp: "2024-01-23T14:20:00Z",
    read: true,
    urgent: false,
    applicationId: "app-002",
  },
  {
    id: "notif-004",
    type: "announcement",
    title: "New Scholarship Opportunity",
    message: "A new merit-based scholarship is now available for Computer Science students.",
    timestamp: "2024-01-22T10:30:00Z",
    read: false,
    urgent: false,
  },
]

export const mockComparisons: UniversityComparison[] = [
  {
    id: "comp-001",
    universityId: "aau",
    addedAt: "2024-01-20T10:00:00Z",
  },
  {
    id: "comp-002",
    universityId: "ait",
    addedAt: "2024-01-20T10:05:00Z",
  },
]

export const mockPayments: PaymentRecord[] = [
  {
    id: "pay-001",
    applicationId: "app-001",
    amount: 500,
    currency: "ETB",
    method: "credit_card",
    status: "completed",
    transactionId: "txn-001",
    timestamp: "2024-01-15T11:00:00Z",
    receipt: "receipt-001.pdf",
  },
  {
    id: "pay-002",
    applicationId: "app-002",
    amount: 600,
    currency: "ETB",
    method: "bank_transfer",
    status: "completed",
    transactionId: "txn-002",
    timestamp: "2024-01-10T10:00:00Z",
    receipt: "receipt-002.pdf",
  },
]

export const mockSurveyResponses: SurveyResponse[] = [
  {
    id: "survey-001",
    surveyId: "application-experience",
    responses: {
      overall_satisfaction: 4,
      ease_of_use: 5,
      application_process: 4,
      support_quality: 3,
      recommendations: "The process was smooth overall, but could use better guidance on document requirements.",
    },
    submittedAt: "2024-01-20T15:30:00Z",
    anonymous: false,
  },
]

// Add the mockAnnouncements export that's missing
// Add this after the existing mock data declarations

export const mockAnnouncements = [
  {
    id: "ann-001",
    title: "Application Deadline Extended",
    content:
      "The application deadline for Addis Ababa University has been extended by two weeks. Take advantage of this opportunity to complete your application.",
    type: "university",
    priority: "high",
    sender: "Addis Ababa University",
    createdAt: "2024-05-01T09:00:00Z",
    isRead: false,
    actionRequired: true,
  },
  {
    id: "ann-002",
    title: "New Scholarship Opportunity",
    content:
      "A new merit-based scholarship is now available for Computer Science students. Check the eligibility criteria and apply before the deadline.",
    type: "general",
    priority: "medium",
    sender: "CommonApply Team",
    createdAt: "2024-04-28T14:30:00Z",
    isRead: true,
    actionRequired: false,
  },
  {
    id: "ann-003",
    title: "System Maintenance Notice",
    content:
      "The system will be undergoing maintenance on Sunday, May 5th, from 2:00 AM to 6:00 AM EAT. Some features may be temporarily unavailable during this time.",
    type: "system",
    priority: "low",
    sender: "System Administrator",
    createdAt: "2024-04-25T11:15:00Z",
    isRead: false,
    actionRequired: false,
  },
  {
    id: "ann-004",
    title: "Interview Invitation",
    content:
      "You have been invited for an interview with Addis Ababa Institute of Technology. Please check your email for details and confirm your attendance.",
    type: "university",
    priority: "high",
    sender: "Addis Ababa Institute of Technology",
    createdAt: "2024-04-22T16:45:00Z",
    isRead: false,
    actionRequired: true,
  },
  {
    id: "ann-005",
    title: "Profile Completion Reminder",
    content:
      "Your profile is only 75% complete. Complete your profile to increase your chances of being matched with suitable universities.",
    type: "system",
    priority: "medium",
    sender: "CommonApply Team",
    createdAt: "2024-04-20T10:30:00Z",
    isRead: true,
    actionRequired: true,
  },
]

// Helper functions
export const getApplicationsByStatus = (status: StudentApplication["status"]) => {
  return mockApplications.filter((app) => app.status === status)
}

export const getUnreadNotifications = () => {
  return mockNotifications.filter((notif) => !notif.read)
}

export const getUrgentNotifications = () => {
  return mockNotifications.filter((notif) => notif.urgent && !notif.read)
}

export const getUpcomingDeadlines = () => {
  const now = new Date()
  const thirtyDaysFromNow = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000)

  return mockApplications.filter((app) => {
    const deadline = new Date(app.deadline)
    return deadline > now && deadline <= thirtyDaysFromNow
  })
}

export const getApplicationProgress = () => {
  const total = mockApplications.length
  const completed = mockApplications.filter((app) => app.status === "accepted").length
  const pending = mockApplications.filter((app) =>
    ["submitted", "under_review", "interview_scheduled"].includes(app.status),
  ).length

  return {
    total,
    completed,
    pending,
    draft: total - completed - pending,
  }
}
