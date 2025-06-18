export interface SurveyQuestion {
  id: string
  type: "text" | "rating" | "multiple_choice" | "yes_no" | "scale" | "textarea"
  question: string
  options?: string[]
  required: boolean
  order: number
}

export interface Survey {
  id: string
  title: string
  description: string
  type: "feedback" | "satisfaction" | "improvement" | "custom" | "exit" | "onboarding"
  status: "draft" | "active" | "completed" | "archived"
  targetAudience: "students" | "applicants" | "accepted" | "staff" | "all"
  questions: SurveyQuestion[]
  responses: number
  completionRate: number
  createdAt: string
  publishedAt?: string
  expiresAt?: string
  createdBy: string
  settings: {
    anonymous: boolean
    allowMultipleResponses: boolean
    showResults: boolean
    requireLogin: boolean
  }
}

export interface SurveyResponse {
  id: string
  surveyId: string
  respondentId?: string
  respondentType: "student" | "applicant" | "staff" | "anonymous"
  responses: Record<string, any>
  submittedAt: string
  completionTime: number
  source: "email" | "web" | "mobile" | "direct"
  ipAddress?: string
  userAgent?: string
}

export interface SurveyAnalytics {
  surveyId: string
  surveyTitle: string
  totalResponses: number
  completionRate: number
  averageRating: number
  averageCompletionTime: number
  responsesByDate: Array<{ date: string; responses: number }>
  responsesBySource: Array<{ source: string; count: number; percentage: number }>
  responsesByAudience: Array<{ audience: string; count: number; percentage: number }>
  questionAnalytics: Array<{
    questionId: string
    question: string
    type: string
    responses: number
    averageRating?: number
    optionBreakdown?: Array<{ option: string; count: number; percentage: number }>
    sentiment?: "positive" | "neutral" | "negative"
    textResponses?: string[]
    statistics?: {
      mean?: number
      median?: number
      mode?: number
      standardDeviation?: number
    }
  }>
  insights: Array<{
    type: "improvement" | "strength" | "concern" | "trend" | "recommendation"
    title: string
    description: string
    impact: "high" | "medium" | "low"
    actionable: boolean
    priority: number
    category: string
    relatedQuestions: string[]
  }>
  trends: Array<{
    metric: string
    direction: "up" | "down" | "stable"
    change: number
    period: string
    significance: "high" | "medium" | "low"
  }>
}

export const mockSurveys: Survey[] = [
  {
    id: "survey_001",
    title: "University Application Experience Survey",
    description: "Help us improve the application process by sharing your experience",
    type: "feedback",
    status: "active",
    targetAudience: "applicants",
    questions: [
      {
        id: "q1",
        type: "rating",
        question: "How would you rate your overall application experience?",
        required: true,
        order: 1,
      },
      {
        id: "q2",
        type: "multiple_choice",
        question: "Which part of the application process was most challenging?",
        options: ["Document Upload", "Form Filling", "Payment Process", "University Selection", "None"],
        required: true,
        order: 2,
      },
      {
        id: "q3",
        type: "scale",
        question: "How easy was it to navigate our application portal? (1-10)",
        required: true,
        order: 3,
      },
      {
        id: "q4",
        type: "textarea",
        question: "What improvements would you suggest for our application process?",
        required: false,
        order: 4,
      },
      {
        id: "q5",
        type: "yes_no",
        question: "Would you recommend our university to a friend?",
        required: true,
        order: 5,
      },
    ],
    responses: 245,
    completionRate: 87.3,
    createdAt: "2024-01-15T10:00:00Z",
    publishedAt: "2024-01-16T09:00:00Z",
    expiresAt: "2024-03-15T23:59:59Z",
    createdBy: "admin_001",
    settings: {
      anonymous: false,
      allowMultipleResponses: false,
      showResults: true,
      requireLogin: true,
    },
  },
  {
    id: "survey_002",
    title: "Student Satisfaction Survey",
    description: "Annual survey to measure student satisfaction with university services",
    type: "satisfaction",
    status: "active",
    targetAudience: "students",
    questions: [
      {
        id: "q6",
        type: "rating",
        question: "How satisfied are you with the quality of education?",
        required: true,
        order: 1,
      },
      {
        id: "q7",
        type: "rating",
        question: "How satisfied are you with campus facilities?",
        required: true,
        order: 2,
      },
      {
        id: "q8",
        type: "multiple_choice",
        question: "Which service needs the most improvement?",
        options: ["Library", "Cafeteria", "IT Support", "Student Services", "Transportation"],
        required: true,
        order: 3,
      },
    ],
    responses: 156,
    completionRate: 92.1,
    createdAt: "2024-01-10T14:30:00Z",
    publishedAt: "2024-01-12T08:00:00Z",
    createdBy: "admin_002",
    settings: {
      anonymous: true,
      allowMultipleResponses: false,
      showResults: false,
      requireLogin: false,
    },
  },
]

export const mockSurveyResponses: SurveyResponse[] = [
  {
    id: "response_001",
    surveyId: "survey_001",
    respondentId: "student_001",
    respondentType: "applicant",
    responses: {
      q1: 4,
      q2: "Document Upload",
      q3: 7,
      q4: "The document upload process could be more intuitive. Maybe add drag-and-drop functionality.",
      q5: "yes",
    },
    submittedAt: "2024-01-22T16:30:00Z",
    completionTime: 180,
    source: "web",
    ipAddress: "192.168.1.100",
    userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
  },
  {
    id: "response_002",
    surveyId: "survey_001",
    respondentId: "student_002",
    respondentType: "applicant",
    responses: {
      q1: 5,
      q2: "None",
      q3: 9,
      q4: "The process was smooth and well-organized. Great job!",
      q5: "yes",
    },
    submittedAt: "2024-01-23T14:15:00Z",
    completionTime: 145,
    source: "mobile",
  },
]

export const mockSurveyAnalytics: SurveyAnalytics[] = [
  {
    surveyId: "survey_001",
    surveyTitle: "University Application Experience Survey",
    totalResponses: 245,
    completionRate: 87.3,
    averageRating: 4.2,
    averageCompletionTime: 165,
    responsesByDate: [
      { date: "2024-01-16", responses: 12 },
      { date: "2024-01-17", responses: 18 },
      { date: "2024-01-18", responses: 15 },
      { date: "2024-01-19", responses: 22 },
      { date: "2024-01-20", responses: 28 },
      { date: "2024-01-21", responses: 19 },
      { date: "2024-01-22", responses: 25 },
      { date: "2024-01-23", responses: 31 },
      { date: "2024-01-24", responses: 27 },
      { date: "2024-01-25", responses: 23 },
      { date: "2024-01-26", responses: 35 },
      { date: "2024-01-27", responses: 30 },
    ],
    responsesBySource: [
      { source: "web", count: 156, percentage: 63.7 },
      { source: "mobile", count: 67, percentage: 27.3 },
      { source: "email", count: 22, percentage: 9.0 },
    ],
    responsesByAudience: [
      { audience: "applicants", count: 189, percentage: 77.1 },
      { audience: "students", count: 56, percentage: 22.9 },
    ],
    questionAnalytics: [
      {
        questionId: "q1",
        question: "How would you rate your overall application experience?",
        type: "rating",
        responses: 245,
        averageRating: 4.2,
        optionBreakdown: [
          { option: "5 stars", count: 98, percentage: 40.0 },
          { option: "4 stars", count: 73, percentage: 29.8 },
          { option: "3 stars", count: 49, percentage: 20.0 },
          { option: "2 stars", count: 17, percentage: 6.9 },
          { option: "1 star", count: 8, percentage: 3.3 },
        ],
        sentiment: "positive",
        statistics: {
          mean: 4.2,
          median: 4,
          mode: 5,
          standardDeviation: 1.1,
        },
      },
      {
        questionId: "q2",
        question: "Which part of the application process was most challenging?",
        type: "multiple_choice",
        responses: 245,
        optionBreakdown: [
          { option: "Document Upload", count: 89, percentage: 36.3 },
          { option: "Form Filling", count: 67, percentage: 27.3 },
          { option: "Payment Process", count: 45, percentage: 18.4 },
          { option: "University Selection", count: 32, percentage: 13.1 },
          { option: "None", count: 12, percentage: 4.9 },
        ],
        sentiment: "neutral",
      },
      {
        questionId: "q3",
        question: "How easy was it to navigate our application portal? (1-10)",
        type: "scale",
        responses: 245,
        averageRating: 7.8,
        sentiment: "positive",
        statistics: {
          mean: 7.8,
          median: 8,
          mode: 8,
          standardDeviation: 1.5,
        },
      },
      {
        questionId: "q4",
        question: "What improvements would you suggest for our application process?",
        type: "textarea",
        responses: 187,
        textResponses: [
          "Add drag-and-drop for document upload",
          "Better mobile experience needed",
          "More clear instructions for requirements",
          "Faster payment processing",
          "Email notifications for status updates",
        ],
        sentiment: "neutral",
      },
      {
        questionId: "q5",
        question: "Would you recommend our university to a friend?",
        type: "yes_no",
        responses: 245,
        optionBreakdown: [
          { option: "Yes", count: 201, percentage: 82.0 },
          { option: "No", count: 44, percentage: 18.0 },
        ],
        sentiment: "positive",
      },
    ],
    insights: [
      {
        type: "improvement",
        title: "Document Upload Process Needs Enhancement",
        description:
          "36% of users found document upload most challenging. Consider implementing drag-and-drop functionality and better file format support.",
        impact: "high",
        actionable: true,
        priority: 1,
        category: "User Experience",
        relatedQuestions: ["q2", "q4"],
      },
      {
        type: "strength",
        title: "High Overall Satisfaction Rate",
        description:
          "70% of users rated their experience 4-5 stars, indicating strong overall satisfaction with the application process.",
        impact: "high",
        actionable: false,
        priority: 2,
        category: "Performance",
        relatedQuestions: ["q1", "q5"],
      },
      {
        type: "trend",
        title: "Increasing Response Rate",
        description:
          "Survey responses have increased by 15% over the past week, showing growing engagement and participation.",
        impact: "medium",
        actionable: false,
        priority: 3,
        category: "Engagement",
        relatedQuestions: [],
      },
      {
        type: "recommendation",
        title: "Mobile Experience Optimization",
        description:
          "27% of responses came from mobile devices. Focus on mobile optimization to improve user experience for this growing segment.",
        impact: "medium",
        actionable: true,
        priority: 4,
        category: "Technology",
        relatedQuestions: ["q3", "q4"],
      },
      {
        type: "concern",
        title: "Payment Process Friction",
        description:
          "18% of users found payment process challenging. This could be causing application abandonment and needs immediate attention.",
        impact: "medium",
        actionable: true,
        priority: 5,
        category: "Payment",
        relatedQuestions: ["q2"],
      },
    ],
    trends: [
      {
        metric: "Response Rate",
        direction: "up",
        change: 15.2,
        period: "Last 7 days",
        significance: "medium",
      },
      {
        metric: "Completion Rate",
        direction: "up",
        change: 3.8,
        period: "Last 30 days",
        significance: "low",
      },
      {
        metric: "Average Rating",
        direction: "stable",
        change: 0.1,
        period: "Last 30 days",
        significance: "low",
      },
      {
        metric: "Mobile Usage",
        direction: "up",
        change: 8.5,
        period: "Last 30 days",
        significance: "high",
      },
    ],
  },
]

export const getSurveysByStatus = (status: Survey["status"]) => {
  return mockSurveys.filter((survey) => survey.status === status)
}

export const getSurveysByType = (type: Survey["type"]) => {
  return mockSurveys.filter((survey) => survey.type === type)
}

export const getSurveysByAudience = (audience: Survey["targetAudience"]) => {
  return mockSurveys.filter((survey) => survey.targetAudience === audience || survey.targetAudience === "all")
}

export const getActiveSurveys = () => {
  const now = new Date()
  return mockSurveys.filter((survey) => {
    if (survey.status !== "active") return false
    if (survey.expiresAt && new Date(survey.expiresAt) < now) return false
    return true
  })
}

export const getSurveyResponsesBySurvey = (surveyId: string) => {
  return mockSurveyResponses.filter((response) => response.surveyId === surveyId)
}

export const getSurveyAnalyticsBySurvey = (surveyId: string) => {
  return mockSurveyAnalytics.find((analytics) => analytics.surveyId === surveyId)
}

export const getSurveyStatistics = () => {
  const totalSurveys = mockSurveys.length
  const activeSurveys = getSurveysByStatus("active").length
  const totalResponses = mockSurveys.reduce((sum, survey) => sum + survey.responses, 0)
  const averageCompletionRate = mockSurveys.reduce((sum, survey) => sum + survey.completionRate, 0) / totalSurveys
  const totalInsights = mockSurveyAnalytics.reduce((sum, analytics) => sum + analytics.insights.length, 0)

  return {
    totalSurveys,
    activeSurveys,
    completedSurveys: getSurveysByStatus("completed").length,
    draftSurveys: getSurveysByStatus("draft").length,
    totalResponses,
    averageCompletionRate,
    totalInsights,
    averageResponsesPerSurvey: totalSurveys > 0 ? totalResponses / totalSurveys : 0,
  }
}

export const getTopInsights = (limit = 5) => {
  const allInsights = mockSurveyAnalytics.flatMap((analytics) =>
    analytics.insights.map((insight) => ({
      ...insight,
      surveyTitle: analytics.surveyTitle,
      surveyId: analytics.surveyId,
    })),
  )

  return allInsights.sort((a, b) => a.priority - b.priority).slice(0, limit)
}

export const getActionableInsights = () => {
  const allInsights = mockSurveyAnalytics.flatMap((analytics) =>
    analytics.insights.map((insight) => ({
      ...insight,
      surveyTitle: analytics.surveyTitle,
      surveyId: analytics.surveyId,
    })),
  )

  return allInsights.filter((insight) => insight.actionable)
}
