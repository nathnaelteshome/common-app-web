import { z } from "zod"

export const verificationDecisionSchema = z.object({
  decision: z.enum(["approve", "reject"]),
  notes: z.string().min(10, "Please provide detailed notes (minimum 10 characters)"),
  conditions: z.array(z.string()).optional(),
  reviewerId: z.string(),
})

export const documentReviewSchema = z.object({
  documentId: z.string(),
  status: z.enum(["verified", "rejected"]),
  reviewNotes: z.string().optional(),
})

export const verificationRequestSchema = z.object({
  universityData: z.object({
    collegeName: z.string().min(2, "College name is required"),
    email: z.string().email("Valid email is required"),
    address1: z.string().min(5, "Address is required"),
    address2: z.string().optional(),
    country: z.string().min(1, "Country is required"),
    city: z.string().min(2, "City is required"),
    postcode: z.string().min(3, "Postcode is required"),
    phone1: z.string().min(10, "Valid phone number is required"),
    phone2: z.string().optional(),
    fieldOfStudies: z.string().min(1, "Field of studies is required"),
  }),
  documents: z
    .array(
      z.object({
        type: z.string(),
        name: z.string(),
        url: z.string(),
      }),
    )
    .min(1, "At least one document is required"),
})

export type VerificationDecision = z.infer<typeof verificationDecisionSchema>
export type DocumentReview = z.infer<typeof documentReviewSchema>
export type VerificationRequestData = z.infer<typeof verificationRequestSchema>

export interface UniversityVerificationRequest {
  id: string
  universityId: string
  universityName: string
  adminEmail: string
  adminName: string
  status: "pending" | "under_review" | "approved" | "rejected"
  submittedAt: string
  reviewedAt?: string
  reviewedBy?: string
  documents: {
    id: string
    type: string
    name: string
    url: string
    status: "pending" | "verified" | "rejected"
    reviewNotes?: string
  }[]
  verificationChecklist: {
    businessLicense: boolean
    accreditation: boolean
    contactVerification: boolean
    addressVerification: boolean
    websiteVerification: boolean
  }
  priority: "high" | "medium" | "low"
  estimatedReviewTime: string
  reviewNotes?: string
  rejectionReason?: string
  conditions?: string[]
  universityData: {
    collegeName: string
    email: string
    address1: string
    address2?: string
    country: string
    city: string
    postcode: string
    phone1: string
    phone2?: string
    fieldOfStudies: string
  }
}

export interface VerificationNotification {
  id: string
  type: "new_request" | "status_update" | "approval" | "rejection" | "document_required"
  title: string
  message: string
  recipientId?: string
  recipientRole: "admin" | "university"
  verificationRequestId: string
  priority: "high" | "medium" | "low"
  isRead: boolean
  createdAt: string
  actionUrl?: string
}
