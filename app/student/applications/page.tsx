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
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { FileText, Search, Plus, Clock, CheckCircle, XCircle, AlertCircle, Eye, Edit, Download, Loader2 } from "lucide-react"
import Link from "next/link"
import { applicationApi, type Application } from "@/lib/api/applications"
import { toast } from "sonner"

export default function StudentApplications() {
  const { user, isAuthenticated } = useAuthStore()
  const router = useRouter()
  const [applications, setApplications] = useState<Application[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [sortBy, setSortBy] = useState("submittedAt")
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 20,
    total: 0,
    totalPages: 0,
    hasNext: false,
    hasPrev: false
  })

  // Fetch applications from API
  const fetchApplications = async () => {
    try {
      setLoading(true)
      const params = {
        page: pagination.page,
        limit: pagination.limit,
        ...(statusFilter !== "all" && { status: statusFilter }),
        sortBy: sortBy === "lastUpdated" ? "updated_at" : sortBy === "deadline" ? "deadline" : "submitted_at",
        sortOrder: "desc" as const
      }
      
      const response = await applicationApi.listApplications(params)
      
      if (response.success && response.data) {
        setApplications(response.data.applications || [])
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
    if (!isAuthenticated || user?.role !== "student") {
      router.push("/auth/sign-in")
    } else {
      fetchApplications()
    }
  }, [isAuthenticated, user, router, statusFilter, sortBy, pagination.page])

  if (!isAuthenticated || user?.role !== "student") {
    return null
  }

  // Client-side search filtering (since backend doesn't support search yet)
  const filteredApplications = applications.filter((app) => {
    const matchesSearch =
      app.program.university.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      app.program.name.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesSearch
  })

  const sortedApplications = filteredApplications

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "accepted":
        return <CheckCircle className="w-4 h-4 text-green-600" />
      case "rejected":
        return <XCircle className="w-4 h-4 text-red-600" />
      case "under_review":
        return <Clock className="w-4 h-4 text-blue-600" />
      case "waitlisted":
        return <AlertCircle className="w-4 h-4 text-yellow-600" />
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

  const statusCounts = {
    all: applications.length,
    draft: applications.filter((app) => app.status === "draft").length,
    submitted: applications.filter((app) => app.status === "submitted").length,
    under_review: applications.filter((app) => app.status === "under_review").length,
    accepted: applications.filter((app) => app.status === "accepted").length,
    rejected: applications.filter((app) => app.status === "rejected").length,
    waitlisted: applications.filter((app) => app.status === "waitlisted").length,
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <div className="container mx-auto px-4 py-8">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">My Applications</h1>
            <p className="text-gray-600">Track and manage your university applications</p>
          </div>
          <Button className="mt-4 md:mt-0 bg-[#0a5eb2] hover:bg-[#0a5eb2]/90" asChild>
            <Link href="/student/applications/new">
              <Plus className="w-4 h-4 mr-2" />
              New Application
            </Link>
          </Button>
        </div>

        {/* Filters and Search */}
        <Card className="mb-6">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="relative flex-1">
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
                <SelectTrigger className="w-full md:w-[200px]">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status ({statusCounts.all})</SelectItem>
                  <SelectItem value="draft">Draft ({statusCounts.draft})</SelectItem>
                  <SelectItem value="submitted">Submitted ({statusCounts.submitted})</SelectItem>
                  <SelectItem value="under_review">Under Review ({statusCounts.under_review})</SelectItem>
                  <SelectItem value="accepted">Accepted ({statusCounts.accepted})</SelectItem>
                  <SelectItem value="rejected">Rejected ({statusCounts.rejected})</SelectItem>
                  <SelectItem value="waitlisted">Waitlisted ({statusCounts.waitlisted})</SelectItem>
                </SelectContent>
              </Select>
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-full md:w-[200px]">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="submittedAt">Last Updated</SelectItem>
                  <SelectItem value="deadline">Deadline</SelectItem>
                  <SelectItem value="university">University</SelectItem>
                  <SelectItem value="status">Status</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Applications Tabs */}
        <Tabs defaultValue="grid" className="space-y-6">
          <TabsList>
            <TabsTrigger value="grid">Grid View</TabsTrigger>
            <TabsTrigger value="list">List View</TabsTrigger>
          </TabsList>

          <TabsContent value="grid">
            {loading ? (
              <div className="flex items-center justify-center h-64">
                <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
                <span className="ml-2 text-gray-600">Loading applications...</span>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {sortedApplications.map((application) => (
                  <Card key={application.id} className="hover:shadow-lg transition-shadow">
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <CardTitle className="text-lg font-semibold text-gray-900 mb-1">
                            {application.program.university.name}
                          </CardTitle>
                          <p className="text-sm text-gray-600">{application.program.name}</p>
                        </div>
                        <Badge className={`${getStatusColor(application.status)} border-0`}>
                          {application.status.replace("_", " ")}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {/* Status and Submitted Date */}
                      <div className="space-y-2 text-sm">
                        <div className="flex items-center justify-between">
                          <span className="text-gray-600">Submitted:</span>
                          <span className="font-medium">
                            {application.submittedAt ? new Date(application.submittedAt).toLocaleDateString() : "Not submitted"}
                          </span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-gray-600">Payment:</span>
                          <Badge
                            variant={application.hasPayment ? "default" : "outline"}
                            className="text-xs"
                          >
                            {application.hasPayment ? "Paid" : "Pending"}
                          </Badge>
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex gap-2 pt-2">
                        <Button variant="outline" size="sm" className="flex-1" asChild>
                          <Link href={`/student/applications/${application.id}`}>
                            <Eye className="w-4 h-4 mr-1" />
                            View
                          </Link>
                        </Button>
                        {application.status === "draft" && (
                          <Button variant="outline" size="sm" className="flex-1" asChild>
                            <Link href={`/student/applications/${application.id}/edit`}>
                              <Edit className="w-4 h-4 mr-1" />
                              Edit
                            </Link>
                          </Button>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="list">
            {loading ? (
              <div className="flex items-center justify-center h-64">
                <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
                <span className="ml-2 text-gray-600">Loading applications...</span>
              </div>
            ) : (
              <Card>
                <CardContent className="p-0">
                  <div className="divide-y">
                    {sortedApplications.map((application) => (
                      <div key={application.id} className="p-6 hover:bg-gray-50 transition-colors">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-4 flex-1">
                            <div className="flex items-center gap-2">
                              {getStatusIcon(application.status)}
                              <Badge className={`${getStatusColor(application.status)} border-0`}>
                                {application.status.replace("_", " ")}
                              </Badge>
                            </div>
                            <div className="flex-1">
                              <h3 className="font-semibold text-gray-900">{application.program.university.name}</h3>
                              <p className="text-sm text-gray-600">{application.program.name}</p>
                            </div>
                            <div className="hidden md:flex items-center gap-6 text-sm text-gray-600">
                              <div>
                                <span className="font-medium">Submitted:</span>{" "}
                                {application.submittedAt ? new Date(application.submittedAt).toLocaleDateString() : "Not submitted"}
                              </div>
                              <div>
                                <span className="font-medium">Payment:</span>{" "}
                                {application.hasPayment ? "Paid" : "Pending"}
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <Button variant="ghost" size="sm" asChild>
                              <Link href={`/student/applications/${application.id}`}>
                                <Eye className="w-4 h-4" />
                              </Link>
                            </Button>
                            {application.status === "draft" && (
                              <Button variant="ghost" size="sm" asChild>
                                <Link href={`/student/applications/${application.id}/edit`}>
                                  <Edit className="w-4 h-4" />
                                </Link>
                              </Button>
                            )}
                            <Button variant="ghost" size="sm">
                              <Download className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>

        {/* Empty State */}
        {sortedApplications.length === 0 && (
          <Card className="text-center py-12">
            <CardContent>
              <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No applications found</h3>
              <p className="text-gray-600 mb-6">
                {searchQuery || statusFilter !== "all"
                  ? "Try adjusting your search or filter criteria"
                  : "Start your journey by creating your first application"}
              </p>
              <Button className="bg-[#0a5eb2] hover:bg-[#0a5eb2]/90" asChild>
                <Link href="/student/applications/new">
                  <Plus className="w-4 h-4 mr-2" />
                  Create New Application
                </Link>
              </Button>
            </CardContent>
          </Card>
        )}
      </div>

      <Footer />
    </div>
  )
}
