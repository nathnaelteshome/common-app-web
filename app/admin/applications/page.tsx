"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useAuthStore } from "@/store/auth-store"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import {
  FileText,
  Search,
  Filter,
  CheckCircle,
  XCircle,
  Clock,
  AlertTriangle,
  Eye,
  MessageSquare,
  Download,
  Star,
  User,
  Calendar,
  DollarSign,
  Bell,
  Send,
  Zap,
  Loader2,
} from "lucide-react"
import Link from "next/link"
import { applicationApi, type ApplicationDetail } from "@/lib/api/applications"
import { toast } from "sonner"

interface ApplicationAction {
  id: string
  type: "accept" | "reject" | "waitlist"
  reason?: string
  notes?: string
  sendNotification: boolean
  customMessage?: string
}

// Transformed admin application interface to match API data
interface AdminApplication {
  id: string
  studentId: string
  studentName: string
  studentEmail: string
  programId: string
  programName: string
  universityId: string
  universityName: string
  status: "draft" | "submitted" | "under_review" | "accepted" | "rejected" | "waitlisted" | "withdrawn"
  submittedAt: string
  lastReviewed?: string
  reviewedBy?: string
  score?: number
  priority: "low" | "medium" | "high"
  paymentStatus: "pending" | "completed" | "failed"
  applicationFee: number
  documents: {
    essay: boolean
    portfolio: boolean
    transcript: boolean
    recommendation: boolean
  }
  eligibilityScore: number
  autoFilterResult: "eligible" | "not_eligible"
  tags: string[]
  notes?: string
}

export default function AdminApplications() {
  const { user, isAuthenticated } = useAuthStore()
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [priorityFilter, setPriorityFilter] = useState("all")
  const [sortBy, setSortBy] = useState("submitted_at")
  const [applications, setApplications] = useState<AdminApplication[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedApplication, setSelectedApplication] = useState<string | null>(null)
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 20,
    total: 0,
    totalPages: 0,
    hasNext: false,
    hasPrev: false
  })
  const [actionDialog, setActionDialog] = useState<{
    open: boolean
    type: "accept" | "reject" | "waitlist" | null
    applicationId: string | null
  }>({ open: false, type: null, applicationId: null })
  const [actionData, setActionData] = useState<ApplicationAction>({
    id: "",
    type: "accept",
    sendNotification: true,
    reason: "",
    notes: "",
    customMessage: "",
  })
  const [bulkMode, setBulkMode] = useState(false)
  const [selectedApplications, setSelectedApplications] = useState<Set<string>>(new Set())
  const [autoFilterEnabled, setAutoFilterEnabled] = useState(false)

  // Fetch applications from API
  const fetchApplications = async () => {
    try {
      setLoading(true)
      const params = {
        page: pagination.page,
        limit: pagination.limit,
        ...(statusFilter !== "all" && { status: statusFilter }),
        sortBy: sortBy,
        sortOrder: "desc" as const
      }
      
      const response = await applicationApi.listApplications(params)
      
      if (response.success && response.data) {
        // Transform API data to admin format
        const transformedApplications: AdminApplication[] = response.data.applications.map(app => ({
          id: app.id,
          studentId: "", // Not available in list view
          studentName: app.program.university.name, // Placeholder - would need student detail API
          studentEmail: "", // Not available in list view
          programId: app.program.id,
          programName: app.program.name,
          universityId: app.program.university.id,
          universityName: app.program.university.name,
          status: app.status,
          submittedAt: app.submittedAt,
          priority: "medium" as const, // Default priority
          paymentStatus: app.hasPayment ? "completed" : "pending",
          applicationFee: 500, // Default fee - would come from program details
          documents: {
            essay: false,
            portfolio: false,
            transcript: false,
            recommendation: false
          },
          eligibilityScore: 75, // Default score
          autoFilterResult: "eligible" as const,
          tags: []
        }))
        
        setApplications(transformedApplications)
        setPagination(response.data.pagination)
      } else {
        toast.error("Failed to load applications")
      }
    } catch (error) {
      console.error("Error fetching applications:", error)
      toast.error("Failed to load applications")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (!isAuthenticated || user?.role !== "university") {
      router.push("/auth/sign-in")
    } else {
      fetchApplications()
    }
  }, [isAuthenticated, user, router, statusFilter, sortBy, pagination.page])

  if (!isAuthenticated || user?.role !== "university") {
    return null
  }

  const filteredApplications = applications.filter((app) => {
    const matchesSearch =
      app.studentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      app.studentEmail.toLowerCase().includes(searchQuery.toLowerCase()) ||
      app.programName.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStatus = statusFilter === "all" || app.status === statusFilter
    const matchesPriority = priorityFilter === "all" || app.priority === priorityFilter
    return matchesSearch && matchesStatus && matchesPriority
  })

  const sortedApplications = [...filteredApplications].sort((a, b) => {
    switch (sortBy) {
      case "submitted_at":
        return new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime()
      case "updated_at":
      case "created_at":
        return new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime() // Fallback to submittedAt
      case "eligibilityScore":
        return b.eligibilityScore - a.eligibilityScore
      case "studentName":
        return a.studentName.localeCompare(b.studentName)
      case "priority":
        const priorityOrder = { high: 3, medium: 2, low: 1 }
        return priorityOrder[b.priority] - priorityOrder[a.priority]
      default:
        return 0
    }
  })

  const handleApplicationAction = async (applicationId: string, action: "accept" | "reject" | "waitlist") => {
    setActionDialog({ open: true, type: action, applicationId })
    setActionData({
      id: applicationId,
      type: action,
      sendNotification: true,
      reason: "",
      notes: "",
      customMessage: getDefaultMessage(action),
    })
  }

  const getDefaultMessage = (action: "accept" | "reject" | "waitlist"): string => {
    switch (action) {
      case "accept":
        return "Congratulations! Your application has been accepted. We look forward to welcoming you to our university."
      case "reject":
        return "Thank you for your interest in our university. Unfortunately, we are unable to offer you admission at this time."
      case "waitlist":
        return "Your application is currently on our waitlist. We will notify you if a spot becomes available."
      default:
        return ""
    }
  }

  const executeApplicationAction = async () => {
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500))

      // Update application status
      setApplications((prev) =>
        prev.map((app) =>
          app.id === actionData.id
            ? {
                ...app,
                status:
                  actionData.type === "accept" ? "accepted" : actionData.type === "reject" ? "rejected" : "waitlisted",
              }
            : app,
        ),
      )

      // Send notification if enabled
      if (actionData.sendNotification) {
        // Simulate sending notification
        toast.success(`Notification sent to student`)
      }

      toast.success(`Application ${actionData.type}ed successfully`)
      setActionDialog({ open: false, type: null, applicationId: null })
    } catch (error) {
      toast.error("Failed to process application")
    }
  }

  const handleBulkAction = async (action: "accept" | "reject" | "waitlist") => {
    if (selectedApplications.size === 0) {
      toast.error("Please select applications to process")
      return
    }

    try {
      // Simulate bulk processing
      await new Promise((resolve) => setTimeout(resolve, 2000))

      setApplications((prev) =>
        prev.map((app) =>
          selectedApplications.has(app.id)
            ? { ...app, status: action === "accept" ? "accepted" : action === "reject" ? "rejected" : "waitlisted" }
            : app,
        ),
      )

      toast.success(`${selectedApplications.size} applications ${action}ed successfully`)
      setSelectedApplications(new Set())
      setBulkMode(false)
    } catch (error) {
      toast.error("Failed to process applications")
    }
  }

  const runAutoFilter = async () => {
    try {
      setAutoFilterEnabled(true)
      await new Promise((resolve) => setTimeout(resolve, 3000))

      // Simulate auto-filtering based on eligibility criteria
      const autoFilteredApplications = applications.map((app) => {
        if (app.status === "submitted") {
          if (app.eligibilityScore >= 90) {
            return { ...app, status: "accepted" as const, tags: [...app.tags, "auto-accepted"] }
          } else if (app.eligibilityScore < 70) {
            return { ...app, status: "rejected" as const, tags: [...app.tags, "auto-rejected"] }
          } else {
            return { ...app, status: "under-review" as const, tags: [...app.tags, "auto-review"] }
          }
        }
        return app
      })

      setApplications(autoFilteredApplications)
      toast.success("Auto-filtering completed successfully")
    } catch (error) {
      toast.error("Auto-filtering failed")
    } finally {
      setAutoFilterEnabled(false)
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "accepted":
        return <CheckCircle className="w-4 h-4 text-green-600" />
      case "rejected":
        return <XCircle className="w-4 h-4 text-red-600" />
      case "under_review":
        return <Clock className="w-4 h-4 text-blue-600" />
      case "waitlisted":
        return <AlertTriangle className="w-4 h-4 text-yellow-600" />
      default:
        return <FileText className="w-4 h-4 text-gray-600" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "accepted":
        return "bg-green-100 text-green-800"
      case "rejected":
        return "bg-red-100 text-red-800"
      case "under_review":
        return "bg-blue-100 text-blue-800"
      case "waitlisted":
        return "bg-yellow-100 text-yellow-800"
      case "submitted":
        return "bg-purple-100 text-purple-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "bg-red-100 text-red-800"
      case "medium":
        return "bg-yellow-100 text-yellow-800"
      case "low":
        return "bg-green-100 text-green-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  // Calculate statistics from current applications
  const statusCounts = {
    total: applications.length,
    submitted: applications.filter(app => app.status === "submitted").length,
    underReview: applications.filter(app => app.status === "under_review").length,
    accepted: applications.filter(app => app.status === "accepted").length,
    rejected: applications.filter(app => app.status === "rejected").length,
    waitlisted: applications.filter(app => app.status === "waitlisted").length,
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <div className="container mx-auto px-4 py-8">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Application Management</h1>
            <p className="text-gray-600">Review and manage student applications with automated tools</p>
          </div>
          <div className="flex gap-2 mt-4 md:mt-0">
            <Button variant="outline" onClick={() => setBulkMode(!bulkMode)} className={bulkMode ? "bg-blue-100" : ""}>
              {bulkMode ? "Exit Bulk Mode" : "Bulk Actions"}
            </Button>
            <Button
              variant="outline"
              onClick={runAutoFilter}
              disabled={autoFilterEnabled}
              className="bg-gradient-to-r from-purple-500 to-blue-500 text-white hover:from-purple-600 hover:to-blue-600"
            >
              {autoFilterEnabled ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                  Auto-Filtering...
                </>
              ) : (
                <>
                  <Zap className="w-4 h-4 mr-2" />
                  Auto Filter
                </>
              )}
            </Button>
            <Button variant="outline" asChild>
              <Link href="/admin/applications/export">
                <Download className="w-4 h-4 mr-2" />
                Export
              </Link>
            </Button>
          </div>
        </div>

        {/* Bulk Actions Bar */}
        {bulkMode && (
          <Card className="mb-6 border-blue-200 bg-blue-50">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <span className="text-sm font-medium">
                    {selectedApplications.size} application{selectedApplications.size !== 1 ? "s" : ""} selected
                  </span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      const allIds = new Set(sortedApplications.map((app) => app.id))
                      setSelectedApplications(allIds)
                    }}
                  >
                    Select All
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => setSelectedApplications(new Set())}>
                    Clear Selection
                  </Button>
                </div>
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    onClick={() => handleBulkAction("accept")}
                    disabled={selectedApplications.size === 0}
                    className="bg-green-600 hover:bg-green-700"
                  >
                    Accept Selected
                  </Button>
                  <Button
                    size="sm"
                    onClick={() => handleBulkAction("waitlist")}
                    disabled={selectedApplications.size === 0}
                    className="bg-yellow-600 hover:bg-yellow-700"
                  >
                    Waitlist Selected
                  </Button>
                  <Button
                    size="sm"
                    onClick={() => handleBulkAction("reject")}
                    disabled={selectedApplications.size === 0}
                    variant="destructive"
                  >
                    Reject Selected
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Filters and Search */}
        <Card className="mb-6">
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  type="text"
                  placeholder="Search applications..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status ({statusCounts.total})</SelectItem>
                  <SelectItem value="submitted">Submitted ({statusCounts.submitted})</SelectItem>
                  <SelectItem value="under_review">Under Review ({statusCounts.underReview})</SelectItem>
                  <SelectItem value="accepted">Accepted ({statusCounts.accepted})</SelectItem>
                  <SelectItem value="rejected">Rejected ({statusCounts.rejected})</SelectItem>
                  <SelectItem value="waitlisted">Waitlisted ({statusCounts.waitlisted})</SelectItem>
                </SelectContent>
              </Select>
              <Select value={priorityFilter} onValueChange={setPriorityFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Filter by priority" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Priority</SelectItem>
                  <SelectItem value="high">High Priority</SelectItem>
                  <SelectItem value="medium">Medium Priority</SelectItem>
                  <SelectItem value="low">Low Priority</SelectItem>
                </SelectContent>
              </Select>
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger>
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="submitted_at">Submission Date</SelectItem>
                  <SelectItem value="updated_at">Last Updated</SelectItem>
                  <SelectItem value="created_at">Creation Date</SelectItem>
                  <SelectItem value="priority">Priority</SelectItem>
                </SelectContent>
              </Select>
              <Button variant="outline" className="w-full">
                <Filter className="w-4 h-4 mr-2" />
                Advanced Filters
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Applications List */}
        {loading ? (
          <div className="flex items-center justify-center h-64">
            <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
            <span className="ml-2 text-gray-600">Loading applications...</span>
          </div>
        ) : (
          <div className="space-y-4">
            {sortedApplications.map((application) => (
            <Card key={application.id} className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-4 flex-1">
                    {bulkMode && (
                      <input
                        type="checkbox"
                        checked={selectedApplications.has(application.id)}
                        onChange={(e) => {
                          const newSelected = new Set(selectedApplications)
                          if (e.target.checked) {
                            newSelected.add(application.id)
                          } else {
                            newSelected.delete(application.id)
                          }
                          setSelectedApplications(newSelected)
                        }}
                        className="mt-1"
                      />
                    )}
                    <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center">
                      <User className="w-6 h-6 text-gray-600" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <h3 className="font-semibold text-gray-900 text-lg">{application.studentName}</h3>
                          <p className="text-sm text-gray-600">{application.studentEmail}</p>
                          <p className="text-sm font-medium text-[#0a5eb2]">{application.programName}</p>
                        </div>
                        <div className="flex flex-col items-end gap-2">
                          <div className="flex items-center gap-2">
                            {getStatusIcon(application.status)}
                            <Badge className={`${getStatusColor(application.status)} border-0`}>
                              {application.status.replace("-", " ")}
                            </Badge>
                          </div>
                          <Badge className={`${getPriorityColor(application.priority)} border-0 text-xs`}>
                            {application.priority} priority
                          </Badge>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                        <div className="flex items-center gap-2">
                          <Star className="w-4 h-4 text-yellow-500" />
                          <span className="text-sm">
                            <span className="font-medium">Score:</span> {application.eligibilityScore}/100
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4 text-gray-500" />
                          <span className="text-sm">
                            <span className="font-medium">Submitted:</span>{" "}
                            {new Date(application.submittedAt).toLocaleDateString()}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <DollarSign className="w-4 h-4 text-green-500" />
                          <span className="text-sm">
                            <span className="font-medium">Fee:</span> ${application.applicationFee}
                          </span>
                          <Badge
                            variant={application.paymentStatus === "completed" ? "default" : "outline"}
                            className="text-xs ml-1"
                          >
                            {application.paymentStatus === "completed" ? "paid" : application.paymentStatus}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-2">
                          <FileText className="w-4 h-4 text-blue-500" />
                          <span className="text-sm">
                            <span className="font-medium">Documents:</span> {Object.values(application.documents).filter(Boolean).length}/{Object.keys(application.documents).length}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-1 mb-3">
                        {application.tags.map((tag) => (
                          <Badge key={tag} variant="outline" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                      </div>

                      <div className="flex items-center gap-2">
                        <Button variant="outline" size="sm" asChild>
                          <Link href={`/admin/applications/${application.id}`}>
                            <Eye className="w-4 h-4 mr-1" />
                            Review
                          </Link>
                        </Button>
                        <Button variant="outline" size="sm">
                          <MessageSquare className="w-4 h-4 mr-1" />
                          Message
                        </Button>
                        {(application.status === "submitted" || application.status === "under_review") && (
                          <>
                            <Button
                              size="sm"
                              className="bg-green-600 hover:bg-green-700 text-white"
                              onClick={() => handleApplicationAction(application.id, "accept")}
                            >
                              <CheckCircle className="w-4 h-4 mr-1" />
                              Accept
                            </Button>
                            <Button
                              size="sm"
                              className="bg-yellow-600 hover:bg-yellow-700 text-white"
                              onClick={() => handleApplicationAction(application.id, "waitlist")}
                            >
                              <AlertTriangle className="w-4 h-4 mr-1" />
                              Waitlist
                            </Button>
                            <Button
                              size="sm"
                              variant="destructive"
                              onClick={() => handleApplicationAction(application.id, "reject")}
                            >
                              <XCircle className="w-4 h-4 mr-1" />
                              Reject
                            </Button>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
            ))}
          </div>
        )}

        {/* Empty State */}
        {sortedApplications.length === 0 && (
          <Card className="text-center py-12">
            <CardContent>
              <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No applications found</h3>
              <p className="text-gray-600 mb-6">
                {searchQuery || statusFilter !== "all" || priorityFilter !== "all"
                  ? "Try adjusting your search or filter criteria"
                  : "No applications have been submitted yet"}
              </p>
            </CardContent>
          </Card>
        )}

        {/* Action Dialog */}
        <Dialog open={actionDialog.open} onOpenChange={(open) => setActionDialog({ ...actionDialog, open })}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                {actionDialog.type === "accept" && <CheckCircle className="w-5 h-5 text-green-600" />}
                {actionDialog.type === "reject" && <XCircle className="w-5 h-5 text-red-600" />}
                {actionDialog.type === "waitlist" && <AlertTriangle className="w-5 h-5 text-yellow-600" />}
                {actionDialog.type === "accept" && "Accept Application"}
                {actionDialog.type === "reject" && "Reject Application"}
                {actionDialog.type === "waitlist" && "Waitlist Application"}
              </DialogTitle>
            </DialogHeader>

            <div className="space-y-4">
              <div>
                <Label htmlFor="reason">Reason (Optional)</Label>
                <Select
                  value={actionData.reason}
                  onValueChange={(value) => setActionData((prev) => ({ ...prev, reason: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a reason" />
                  </SelectTrigger>
                  <SelectContent>
                    {actionDialog.type === "accept" && (
                      <>
                        <SelectItem value="excellent_qualifications">Excellent Qualifications</SelectItem>
                        <SelectItem value="meets_requirements">Meets All Requirements</SelectItem>
                        <SelectItem value="strong_application">Strong Application</SelectItem>
                      </>
                    )}
                    {actionDialog.type === "reject" && (
                      <>
                        <SelectItem value="insufficient_grades">Insufficient Grades</SelectItem>
                        <SelectItem value="missing_requirements">Missing Requirements</SelectItem>
                        <SelectItem value="program_full">Program Full</SelectItem>
                        <SelectItem value="incomplete_application">Incomplete Application</SelectItem>
                      </>
                    )}
                    {actionDialog.type === "waitlist" && (
                      <>
                        <SelectItem value="competitive_pool">Competitive Applicant Pool</SelectItem>
                        <SelectItem value="limited_spots">Limited Available Spots</SelectItem>
                        <SelectItem value="pending_review">Pending Further Review</SelectItem>
                      </>
                    )}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="notes">Internal Notes (Optional)</Label>
                <Textarea
                  id="notes"
                  value={actionData.notes}
                  onChange={(e) => setActionData((prev) => ({ ...prev, notes: e.target.value }))}
                  placeholder="Add internal notes for your records..."
                  rows={3}
                />
              </div>

              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="sendNotification"
                  checked={actionData.sendNotification}
                  onChange={(e) => setActionData((prev) => ({ ...prev, sendNotification: e.target.checked }))}
                />
                <Label htmlFor="sendNotification" className="flex items-center gap-2">
                  <Bell className="w-4 h-4" />
                  Send notification to student
                </Label>
              </div>

              {actionData.sendNotification && (
                <div>
                  <Label htmlFor="customMessage">Custom Message</Label>
                  <Textarea
                    id="customMessage"
                    value={actionData.customMessage}
                    onChange={(e) => setActionData((prev) => ({ ...prev, customMessage: e.target.value }))}
                    placeholder="Customize the message sent to the student..."
                    rows={4}
                  />
                </div>
              )}

              <div className="flex justify-end gap-2 pt-4">
                <Button
                  variant="outline"
                  onClick={() => setActionDialog({ open: false, type: null, applicationId: null })}
                >
                  Cancel
                </Button>
                <Button
                  onClick={executeApplicationAction}
                  className={
                    actionDialog.type === "accept"
                      ? "bg-green-600 hover:bg-green-700"
                      : actionDialog.type === "reject"
                        ? "bg-red-600 hover:bg-red-700"
                        : "bg-yellow-600 hover:bg-yellow-700"
                  }
                >
                  <Send className="w-4 h-4 mr-2" />
                  Confirm{" "}
                  {actionDialog.type === "accept" ? "Accept" : actionDialog.type === "reject" ? "Reject" : "Waitlist"}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <Footer />
    </div>
  )
}
