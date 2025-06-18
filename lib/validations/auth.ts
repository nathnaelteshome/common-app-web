import { z } from "zod"

// Base user schema for common fields
const baseUserSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
      "Password must contain at least one uppercase letter, one lowercase letter, and one number",
    ),
  confirmPassword: z.string(),
})

// Student registration schema
export const studentRegistrationSchema = z
  .object({
    firstName: z.string().min(2, "First name must be at least 2 characters"),
    lastName: z.string().min(2, "Last name must be at least 2 characters"),
    username: z
      .string()
      .min(3, "Username must be at least 3 characters")
      .regex(/^[a-zA-Z0-9_]+$/, "Username can only contain letters, numbers, and underscores"),
    email: z.string().email("Please enter a valid email address"),
    phoneNumber: z.string().regex(/^\+?[1-9]\d{1,14}$/, "Please enter a valid phone number"),
    dateOfBirth: z.string().regex(/^\d{2}\/\d{2}\/\d{4}$/, "Date must be in MM/DD/YYYY format"),
    password: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
        "Password must contain at least one uppercase letter, one lowercase letter, and one number",
      ),
    confirmPassword: z.string(),
    role: z.literal("student"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  })

// University registration schema
export const universityRegistrationSchema = z
  .object({
    email: z.string().email("Please enter a valid email address"),
    password: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
        "Password must contain at least one uppercase letter, one lowercase letter, and one number",
      ),
    confirmPassword: z.string(),
    collegeName: z.string().min(2, "College name must be at least 2 characters"),
    address1: z.string().min(5, "Address is required"),
    address2: z.string().optional(),
    country: z.string().min(1, "Please select a country"),
    city: z.string().min(2, "City is required"),
    postcode: z.string().min(3, "Postcode is required"),
    phone1: z.string().regex(/^\+?[1-9]\d{1,14}$/, "Please enter a valid phone number"),
    phone2: z
      .string()
      .regex(/^\+?[1-9]\d{1,14}$/, "Please enter a valid phone number")
      .optional()
      .or(z.literal("")),
    documents: z.string().min(1, "Please select document type"),
    fieldOfStudies: z.string().min(1, "Please select field of studies"),
    campusImage: z.string().optional(),
    role: z.literal("university"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  })

// Sign in schema
export const signInSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(1, "Password is required"),
})

// Email verification schema
export const emailVerificationSchema = z.object({
  verificationCode: z.string().length(6, "Verification code must be 6 digits"),
})

// Password reset schema
export const passwordResetSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
})

// New password schema
export const newPasswordSchema = z
  .object({
    resetCode: z.string().length(6, "Reset code must be 6 digits"),
    password: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
        "Password must contain at least one uppercase letter, one lowercase letter, and one number",
      ),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  })

// Types
export type StudentRegistrationData = z.infer<typeof studentRegistrationSchema>
export type SignInData = z.infer<typeof signInSchema>
export type EmailVerificationData = z.infer<typeof emailVerificationSchema>
export type PasswordResetData = z.infer<typeof passwordResetSchema>
export type NewPasswordData = z.infer<typeof newPasswordSchema>

export type UserRole = "student" | "university" | "admin"

export interface User {
  id: string
  email: string
  role: UserRole
  isEmailVerified: boolean
  profile: StudentProfile | UniversityProfile | AdminProfile
  createdAt: Date
  updatedAt: Date
}

export interface StudentProfile {
  firstName: string
  lastName: string
  username: string
  phoneNumber: string
  dateOfBirth: string
  avatar?: string
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
}

// Extended types for registration data transformation
export interface UniversityRegistrationData extends z.infer<typeof universityRegistrationSchema> {
  universityName?: string
  universityType?: "PUBLIC" | "PRIVATE"
  website?: string
  description?: string
  establishedYear?: number
  address?: {
    street: string
    city: string
    state?: string
    zipCode: string
    country: string
  }
  contact?: {
    phone: string
    email: string
    admissions_email?: string
  }
}

export interface AdminProfile {
  firstName: string
  lastName: string
  permissions: string[]
}
