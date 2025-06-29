"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { FileText, University, Bell, TrendingUp, Clock, CheckCircle, Eye, Settings, Loader2 } from "lucide-react"
import Link from "next/link"
import { useAuthStore } from "@/store/auth-store"
import { applicationApi, type Application } from "@/lib/api/applications"
import { announcementService, type Announcement } from "@/lib/api/announcements"
import { ApplicationStatusCard } from "@/components/application-status-card"
import { QuickActions } from "@/components/quick-actions"
import { RecentActivity } from "@/components/recent-activity"
import { UpcomingDeadlines } from "@/components/upcoming-deadlines"
import { toast } from "sonner"

export function StudentDashboard() {
  const { user } = useAuthStore()
  const [activeTab, setActiveTab] = useState("overview")
  const [applications, setApplications] = useState<Application[]>([])
  const [announcements, setAnnouncements] = useState<Announcement[]>([])
  const [loading, setLoading] = useState(true)

  // Fetch applications and announcements from API
  const fetchData = async () => {
    try {
      setLoading(true)
      
      // Fetch applications
      const applicationsResponse = await applicationApi.listApplications({ 
        limit: 10, 
        sortBy: "submitted_at", 
        sortOrder: "desc" 
      })
      
      if (applicationsResponse.success && applicationsResponse.data) {
        setApplications(applicationsResponse.data.applications || [])
      }
      
      // Fetch announcements for notifications
      const announcementsResponse = await announcementService.getAnnouncementsByAudience("students", {
        status: "published",
        page: 1,
        limit: 10,
        sortBy: "publishDate",
        sortOrder: "desc"
      })
      
      if (announcementsResponse.announcements) {
        setAnnouncements(announcementsResponse.announcements)
      }
    } catch (error) {
      console.error("Error fetching data:", error)
      toast.error("Failed to load dashboard data")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  // Calculate dashboard stats
  const totalApplications = applications.length
  const acceptedApplications = applications.filter((app) => app.status === "accepted").length
  const pendingApplications = applications.filter((app) => app.status === "under_review").length
  // Use announcements as notifications (in a real app, these would be separate)
  const unreadNotifications = announcements.filter((announcement) => 
    announcement.priority === "high" || announcement.type === "urgent"
  ).length

  const completionRate = totalApplications > 0 ? Math.round((acceptedApplications / totalApplications) * 100) : 0

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Welcome Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Welcome back, {user?.profile?.firstName || "Student"}!
        </h1>
        <p className="text-gray-600">Track your applications and manage your university journey</p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="applications">Applications</TabsTrigger>
          {/* <TabsTrigger value="compare">Compare</TabsTrigger> */}
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="profile">Profile</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {/* Stats Overview */}
          {loading ? (
            <div className="flex items-center justify-center h-32">
              <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
              <span className="ml-2 text-gray-600">Loading dashboard...</span>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Total Applications</p>
                      <p className="text-2xl font-bold text-gray-900">{totalApplications}</p>
                    </div>
                    <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                      <FileText className="w-6 h-6 text-blue-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Accepted</p>
                      <p className="text-2xl font-bold text-green-600">{acceptedApplications}</p>
                    </div>
                    <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                      <CheckCircle className="w-6 h-6 text-green-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Under Review</p>
                      <p className="text-2xl font-bold text-yellow-600">{pendingApplications}</p>
                    </div>
                    <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                      <Clock className="w-6 h-6 text-yellow-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Success Rate</p>
                      <p className="text-2xl font-bold text-purple-600">{completionRate}%</p>
                    </div>
                    <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                      <TrendingUp className="w-6 h-6 text-purple-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Quick Actions */}
          {/* <QuickActions /> */}

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Recent Applications */}
            <div className="lg:col-span-2">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle>Recent Applications</CardTitle>
                  <Button variant="outline" size="sm" asChild>
                    <Link href="/student/applications">
                      <Eye className="w-4 h-4 mr-2" />
                      View All
                    </Link>
                  </Button>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {loading ? (
                      <div className="flex items-center justify-center h-20">
                        <Loader2 className="w-6 h-6 animate-spin text-blue-600" />
                        <span className="ml-2 text-gray-600">Loading applications...</span>
                      </div>
                    ) : applications.length > 0 ? (
                      applications.slice(0, 3).map((application) => (
                        <ApplicationStatusCard key={application.id} application={application} />
                      ))
                    ) : (
                      <div className="text-center py-8">
                        <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                        <p className="text-gray-600 mb-4">No applications yet</p>
                        <Button size="sm" asChild>
                          <Link href="/student/applications/new">Create Your First Application</Link>
                        </Button>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Upcoming Deadlines */}
              <UpcomingDeadlines />

              {/* Recent Activity */}
              <RecentActivity />

              {/* Notifications Preview */}
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <Bell className="w-5 h-5" />
                    Notifications
                    {unreadNotifications > 0 && <Badge className="bg-red-500 text-white">{unreadNotifications}</Badge>}
                  </CardTitle>
                  <Button variant="outline" size="sm" asChild>
                    <Link href="/student/announcements">View All</Link>
                  </Button>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {loading ? (
                      <div className="flex items-center justify-center h-20">
                        <Loader2 className="w-4 h-4 animate-spin text-blue-600" />
                        <span className="ml-2 text-sm text-gray-600">Loading...</span>
                      </div>
                    ) : announcements.length === 0 ? (
                      <div className="text-center py-6">
                        <Bell className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                        <p className="text-sm text-gray-600">No notifications</p>
                      </div>
                    ) : (
                      announcements.slice(0, 3).map((announcement) => {
                        const isHighPriority = announcement.priority === "high" || announcement.type === "urgent"
                        return (
                          <div key={announcement.id} className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                            <div className={`w-2 h-2 rounded-full mt-2 flex-shrink-0 ${
                              isHighPriority ? "bg-red-500" : "bg-blue-500"
                            }`} />
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium text-gray-900 truncate">{announcement.title}</p>
                              <p className="text-xs text-gray-500">
                                {new Date(announcement.publishDate).toLocaleDateString()}
                              </p>
                            </div>
                          </div>
                        )
                      })
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="applications">
          <div className="text-center py-8">
            <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Application Management</h3>
            <p className="text-gray-600 mb-6">Manage all your university applications in one place</p>
            <Button asChild>
              <Link href="/student/applications">Go to Applications</Link>
            </Button>
          </div>
        </TabsContent>

        <TabsContent value="compare">
          <div className="text-center py-8">
            <University className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">University Comparison</h3>
            <p className="text-gray-600 mb-6">Compare universities side-by-side to make informed decisions</p>
            <Button asChild>
              <Link href="/student/compare">Compare Universities</Link>
            </Button>
          </div>
        </TabsContent>

        <TabsContent value="notifications">
          <div className="text-center py-8">
            <Bell className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Notification Center</h3>
            <p className="text-gray-600 mb-6">Stay updated with application status and important announcements</p>
            <Button asChild>
              <Link href="/student/notifications">View Notifications</Link>
            </Button>
          </div>
        </TabsContent>

        <TabsContent value="profile">
          <div className="text-center py-8">
            <Settings className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Profile Settings</h3>
            <p className="text-gray-600 mb-6">Manage your personal information and preferences</p>
            <Button asChild>
              <Link href="/student/profile">Edit Profile</Link>
            </Button>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
