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
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import {
  ArrowLeft,
  User,
  GraduationCap,
  FileText,
  CreditCard,
  MessageSquare,
  Calendar,
  MapPin,
  Phone,
  Mail,
  Download,
  CheckCircle,
  XCircle,
  Clock,
  AlertTriangle,
  Star,
  Loader2,
} from "lucide-react"
import Link from "next/link"
import { applicationApi, type ApplicationDetail } from "@/lib/api/applications"
import { toast } from "sonner"

interface PageProps {
  params: { id: string }
}

export default function ApplicationDetailPage({ params }: PageProps) {
  const { user, isAuthenticated } = useAuthStore()
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true)
  const [application, setApplication] = useState<ApplicationDetail | null>(null)
  const [updating, setUpdating] = useState(false)
  const [notes, setNotes] = useState("")

  // Authentication check
  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/auth/sign-in?redirect=/admin/applications/" + params.id)
      return
    }

    if (user?.role !== "university_admin" && user?.role !== "system_admin") {
      router.push("/unauthorized")
      return
    }

    setIsLoading(false)
  }, [isAuthenticated, user, router, params.id])

  // Fetch application details
  const fetchApplication = async () => {
    try {
      const response = await applicationApi.getApplication(params.id)
      
      if (response.success && response.data) {
        setApplication(response.data)
        setNotes(response.data.decision_notes || "")
      } else {
        toast.error("Failed to load application details")
        router.push("/admin/applications")
      }
    } catch (error) {
      console.error("Error fetching application:", error)
      toast.error("Error loading application")
      router.push("/admin/applications")
    }
  }

  useEffect(() => {
    if (!isLoading) {
      fetchApplication()
    }
  }, [isLoading, params.id])

  // Update application status
  const updateApplicationStatus = async (
    status: "accepted" | "rejected" | "waitlisted" | "under_review"
  ) => {
    if (!application) return

    try {
      setUpdating(true)
      const response = await applicationApi.updateApplicationStatus(
        application.id,
        status,
        undefined,
        notes
      )

      if (response.success && response.data) {
        setApplication(response.data)
        toast.success(`Application ${status} successfully`)
      } else {
        toast.error(`Failed to ${status} application`)
      }
    } catch (error) {
      console.error("Error updating application status:", error)
      toast.error("Error updating application status")
    } finally {
      setUpdating(false)
    }
  }

  // Get status color and icon
  const getStatusDisplay = (status: string) => {
    switch (status) {
      case "accepted":
        return { color: "bg-green-100 text-green-800", icon: CheckCircle }
      case "rejected":
        return { color: "bg-red-100 text-red-800", icon: XCircle }
      case "waitlisted":
        return { color: "bg-yellow-100 text-yellow-800", icon: Clock }
      case "under_review":
        return { color: "bg-blue-100 text-blue-800", icon: AlertTriangle }
      case "submitted":
        return { color: "bg-purple-100 text-purple-800", icon: FileText }
      default:
        return { color: "bg-gray-100 text-gray-800", icon: FileText }
    }
  }

  // Get progress color
  const getProgressColor = (progress: number) => {
    if (progress >= 80) return "bg-green-500"
    if (progress >= 60) return "bg-yellow-500"
    return "bg-red-500"
  }

  // Format date
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-blue-600" />
          <p className="text-gray-600">Loading application details...</p>
        </div>
      </div>
    )
  }

  if (!application) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">Application not found</p>
        </div>
      </div>
    )
  }

  const statusDisplay = getStatusDisplay(application.status)
  const StatusIcon = statusDisplay.icon

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-4">
            <Button variant="ghost" size="sm" asChild>
              <Link href="/admin/applications">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Applications
              </Link>
            </Button>
          </div>
          
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Application Details
              </h1>
              <p className="text-gray-600 mt-1">
                {application.student.studentProfile.first_name} {application.student.studentProfile.last_name} • {application.program.name}
              </p>
            </div>
            
            <div className="flex items-center gap-3">
              <Badge className={`${statusDisplay.color} border-0`}>
                <StatusIcon className="w-4 h-4 mr-1" />
                {application.status.replace("_", " ").toUpperCase()}
              </Badge>
              
              {application.priority && (
                <Badge variant="outline" className="capitalize">
                  <Star className="w-3 h-3 mr-1" />
                  {application.priority} Priority
                </Badge>
              )}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Student Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="w-5 h-5" />
                  Student Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm font-medium text-gray-500">Full Name</Label>
                    <p className="text-gray-900 font-medium">
                      {application.student.studentProfile.first_name} {application.student.studentProfile.last_name}
                    </p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-500">Email</Label>
                    <p className="text-gray-900 flex items-center gap-2">
                      <Mail className="w-4 h-4" />
                      {application.student.email}
                    </p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-500">Phone</Label>
                    <p className="text-gray-900 flex items-center gap-2">
                      <Phone className="w-4 h-4" />
                      {application.student.studentProfile.phone_number}
                    </p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-500">Date of Birth</Label>
                    <p className="text-gray-900 flex items-center gap-2">
                      <Calendar className="w-4 h-4" />
                      {new Date(application.student.studentProfile.date_of_birth).toLocaleDateString()}
                    </p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-500">Nationality</Label>
                    <p className="text-gray-900">{application.student.studentProfile.nationality}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-500">Address</Label>
                    <p className="text-gray-900 flex items-center gap-2">
                      <MapPin className="w-4 h-4" />
                      {application.student.studentProfile.address.street}, {application.student.studentProfile.address.city}, {application.student.studentProfile.address.country}
                    </p>
                  </div>
                </div>

                {application.student.studentProfile.bio && (
                  <div>
                    <Label className="text-sm font-medium text-gray-500">Bio</Label>
                    <p className="text-gray-900 mt-1">{application.student.studentProfile.bio}</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Academic Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <GraduationCap className="w-5 h-5" />
                  Academic History
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {application.academic_history.map((academic, index) => (
                    <div key={index} className="border rounded-lg p-4">
                      <div className="flex justify-between items-start mb-2">
                        <h4 className="font-semibold text-gray-900">{academic.institution}</h4>
                        <Badge variant={academic.is_completed ? "default" : "secondary"}>
                          {academic.is_completed ? "Completed" : "In Progress"}
                        </Badge>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-2 text-sm">
                        <p><span className="font-medium">Degree:</span> {academic.degree}</p>
                        <p><span className="font-medium">Field:</span> {academic.field_of_study}</p>
                        <p><span className="font-medium">GPA:</span> {academic.gpa.toFixed(2)}</p>
                        <p><span className="font-medium">Start:</span> {new Date(academic.start_date).toLocaleDateString()}</p>
                        <p><span className="font-medium">End:</span> {new Date(academic.end_date).toLocaleDateString()}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Personal Statement */}
            {application.personal_statement && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="w-5 h-5" />
                    Personal Statement
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="prose max-w-none">
                    <p className="text-gray-900 whitespace-pre-wrap">{application.personal_statement}</p>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Program Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <GraduationCap className="w-5 h-5" />
                  Program Details
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm font-medium text-gray-500">Program Name</Label>
                    <p className="text-gray-900 font-medium">{application.program.name}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-500">University</Label>
                    <p className="text-gray-900 font-medium">{application.program.university.name}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-500">Degree Type</Label>
                    <p className="text-gray-900">{application.program.degree}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-500">Duration</Label>
                    <p className="text-gray-900">{application.program.duration}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-500">Application Fee</Label>
                    <p className="text-gray-900">${application.program.application_fee}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-500">Tuition Fee</Label>
                    <p className="text-gray-900">${application.program.tuition_fee.toLocaleString()}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button 
                  className="w-full" 
                  variant="outline"
                  onClick={() => updateApplicationStatus("under_review")}
                  disabled={updating || application.status === "under_review"}
                >
                  {updating ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Clock className="w-4 h-4 mr-2" />}
                  Mark Under Review
                </Button>
                
                <Button 
                  className="w-full bg-green-600 hover:bg-green-700" 
                  onClick={() => updateApplicationStatus("accepted")}
                  disabled={updating || application.status === "accepted"}
                >
                  {updating ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <CheckCircle className="w-4 h-4 mr-2" />}
                  Accept Application
                </Button>
                
                <Button 
                  className="w-full bg-yellow-600 hover:bg-yellow-700" 
                  onClick={() => updateApplicationStatus("waitlisted")}
                  disabled={updating || application.status === "waitlisted"}
                >
                  {updating ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Clock className="w-4 h-4 mr-2" />}
                  Add to Waitlist
                </Button>
                
                <Button 
                  className="w-full bg-red-600 hover:bg-red-700" 
                  variant="destructive"
                  onClick={() => updateApplicationStatus("rejected")}
                  disabled={updating || application.status === "rejected"}
                >
                  {updating ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <XCircle className="w-4 h-4 mr-2" />}
                  Reject Application
                </Button>
              </CardContent>
            </Card>

            {/* Application Progress */}
            <Card>
              <CardHeader>
                <CardTitle>Application Progress</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span>Completion</span>
                    <span>{application.progress}%</span>
                  </div>
                  <Progress value={application.progress} className="h-2" />
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="flex items-center gap-2">
                      <div className={`w-2 h-2 rounded-full ${application.documents.transcript ? 'bg-green-500' : 'bg-red-500'}`} />
                      Transcript
                    </span>
                    {application.documents.transcript ? <CheckCircle className="w-4 h-4 text-green-600" /> : <XCircle className="w-4 h-4 text-red-600" />}
                  </div>
                  
                  <div className="flex items-center justify-between text-sm">
                    <span className="flex items-center gap-2">
                      <div className={`w-2 h-2 rounded-full ${application.documents.essay ? 'bg-green-500' : 'bg-red-500'}`} />
                      Essay
                    </span>
                    {application.documents.essay ? <CheckCircle className="w-4 h-4 text-green-600" /> : <XCircle className="w-4 h-4 text-red-600" />}
                  </div>
                  
                  <div className="flex items-center justify-between text-sm">
                    <span className="flex items-center gap-2">
                      <div className={`w-2 h-2 rounded-full ${application.documents.recommendation ? 'bg-green-500' : 'bg-red-500'}`} />
                      Recommendation
                    </span>
                    {application.documents.recommendation ? <CheckCircle className="w-4 h-4 text-green-600" /> : <XCircle className="w-4 h-4 text-red-600" />}
                  </div>
                  
                  <div className="flex items-center justify-between text-sm">
                    <span className="flex items-center gap-2">
                      <div className={`w-2 h-2 rounded-full ${application.documents.portfolio ? 'bg-green-500' : 'bg-red-500'}`} />
                      Portfolio
                    </span>
                    {application.documents.portfolio ? <CheckCircle className="w-4 h-4 text-green-600" /> : <XCircle className="w-4 h-4 text-red-600" />}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Payment Information */}
            {application.payment && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <CreditCard className="w-5 h-5" />
                    Payment Details
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div>
                    <Label className="text-sm font-medium text-gray-500">Status</Label>
                    <Badge 
                      variant={application.payment.status === "completed" ? "default" : "secondary"}
                      className="ml-2"
                    >
                      {application.payment.status.toUpperCase()}
                    </Badge>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-500">Amount</Label>
                    <p className="text-gray-900 font-medium">
                      ${application.payment.amount} {application.payment.currency.toUpperCase()}
                    </p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-500">Method</Label>
                    <p className="text-gray-900 capitalize">{application.payment.method.replace("_", " ")}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-500">Transaction ID</Label>
                    <p className="text-gray-900 text-xs break-all">{application.payment.transaction_id}</p>
                  </div>
                  {application.payment.receipt_url && (
                    <Button variant="outline" size="sm" className="w-full" asChild>
                      <a href={application.payment.receipt_url} target="_blank" rel="noopener noreferrer">
                        <Download className="w-4 h-4 mr-2" />
                        Download Receipt
                      </a>
                    </Button>
                  )}
                </CardContent>
              </Card>
            )}

            {/* Timestamps */}
            <Card>
              <CardHeader>
                <CardTitle>Timeline</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                <div>
                  <Label className="text-gray-500">Created</Label>
                  <p className="text-gray-900">{formatDate(application.created_at)}</p>
                </div>
                <div>
                  <Label className="text-gray-500">Submitted</Label>
                  <p className="text-gray-900">{formatDate(application.submitted_at)}</p>
                </div>
                {application.reviewed_at && (
                  <div>
                    <Label className="text-gray-500">Reviewed</Label>
                    <p className="text-gray-900">{formatDate(application.reviewed_at)}</p>
                  </div>
                )}
                <div>
                  <Label className="text-gray-500">Last Updated</Label>
                  <p className="text-gray-900">{formatDate(application.updated_at)}</p>
                </div>
              </CardContent>
            </Card>

            {/* Review Notes */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MessageSquare className="w-5 h-5" />
                  Review Notes
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Textarea
                  placeholder="Add your review notes here..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  rows={4}
                />
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="w-full"
                  onClick={() => updateApplicationStatus(application.status as any)}
                  disabled={updating}
                >
                  {updating ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <MessageSquare className="w-4 h-4 mr-2" />}
                  Save Notes
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}