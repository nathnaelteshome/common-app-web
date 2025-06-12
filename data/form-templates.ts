export interface FormTemplate {
  id: string
  name: string
  description: string
  category: string
  type: string
  thumbnail?: string
  isDefault: boolean
  usageCount: number
  rating: number
  tags: string[]
  fields: FormField[]
  settings: {
    allowDuplicates: boolean
    requiresApproval: boolean
    autoSave: boolean
    showProgress: boolean
    customStyling?: {
      primaryColor?: string
      backgroundColor?: string
      fontFamily?: string
    }
  }
  createdAt: string
  updatedAt: string
  createdBy: string
  version: string
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
  helpText?: string
  defaultValue?: string
}

// Mock form templates
export const mockFormTemplates: FormTemplate[] = [
  {
    id: "template_1",
    name: "Basic Undergraduate Application",
    description: "Standard undergraduate application form with essential fields",
    category: "undergraduate",
    type: "application",
    thumbnail: "/placeholder.svg?height=200&width=300&query=undergraduate application form",
    isDefault: true,
    usageCount: 1247,
    rating: 4.8,
    tags: ["undergraduate", "basic", "standard"],
    fields: [
      {
        id: "field_1",
        type: "text",
        label: "Full Name",
        placeholder: "Enter your full legal name",
        required: true,
        helpText: "Please enter your name as it appears on official documents",
      },
      {
        id: "field_2",
        type: "email",
        label: "Email Address",
        placeholder: "your.email@example.com",
        required: true,
        validation: {
          pattern: "^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$",
        },
      },
      {
        id: "field_3",
        type: "phone",
        label: "Phone Number",
        placeholder: "+1 (555) 123-4567",
        required: true,
      },
      {
        id: "field_4",
        type: "date",
        label: "Date of Birth",
        required: true,
      },
      {
        id: "field_5",
        type: "select",
        label: "Preferred Program",
        required: true,
        options: ["Computer Science", "Engineering", "Business Administration", "Medicine", "Law"],
      },
      {
        id: "field_6",
        type: "number",
        label: "High School GPA",
        placeholder: "3.5",
        required: true,
        validation: {
          min: 0,
          max: 4,
        },
      },
      {
        id: "field_7",
        type: "file",
        label: "Academic Transcripts",
        required: true,
        helpText: "Upload official transcripts from your high school",
      },
      {
        id: "field_8",
        type: "textarea",
        label: "Personal Statement",
        placeholder: "Tell us about yourself and why you want to study here...",
        required: true,
        validation: {
          minLength: 250,
          maxLength: 1000,
        },
      },
    ],
    settings: {
      allowDuplicates: false,
      requiresApproval: true,
      autoSave: true,
      showProgress: true,
    },
    createdAt: "2024-01-01T00:00:00Z",
    updatedAt: "2024-01-15T10:00:00Z",
    createdBy: "system",
    version: "1.2",
  },
  {
    id: "template_2",
    name: "Graduate School Application",
    description: "Comprehensive application form for graduate and postgraduate programs",
    category: "graduate",
    type: "application",
    thumbnail: "/placeholder.svg?height=200&width=300&query=graduate school application form",
    isDefault: true,
    usageCount: 543,
    rating: 4.9,
    tags: ["graduate", "masters", "phd", "research"],
    fields: [
      {
        id: "field_9",
        type: "text",
        label: "Full Name",
        required: true,
      },
      {
        id: "field_10",
        type: "email",
        label: "Email Address",
        required: true,
      },
      {
        id: "field_11",
        type: "select",
        label: "Degree Level",
        required: true,
        options: ["Master's Degree", "Doctoral Degree", "Professional Doctorate", "Certificate Program"],
      },
      {
        id: "field_12",
        type: "select",
        label: "Field of Study",
        required: true,
        options: ["Computer Science", "Engineering", "Business", "Medicine", "Law", "Education", "Arts & Sciences"],
      },
      {
        id: "field_13",
        type: "file",
        label: "Undergraduate Transcripts",
        required: true,
      },
      {
        id: "field_14",
        type: "file",
        label: "Letters of Recommendation",
        required: true,
        helpText: "Upload 2-3 letters of recommendation",
      },
      {
        id: "field_15",
        type: "textarea",
        label: "Research Proposal",
        required: true,
        validation: {
          minLength: 500,
          maxLength: 2000,
        },
        helpText: "Describe your proposed research area and methodology",
      },
      {
        id: "field_16",
        type: "textarea",
        label: "Statement of Purpose",
        required: true,
        validation: {
          minLength: 300,
          maxLength: 1500,
        },
      },
    ],
    settings: {
      allowDuplicates: false,
      requiresApproval: true,
      autoSave: true,
      showProgress: true,
    },
    createdAt: "2024-01-01T00:00:00Z",
    updatedAt: "2024-01-10T09:00:00Z",
    createdBy: "system",
    version: "1.1",
  },
  {
    id: "template_3",
    name: "International Student Application",
    description: "Specialized form for international students with visa and language requirements",
    category: "international",
    type: "application",
    thumbnail: "/placeholder.svg?height=200&width=300&query=international student application form",
    isDefault: true,
    usageCount: 892,
    rating: 4.7,
    tags: ["international", "visa", "language", "toefl", "ielts"],
    fields: [
      {
        id: "field_17",
        type: "text",
        label: "Full Name",
        required: true,
      },
      {
        id: "field_18",
        type: "email",
        label: "Email Address",
        required: true,
      },
      {
        id: "field_19",
        type: "select",
        label: "Country of Citizenship",
        required: true,
        options: [
          "United States",
          "Canada",
          "United Kingdom",
          "Australia",
          "Germany",
          "France",
          "Japan",
          "China",
          "India",
          "Other",
        ],
      },
      {
        id: "field_20",
        type: "text",
        label: "Passport Number",
        required: true,
      },
      {
        id: "field_21",
        type: "file",
        label: "Passport Copy",
        required: true,
      },
      {
        id: "field_22",
        type: "select",
        label: "English Proficiency Test",
        required: true,
        options: ["TOEFL", "IELTS", "PTE Academic", "Duolingo English Test", "Native Speaker"],
      },
      {
        id: "field_23",
        type: "number",
        label: "Test Score",
        required: true,
        conditionalLogic: [
          {
            action: "show",
            conditions: [
              {
                field: "field_22",
                operator: "not_equals",
                value: "Native Speaker",
              },
            ],
            logic: "and",
          },
        ],
      },
      {
        id: "field_24",
        type: "file",
        label: "Test Score Report",
        required: true,
        conditionalLogic: [
          {
            action: "show",
            conditions: [
              {
                field: "field_22",
                operator: "not_equals",
                value: "Native Speaker",
              },
            ],
            logic: "and",
          },
        ],
      },
      {
        id: "field_25",
        type: "file",
        label: "Financial Support Documentation",
        required: true,
        helpText: "Bank statements or sponsor letters showing financial capability",
      },
    ],
    settings: {
      allowDuplicates: false,
      requiresApproval: true,
      autoSave: true,
      showProgress: true,
    },
    createdAt: "2024-01-01T00:00:00Z",
    updatedAt: "2024-01-25T11:00:00Z",
    createdBy: "system",
    version: "1.0",
  },
  {
    id: "template_4",
    name: "Scholarship Application",
    description: "Merit-based scholarship application with financial need assessment",
    category: "scholarship",
    type: "application",
    thumbnail: "/placeholder.svg?height=200&width=300&query=scholarship application form",
    isDefault: true,
    usageCount: 1156,
    rating: 4.6,
    tags: ["scholarship", "financial-aid", "merit", "need-based"],
    fields: [
      {
        id: "field_26",
        type: "text",
        label: "Full Name",
        required: true,
      },
      {
        id: "field_27",
        type: "email",
        label: "Email Address",
        required: true,
      },
      {
        id: "field_28",
        type: "text",
        label: "Student ID",
        required: true,
        helpText: "Your university student identification number",
      },
      {
        id: "field_29",
        type: "select",
        label: "Academic Year",
        required: true,
        options: ["Freshman", "Sophomore", "Junior", "Senior", "Graduate Student"],
      },
      {
        id: "field_30",
        type: "number",
        label: "Current GPA",
        required: true,
        validation: {
          min: 0,
          max: 4,
        },
      },
      {
        id: "field_31",
        type: "number",
        label: "Annual Family Income",
        required: true,
        helpText: "Total household income before taxes",
      },
      {
        id: "field_32",
        type: "textarea",
        label: "Financial Need Statement",
        required: true,
        validation: {
          minLength: 200,
          maxLength: 800,
        },
        helpText: "Explain your financial circumstances and need for assistance",
      },
      {
        id: "field_33",
        type: "textarea",
        label: "Academic Achievements",
        required: true,
        validation: {
          minLength: 150,
          maxLength: 600,
        },
      },
      {
        id: "field_34",
        type: "file",
        label: "Supporting Documents",
        required: false,
        helpText: "Tax returns, award certificates, or other relevant documents",
      },
    ],
    settings: {
      allowDuplicates: true,
      requiresApproval: true,
      autoSave: true,
      showProgress: true,
    },
    createdAt: "2024-01-01T00:00:00Z",
    updatedAt: "2024-01-20T14:30:00Z",
    createdBy: "system",
    version: "1.3",
  },
  {
    id: "template_5",
    name: "Transfer Student Application",
    description: "Application form for students transferring from other institutions",
    category: "transfer",
    type: "application",
    thumbnail: "/placeholder.svg?height=200&width=300&query=transfer student application form",
    isDefault: true,
    usageCount: 678,
    rating: 4.5,
    tags: ["transfer", "credit-transfer", "previous-institution"],
    fields: [
      {
        id: "field_35",
        type: "text",
        label: "Full Name",
        required: true,
      },
      {
        id: "field_36",
        type: "email",
        label: "Email Address",
        required: true,
      },
      {
        id: "field_37",
        type: "text",
        label: "Previous Institution",
        required: true,
        helpText: "Name of the college/university you are transferring from",
      },
      {
        id: "field_38",
        type: "number",
        label: "Credits Completed",
        required: true,
        helpText: "Total number of credit hours completed",
      },
      {
        id: "field_39",
        type: "number",
        label: "Current GPA",
        required: true,
        validation: {
          min: 0,
          max: 4,
        },
      },
      {
        id: "field_40",
        type: "textarea",
        label: "Reason for Transfer",
        required: true,
        validation: {
          minLength: 100,
          maxLength: 500,
        },
      },
      {
        id: "field_41",
        type: "file",
        label: "Official Transcripts",
        required: true,
        helpText: "Transcripts from all previously attended institutions",
      },
      {
        id: "field_42",
        type: "file",
        label: "Course Descriptions",
        required: false,
        helpText: "Detailed course descriptions for credit evaluation",
      },
    ],
    settings: {
      allowDuplicates: false,
      requiresApproval: true,
      autoSave: true,
      showProgress: true,
    },
    createdAt: "2024-01-01T00:00:00Z",
    updatedAt: "2024-01-18T16:45:00Z",
    createdBy: "system",
    version: "1.0",
  },
]

export const templateCategories = [
  { id: "all", name: "All Templates", count: mockFormTemplates.length },
  {
    id: "undergraduate",
    name: "Undergraduate",
    count: mockFormTemplates.filter((t) => t.category === "undergraduate").length,
  },
  { id: "graduate", name: "Graduate", count: mockFormTemplates.filter((t) => t.category === "graduate").length },
  {
    id: "international",
    name: "International",
    count: mockFormTemplates.filter((t) => t.category === "international").length,
  },
  {
    id: "scholarship",
    name: "Scholarship",
    count: mockFormTemplates.filter((t) => t.category === "scholarship").length,
  },
  { id: "transfer", name: "Transfer", count: mockFormTemplates.filter((t) => t.category === "transfer").length },
]
