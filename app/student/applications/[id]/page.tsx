"use client"

import { useEffect, useState } from "react"
import { useRouter, useParams } from "next/navigation"
import { useAuthStore } from "@/store/auth-store"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Separator } from "@/components/ui/separator"
import { 
  ArrowLeft, 
  Edit, 
  FileText, 
  CheckCircle, 
  XCircle, 
  Clock, 
  AlertCircle,
  Calendar,
  DollarSign,
  User,
  School,
  Download,
  Upload,
  Loader2
} from "lucide-react"
import Link from "next/link"
import { applicationApi, type ApplicationDetail } from "@/lib/api/applications"
import { toast } from "sonner"

export default function ApplicationDetailPage() {
  const { user, isAuthenticated } = useAuthStore()
  const router = useRouter()
  const params = useParams()
  const applicationId = params.id as string

  const [application, setApplication] = useState<ApplicationDetail | null>(null)
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)

  // Fetch application details
  useEffect(() => {
    if (!isAuthenticated || user?.role !== "student") {
      router.push("/auth/sign-in")
      return
    }

    if (!applicationId) {
      toast.error("Invalid application ID")
      router.push("/student/applications")
      return
    }

    fetchApplicationDetails()
  }, [isAuthenticated, user, applicationId, router])

  const fetchApplicationDetails = async () => {
    try {
      setLoading(true)
      const response = await applicationApi.getApplication(applicationId)
      
      if (response.success && response.data) {
        setApplication(response.data)
      } else {
        toast.error("Application not found")
        router.push("/student/applications")
      }
    } catch (error) {
      console.error("Error fetching application:", error)
      toast.error("Failed to load application details")
      router.push("/student/applications")
    } finally {
      setLoading(false)
    }
  }

  const handleSubmitApplication = async () => {
    if (!application) return

    try {
      setSubmitting(true)
      const response = await applicationApi.submitApplication(application.id)
      
      if (response.success) {
        toast.success("Application submitted successfully!")
        setApplication(prev => prev ? { ...prev, status: "submitted", submitted_at: new Date().toISOString() } : null)
      } else {
        toast.error("Failed to submit application")
      }
    } catch (error) {
      console.error("Error submitting application:", error)
      toast.error("Failed to submit application")
    } finally {
      setSubmitting(false)
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "accepted":
        return <CheckCircle className="w-5 h-5 text-green-600" />
      case "rejected":
        return <XCircle className="w-5 h-5 text-red-600" />
      case "under_review":
        return <Clock className="w-5 h-5 text-blue-600" />
      case "waitlisted":
        return <AlertCircle className="w-5 h-5 text-yellow-600" />
      case "submitted":
        return <FileText className="w-5 h-5 text-purple-600" />
      default:
        return <FileText className="w-5 h-5 text-gray-600" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "accepted":
        return "bg-green-100 text-green-800 border-green-200"
      case "rejected":
        return "bg-red-100 text-red-800 border-red-200"
      case "under_review":
        return "bg-blue-100 text-blue-800 border-blue-200"
      case "waitlisted":
        return "bg-yellow-100 text-yellow-800 border-yellow-200"
      case "submitted":
        return "bg-purple-100 text-purple-800 border-purple-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  if (!isAuthenticated || user?.role !== "student") {
    return null
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center h-64">
            <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
            <span className="ml-2 text-gray-600">Loading application details...</span>
          </div>
        </div>
        <Footer />
      </div>
    )
  }

  if (!application) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <Card className="text-center py-12">
            <CardContent>
              <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Application not found</h3>
              <p className="text-gray-600 mb-6">The application you're looking for doesn't exist or you don't have permission to view it.</p>
              <Button asChild>
                <Link href="/student/applications">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to Applications
                </Link>
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
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Button variant="ghost" asChild>
              <Link href="/student/applications">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Applications
              </Link>
            </Button>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{application.program.university.name}</h1>
              <p className="text-gray-600">{application.program.name}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Badge className={`${getStatusColor(application.status)} border`}>
              <div className="flex items-center gap-1">
                {getStatusIcon(application.status)}
                {application.status.replace("_", " ").toUpperCase()}
              </div>
            </Badge>
            {application.status === "draft" && (
              <Button asChild>
                <Link href={`/student/applications/${application.id}/edit`}>
                  <Edit className="w-4 h-4 mr-2" />
                  Edit Application
                </Link>
              </Button>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Application Progress */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="w-5 h-5" />
                  Application Progress
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Completion Progress</span>
                  <span className="text-sm text-gray-600">{application.progress}%</span>
                </div>
                <Progress value={application.progress} className="w-full" />
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  <div className="text-center">
                    <div className={`w-3 h-3 rounded-full mx-auto mb-1 ${application.documents.transcript ? 'bg-green-500' : 'bg-gray-300'}`} />
                    <span className="text-gray-600">Transcript</span>
                  </div>
                  <div className="text-center">
                    <div className={`w-3 h-3 rounded-full mx-auto mb-1 ${application.documents.recommendation ? 'bg-green-500' : 'bg-gray-300'}`} />
                    <span className="text-gray-600">Recommendation</span>
                  </div>
                  <div className="text-center">
                    <div className={`w-3 h-3 rounded-full mx-auto mb-1 ${application.documents.essay ? 'bg-green-500' : 'bg-gray-300'}`} />
                    <span className="text-gray-600">Essay</span>
                  </div>
                  <div className="text-center">
                    <div className={`w-3 h-3 rounded-full mx-auto mb-1 ${application.documents.portfolio ? 'bg-green-500' : 'bg-gray-300'}`} />
                    <span className="text-gray-600">Portfolio</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Personal Statement */}
            {application.personal_statement && (
              <Card>
                <CardHeader>
                  <CardTitle>Personal Statement</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-700 whitespace-pre-wrap">{application.personal_statement}</p>
                </CardContent>
              </Card>
            )}

            {/* Academic History */}
            {application.academic_history && application.academic_history.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <School className="w-5 h-5" />
                    Academic History
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {application.academic_history.map((education, index) => (
                      <div key={index} className="border-l-4 border-blue-500 pl-4">
                        <div className="flex items-center justify-between">
                          <h4 className="font-semibold">{education.institution}</h4>
                          <Badge variant="outline">GPA: {education.gpa}</Badge>
                        </div>
                        <p className="text-sm text-gray-600">{education.degree} in {education.field_of_study}</p>
                        <p className="text-xs text-gray-500">
                          {new Date(education.start_date).getFullYear()} - {education.is_completed ? new Date(education.end_date).getFullYear() : 'Present'}
                        </p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Decision Notes */}
            {application.decision_notes && (
              <Card>
                <CardHeader>
                  <CardTitle>Decision Notes</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-700">{application.decision_notes}</p>
                  {application.reviewed_at && (
                    <p className="text-sm text-gray-500 mt-2">
                      Reviewed on {new Date(application.reviewed_at).toLocaleDateString()}
                    </p>
                  )}
                </CardContent>
              </Card>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Application Info */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Application Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-3">
                  <Calendar className="w-4 h-4 text-gray-500" />
                  <div>
                    <p className="text-sm font-medium">Deadline</p>
                    <p className="text-sm text-gray-600">{new Date(application.deadline).toLocaleDateString()}</p>
                  </div>
                </div>
                
                <Separator />
                
                <div className="flex items-center gap-3">
                  <DollarSign className="w-4 h-4 text-gray-500" />
                  <div>
                    <p className="text-sm font-medium">Application Fee</p>
                    <p className="text-sm text-gray-600">${application.application_fee}</p>
                  </div>
                </div>
                
                <Separator />
                
                <div className="flex items-center gap-3">
                  <FileText className="w-4 h-4 text-gray-500" />
                  <div>
                    <p className="text-sm font-medium">Application ID</p>
                    <p className="text-sm text-gray-600 font-mono">{application.id.slice(0, 8)}...</p>
                  </div>
                </div>

                {application.submitted_at && (
                  <>
                    <Separator />
                    <div className="flex items-center gap-3">
                      <Clock className="w-4 h-4 text-gray-500" />
                      <div>
                        <p className="text-sm font-medium">Submitted</p>
                        <p className="text-sm text-gray-600">{new Date(application.submitted_at).toLocaleDateString()}</p>
                      </div>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>

            {/* Payment Status */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Payment Status</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-sm font-medium">Status</span>
                  <Badge variant={application.payment_status === "completed" ? "default" : "outline"}>
                    {application.payment_status}
                  </Badge>
                </div>
                {application.payment && (
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Amount:</span>
                      <span className="font-medium">${application.payment.amount} {application.payment.currency}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Method:</span>
                      <span className="font-medium capitalize">{application.payment.method.replace('_', ' ')}</span>
                    </div>
                    {application.payment.processed_at && (
                      <div className="flex justify-between">
                        <span className="text-gray-600">Processed:</span>
                        <span className="font-medium">{new Date(application.payment.processed_at).toLocaleDateString()}</span>
                      </div>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Actions */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {application.status === "draft" && (
                  <Button 
                    onClick={handleSubmitApplication} 
                    disabled={submitting}
                    className="w-full"
                  >
                    {submitting ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Submitting...
                      </>
                    ) : (
                      <>
                        <Upload className="w-4 h-4 mr-2" />
                        Submit Application
                      </>
                    )}
                  </Button>
                )}
                
                <Button variant="outline" className="w-full">
                  <Download className="w-4 h-4 mr-2" />
                  Download Application
                </Button>
                
                {application.payment && application.payment.receipt_url && (
                  <Button variant="outline" className="w-full" asChild>
                    <a href={application.payment.receipt_url} target="_blank" rel="noopener noreferrer">
                      <Download className="w-4 h-4 mr-2" />
                      Download Receipt
                    </a>
                  </Button>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  )
}