"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useAuthStore } from "@/store/auth-store"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import {
  CheckCircle,
  XCircle,
  Clock,
  AlertTriangle,
  Eye,
  FileText,
  Download,
  Search,
  Filter,
  Bell,
  Calendar,
  Building,
  User,
  Mail,
} from "lucide-react"
import Link from "next/link"
import { mockVerificationRequests } from "@/data/mock-verification-data"
import { toast } from "sonner"

export default function VerificationManagement() {
  const { user, isAuthenticated } = useAuthStore()
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [priorityFilter, setPriorityFilter] = useState("all")
  const [selectedRequest, setSelectedRequest] = useState<any>(null)
  const [reviewNotes, setReviewNotes] = useState("")
  const [rejectionReason, setRejectionReason] = useState("")

  useEffect(() => {
    if (!isAuthenticated || user?.role !== "admin") {
      router.push("/auth/sign-in")
    }

    const urlParams = new URLSearchParams(window.location.search)
    const highlightId = urlParams.get("highlight")

    if (highlightId) {
      // Scroll to and highlight the specific request
      setTimeout(() => {
        const element = document.getElementById(`request-${highlightId}`)
        if (element) {
          element.scrollIntoView({ behavior: "smooth" })
          element.classList.add("ring-2", "ring-blue-500", "ring-opacity-50")
          setTimeout(() => {
            element.classList.remove("ring-2", "ring-blue-500", "ring-opacity-50")
          }, 3000)
        }
      }, 500)
    }
  }, [isAuthenticated, user, router])

  if (!isAuthenticated || user?.role !== "admin") {
    return null
  }

  const filteredRequests = mockVerificationRequests.filter((req) => {
    const matchesSearch =
      req.universityName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      req.adminEmail.toLowerCase().includes(searchQuery.toLowerCase()) ||
      req.adminName.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStatus = statusFilter === "all" || req.status === statusFilter
    const matchesPriority = priorityFilter === "all" || req.priority === priorityFilter
    return matchesSearch && matchesStatus && matchesPriority
  })

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "approved":
        return <CheckCircle className="w-4 h-4 text-green-600" />
      case "rejected":
        return <XCircle className="w-4 h-4 text-red-600" />
      case "under_review":
        return <Clock className="w-4 h-4 text-blue-600" />
      case "pending":
        return <AlertTriangle className="w-4 h-4 text-yellow-600" />
      default:
        return <Building className="w-4 h-4 text-gray-600" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "approved":
        return "bg-green-100 text-green-800"
      case "rejected":
        return "bg-red-100 text-red-800"
      case "under_review":
        return "bg-blue-100 text-blue-800"
      case "pending":
        return "bg-yellow-100 text-yellow-800"
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

  const handleApprove = async (requestId: string) => {
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))
      toast.success("University verification approved successfully")
      // In real app, refetch data
    } catch (error) {
      toast.error("Failed to approve verification")
    }
  }

  const handleReject = async (requestId: string, reason: string) => {
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))
      toast.success("University verification rejected")
      setRejectionReason("")
      // In real app, refetch data
    } catch (error) {
      toast.error("Failed to reject verification")
    }
  }

  const handleStartReview = async (requestId: string) => {
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 500))
      toast.success("Review started")
      // In real app, update status to under_review
    } catch (error) {
      toast.error("Failed to start review")
    }
  }

  const statusCounts = {
    all: mockVerificationRequests.length,
    pending: mockVerificationRequests.filter((req) => req.status === "pending").length,
    under_review: mockVerificationRequests.filter((req) => req.status === "under_review").length,
    approved: mockVerificationRequests.filter((req) => req.status === "approved").length,
    rejected: mockVerificationRequests.filter((req) => req.status === "rejected").length,
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <div className="container mx-auto px-4 py-8">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">University Verification Management</h1>
            <p className="text-gray-600">Review and approve university admin registration requests</p>
          </div>
          <div className="flex gap-2 mt-4 md:mt-0">
            <Button variant="outline" asChild>
              <Link href="/system-admin/verification/reports">
                <FileText className="w-4 h-4 mr-2" />
                Reports
              </Link>
            </Button>
            <Button variant="outline" asChild>
              <Link href="/system-admin/verification/settings">
                <Filter className="w-4 h-4 mr-2" />
                Settings
              </Link>
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="border-l-4 border-l-yellow-500">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Pending Review</p>
                  <p className="text-3xl font-bold text-yellow-600">{statusCounts.pending}</p>
                </div>
                <AlertTriangle className="w-8 h-8 text-yellow-500" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-blue-500">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Under Review</p>
                  <p className="text-3xl font-bold text-blue-600">{statusCounts.under_review}</p>
                </div>
                <Clock className="w-8 h-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-green-500">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Approved</p>
                  <p className="text-3xl font-bold text-green-600">{statusCounts.approved}</p>
                </div>
                <CheckCircle className="w-8 h-8 text-green-500" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-red-500">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Rejected</p>
                  <p className="text-3xl font-bold text-red-600">{statusCounts.rejected}</p>
                </div>
                <XCircle className="w-8 h-8 text-red-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="requests" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="requests">Verification Requests</TabsTrigger>
            <TabsTrigger value="documents">Document Review</TabsTrigger>
            <TabsTrigger value="notifications">Notifications</TabsTrigger>
          </TabsList>

          <TabsContent value="requests" className="space-y-6">
            {/* Filters */}
            <Card>
              <CardContent className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <Input
                      type="text"
                      placeholder="Search requests..."
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
                      <SelectItem value="all">All Status ({statusCounts.all})</SelectItem>
                      <SelectItem value="pending">Pending ({statusCounts.pending})</SelectItem>
                      <SelectItem value="under_review">Under Review ({statusCounts.under_review})</SelectItem>
                      <SelectItem value="approved">Approved ({statusCounts.approved})</SelectItem>
                      <SelectItem value="rejected">Rejected ({statusCounts.rejected})</SelectItem>
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
                  <Button variant="outline" className="w-full">
                    <Download className="w-4 h-4 mr-2" />
                    Export
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Requests Table */}
            <Card>
              <CardHeader>
                <CardTitle>Verification Requests ({filteredRequests.length})</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>University</TableHead>
                      <TableHead>Admin Contact</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Priority</TableHead>
                      <TableHead>Submitted</TableHead>
                      <TableHead>Est. Review Time</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredRequests.map((request) => (
                      <TableRow key={request.id} id={`request-${request.id}`}>
                        <TableCell>
                          <div>
                            <div className="font-medium">{request.universityName}</div>
                            <div className="text-sm text-gray-500">ID: {request.universityId}</div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div>
                            <div className="font-medium">{request.adminName}</div>
                            <div className="text-sm text-gray-500">{request.adminEmail}</div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            {getStatusIcon(request.status)}
                            <Badge className={`${getStatusColor(request.status)} border-0`}>
                              {request.status.replace("_", " ")}
                            </Badge>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge className={`${getPriorityColor(request.priority)} border-0`}>{request.priority}</Badge>
                        </TableCell>
                        <TableCell>{new Date(request.submittedAt).toLocaleDateString()}</TableCell>
                        <TableCell>{request.estimatedReviewTime}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Dialog>
                              <DialogTrigger asChild>
                                <Button variant="ghost" size="sm" onClick={() => setSelectedRequest(request)}>
                                  <Eye className="w-4 h-4" />
                                </Button>
                              </DialogTrigger>
                              <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                                <DialogHeader>
                                  <DialogTitle>University Verification Details</DialogTitle>
                                  <DialogDescription>Review university information and documents</DialogDescription>
                                </DialogHeader>
                                {selectedRequest && (
                                  <div className="space-y-6">
                                    {/* University Info */}
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                      <Card>
                                        <CardHeader>
                                          <CardTitle className="text-lg">University Information</CardTitle>
                                        </CardHeader>
                                        <CardContent className="space-y-4">
                                          <div className="flex items-center gap-2">
                                            <Building className="w-4 h-4 text-gray-500" />
                                            <span className="font-medium">{selectedRequest.universityName}</span>
                                          </div>
                                          <div className="flex items-center gap-2">
                                            <User className="w-4 h-4 text-gray-500" />
                                            <span>{selectedRequest.adminName}</span>
                                          </div>
                                          <div className="flex items-center gap-2">
                                            <Mail className="w-4 h-4 text-gray-500" />
                                            <span>{selectedRequest.adminEmail}</span>
                                          </div>
                                          <div className="flex items-center gap-2">
                                            <Calendar className="w-4 h-4 text-gray-500" />
                                            <span>
                                              Submitted: {new Date(selectedRequest.submittedAt).toLocaleString()}
                                            </span>
                                          </div>
                                        </CardContent>
                                      </Card>

                                      <Card>
                                        <CardHeader>
                                          <CardTitle className="text-lg">Verification Checklist</CardTitle>
                                        </CardHeader>
                                        <CardContent className="space-y-3">
                                          {Object.entries(selectedRequest.verificationChecklist).map(([key, value]) => (
                                            <div key={key} className="flex items-center justify-between">
                                              <span className="text-sm capitalize">
                                                {key.replace(/([A-Z])/g, " $1").trim()}
                                              </span>
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
                                    <Card>
                                      <CardHeader>
                                        <CardTitle className="text-lg">Submitted Documents</CardTitle>
                                      </CardHeader>
                                      <CardContent>
                                        <div className="space-y-3">
                                          {selectedRequest.documents.map((doc: any) => (
                                            <div
                                              key={doc.id}
                                              className="flex items-center justify-between p-3 border rounded-lg"
                                            >
                                              <div className="flex items-center gap-3">
                                                <FileText className="w-5 h-5 text-gray-500" />
                                                <div>
                                                  <p className="font-medium">{doc.name}</p>
                                                  <p className="text-sm text-gray-500 capitalize">
                                                    {doc.type.replace("_", " ")}
                                                  </p>
                                                </div>
                                              </div>
                                              <div className="flex items-center gap-2">
                                                <Badge className={`${getStatusColor(doc.status)} border-0`}>
                                                  {doc.status}
                                                </Badge>
                                                <Button variant="ghost" size="sm">
                                                  <Download className="w-4 h-4" />
                                                </Button>
                                              </div>
                                            </div>
                                          ))}
                                        </div>
                                      </CardContent>
                                    </Card>

                                    {/* Review Notes */}
                                    {selectedRequest.reviewNotes && (
                                      <Card>
                                        <CardHeader>
                                          <CardTitle className="text-lg">Review Notes</CardTitle>
                                        </CardHeader>
                                        <CardContent>
                                          <p className="text-sm text-gray-700">{selectedRequest.reviewNotes}</p>
                                        </CardContent>
                                      </Card>
                                    )}
                                  </div>
                                )}
                              </DialogContent>
                            </Dialog>

                            {request.status === "pending" && (
                              <Button variant="outline" size="sm" onClick={() => handleStartReview(request.id)}>
                                Start Review
                              </Button>
                            )}

                            {(request.status === "pending" || request.status === "under_review") && (
                              <>
                                <AlertDialog>
                                  <AlertDialogTrigger asChild>
                                    <Button size="sm" className="bg-green-600 hover:bg-green-700 text-white">
                                      Approve
                                    </Button>
                                  </AlertDialogTrigger>
                                  <AlertDialogContent>
                                    <AlertDialogHeader>
                                      <AlertDialogTitle>Approve University Verification</AlertDialogTitle>
                                      <AlertDialogDescription>
                                        Are you sure you want to approve {request.universityName}? This will grant them
                                        access to the admin dashboard.
                                      </AlertDialogDescription>
                                    </AlertDialogHeader>
                                    <AlertDialogFooter>
                                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                                      <AlertDialogAction
                                        onClick={() => handleApprove(request.id)}
                                        className="bg-green-600 hover:bg-green-700"
                                      >
                                        Approve
                                      </AlertDialogAction>
                                    </AlertDialogFooter>
                                  </AlertDialogContent>
                                </AlertDialog>

                                <Dialog>
                                  <DialogTrigger asChild>
                                    <Button size="sm" variant="destructive">
                                      Reject
                                    </Button>
                                  </DialogTrigger>
                                  <DialogContent>
                                    <DialogHeader>
                                      <DialogTitle>Reject University Verification</DialogTitle>
                                      <DialogDescription>
                                        Please provide a reason for rejecting this verification request.
                                      </DialogDescription>
                                    </DialogHeader>
                                    <div className="space-y-4">
                                      <Textarea
                                        placeholder="Enter rejection reason..."
                                        value={rejectionReason}
                                        onChange={(e) => setRejectionReason(e.target.value)}
                                        rows={4}
                                      />
                                    </div>
                                    <DialogFooter>
                                      <Button variant="outline" onClick={() => setRejectionReason("")}>
                                        Cancel
                                      </Button>
                                      <Button
                                        variant="destructive"
                                        onClick={() => handleReject(request.id, rejectionReason)}
                                        disabled={!rejectionReason.trim()}
                                      >
                                        Reject
                                      </Button>
                                    </DialogFooter>
                                  </DialogContent>
                                </Dialog>
                              </>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="documents" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Document Review Queue</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8">
                  <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Document Review Interface</h3>
                  <p className="text-gray-600">Advanced document review features coming soon</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="notifications" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Verification Notifications</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8">
                  <Bell className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Notification Center</h3>
                  <p className="text-gray-600">Manage verification notifications and alerts</p>
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
