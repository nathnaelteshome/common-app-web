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
} from "lucide-react"
import Link from "next/link"
import { mockAdminApplications } from "@/data/mock-admin-data"

export default function AdminApplications() {
  const { user, isAuthenticated } = useAuthStore()
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [priorityFilter, setPriorityFilter] = useState("all")
  const [sortBy, setSortBy] = useState("submittedAt")

  useEffect(() => {
    if (!isAuthenticated || user?.role !== "university") {
      router.push("/auth/sign-in")
    }
  }, [isAuthenticated, user, router])

  if (!isAuthenticated || user?.role !== "university") {
    return null
  }

  const filteredApplications = mockAdminApplications.filter((app) => {
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
      case "submittedAt":
        return new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime()
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

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "accepted":
        return <CheckCircle className="w-4 h-4 text-green-600" />
      case "rejected":
        return <XCircle className="w-4 h-4 text-red-600" />
      case "under-review":
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
      case "under-review":
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

  const statusCounts = {
    all: mockAdminApplications.length,
    submitted: mockAdminApplications.filter((app) => app.status === "submitted").length,
    "under-review": mockAdminApplications.filter((app) => app.status === "under-review").length,
    accepted: mockAdminApplications.filter((app) => app.status === "accepted").length,
    rejected: mockAdminApplications.filter((app) => app.status === "rejected").length,
    waitlisted: mockAdminApplications.filter((app) => app.status === "waitlisted").length,
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <div className="container mx-auto px-4 py-8">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Application Management</h1>
            <p className="text-gray-600">Review and manage student applications</p>
          </div>
          <div className="flex gap-2 mt-4 md:mt-0">
            <Button variant="outline" asChild>
              <Link href="/admin/applications/export">
                <Download className="w-4 h-4 mr-2" />
                Export
              </Link>
            </Button>
            <Button className="bg-[#0a5eb2] hover:bg-[#0a5eb2]/90" asChild>
              <Link href="/admin/eligibility">
                <Filter className="w-4 h-4 mr-2" />
                Auto Filter
              </Link>
            </Button>
          </div>
        </div>

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
                  <SelectItem value="all">All Status ({statusCounts.all})</SelectItem>
                  <SelectItem value="submitted">Submitted ({statusCounts.submitted})</SelectItem>
                  <SelectItem value="under-review">Under Review ({statusCounts["under-review"]})</SelectItem>
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
                  <SelectItem value="submittedAt">Submission Date</SelectItem>
                  <SelectItem value="eligibilityScore">Eligibility Score</SelectItem>
                  <SelectItem value="studentName">Student Name</SelectItem>
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
        <div className="space-y-4">
          {sortedApplications.map((application) => (
            <Card key={application.id} className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-4 flex-1">
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
                            variant={application.paymentStatus === "paid" ? "default" : "outline"}
                            className="text-xs ml-1"
                          >
                            {application.paymentStatus}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-2">
                          <FileText className="w-4 h-4 text-blue-500" />
                          <span className="text-sm">
                            <span className="font-medium">Documents:</span> {application.documents.length}
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
                        {application.status === "submitted" && (
                          <>
                            <Button size="sm" className="bg-green-600 hover:bg-green-700 text-white">
                              <CheckCircle className="w-4 h-4 mr-1" />
                              Accept
                            </Button>
                            <Button size="sm" variant="destructive">
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
      </div>

      <Footer />
    </div>
  )
}
