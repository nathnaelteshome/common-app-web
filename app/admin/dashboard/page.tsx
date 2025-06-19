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
import {
  FileText,
  CheckCircle,
  Clock,
  DollarSign,
  AlertTriangle,
  Plus,
  ArrowRight,
  BarChart3,
  Users,
  Bell,
  MessageSquare,
  Eye,
  Download,
  PenTool,
  Loader2,
} from "lucide-react"
import Link from "next/link"
import { applicationApi, type Application } from "@/lib/api/applications"
import { mockAnnouncements } from "@/data/mock-data"
import { toast } from "sonner"

export default function AdminDashboard() {
  const { user, isAuthenticated } = useAuthStore()
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true)
  const [applications, setApplications] = useState<Application[]>([])
  const [applicationsLoading, setApplicationsLoading] = useState(true)

  // Fetch applications for dashboard stats
  const fetchApplications = async () => {
    try {
      setApplicationsLoading(true)
      const response = await applicationApi.listApplications({ limit: 100 }) // Get more for accurate stats
      
      if (response.success && response.data) {
        setApplications(response.data.applications || [])
      } else {
        toast.error("Failed to load application statistics")
      }
    } catch (error) {
      console.error("Error fetching applications:", error)
      toast.error("Failed to load application statistics")
    } finally {
      setApplicationsLoading(false)
    }
  }

  useEffect(() => {
    if (!isAuthenticated || user?.role !== "university") {
      router.push("/auth/sign-in")
    } else {
      setIsLoading(false)
      fetchApplications()
    }
  }, [isAuthenticated, user, router])

  if (isLoading || !isAuthenticated || user?.role !== "university") {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-[#0a5eb2]"></div>
      </div>
    )
  }

  // Dashboard metrics from real API data
  const totalApplications = applications.length
  const submittedApplications = applications.filter((app) => app.status === "submitted").length
  const underReviewApplications = applications.filter((app) => app.status === "under_review").length
  const acceptedApplications = applications.filter((app) => app.status === "accepted").length
  const rejectedApplications = applications.filter((app) => app.status === "rejected").length
  const paidApplications = applications.filter((app) => app.hasPayment).length
  // Note: Total revenue calculation would need application fee data from program details
  const estimatedRevenue = paidApplications * 500 // Estimated average fee

  const conversionRate = totalApplications > 0 ? (acceptedApplications / totalApplications) * 100 : 0
  const paymentRate = totalApplications > 0 ? (paidApplications / totalApplications) * 100 : 0

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <div className="container mx-auto px-4 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Welcome back, {user?.profile?.collegeName || "Administrator"}
              </h1>
              <p className="text-gray-600">
                Manage your university's admission process and track applications in real-time.
              </p>
            </div>
            <div className="flex gap-3">
              <Button variant="outline" asChild>
                <Link href="/admin/reports">
                  <Download className="w-4 h-4 mr-2" />
                  Export Reports
                </Link>
              </Button>
              <Button className="bg-[#0a5eb2] hover:bg-[#0a5eb2]/90" asChild>
                <Link href="/admin/forms/create">
                  <Plus className="w-4 h-4 mr-2" />
                  Create Form
                </Link>
              </Button>
            </div>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="border-l-4 border-l-blue-500">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Applications</p>
                  <p className="text-3xl font-bold text-gray-900">{applicationsLoading ? '...' : totalApplications}</p>
                  <p className="text-xs text-green-600 mt-1">↗ +12% from last month</p>
                </div>
                <div className="p-3 bg-blue-100 rounded-full">
                  <FileText className="w-6 h-6 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-orange-500">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Pending Review</p>
                  <p className="text-3xl font-bold text-orange-600">{applicationsLoading ? '...' : submittedApplications}</p>
                  <p className="text-xs text-orange-600 mt-1">Requires attention</p>
                </div>
                <div className="p-3 bg-orange-100 rounded-full">
                  <Clock className="w-6 h-6 text-orange-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-green-500">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Acceptance Rate</p>
                  <p className="text-3xl font-bold text-green-600">{applicationsLoading ? '...' : `${conversionRate.toFixed(1)}%`}</p>
                  <p className="text-xs text-green-600 mt-1">{acceptedApplications} accepted</p>
                </div>
                <div className="p-3 bg-green-100 rounded-full">
                  <CheckCircle className="w-6 h-6 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-purple-500">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Revenue</p>
                  <p className="text-3xl font-bold text-purple-600">{applicationsLoading ? '...' : `$${estimatedRevenue.toLocaleString()}`}</p>
                  <p className="text-xs text-purple-600 mt-1">{paymentRate.toFixed(1)}% payment rate</p>
                </div>
                <div className="p-3 bg-purple-100 rounded-full">
                  <DollarSign className="w-6 h-6 text-purple-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        {/* <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          <div className="lg:col-span-2">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Quick Actions</CardTitle>
                <Button variant="ghost" size="sm" asChild>
                  <Link href="/admin/tools">View All Tools</Link>
                </Button>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  <Button variant="outline" className="h-20 flex flex-col gap-2" asChild>
                    <Link href="/admin/forms">
                      <FileText className="w-6 h-6" />
                      <span className="text-sm">Admission Forms</span>
                    </Link>
                  </Button>
                  <Button variant="outline" className="h-20 flex flex-col gap-2" asChild>
                    <Link href="/admin/applications">
                      <Users className="w-6 h-6" />
                      <span className="text-sm">Applications</span>
                    </Link>
                  </Button>
                  <Button variant="outline" className="h-20 flex flex-col gap-2" asChild>
                    <Link href="/admin/blog">
                      <PenTool className="w-6 h-6" />
                      <span className="text-sm">Blog Management</span>
                    </Link>
                  </Button>
                  <Button variant="outline" className="h-20 flex flex-col gap-2" asChild>
                    <Link href="/admin/notifications">
                      <Bell className="w-6 h-6" />
                      <span className="text-sm">Notifications</span>
                    </Link>
                  </Button>
                  <Button variant="outline" className="h-20 flex flex-col gap-2" asChild>
                    <Link href="/admin/announcements">
                      <MessageSquare className="w-6 h-6" />
                      <span className="text-sm">Announcements</span>
                    </Link>
                  </Button>
                  <Button variant="outline" className="h-20 flex flex-col gap-2" asChild>
                    <Link href="/admin/payments">
                      <DollarSign className="w-6 h-6" />
                      <span className="text-sm">Payments</span>
                    </Link>
                  </Button>
                  <Button variant="outline" className="h-20 flex flex-col gap-2" asChild>
                    <Link href="/admin/analytics">
                      <BarChart3 className="w-6 h-6" />
                      <span className="text-sm">Analytics</span>
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          <div>
            <Card>
              <CardHeader>
                <CardTitle>Application Status</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-gray-600">Submitted</span>
                      <span className="text-sm font-medium">{submittedApplications}</span>
                    </div>
                    <Progress value={(submittedApplications / totalApplications) * 100} className="h-2" />
                  </div>
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-gray-600">Under Review</span>
                      <span className="text-sm font-medium">{underReviewApplications}</span>
                    </div>
                    <Progress value={(underReviewApplications / totalApplications) * 100} className="h-2" />
                  </div>
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-gray-600">Accepted</span>
                      <span className="text-sm font-medium">{acceptedApplications}</span>
                    </div>
                    <Progress value={(acceptedApplications / totalApplications) * 100} className="h-2" />
                  </div>
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-gray-600">Rejected</span>
                      <span className="text-sm font-medium">{rejectedApplications}</span>
                    </div>
                    <Progress value={(rejectedApplications / totalApplications) * 100} className="h-2" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div> */}

        {/* Recent Activity & Announcements */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Recent Applications</CardTitle>
              <Button variant="outline" size="sm" asChild>
                <Link href="/admin/applications">
                  View All
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Link>
              </Button>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {applicationsLoading ? (
                  <div className="flex items-center justify-center h-32">
                    <Loader2 className="w-6 h-6 animate-spin text-blue-600" />
                    <span className="ml-2 text-gray-600">Loading recent applications...</span>
                  </div>
                ) : applications.slice(0, 5).map((application) => (
                  <div key={application.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900">{application.program.university.name}</h4>
                      <p className="text-sm text-gray-600">{application.program.name}</p>
                      <p className="text-xs text-gray-500">{new Date(application.submittedAt).toLocaleDateString()}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge
                        variant={
                          application.status === "accepted"
                            ? "default"
                            : application.status === "rejected"
                              ? "destructive"
                              : "secondary"
                        }
                      >
                        {application.status.replace("_", " ")}
                      </Badge>
                      <Button variant="ghost" size="sm" asChild>
                        <Link href={`/admin/applications/${application.id}`}>
                          <Eye className="w-4 h-4" />
                        </Link>
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Recent Announcements</CardTitle>
              <Button variant="outline" size="sm" asChild>
                <Link href="/admin/announcements">
                  Manage
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Link>
              </Button>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {mockAnnouncements.slice(0, 4).map((announcement) => (
                  <div key={announcement.id} className="p-3 border rounded-lg">
                    <div className="flex items-start justify-between mb-2">
                      <h4 className="font-medium text-gray-900">{announcement.title}</h4>
                      <Badge variant={announcement.priority === "high" ? "destructive" : "outline"} className="text-xs">
                        {announcement.priority}
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-600 mb-2">{announcement.content.substring(0, 100)}...</p>
                    <p className="text-xs text-gray-400">
                      {announcement.publishedAt && new Date(announcement.publishedAt).toLocaleDateString()}
                    </p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Alerts & Reminders */}
        <div className="mt-8">
          <Card className="border-l-4 border-l-yellow-500">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-yellow-600" />
                Alerts & Reminders
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="p-4 bg-yellow-50 rounded-lg border border-yellow-200">
                  <h4 className="font-medium text-yellow-800 mb-2">Application Deadline</h4>
                  <p className="text-sm text-yellow-700">
                    Computer Science applications deadline in 5 days (Aug 30, 2024)
                  </p>
                </div>
                <div className="p-4 bg-red-50 rounded-lg border border-red-200">
                  <h4 className="font-medium text-red-800 mb-2">Pending Reviews</h4>
                  <p className="text-sm text-red-700">{submittedApplications} applications require immediate review</p>
                </div>
                <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                  <h4 className="font-medium text-blue-800 mb-2">Payment Follow-up</h4>
                  <p className="text-sm text-blue-700">
                    {totalApplications - paidApplications} applications have pending payments
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <Footer />
    </div>
  )
}
