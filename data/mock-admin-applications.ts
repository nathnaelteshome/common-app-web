export interface AdminApplication {
  id: string
  studentId: string
  studentName: string
  studentEmail: string
  programId: string
  programName: string
  universityId: string
  universityName: string
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
  notes?: string
  rejectionReason?: string
  acceptanceConditions?: string[]
}

export const mockAdminApplications: AdminApplication[] = [
  {
    id: "app_001",
    studentId: "student_001",
    studentName: "Abebe Kebede",
    studentEmail: "abebe.kebede@email.com",
    programId: "cs_001",
    programName: "Computer Science and Engineering",
    universityId: "aau_001",
    universityName: "Addis Ababa University",
    status: "submitted",
    submittedAt: "2024-01-20T10:30:00Z",
    priority: "high",
    paymentStatus: "paid",
    applicationFee: 500,
    documents: [
      {
        id: "doc_001",
        name: "Academic Transcript",
        type: "transcript",
        status: "verified",
      },
      {
        id: "doc_002",
        name: "Personal Statement",
        type: "essay",
        status: "pending",
      },
      {
        id: "doc_003",
        name: "Recommendation Letter",
        type: "recommendation",
        status: "verified",
      },
    ],
    formData: {
      gpa: 3.8,
      testScore: 1450,
      extracurriculars: ["Programming Club", "Volunteer Work", "Math Olympiad"],
      workExperience: "2 years as junior developer",
      researchExperience: "Machine Learning project on crop prediction",
    },
    eligibilityScore: 95,
    autoFilterResult: "eligible",
    tags: ["high-achiever", "scholarship-eligible", "stem-background", "research-experience"],
  },
  {
    id: "app_002",
    studentId: "student_002",
    studentName: "Hanan Mohammed",
    studentEmail: "hanan.mohammed@email.com",
    programId: "ee_001",
    programName: "Electrical Engineering",
    universityId: "ait_001",
    universityName: "Addis Ababa Institute of Technology",
    status: "under-review",
    submittedAt: "2024-01-19T14:15:00Z",
    lastReviewed: "2024-01-22T09:00:00Z",
    reviewedBy: "admin_001",
    score: 88,
    priority: "medium",
    paymentStatus: "paid",
    applicationFee: 600,
    documents: [
      {
        id: "doc_004",
        name: "Academic Transcript",
        type: "transcript",
        status: "verified",
      },
      {
        id: "doc_005",
        name: "Portfolio",
        type: "portfolio",
        status: "verified",
      },
      {
        id: "doc_006",
        name: "English Proficiency Test",
        type: "language",
        status: "pending",
      },
    ],
    formData: {
      gpa: 3.6,
      testScore: 1380,
      extracurriculars: ["Debate Team", "Engineering Society"],
      internshipExperience: "Summer internship at Ethiopian Electric Power",
    },
    eligibilityScore: 88,
    autoFilterResult: "eligible",
    tags: ["international", "stem", "leadership-experience"],
    notes: "Strong technical background, pending language test results",
  },
  {
    id: "app_003",
    studentId: "student_003",
    studentName: "Dawit Tadesse",
    studentEmail: "dawit.tadesse@email.com",
    programId: "ba_001",
    programName: "Business Administration",
    universityId: "ju_001",
    universityName: "Jimma University",
    status: "accepted",
    submittedAt: "2024-01-18T09:45:00Z",
    lastReviewed: "2024-01-25T16:30:00Z",
    reviewedBy: "admin_002",
    score: 82,
    priority: "low",
    paymentStatus: "paid",
    applicationFee: 450,
    documents: [
      {
        id: "doc_007",
        name: "Academic Transcript",
        type: "transcript",
        status: "verified",
      },
      {
        id: "doc_008",
        name: "Work Experience Certificate",
        type: "experience",
        status: "verified",
      },
    ],
    formData: {
      gpa: 3.4,
      testScore: 1250,
      extracurriculars: ["Business Club", "Community Service"],
      workExperience: "3 years in family business",
    },
    eligibilityScore: 82,
    autoFilterResult: "eligible",
    tags: ["working-professional", "business-background"],
    acceptanceConditions: ["Maintain GPA above 3.0", "Complete orientation program"],
  },
  {
    id: "app_004",
    studentId: "student_004",
    studentName: "Sara Ahmed",
    studentEmail: "sara.ahmed@email.com",
    programId: "med_001",
    programName: "Medicine",
    universityId: "hu_001",
    universityName: "Hawassa University",
    status: "rejected",
    submittedAt: "2024-01-15T11:20:00Z",
    lastReviewed: "2024-01-28T14:45:00Z",
    reviewedBy: "admin_003",
    score: 65,
    priority: "medium",
    paymentStatus: "paid",
    applicationFee: 800,
    documents: [
      {
        id: "doc_009",
        name: "Academic Transcript",
        type: "transcript",
        status: "rejected",
        reviewNotes: "GPA below minimum requirement",
      },
      {
        id: "doc_010",
        name: "Medical Aptitude Test",
        type: "test",
        status: "verified",
      },
    ],
    formData: {
      gpa: 2.8,
      testScore: 1150,
      extracurriculars: ["Red Cross Volunteer"],
      medicalExperience: "Hospital volunteer for 6 months",
    },
    eligibilityScore: 65,
    autoFilterResult: "ineligible",
    tags: ["medical-interest", "volunteer-experience"],
    rejectionReason: "GPA below minimum requirement of 3.0 for medical program",
  },
  {
    id: "app_005",
    studentId: "student_005",
    studentName: "Yohannes Bekele",
    studentEmail: "yohannes.bekele@email.com",
    programId: "cs_001",
    programName: "Computer Science and Engineering",
    universityId: "aau_001",
    universityName: "Addis Ababa University",
    status: "waitlisted",
    submittedAt: "2024-01-22T16:10:00Z",
    lastReviewed: "2024-01-30T10:15:00Z",
    reviewedBy: "admin_001",
    score: 75,
    priority: "medium",
    paymentStatus: "paid",
    applicationFee: 500,
    documents: [
      {
        id: "doc_011",
        name: "Academic Transcript",
        type: "transcript",
        status: "verified",
      },
      {
        id: "doc_012",
        name: "Coding Portfolio",
        type: "portfolio",
        status: "verified",
      },
    ],
    formData: {
      gpa: 3.5,
      testScore: 1320,
      extracurriculars: ["Coding Bootcamp", "Tech Meetups"],
      programmingExperience: "Self-taught programmer with 2 years experience",
    },
    eligibilityScore: 75,
    autoFilterResult: "review-required",
    tags: ["self-taught", "programming-experience", "tech-enthusiast"],
    notes: "Good technical skills but competitive program. Placed on waitlist due to limited spots.",
  },
]

export const getApplicationsByStatus = (status: AdminApplication["status"]) => {
  return mockAdminApplications.filter((app) => app.status === status)
}

export const getApplicationsByPriority = (priority: AdminApplication["priority"]) => {
  return mockAdminApplications.filter((app) => app.priority === priority)
}

export const getApplicationsByUniversity = (universityId: string) => {
  return mockAdminApplications.filter((app) => app.universityId === universityId)
}

export const getApplicationsByProgram = (programId: string) => {
  return mockAdminApplications.filter((app) => app.programId === programId)
}

export const getApplicationsRequiringReview = () => {
  return mockAdminApplications.filter(
    (app) => app.status === "submitted" || (app.status === "under-review" && !app.lastReviewed),
  )
}

export const getHighPriorityApplications = () => {
  return mockAdminApplications.filter(
    (app) => app.priority === "high" && ["submitted", "under-review"].includes(app.status),
  )
}

export const getApplicationsWithPendingDocuments = () => {
  return mockAdminApplications.filter((app) => app.documents.some((doc) => doc.status === "pending"))
}

export const getApplicationsWithPendingPayments = () => {
  return mockAdminApplications.filter((app) => app.paymentStatus === "pending")
}

export const getApplicationStatistics = () => {
  const total = mockAdminApplications.length
  const submitted = getApplicationsByStatus("submitted").length
  const underReview = getApplicationsByStatus("under-review").length
  const accepted = getApplicationsByStatus("accepted").length
  const rejected = getApplicationsByStatus("rejected").length
  const waitlisted = getApplicationsByStatus("waitlisted").length

  return {
    total,
    submitted,
    underReview,
    accepted,
    rejected,
    waitlisted,
    acceptanceRate: total > 0 ? (accepted / total) * 100 : 0,
    rejectionRate: total > 0 ? (rejected / total) * 100 : 0,
    averageEligibilityScore:
      total > 0 ? mockAdminApplications.reduce((sum, app) => sum + app.eligibilityScore, 0) / total : 0,
  }
}
