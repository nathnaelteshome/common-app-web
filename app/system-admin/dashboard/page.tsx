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
  Users,
  Building,
  FileText,
  DollarSign,
  Activity,
  AlertTriangle,
  CheckCircle,
  Clock,
  BarChart3,
  Bell,
  Monitor,
  Plus,
  Eye,
  Edit,
} from "lucide-react"
import Link from "next/link"
import { mockSystemMetrics, mockUniversityData, mockSystemLogs, mockNotificationTemplates } from "@/data/mock-data"

export default function SystemAdminDashboard() {
  const { user, isAuthenticated } = useAuthStore()
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (!isAuthenticated || user?.role !== "admin") {
      router.push("/auth/sign-in")
    } else {
      setIsLoading(false)
    }
  }, [isAuthenticated, user, router])

  if (isLoading || !isAuthenticated || user?.role !== "admin") {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-[#0a5eb2]"></div>
      </div>
    )
  }

  const metrics = mockSystemMetrics
  const recentLogs = mockSystemLogs.slice(0, 5)
  const criticalIssues = mockSystemLogs.filter((log) => log.level === "critical" || log.level === "error").length
  const pendingUniversities = mockUniversityData.filter((uni) => uni.status === "pending").length

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <div className="container mx-auto px-4 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">System Administration Dashboard</h1>
              <p className="text-gray-600">
                Monitor platform performance, manage universities, and oversee system operations.
              </p>
            </div>
            <div className="flex gap-3">
              <Button variant="outline" asChild>
                <Link href="/system-admin/reports">
                  <BarChart3 className="w-4 h-4 mr-2" />
                  System Reports
                </Link>
              </Button>
              <Button className="bg-[#0a5eb2] hover:bg-[#0a5eb2]/90" asChild>
                <Link href="/system-admin/universities/create">
                  <Plus className="w-4 h-4 mr-2" />
                  Add University
                </Link>
              </Button>
            </div>
          </div>
        </div>

        {/* System Health Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="border-l-4 border-l-green-500">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">System Uptime</p>
                  <p className="text-3xl font-bold text-green-600">{metrics.systemUptime}</p>
                  <p className="text-xs text-green-600 mt-1">Last 30 days</p>
                </div>
                <div className="p-3 bg-green-100 rounded-full">
                  <Activity className="w-6 h-6 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-blue-500">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Active Users</p>
                  <p className="text-3xl font-bold text-blue-600">{metrics.activeUsers.toLocaleString()}</p>
                  <p className="text-xs text-blue-600 mt-1">Currently online</p>
                </div>
                <div className="p-3 bg-blue-100 rounded-full">
                  <Users className="w-6 h-6 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-purple-500">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Revenue</p>
                  <p className="text-3xl font-bold text-purple-600">${metrics.totalRevenue.toLocaleString()}</p>
                  <p className="text-xs text-purple-600 mt-1">All time</p>
                </div>
                <div className="p-3 bg-purple-100 rounded-full">
                  <DollarSign className="w-6 h-6 text-purple-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-orange-500">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Response Time</p>
                  <p className="text-3xl font-bold text-orange-600">{metrics.averageResponseTime}ms</p>
                  <p className="text-xs text-orange-600 mt-1">Average</p>
                </div>
                <div className="p-3 bg-orange-100 rounded-full">
                  <Clock className="w-6 h-6 text-orange-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          <div className="lg:col-span-2">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>System Management</CardTitle>
                <Button variant="ghost" size="sm" asChild>
                  <Link href="/system-admin/tools">View All Tools</Link>
                </Button>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  <Button variant="outline" className="h-20 flex flex-col gap-2" asChild>
                    <Link href="/system-admin/universities">
                      <Building className="w-6 h-6" />
                      <span className="text-sm">Universities</span>
                    </Link>
                  </Button>
                  <Button variant="outline" className="h-20 flex flex-col gap-2" asChild>
                    <Link href="/system-admin/users">
                      <Users className="w-6 h-6" />
                      <span className="text-sm">User Management</span>
                    </Link>
                  </Button>
                  <Button variant="outline" className="h-20 flex flex-col gap-2" asChild>
                    <Link href="/system-admin/payments">
                      <DollarSign className="w-6 h-6" />
                      <span className="text-sm">Payment Gateway</span>
                    </Link>
                  </Button>
                  <Button variant="outline" className="h-20 flex flex-col gap-2" asChild>
                    <Link href="/system-admin/notifications">
                      <Bell className="w-6 h-6" />
                      <span className="text-sm">Notifications</span>
                    </Link>
                  </Button>
                  <Button variant="outline" className="h-20 flex flex-col gap-2" asChild>
                    <Link href="/system-admin/surveys">
                      <FileText className="w-6 h-6" />
                      <span className="text-sm">Surveys</span>
                    </Link>
                  </Button>
                  <Button variant="outline" className="h-20 flex flex-col gap-2" asChild>
                    <Link href="/system-admin/monitoring">
                      <Monitor className="w-6 h-6" />
                      <span className="text-sm">System Monitor</span>
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          <div>
            <Card>
              <CardHeader>
                <CardTitle>System Status</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Database</span>
                    <Badge variant="default" className="bg-green-500">
                      <CheckCircle className="w-3 h-3 mr-1" />
                      Healthy
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Payment Gateway</span>
                    <Badge variant="default" className="bg-green-500">
                      <CheckCircle className="w-3 h-3 mr-1" />
                      Online
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Email Service</span>
                    <Badge variant="secondary">
                      <Clock className="w-3 h-3 mr-1" />
                      Degraded
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">File Storage</span>
                    <Badge variant="default" className="bg-green-500">
                      <CheckCircle className="w-3 h-3 mr-1" />
                      Operational
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Universities & System Logs */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>University Management</CardTitle>
              <Button variant="outline" size="sm" asChild>
                <Link href="/system-admin/universities">
                  View All
                  <Eye className="w-4 h-4 ml-2" />
                </Link>
              </Button>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {mockUniversityData.slice(0, 4).map((university) => (
                  <div key={university.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900">{university.name}</h4>
                      <p className="text-sm text-gray-600">{university.email}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-xs text-gray-500">Data Accuracy:</span>
                        <Progress value={university.dataAccuracy} className="w-16 h-2" />
                        <span className="text-xs text-gray-500">{university.dataAccuracy}%</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge
                        variant={
                          university.status === "active"
                            ? "default"
                            : university.status === "pending"
                              ? "secondary"
                              : "destructive"
                        }
                      >
                        {university.status}
                      </Badge>
                      <Button variant="ghost" size="sm" asChild>
                        <Link href={`/system-admin/universities/${university.id}`}>
                          <Edit className="w-4 h-4" />
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
              <CardTitle>System Logs</CardTitle>
              <Button variant="outline" size="sm" asChild>
                <Link href="/system-admin/logs">
                  View All
                  <Eye className="w-4 h-4 ml-2" />
                </Link>
              </Button>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentLogs.map((log) => (
                  <div key={log.id} className="p-3 border rounded-lg">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <Badge
                          variant={
                            log.level === "critical" || log.level === "error"
                              ? "destructive"
                              : log.level === "warning"
                                ? "secondary"
                                : "outline"
                          }
                        >
                          {log.level}
                        </Badge>
                        <span className="text-sm font-medium text-gray-900">{log.category}</span>
                      </div>
                      <span className="text-xs text-gray-400">{new Date(log.timestamp).toLocaleTimeString()}</span>
                    </div>
                    <p className="text-sm text-gray-600">{log.message}</p>
                    {!log.resolved && (
                      <Badge variant="outline" className="mt-2 text-xs">
                        Unresolved
                      </Badge>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Alerts & Critical Issues */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <Card className="border-l-4 border-l-red-500">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-red-600" />
                Critical Alerts
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="p-3 bg-red-50 rounded-lg border border-red-200">
                  <h4 className="font-medium text-red-800 mb-1">System Issues</h4>
                  <p className="text-sm text-red-700">{criticalIssues} unresolved critical issues</p>
                </div>
                <div className="p-3 bg-yellow-50 rounded-lg border border-yellow-200">
                  <h4 className="font-medium text-yellow-800 mb-1">Pending Approvals</h4>
                  <p className="text-sm text-yellow-700">{pendingUniversities} universities awaiting approval</p>
                </div>
                <div className="p-3 bg-yellow-50 rounded-lg border border-yellow-200">
                  <h4 className="font-medium text-yellow-800 mb-1">Pending Verifications</h4>
                  <p className="text-sm text-yellow-700">
                    {pendingUniversities} universities awaiting verification approval
                  </p>
                  <Button variant="outline" size="sm" className="mt-2" asChild>
                    <Link href="/system-admin/verification">Review Requests</Link>
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Payment Gateway Status</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Success Rate</span>
                  <span className="text-sm font-medium text-green-600">98.5%</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Failed Transactions</span>
                  <span className="text-sm font-medium text-red-600">12</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Pending Receipts</span>
                  <span className="text-sm font-medium text-orange-600">3</span>
                </div>
                <Button variant="outline" size="sm" className="w-full" asChild>
                  <Link href="/system-admin/payments">View Payment Logs</Link>
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Notification Templates</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {mockNotificationTemplates.slice(0, 3).map((template) => (
                  <div key={template.id} className="p-2 border rounded">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">{template.name}</span>
                      <Badge variant={template.isActive ? "default" : "secondary"}>
                        {template.isActive ? "Active" : "Inactive"}
                      </Badge>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">Used {template.usageCount} times</p>
                  </div>
                ))}
                <Button variant="outline" size="sm" className="w-full" asChild>
                  <Link href="/system-admin/notifications">Manage Templates</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <Footer />
    </div>
  )
}
