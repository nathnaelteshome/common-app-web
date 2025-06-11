"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useAuthStore } from "@/store/auth-store"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  CheckCircle,
  XCircle,
  Clock,
  AlertTriangle,
  FileText,
  Download,
  Upload,
  RefreshCw,
  MessageSquare,
  Calendar,
  Building,
  Mail,
  Phone,
} from "lucide-react"
import Link from "next/link"
import { mockVerificationRequests } from "@/data/mock-verification-data"

export default function VerificationStatus() {
  const { user, isAuthenticated } = useAuthStore()
  const router = useRouter()
  const [verificationRequest, setVerificationRequest] = useState<any>(null)

  useEffect(() => {
    if (!isAuthenticated || user?.role !== "university") {
      router.push("/auth/sign-in")
    } else {
      // Find verification request for current university
      const request = mockVerificationRequests.find((req) => req.adminEmail === user.email)
      setVerificationRequest(request)
    }
  }, [isAuthenticated, user, router])

  if (!isAuthenticated || user?.role !== "university") {
    return null
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

  const getProgressPercentage = () => {
    if (!verificationRequest) return 0
    const checklist = verificationRequest.verificationChecklist
    const completed = Object.values(checklist).filter(Boolean).length
    const total = Object.keys(checklist).length
    return (completed / total) * 100
  }

  if (!verificationRequest) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <Card className="max-w-2xl mx-auto">
            <CardContent className="text-center py-12">
              <Building className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-gray-900 mb-2">No Verification Request Found</h2>
              <p className="text-gray-600 mb-6">
                You don't have any pending verification requests. Your university may already be verified.
              </p>
              <Button asChild>
                <Link href="/admin/dashboard">Go to Dashboard</Link>
              </Button>
            </CardContent>
          </Card>
        </div>
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <div className="container mx-auto px-4 py-8">
        {/* Header Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Verification Status</h1>
          <p className="text-gray-600">Track your university verification progress</p>
        </div>

        {/* Status Overview */}
        <Card className="mb-8">
          <CardContent className="p-8">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-4">
                {getStatusIcon(verificationRequest.status)}
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">{verificationRequest.universityName}</h2>
                  <p className="text-gray-600">Verification Request</p>
                </div>
              </div>
              <Badge className={`${getStatusColor(verificationRequest.status)} text-lg px-4 py-2`}>
                {verificationRequest.status.replace("_", " ").toUpperCase()}
              </Badge>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <Calendar className="w-8 h-8 text-gray-500 mx-auto mb-2" />
                <p className="text-sm text-gray-600">Submitted</p>
                <p className="font-semibold">{new Date(verificationRequest.submittedAt).toLocaleDateString()}</p>
              </div>
              <div className="text-center">
                <Clock className="w-8 h-8 text-gray-500 mx-auto mb-2" />
                <p className="text-sm text-gray-600">Estimated Review Time</p>
                <p className="font-semibold">{verificationRequest.estimatedReviewTime}</p>
              </div>
              <div className="text-center">
                <CheckCircle className="w-8 h-8 text-gray-500 mx-auto mb-2" />
                <p className="text-sm text-gray-600">Progress</p>
                <p className="font-semibold">{Math.round(getProgressPercentage())}% Complete</p>
              </div>
            </div>

            <div className="mt-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-700">Verification Progress</span>
                <span className="text-sm text-gray-500">{Math.round(getProgressPercentage())}%</span>
              </div>
              <Progress value={getProgressPercentage()} className="h-2" />
            </div>
          </CardContent>
        </Card>

        <Tabs defaultValue="checklist" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="checklist">Verification Checklist</TabsTrigger>
            <TabsTrigger value="documents">Documents</TabsTrigger>
            <TabsTrigger value="timeline">Timeline</TabsTrigger>
            <TabsTrigger value="contact">Contact</TabsTrigger>
          </TabsList>

          <TabsContent value="checklist" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Verification Checklist</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {Object.entries(verificationRequest.verificationChecklist).map(([key, value]) => (
                    <div key={key} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center gap-3">
                        {value ? (
                          <CheckCircle className="w-5 h-5 text-green-600" />
                        ) : (
                          <XCircle className="w-5 h-5 text-red-600" />
                        )}
                        <div>
                          <p className="font-medium capitalize">{key.replace(/([A-Z])/g, " $1").trim()}</p>
                          <p className="text-sm text-gray-500">{value ? "Verified" : "Pending verification"}</p>
                        </div>
                      </div>
                      <Badge variant={value ? "default" : "secondary"}>{value ? "Complete" : "Pending"}</Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="documents" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Submitted Documents</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {verificationRequest.documents.map((doc: any) => (
                    <div key={doc.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center gap-3">
                        <FileText className="w-5 h-5 text-gray-500" />
                        <div>
                          <p className="font-medium">{doc.name}</p>
                          <p className="text-sm text-gray-500 capitalize">{doc.type.replace("_", " ")}</p>
                          {doc.reviewNotes && <p className="text-sm text-red-600 mt-1">{doc.reviewNotes}</p>}
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge className={`${getStatusColor(doc.status)} border-0`}>{doc.status}</Badge>
                        <Button variant="ghost" size="sm">
                          <Download className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>

                {verificationRequest.status === "rejected" && (
                  <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                    <h4 className="font-medium text-red-800 mb-2">Action Required</h4>
                    <p className="text-sm text-red-700 mb-4">
                      Your verification was rejected. Please review the feedback and resubmit with corrected documents.
                    </p>
                    <Button className="bg-red-600 hover:bg-red-700 text-white">
                      <Upload className="w-4 h-4 mr-2" />
                      Resubmit Documents
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="timeline" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Verification Timeline</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="flex items-start gap-4">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                      <Upload className="w-4 h-4 text-blue-600" />
                    </div>
                    <div>
                      <p className="font-medium">Application Submitted</p>
                      <p className="text-sm text-gray-500">
                        {new Date(verificationRequest.submittedAt).toLocaleString()}
                      </p>
                      <p className="text-sm text-gray-600 mt-1">
                        Your verification request has been submitted and is in the queue for review.
                      </p>
                    </div>
                  </div>

                  {verificationRequest.reviewedAt && (
                    <div className="flex items-start gap-4">
                      <div className="w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center">
                        <Clock className="w-4 h-4 text-yellow-600" />
                      </div>
                      <div>
                        <p className="font-medium">Review Started</p>
                        <p className="text-sm text-gray-500">
                          {new Date(verificationRequest.reviewedAt).toLocaleString()}
                        </p>
                        <p className="text-sm text-gray-600 mt-1">
                          Our team has started reviewing your application and documents.
                        </p>
                      </div>
                    </div>
                  )}

                  {verificationRequest.status === "approved" && (
                    <div className="flex items-start gap-4">
                      <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                        <CheckCircle className="w-4 h-4 text-green-600" />
                      </div>
                      <div>
                        <p className="font-medium">Verification Approved</p>
                        <p className="text-sm text-gray-500">
                          {verificationRequest.reviewedAt && new Date(verificationRequest.reviewedAt).toLocaleString()}
                        </p>
                        <p className="text-sm text-gray-600 mt-1">
                          Congratulations! Your university has been verified and you now have access to the admin
                          dashboard.
                        </p>
                      </div>
                    </div>
                  )}

                  {verificationRequest.status === "rejected" && (
                    <div className="flex items-start gap-4">
                      <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
                        <XCircle className="w-4 h-4 text-red-600" />
                      </div>
                      <div>
                        <p className="font-medium">Verification Rejected</p>
                        <p className="text-sm text-gray-500">
                          {verificationRequest.reviewedAt && new Date(verificationRequest.reviewedAt).toLocaleString()}
                        </p>
                        <p className="text-sm text-gray-600 mt-1">{verificationRequest.rejectionReason}</p>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="contact" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Contact Support</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <h4 className="font-medium">Need Help?</h4>
                      <p className="text-sm text-gray-600">
                        If you have questions about your verification status or need assistance, our support team is
                        here to help.
                      </p>
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <Mail className="w-4 h-4 text-gray-500" />
                          <span className="text-sm">verification@commonapply.com</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Phone className="w-4 h-4 text-gray-500" />
                          <span className="text-sm">+251 911 221 122</span>
                        </div>
                      </div>
                    </div>
                    <div className="space-y-4">
                      <h4 className="font-medium">Quick Actions</h4>
                      <div className="space-y-2">
                        <Button variant="outline" className="w-full justify-start">
                          <MessageSquare className="w-4 h-4 mr-2" />
                          Contact Support
                        </Button>
                        <Button variant="outline" className="w-full justify-start">
                          <RefreshCw className="w-4 h-4 mr-2" />
                          Check for Updates
                        </Button>
                        <Button variant="outline" className="w-full justify-start">
                          <FileText className="w-4 h-4 mr-2" />
                          View Guidelines
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      <Footer />
    </div>
  )
}
