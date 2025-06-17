export interface Announcement {
  id: string
  title: string
  content: string
  type: "general" | "urgent" | "deadline" | "event" | "maintenance" | "celebration"
  targetAudience: "all" | "students" | "applicants" | "accepted" | "staff" | "specific"
  status: "draft" | "published" | "scheduled" | "archived"
  publishDate: string
  expiryDate?: string
  createdAt: string
  createdBy: string
  views: number
  attachments?: {
    id: string
    name: string
    url: string
    type: string
    size: number
  }[]
  isPinned: boolean
  allowComments: boolean
  sendNotification: boolean
  priority: "low" | "medium" | "high"
  tags: string[]
  programIds?: string[]
  universityIds?: string[]
  comments?: {
    id: string
    userId: string
    userName: string
    content: string
    createdAt: string
    replies?: {
      id: string
      userId: string
      userName: string
      content: string
      createdAt: string
    }[]
  }[]
}

export const mockAnnouncements: Announcement[] = [
  {
    id: "ann_001",
    title: "Application Deadline Extended for Fall 2024",
    content: `We are pleased to announce that the application deadline for Fall 2024 admission has been extended to March 15, 2024. 

This extension provides prospective students with additional time to:
• Complete their application forms
• Gather required documents
• Prepare for entrance examinations
• Submit scholarship applications

We encourage all interested students to take advantage of this opportunity. Please note that this is a final extension and no further deadline changes will be made.

For any questions regarding the application process, please contact our admissions office.`,
    type: "deadline",
    targetAudience: "all",
    status: "published",
    publishDate: "2024-01-20T10:00:00Z",
    expiryDate: "2024-03-15T23:59:59Z",
    createdAt: "2024-01-20T09:30:00Z",
    createdBy: "admin_001",
    views: 1250,
    isPinned: true,
    allowComments: true,
    sendNotification: true,
    priority: "high",
    tags: ["deadline", "applications", "fall-2024", "extension"],
    attachments: [
      {
        id: "att_001",
        name: "Updated Application Timeline.pdf",
        url: "/documents/timeline.pdf",
        type: "pdf",
        size: 245760,
      },
    ],
    comments: [
      {
        id: "comment_001",
        userId: "student_001",
        userName: "Abebe Kebede",
        content: "Thank you for the extension! This gives me time to improve my personal statement.",
        createdAt: "2024-01-20T11:30:00Z",
        replies: [
          {
            id: "reply_001",
            userId: "admin_001",
            userName: "Admissions Office",
            content: "You're welcome! We're here to help if you need any guidance.",
            createdAt: "2024-01-20T14:15:00Z",
          },
        ],
      },
    ],
  },
  {
    id: "ann_002",
    title: "New Merit-Based Scholarship Program Launched",
    content: `We are excited to introduce our new Academic Excellence Scholarship program for outstanding students.

**Scholarship Details:**
• Award Amount: Up to $10,000 per academic year
• Duration: Renewable for up to 4 years
• Eligibility: Minimum GPA of 3.7 and demonstrated leadership
• Application Deadline: February 28, 2024

**Selection Criteria:**
• Academic performance (40%)
• Leadership experience (25%)
• Community service (20%)
• Financial need (15%)

Applications are now open through our scholarship portal. Don't miss this opportunity to fund your education!`,
    type: "general",
    targetAudience: "students",
    status: "published",
    publishDate: "2024-01-18T14:00:00Z",
    createdAt: "2024-01-18T13:45:00Z",
    createdBy: "admin_002",
    views: 890,
    isPinned: false,
    allowComments: true,
    sendNotification: true,
    priority: "medium",
    tags: ["scholarship", "financial-aid", "merit", "academic-excellence"],
    attachments: [
      {
        id: "att_002",
        name: "Scholarship Application Form.pdf",
        url: "/documents/scholarship-form.pdf",
        type: "pdf",
        size: 156432,
      },
      {
        id: "att_003",
        name: "Scholarship Guidelines.docx",
        url: "/documents/scholarship-guidelines.docx",
        type: "docx",
        size: 89234,
      },
    ],
  },
  {
    id: "ann_003",
    title: "Virtual Campus Tour and Information Session",
    content: `Join us for an exclusive virtual campus tour and information session!

**Event Details:**
• Date: February 10, 2024
• Time: 2:00 PM - 4:00 PM EAT
• Platform: Zoom (link will be provided upon registration)

**What to Expect:**
• Live virtual tour of our campus facilities
• Information about academic programs
• Q&A session with faculty and current students
• Admissions process overview
• Financial aid information

Registration is required. Limited spots available!`,
    type: "event",
    targetAudience: "applicants",
    status: "published",
    publishDate: "2024-01-25T09:00:00Z",
    expiryDate: "2024-02-10T18:00:00Z",
    createdAt: "2024-01-25T08:30:00Z",
    createdBy: "admin_003",
    views: 567,
    isPinned: true,
    allowComments: true,
    sendNotification: true,
    priority: "medium",
    tags: ["event", "virtual-tour", "information-session", "campus"],
  },
  {
    id: "ann_004",
    title: "System Maintenance Scheduled",
    content: `Our application portal will undergo scheduled maintenance to improve performance and add new features.

**Maintenance Window:**
• Date: February 5, 2024
• Time: 2:00 AM - 6:00 AM EAT
• Duration: Approximately 4 hours

**Services Affected:**
• Application submission portal
• Document upload system
• Payment processing
• Student dashboard

**What to Expect:**
• Improved loading speeds
• Enhanced security features
• New document preview functionality
• Better mobile experience

We apologize for any inconvenience and appreciate your patience.`,
    type: "maintenance",
    targetAudience: "all",
    status: "published",
    publishDate: "2024-01-30T16:00:00Z",
    expiryDate: "2024-02-05T10:00:00Z",
    createdAt: "2024-01-30T15:45:00Z",
    createdBy: "admin_004",
    views: 234,
    isPinned: false,
    allowComments: false,
    sendNotification: true,
    priority: "low",
    tags: ["maintenance", "system-update", "portal"],
  },
  {
    id: "ann_005",
    title: "Congratulations to Our New Graduates!",
    content: `We are proud to celebrate the achievements of our Class of 2024 graduates!

**Graduation Highlights:**
• 1,250 students graduated across all programs
• 95% job placement rate within 6 months
• Average starting salary increased by 12%
• 15% pursuing advanced degrees

**Notable Achievements:**
• 50 students graduated with highest honors
• 25 students received industry recognition
• 10 students started their own businesses
• 5 students received international scholarships

We wish all our graduates success in their future endeavors!`,
    type: "celebration",
    targetAudience: "all",
    status: "published",
    publishDate: "2024-01-28T12:00:00Z",
    createdAt: "2024-01-28T11:30:00Z",
    createdBy: "admin_005",
    views: 445,
    isPinned: false,
    allowComments: true,
    sendNotification: false,
    priority: "low",
    tags: ["graduation", "celebration", "achievements", "class-2024"],
  },
  {
    id: "ann_006",
    title: "URGENT: Document Verification Deadline",
    content: `IMPORTANT NOTICE: All submitted documents must be verified by February 20, 2024.

**Action Required:**
• Check your application status
• Respond to any verification requests
• Submit missing documents immediately
• Contact admissions if you have questions

**Consequences of Missing Deadline:**
• Application may be marked incomplete
• Admission decision may be delayed
• May affect scholarship eligibility

Please act immediately to avoid any complications with your application.`,
    type: "urgent",
    targetAudience: "applicants",
    status: "published",
    publishDate: "2024-02-01T08:00:00Z",
    expiryDate: "2024-02-20T23:59:59Z",
    createdAt: "2024-02-01T07:45:00Z",
    createdBy: "admin_001",
    views: 789,
    isPinned: true,
    allowComments: false,
    sendNotification: true,
    priority: "high",
    tags: ["urgent", "documents", "verification", "deadline"],
  },
]

export const getAnnouncementsByType = (type: Announcement["type"]) => {
  return mockAnnouncements.filter((ann) => ann.type === type)
}

export const getAnnouncementsByStatus = (status: Announcement["status"]) => {
  return mockAnnouncements.filter((ann) => ann.status === status)
}

export const getAnnouncementsByAudience = (audience: Announcement["targetAudience"]) => {
  return mockAnnouncements.filter((ann) => ann.targetAudience === audience || ann.targetAudience === "all")
}

export const getPinnedAnnouncements = () => {
  return mockAnnouncements.filter((ann) => ann.isPinned && ann.status === "published")
}

export const getActiveAnnouncements = () => {
  const now = new Date()
  return mockAnnouncements.filter((ann) => {
    if (ann.status !== "published") return false
    if (ann.expiryDate && new Date(ann.expiryDate) < now) return false
    return true
  })
}

export const getAnnouncementsByPriority = (priority: Announcement["priority"]) => {
  return mockAnnouncements.filter((ann) => ann.priority === priority)
}

export const getAnnouncementsWithComments = () => {
  return mockAnnouncements.filter((ann) => ann.allowComments && ann.comments && ann.comments.length > 0)
}

export const getAnnouncementStatistics = () => {
  const total = mockAnnouncements.length
  const published = getAnnouncementsByStatus("published").length
  const draft = getAnnouncementsByStatus("draft").length
  const scheduled = getAnnouncementsByStatus("scheduled").length
  const totalViews = mockAnnouncements.reduce((sum, ann) => sum + ann.views, 0)
  const totalComments = mockAnnouncements.reduce((sum, ann) => sum + (ann.comments?.length || 0), 0)

  return {
    total,
    published,
    draft,
    scheduled,
    totalViews,
    totalComments,
    averageViews: total > 0 ? totalViews / total : 0,
    engagementRate: totalViews > 0 ? (totalComments / totalViews) * 100 : 0,
  }
}
