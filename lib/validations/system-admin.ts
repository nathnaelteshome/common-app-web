import { z } from "zod"

// Data Validation Schemas
export const universityDataSchema = z.object({
  name: z.string().min(2, "University name must be at least 2 characters").max(100),
  email: z.string().email("Invalid email format"),
  phone: z.string().regex(/^\+?[1-9]\d{1,14}$/, "Invalid phone number format"),
  address: z.string().min(5, "Address must be at least 5 characters"),
  website: z.string().url("Invalid website URL").optional(),
  establishedYear: z.number().min(1800).max(new Date().getFullYear()),
  accreditationNumber: z.string().min(5, "Accreditation number required"),
  totalStudents: z.number().min(0),
  totalFaculty: z.number().min(0),
  programs: z.array(
    z.object({
      name: z.string().min(2),
      duration: z.number().min(1).max(10),
      tuitionFee: z.number().min(0),
      capacity: z.number().min(1),
    }),
  ),
})

export const paymentTransactionSchema = z.object({
  amount: z.number().positive("Amount must be positive"),
  currency: z.enum(["USD", "EUR", "ETB"]),
  paymentMethod: z.enum(["credit_card", "bank_transfer", "mobile_money"]),
  studentId: z.string().uuid("Invalid student ID"),
  applicationId: z.string().uuid("Invalid application ID"),
  description: z.string().min(5, "Description required"),
})

export const notificationTemplateSchema = z.object({
  name: z.string().min(2, "Template name required"),
  type: z.enum(["email", "sms", "push", "in_app"]),
  category: z.enum(["application", "payment", "system", "reminder", "marketing"]),
  subject: z.string().min(5, "Subject required"),
  content: z.string().min(10, "Content required"),
  variables: z.array(z.string()),
  isActive: z.boolean(),
  targetAudience: z.enum(["students", "universities", "all", "specific"]),
  schedulingOptions: z
    .object({
      immediate: z.boolean(),
      scheduled: z.boolean(),
      recurring: z.boolean(),
      timezone: z.string().optional(),
    })
    .optional(),
})

export const surveySchema = z.object({
  title: z.string().min(5, "Survey title required"),
  description: z.string().min(10, "Description required"),
  type: z.enum(["feedback", "satisfaction", "improvement", "research", "custom"]),
  targetAudience: z.enum(["students", "universities", "all", "specific_program"]),
  questions: z.array(
    z.object({
      id: z.string(),
      type: z.enum(["text", "rating", "multiple_choice", "yes_no", "scale", "matrix"]),
      question: z.string().min(5),
      options: z.array(z.string()).optional(),
      required: z.boolean(),
      validation: z
        .object({
          minLength: z.number().optional(),
          maxLength: z.number().optional(),
          pattern: z.string().optional(),
        })
        .optional(),
    }),
  ),
  settings: z.object({
    anonymous: z.boolean(),
    allowMultipleResponses: z.boolean(),
    showProgress: z.boolean(),
    randomizeQuestions: z.boolean(),
    expiresAt: z.string().optional(),
  }),
})

export const userAccountSchema = z.object({
  email: z.string().email("Invalid email format"),
  role: z.enum(["student", "university", "admin"]),
  permissions: z.array(z.string()),
  profile: z.object({
    firstName: z.string().min(2),
    lastName: z.string().min(2),
    phone: z.string().optional(),
    department: z.string().optional(),
    position: z.string().optional(),
  }),
  securitySettings: z.object({
    twoFactorEnabled: z.boolean(),
    passwordLastChanged: z.string(),
    lastLoginAt: z.string().optional(),
    failedLoginAttempts: z.number().min(0).max(10),
    accountLocked: z.boolean(),
  }),
})

export type UniversityData = z.infer<typeof universityDataSchema>
export type PaymentTransaction = z.infer<typeof paymentTransactionSchema>
export type NotificationTemplate = z.infer<typeof notificationTemplateSchema>
export type Survey = z.infer<typeof surveySchema>
export type UserAccount = z.infer<typeof userAccountSchema>
