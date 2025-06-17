"use client"

import { useEffect, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { CheckCircle, Clock, XCircle, AlertTriangle, FileText, Mail, Building, Calendar, RefreshCw } from "lucide-react"
import Link from "next/link"
import { verificationService } from "@/lib/services/verification-service"
import { useAuthStore } from "@/store/auth-store"
import { toast } from "sonner"

export default function VerificationStatusPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { user, isAuthenticated } = useAuthStore()
  const [verificationRequest, setVerificationRequest] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)

  const requestId = searchParams.get("requestId")

  useEffect(() => {
    loadVerificationStatus()
  }, [requestId, user])

  const loadVerificationStatus = async () => {
    try {
      setLoading(true)

      let request = null

      if (requestId) {
        // Load by request ID (for new registrations)
        request = verificationService.getVerificationRequest(requestId)
      } else if (user?.id) {
        // Load by university ID (for existing users)
        request = verificationService.getVerificationRequestByUniversityId(user.id)
      }

      if (request) {
        setVerificationRequest(request)
      } else {
        // If no verification request found, check if user is already verified
        if (user?.id) {
          const isVerified = verificationService.isUniversityVerified(user.id)
          if (isVerified) {
            // User is already verified, redirect to dashboard
            router.push("/admin/dashboard")
            return
          }
        }
        toast.error("Verification request not found")
      }
    } catch (error) {
      console.error("Error loading verification status:", error)
      toast.error("Failed to load verification status")
    } finally {
      setLoading(false)
    }
  }

  const handleRefresh = async () => {
    setRefreshing(true)
    await loadVerificationStatus()
    setRefreshing(false)
    toast.success("Status refreshed")
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "approved":
        return <CheckCircle className="w-6 h-6 text-green-600" />
      case "rejected":
        return <XCircle className="w-6 h-6 text-red-600" />
      case "under_review":
        return <Clock className="w-6 h-6 text-blue-600" />
      case "pending":
        return <AlertTriangle className="w-6 h-6 text-yellow-600" />
      default:
        return <Building className="w-6 h-6 text-gray-600" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "approved":
        return "bg-green-100 text-green-800 border-green-200"
      case "rejected":
        return "bg-red-100 text-red-800 border-red-200"
      case "under_review":
        return "bg-blue-100 text-blue-800 border-blue-200"
      case "pending":
        return "bg-yellow-100 text-yellow-800 border-yellow-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  const getStatusMessage = (status: string) => {
    switch (status) {
      case "approved":
        return "Congratulations! Your university has been verified and approved."
      case "rejected":
        return "Your verification request has been rejected. Please review the feedback below."
      case "under_review":
        return "Your verification request is currently under review by our team."
      case "pending":
        return "Your verification request has been submitted and is in the queue for review."
      default:
        return "Unknown status"
    }
  }

  const calculateProgress = (request: any) => {
    if (!request) return 0

    const checklist = request.verificationChecklist
    const totalItems = Object.keys(checklist).length
    const completedItems = Object.values(checklist).filter(Boolean).length

    return Math.round((completedItems / totalItems) * 100)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto">
            <div className="animate-pulse space-y-6">
              <div className="h-8 bg-gray-200 rounded w-1/3"></div>
              <div className="h-64 bg-gray-200 rounded"></div>
              <div className="h-48 bg-gray-200 rounded"></div>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    )
  }

  if (!verificationRequest) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto text-center">
            <div className="bg-white p-8 rounded-lg shadow-sm">
              <AlertTriangle className="w-16 h-16 text-yellow-500 mx-auto mb-4" />
              <h1 className="text-2xl font-bold text-gray-900 mb-2">Verification Request Not Found</h1>
              <p className="text-gray-600 mb-6">We couldn't find your verification request. This might be because:</p>
              <ul className="text-left text-gray-600 mb-6 space-y-2">
                <li>• Your registration is still being processed</li>
                <li>• You may have already been verified</li>
                <li>• The verification request ID is invalid</li>
              </ul>
              <div className="space-x-4">
                <Button asChild>
                  <Link href="/auth/create-account">Register University</Link>
                </Button>
                <Button variant="outline" asChild>
                  <Link href="/auth/sign-in">Sign In</Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Verification Status</h1>
              <p className="text-gray-600">Track your university verification progress</p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" onClick={handleRefresh} disabled={refreshing}>
                <RefreshCw className={`w-4 h-4 mr-2 ${refreshing ? "animate-spin" : ""}`} />
                Refresh
              </Button>
              {verificationRequest.status === "approved" && (
                <Button asChild>
                  <Link href="/admin/dashboard">Go to Dashboard</Link>
                </Button>
              )}
            </div>
          </div>

          {/* Status Overview */}
          <Card className="mb-8">
            <CardContent className="p-8">
              <div className="flex items-center gap-4 mb-6">
                {getStatusIcon(verificationRequest.status)}
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">{verificationRequest.universityName}</h2>
                  <p className="text-gray-600">{getStatusMessage(verificationRequest.status)}</p>
                </div>
              </div>

              <div className="flex items-center gap-4 mb-6">
                <Badge className={`${getStatusColor(verificationRequest.status)} px-4 py-2 text-sm font-medium border`}>
                  {verificationRequest.status.replace("_", " ").toUpperCase()}
                </Badge>
                <span className="text-sm text-gray-500">
                  Submitted: {new Date(verificationRequest.submittedAt).toLocaleDateString()}
                </span>
                {verificationRequest.reviewedAt && (
                  <span className="text-sm text-gray-500">
                    Reviewed: {new Date(verificationRequest.reviewedAt).toLocaleDateString()}
                  </span>
                )}
              </div>

              {/* Progress Bar */}
              <div className="mb-4">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium text-gray-700">Verification Progress</span>
                  <span className="text-sm text-gray-500">{calculateProgress(verificationRequest)}%</span>
                </div>
                <Progress value={calculateProgress(verificationRequest)} className="h-2" />
              </div>

              <p className="text-sm text-gray-600">Estimated review time: {verificationRequest.estimatedReviewTime}</p>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* University Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Building className="w-5 h-5" />
                  University Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-2">
                  <Building className="w-4 h-4 text-gray-500" />
                  <span className="font-medium">{verificationRequest.universityName}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Mail className="w-4 h-4 text-gray-500" />
                  <span>{verificationRequest.adminEmail}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-gray-500" />
                  <span>Submitted: {new Date(verificationRequest.submittedAt).toLocaleString()}</span>
                </div>
                <div className="flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-gray-500" />
                  <span>Priority: {verificationRequest.priority}</span>
                </div>
              </CardContent>
            </Card>

            {/* Verification Checklist */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CheckCircle className="w-5 h-5" />
                  Verification Checklist
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {Object.entries(verificationRequest.verificationChecklist).map(([key, value]) => (
                  <div key={key} className="flex items-center justify-between">
                    <span className="text-sm capitalize">{key.replace(/([A-Z])/g, " $1").trim()}</span>
                    {value ? (
                      <CheckCircle className="w-4 h-4 text-green-600" />
                    ) : (
                      <XCircle className="w-4 h-4 text-red-600" />
                    )}
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* Documents */}
          <Card className="mt-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="w-5 h-5" />
                Submitted Documents
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {verificationRequest.documents.map((doc: any) => (
                  <div key={doc.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <FileText className="w-5 h-5 text-gray-500" />
                      <div>
                        <p className="font-medium">{doc.name}</p>
                        <p className="text-sm text-gray-500 capitalize">{doc.type.replace("_", " ")}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge className={`${getStatusColor(doc.status)} border-0`}>{doc.status}</Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Review Notes */}
          {verificationRequest.reviewNotes && (
            <Card className="mt-8">
              <CardHeader>
                <CardTitle>Review Notes</CardTitle>
              </CardHeader>
              <CardContent>
                <div
                  className={`p-4 rounded-lg ${
                    verificationRequest.status === "approved"
                      ? "bg-green-50 border border-green-200"
                      : "bg-red-50 border border-red-200"
                  }`}
                >
                  <p
                    className={`text-sm ${
                      verificationRequest.status === "approved" ? "text-green-800" : "text-red-800"
                    }`}
                  >
                    {verificationRequest.reviewNotes}
                  </p>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Next Steps */}
          <Card className="mt-8">
            <CardHeader>
              <CardTitle>Next Steps</CardTitle>
            </CardHeader>
            <CardContent>
              {verificationRequest.status === "pending" && (
                <div className="space-y-2 text-sm text-gray-600">
                  <p>• Your verification request is in the queue for review</p>
                  <p>• Our team will review your documents within the estimated time</p>
                  <p>• You'll receive email notifications about any status changes</p>
                  <p>• Please ensure your email is accessible for important updates</p>
                </div>
              )}

              {verificationRequest.status === "under_review" && (
                <div className="space-y-2 text-sm text-gray-600">
                  <p>• Your verification is currently being reviewed by our team</p>
                  <p>• We may contact you if additional information is needed</p>
                  <p>• You'll receive a notification once the review is complete</p>
                  <p>• Please be patient as we ensure thorough verification</p>
                </div>
              )}

              {verificationRequest.status === "approved" && (
                <div className="space-y-4">
                  <div className="space-y-2 text-sm text-green-700">
                    <p>• Congratulations! Your university has been verified</p>
                    <p>• You now have access to the admin dashboard</p>
                    <p>• You can start managing applications and programs</p>
                    <p>• Welcome to the CommonApply platform!</p>
                  </div>
                  <Button asChild className="w-full">
                    <Link href="/admin/dashboard">Access Admin Dashboard</Link>
                  </Button>
                </div>
              )}

              {verificationRequest.status === "rejected" && (
                <div className="space-y-4">
                  <div className="space-y-2 text-sm text-red-700">
                    <p>• Please review the feedback provided above</p>
                    <p>• Correct any issues with your documentation</p>
                    <p>• You can resubmit your verification request</p>
                    <p>• Contact support if you need assistance</p>
                  </div>
                  <div className="flex gap-2">
                    <Button asChild>
                      <Link href="/auth/create-account">Resubmit Application</Link>
                    </Button>
                    <Button variant="outline" asChild>
                      <Link href="/contact">Contact Support</Link>
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      <Footer />
    </div>
  )
}
