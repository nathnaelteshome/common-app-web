import type { UniversityVerificationRequest, VerificationDecision } from "@/lib/validations/verification"
import { mockVerificationRequests, mockVerificationNotifications } from "@/data/mock-verification-data"

export class VerificationService {
  private requests: Map<string, UniversityVerificationRequest> = new Map()
  private notifications: any[] = []

  constructor() {
    // Initialize with mock data
    mockVerificationRequests.forEach((request) => {
      this.requests.set(request.id, request)
    })
    this.notifications = [...mockVerificationNotifications]
  }

  async submitVerificationRequest(universityData: any, documents: File[]): Promise<string> {
    const requestId = `ver-req-${Date.now()}`

    // Simulate document upload
    const uploadedDocs = documents.map((file, index) => ({
      id: `doc-${Date.now()}-${index}`,
      type: this.getDocumentType(file.name),
      name: file.name,
      url: `/documents/${file.name}`,
      status: "pending" as const,
    }))

    const verificationRequest: UniversityVerificationRequest = {
      id: requestId,
      universityId: universityData.id,
      universityName: universityData.collegeName,
      adminEmail: universityData.email,
      adminName: `${universityData.firstName} ${universityData.lastName}`,
      status: "pending",
      submittedAt: new Date().toISOString(),
      documents: uploadedDocs,
      verificationChecklist: {
        businessLicense: false,
        accreditation: false,
        contactVerification: false,
        addressVerification: false,
        websiteVerification: false,
      },
      priority: this.calculatePriority(universityData),
      estimatedReviewTime: "2-3 business days",
    }

    this.requests.set(requestId, verificationRequest)

    // Notify system admin
    await this.sendNotification({
      type: "new_request",
      title: "New University Verification Request",
      message: `${universityData.collegeName} has submitted a new verification request requiring your review.`,
      recipientRole: "admin",
      verificationRequestId: requestId,
      priority: verificationRequest.priority,
    })

    // Notify university admin
    await this.sendNotification({
      type: "status_update",
      title: "Verification Request Submitted",
      message: "Your university verification request has been submitted and is in the queue for review.",
      recipientId: universityData.id,
      recipientRole: "university",
      verificationRequestId: requestId,
      priority: "medium",
    })

    return requestId
  }

  async updateVerificationStatus(requestId: string, decision: VerificationDecision, reviewerId: string): Promise<void> {
    const request = this.requests.get(requestId)
    if (!request) {
      throw new Error("Verification request not found")
    }

    const updatedRequest = {
      ...request,
      status: decision.decision === "approve" ? "approved" : ("rejected" as const),
      reviewedAt: new Date().toISOString(),
      reviewedBy: reviewerId,
      reviewNotes: decision.notes,
      conditions: decision.conditions,
      rejectionReason: decision.decision === "reject" ? decision.notes : undefined,
    }

    this.requests.set(requestId, updatedRequest)

    // Send notification to university admin
    if (decision.decision === "approve") {
      await this.sendNotification({
        type: "approval",
        title: "Verification Approved!",
        message:
          "Congratulations! Your university verification has been approved. You now have access to the admin dashboard.",
        recipientId: request.universityId,
        recipientRole: "university",
        verificationRequestId: requestId,
        priority: "high",
        actionUrl: "/admin/dashboard",
      })

      // Update user permissions in the system
      await this.grantUniversityAccess(request.universityId)
    } else {
      await this.sendNotification({
        type: "rejection",
        title: "Verification Request Rejected",
        message: `Your university verification request has been rejected. Reason: ${decision.notes}. Please review the feedback and resubmit with correct documentation.`,
        recipientId: request.universityId,
        recipientRole: "university",
        verificationRequestId: requestId,
        priority: "high",
        actionUrl: "/admin/verification/status",
      })
    }

    // Notify system admin of completion
    await this.sendNotification({
      type: "status_update",
      title: `Verification ${decision.decision === "approve" ? "Approved" : "Rejected"}`,
      message: `${request.universityName} verification has been ${decision.decision}d.`,
      recipientRole: "admin",
      verificationRequestId: requestId,
      priority: "medium",
    })
  }

  async startReview(requestId: string, reviewerId: string): Promise<void> {
    const request = this.requests.get(requestId)
    if (!request) {
      throw new Error("Verification request not found")
    }

    const updatedRequest = {
      ...request,
      status: "under_review" as const,
      reviewedAt: new Date().toISOString(),
      reviewedBy: reviewerId,
    }

    this.requests.set(requestId, updatedRequest)

    // Notify university admin
    await this.sendNotification({
      type: "status_update",
      title: "Verification Under Review",
      message:
        "Your university verification request is now under review. We will contact you within the estimated review time.",
      recipientId: request.universityId,
      recipientRole: "university",
      verificationRequestId: requestId,
      priority: "medium",
      actionUrl: "/admin/verification/status",
    })
  }

  async updateDocumentStatus(
    requestId: string,
    documentId: string,
    status: "verified" | "rejected",
    reviewNotes?: string,
  ): Promise<void> {
    const request = this.requests.get(requestId)
    if (!request) {
      throw new Error("Verification request not found")
    }

    const updatedDocuments = request.documents.map((doc) =>
      doc.id === documentId ? { ...doc, status, reviewNotes } : doc,
    )

    const updatedRequest = {
      ...request,
      documents: updatedDocuments,
    }

    this.requests.set(requestId, updatedRequest)

    // Update verification checklist based on document type
    if (status === "verified") {
      this.updateVerificationChecklist(requestId, documentId)
    }

    // Notify university if document rejected
    if (status === "rejected") {
      await this.sendNotification({
        type: "document_required",
        title: "Document Rejected",
        message: `Your ${updatedDocuments.find((d) => d.id === documentId)?.type.replace("_", " ")} document has been rejected. ${reviewNotes || "Please resubmit with correct documentation."}`,
        recipientId: request.universityId,
        recipientRole: "university",
        verificationRequestId: requestId,
        priority: "high",
        actionUrl: "/admin/verification/status",
      })
    }
  }

  private updateVerificationChecklist(requestId: string, documentId: string): void {
    const request = this.requests.get(requestId)
    if (!request) return

    const document = request.documents.find((doc) => doc.id === documentId)
    if (!document) return

    const updatedChecklist = { ...request.verificationChecklist }

    switch (document.type) {
      case "business_license":
        updatedChecklist.businessLicense = true
        break
      case "accreditation":
        updatedChecklist.accreditation = true
        break
      // Add more document type mappings as needed
    }

    const updatedRequest = {
      ...request,
      verificationChecklist: updatedChecklist,
    }

    this.requests.set(requestId, updatedRequest)
  }

  private async grantUniversityAccess(universityId: string): Promise<void> {
    // In a real implementation, this would update the user's role and permissions
    // For now, we'll simulate this
    console.log(`Granting admin access to university: ${universityId}`)

    // Update user status in database
    // Enable admin dashboard access
    // Send welcome email with login instructions
  }

  private async sendNotification(notificationData: any): Promise<void> {
    const notification = {
      id: `notif-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      ...notificationData,
      isRead: false,
      createdAt: new Date().toISOString(),
    }

    this.notifications.push(notification)

    // In a real implementation, this would also:
    // - Send email notifications
    // - Send push notifications
    // - Update notification center
    console.log("Notification sent:", notification)
  }

  private getDocumentType(filename: string): string {
    const name = filename.toLowerCase()
    if (name.includes("license")) return "business_license"
    if (name.includes("accreditation")) return "accreditation"
    if (name.includes("tax")) return "tax_certificate"
    return "other"
  }

  private calculatePriority(universityData: any): "high" | "medium" | "low" {
    // Calculate priority based on various factors
    // For now, return medium as default
    return "medium"
  }

  getVerificationRequest(requestId: string): UniversityVerificationRequest | null {
    return this.requests.get(requestId) || null
  }

  getVerificationRequests(filters?: {
    status?: string
    priority?: string
    search?: string
  }): UniversityVerificationRequest[] {
    let requests = Array.from(this.requests.values())

    if (filters?.status && filters.status !== "all") {
      requests = requests.filter((req) => req.status === filters.status)
    }

    if (filters?.priority && filters.priority !== "all") {
      requests = requests.filter((req) => req.priority === filters.priority)
    }

    if (filters?.search) {
      const search = filters.search.toLowerCase()
      requests = requests.filter(
        (req) =>
          req.universityName.toLowerCase().includes(search) ||
          req.adminEmail.toLowerCase().includes(search) ||
          req.adminName.toLowerCase().includes(search),
      )
    }

    return requests.sort((a, b) => new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime())
  }

  getNotifications(userId: string, role: "admin" | "university"): any[] {
    return this.notifications
      .filter((notif) => notif.recipientRole === role && (role === "admin" || notif.recipientId === userId))
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
  }

  async generateVerificationReport(): Promise<{
    totalRequests: number
    pendingRequests: number
    approvedRequests: number
    rejectedRequests: number
    averageReviewTime: number
    documentVerificationRate: number
  }> {
    const requests = Array.from(this.requests.values())

    return {
      totalRequests: requests.length,
      pendingRequests: requests.filter((r) => r.status === "pending").length,
      approvedRequests: requests.filter((r) => r.status === "approved").length,
      rejectedRequests: requests.filter((r) => r.status === "rejected").length,
      averageReviewTime: this.calculateAverageReviewTime(requests),
      documentVerificationRate: this.calculateDocumentVerificationRate(requests),
    }
  }

  private calculateAverageReviewTime(requests: UniversityVerificationRequest[]): number {
    const reviewedRequests = requests.filter((r) => r.reviewedAt && r.submittedAt)
    if (reviewedRequests.length === 0) return 0

    const totalTime = reviewedRequests.reduce((sum, req) => {
      const submitted = new Date(req.submittedAt).getTime()
      const reviewed = new Date(req.reviewedAt!).getTime()
      return sum + (reviewed - submitted)
    }, 0)

    return totalTime / reviewedRequests.length / (1000 * 60 * 60 * 24) // Convert to days
  }

  private calculateDocumentVerificationRate(requests: UniversityVerificationRequest[]): number {
    const allDocuments = requests.flatMap((r) => r.documents)
    if (allDocuments.length === 0) return 0

    const verifiedDocuments = allDocuments.filter((d) => d.status === "verified")
    return (verifiedDocuments.length / allDocuments.length) * 100
  }
}

export const verificationService = new VerificationService()
