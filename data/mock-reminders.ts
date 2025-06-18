export interface Reminder {
  id: string
  title: string
  description: string
  type: "deadline" | "review" | "follow_up" | "payment" | "document" | "interview" | "orientation"
  triggerType: "date" | "days_before" | "days_after" | "condition" | "recurring"
  triggerValue: string | number
  targetAudience: "students" | "admins" | "specific" | "applicants" | "accepted"
  isActive: boolean
  createdAt: string
  lastTriggered?: string
  timesTriggered: number
  nextTrigger?: string
  conditions?: {
    applicationStatus?: string[]
    paymentStatus?: string[]
    documentStatus?: string[]
    programIds?: string[]
    universityIds?: string[]
    studentIds?: string[]
  }
  notification: {
    email: boolean
    sms: boolean
    inApp: boolean
    push: boolean
    subject: string
    message: string
    template?: string
  }
  recurrence?: {
    frequency: "daily" | "weekly" | "monthly"
    interval: number
    endDate?: string
    maxOccurrences?: number
  }
  priority: "low" | "medium" | "high"
  category: "system" | "custom" | "template"
}

export const mockReminders: Reminder[] = [
  {
    id: "reminder_001",
    title: "Application Deadline Reminder - 7 Days",
    description: "Remind students about upcoming application deadlines one week in advance",
    type: "deadline",
    triggerType: "days_before",
    triggerValue: 7,
    targetAudience: "students",
    isActive: true,
    createdAt: "2024-01-15T10:00:00Z",
    lastTriggered: "2024-02-01T09:00:00Z",
    timesTriggered: 45,
    nextTrigger: "2024-02-08T09:00:00Z",
    notification: {
      email: true,
      sms: false,
      inApp: true,
      push: true,
      subject: "Application Deadline Approaching - 7 Days Left",
      message:
        "Your application deadline is approaching in 7 days. Please ensure all required documents are submitted and your application is complete. Don't miss this opportunity!",
      template: "deadline_reminder_7_days",
    },
    priority: "high",
    category: "template",
  },
  {
    id: "reminder_002",
    title: "Pending Review Reminder for Admins",
    description: "Remind admins about applications pending review for more than 3 days",
    type: "review",
    triggerType: "days_after",
    triggerValue: 3,
    targetAudience: "admins",
    isActive: true,
    createdAt: "2024-01-10T09:00:00Z",
    lastTriggered: "2024-02-01T14:30:00Z",
    timesTriggered: 12,
    nextTrigger: "2024-02-05T14:30:00Z",
    conditions: {
      applicationStatus: ["submitted", "under-review"],
    },
    notification: {
      email: true,
      sms: false,
      inApp: true,
      push: false,
      subject: "Applications Pending Review - Action Required",
      message:
        "You have applications that have been pending review for more than 3 days. Please review these applications to maintain our response time standards.",
      template: "admin_review_reminder",
    },
    priority: "medium",
    category: "system",
  },
  {
    id: "reminder_003",
    title: "Document Upload Reminder",
    description: "Remind students to upload missing documents",
    type: "document",
    triggerType: "days_after",
    triggerValue: 2,
    targetAudience: "students",
    isActive: true,
    createdAt: "2024-01-12T11:30:00Z",
    lastTriggered: "2024-01-30T16:45:00Z",
    timesTriggered: 28,
    nextTrigger: "2024-02-03T16:45:00Z",
    conditions: {
      documentStatus: ["missing", "pending"],
    },
    notification: {
      email: true,
      sms: true,
      inApp: true,
      push: true,
      subject: "Missing Documents - Upload Required",
      message:
        "We noticed that some required documents are missing from your application. Please upload the missing documents as soon as possible to avoid delays in processing.",
      template: "document_upload_reminder",
    },
    priority: "high",
    category: "template",
  },
  {
    id: "reminder_004",
    title: "Payment Pending Reminder",
    description: "Remind students about pending application fee payments",
    type: "payment",
    triggerType: "days_after",
    triggerValue: 1,
    targetAudience: "students",
    isActive: true,
    createdAt: "2024-01-08T14:20:00Z",
    lastTriggered: "2024-02-01T10:15:00Z",
    timesTriggered: 67,
    nextTrigger: "2024-02-04T10:15:00Z",
    conditions: {
      paymentStatus: ["pending", "failed"],
    },
    notification: {
      email: true,
      sms: true,
      inApp: true,
      push: true,
      subject: "Application Fee Payment Required",
      message:
        "Your application fee payment is still pending. Please complete the payment to proceed with your application. If you're experiencing issues, contact our support team.",
      template: "payment_reminder",
    },
    priority: "high",
    category: "system",
  },
  {
    id: "reminder_005",
    title: "Interview Scheduling Reminder",
    description: "Remind students to schedule their admission interviews",
    type: "interview",
    triggerType: "condition",
    triggerValue: "interview_required",
    targetAudience: "students",
    isActive: true,
    createdAt: "2024-01-20T13:45:00Z",
    lastTriggered: "2024-01-29T11:20:00Z",
    timesTriggered: 8,
    nextTrigger: "2024-02-05T11:20:00Z",
    conditions: {
      applicationStatus: ["interview_scheduled", "accepted"],
    },
    notification: {
      email: true,
      sms: false,
      inApp: true,
      push: true,
      subject: "Interview Scheduling Required",
      message:
        "Congratulations! Your application has progressed to the interview stage. Please schedule your interview within the next 5 days using the link in your dashboard.",
      template: "interview_scheduling",
    },
    priority: "high",
    category: "custom",
  },
  {
    id: "reminder_006",
    title: "Weekly Application Status Update",
    description: "Send weekly updates to students about their application status",
    type: "follow_up",
    triggerType: "recurring",
    triggerValue: 7,
    targetAudience: "students",
    isActive: true,
    createdAt: "2024-01-05T08:00:00Z",
    lastTriggered: "2024-01-29T08:00:00Z",
    timesTriggered: 4,
    nextTrigger: "2024-02-05T08:00:00Z",
    recurrence: {
      frequency: "weekly",
      interval: 1,
      endDate: "2024-06-01T00:00:00Z",
      maxOccurrences: 20,
    },
    notification: {
      email: true,
      sms: false,
      inApp: true,
      push: false,
      subject: "Weekly Application Status Update",
      message:
        "Here's your weekly application status update. Check your dashboard for the latest information about your application progress and any required actions.",
      template: "weekly_status_update",
    },
    priority: "low",
    category: "template",
  },
  {
    id: "reminder_007",
    title: "Orientation Program Reminder",
    description: "Remind accepted students about orientation program registration",
    type: "orientation",
    triggerType: "days_before",
    triggerValue: 14,
    targetAudience: "accepted",
    isActive: true,
    createdAt: "2024-01-25T15:30:00Z",
    timesTriggered: 0,
    nextTrigger: "2024-02-15T09:00:00Z",
    conditions: {
      applicationStatus: ["accepted"],
    },
    notification: {
      email: true,
      sms: true,
      inApp: true,
      push: true,
      subject: "Orientation Program Registration - 2 Weeks Left",
      message:
        "Welcome to our university! Don't forget to register for the orientation program. Registration closes in 2 weeks. This program will help you get familiar with campus life and academic requirements.",
      template: "orientation_reminder",
    },
    priority: "medium",
    category: "template",
  },
  {
    id: "reminder_008",
    title: "Scholarship Application Deadline",
    description: "Remind eligible students about scholarship application deadlines",
    type: "deadline",
    triggerType: "days_before",
    triggerValue: 10,
    targetAudience: "students",
    isActive: true,
    createdAt: "2024-01-18T12:15:00Z",
    lastTriggered: "2024-01-28T09:30:00Z",
    timesTriggered: 15,
    nextTrigger: "2024-02-18T09:30:00Z",
    conditions: {
      applicationStatus: ["accepted", "submitted"],
    },
    notification: {
      email: true,
      sms: false,
      inApp: true,
      push: true,
      subject: "Scholarship Application Deadline - 10 Days Left",
      message:
        "Don't miss out on scholarship opportunities! The deadline for scholarship applications is in 10 days. Apply now to secure financial aid for your studies.",
      template: "scholarship_deadline",
    },
    priority: "medium",
    category: "custom",
  },
]

export const getRemindersByType = (type: Reminder["type"]) => {
  return mockReminders.filter((reminder) => reminder.type === type)
}

export const getRemindersByAudience = (audience: Reminder["targetAudience"]) => {
  return mockReminders.filter((reminder) => reminder.targetAudience === audience)
}

export const getActiveReminders = () => {
  return mockReminders.filter((reminder) => reminder.isActive)
}

export const getRemindersByPriority = (priority: Reminder["priority"]) => {
  return mockReminders.filter((reminder) => reminder.priority === priority)
}

export const getRecurringReminders = () => {
  return mockReminders.filter((reminder) => reminder.triggerType === "recurring")
}

export const getTriggeredReminders = () => {
  const now = new Date()
  return mockReminders.filter((reminder) => {
    if (!reminder.isActive) return false
    if (!reminder.nextTrigger) return false
    return new Date(reminder.nextTrigger) <= now
  })
}

export const getRemindersByCategory = (category: Reminder["category"]) => {
  return mockReminders.filter((reminder) => reminder.category === category)
}

export const getReminderStatistics = () => {
  const total = mockReminders.length
  const active = getActiveReminders().length
  const totalTriggered = mockReminders.reduce((sum, reminder) => sum + reminder.timesTriggered, 0)
  const highPriority = getRemindersByPriority("high").length
  const recurring = getRecurringReminders().length

  return {
    total,
    active,
    inactive: total - active,
    totalTriggered,
    highPriority,
    recurring,
    averageTriggered: total > 0 ? totalTriggered / total : 0,
    activePercentage: total > 0 ? (active / total) * 100 : 0,
  }
}

export const getUpcomingReminders = (days = 7) => {
  const now = new Date()
  const futureDate = new Date(now.getTime() + days * 24 * 60 * 60 * 1000)

  return mockReminders.filter((reminder) => {
    if (!reminder.isActive || !reminder.nextTrigger) return false
    const triggerDate = new Date(reminder.nextTrigger)
    return triggerDate >= now && triggerDate <= futureDate
  })
}
