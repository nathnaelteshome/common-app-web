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
import { Alert, AlertDescription } from "@/components/ui/alert"
import {
  FileText,
  AlertTriangle,
  CheckCircle,
  Clock,
  RefreshCw,
  Settings,
  TrendingUp,
  TrendingDown,
  Activity,
  Zap,
  AlertCircle,
  Eye,
  Wrench,
} from "lucide-react"
import { systemAdminService } from "@/lib/services/system-admin-service"
import { toast } from "sonner"

export default function FormsMonitorPage() {
  const { user, isAuthenticated } = useAuthStore()
  const router = useRouter()
  const [formsData, setFormsData] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isRefreshing, setIsRefreshing] = useState(false)

  useEffect(() => {
    if (!isAuthenticated || user?.role !== "admin") {
      router.push("/auth/sign-in")
    } else {
      loadFormsData()
    }
  }, [isAuthenticated, user, router])

  const loadFormsData = async () => {
    try {
      setIsLoading(true)
      const data = await systemAdminService.getFormMonitoring()
      setFormsData(data)
    } catch (error) {
      console.error("Failed to load forms data:", error)
      toast.error("Failed to load forms monitoring data")
    } finally {
      setIsLoading(false)
    }
  }

  const handleRefresh = async () => {
    setIsRefreshing(true)
    await loadFormsData()
    setIsRefreshing(false)
    toast.success("Forms data refreshed")
  }

  const handleFixIssue = async (formId: string, issueType: string) => {
    try {
      const success = await systemAdminService.fixFormIssue(formId, issueType)
      if (success) {
        toast.success(`${issueType} issue fixed successfully`)
        await loadFormsData() // Reload data
      } else {
        toast.error(`Failed to fix ${issueType} issue`)
      }
    } catch (error) {
      toast.error("An error occurred while fixing the issue")
    }
  }

  if (!isAuthenticated || user?.role !== "admin") {
    return null
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-gray-200 rounded w-1/4"></div>
            <div className="h-64 bg-gray-200 rounded"></div>
          </div>
        </div>
        <Footer />
      </div>
    )
  }

  const totalForms = formsData.length
  const activeForms = formsData.filter((f) => f.status === "active").length
  const formsWithErrors = formsData.filter((f) => f.status === "error").length
  const totalSubmissions = formsData.reduce((sum, form) => sum + form.submissionCount, 0)
  const totalErrors = formsData.reduce((sum, form) => sum + form.errorCount, 0)
  const averageConversionRate = formsData.reduce((sum, form) => sum + form.conversionRate, 0) / totalForms

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "active":
        return <CheckCircle className="w-4 h-4 text-green-600" />
      case "error":
        return <AlertTriangle className="w-4 h-4 text-red-600" />
      case "maintenance":
        return <Clock className="w-4 h-4 text-yellow-600" />
      default:
        return <FileText className="w-4 h-4 text-gray-600" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800"
      case "error":
        return "bg-red-100 text-red-800"
      case "maintenance":
        return "bg-yellow-100 text-yellow-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "critical":
        return "bg-red-100 text-red-800 border-red-200"
      case "high":
        return "bg-orange-100 text-orange-800 border-orange-200"
      case "medium":
        return "bg-yellow-100 text-yellow-800 border-yellow-200"
      case "low":
        return "bg-blue-100 text-blue-800 border-blue-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Admission Forms Monitoring</h1>
            <p className="text-gray-600">Monitor and ensure all admission forms function correctly</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={handleRefresh} disabled={isRefreshing}>
              <RefreshCw className={`w-4 h-4 mr-2 ${isRefreshing ? "animate-spin" : ""}`} />
              Refresh
            </Button>
            <Button variant="outline">
              <Settings className="w-4 h-4 mr-2" />
              Configure Monitoring
            </Button>
          </div>
        </div>

        {/* Overview Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="border-l-4 border-l-blue-500">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Forms</p>
                  <p className="text-3xl font-bold text-blue-600">{totalForms}</p>
                  <p className="text-xs text-blue-600 mt-1">{activeForms} active</p>
                </div>
                <div className="p-3 bg-blue-100 rounded-full">
                  <FileText className="w-6 h-6 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-green-500">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Success Rate</p>
                  <p className="text-3xl font-bold text-green-600">{averageConversionRate.toFixed(1)}%</p>
                  <p className="text-xs text-green-600 mt-1">
                    <TrendingUp className="w-3 h-3 inline mr-1" />
                    +2.3% from last week
                  </p>
                </div>
                <div className="p-3 bg-green-100 rounded-full">
                  <CheckCircle className="w-6 h-6 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-orange-500">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Submissions</p>
                  <p className="text-3xl font-bold text-orange-600">{totalSubmissions.toLocaleString()}</p>
                  <p className="text-xs text-orange-600 mt-1">Last 24 hours</p>
                </div>
                <div className="p-3 bg-orange-100 rounded-full">
                  <Activity className="w-6 h-6 text-orange-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-red-500">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Forms with Issues</p>
                  <p className="text-3xl font-bold text-red-600">{formsWithErrors}</p>
                  <p className="text-xs text-red-600 mt-1">{totalErrors} total errors</p>
                </div>
                <div className="p-3 bg-red-100 rounded-full">
                  <AlertTriangle className="w-6 h-6 text-red-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="forms">Forms Status</TabsTrigger>
            <TabsTrigger value="issues">Issues & Alerts</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            {/* Critical Alerts */}
            {formsWithErrors > 0 && (
              <Alert className="border-red-200 bg-red-50">
                <AlertTriangle className="h-4 w-4 text-red-600" />
                <AlertDescription className="text-red-800">
                  <strong>{formsWithErrors} forms</strong> are currently experiencing issues and require immediate
                  attention.
                </AlertDescription>
              </Alert>
            )}

            {/* Forms Overview */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <Card>
                <CardHeader>
                  <CardTitle>Form Performance Summary</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between mb-2">
                        <span className="text-sm text-gray-600">Active Forms</span>
                        <span className="text-sm font-medium">
                          {activeForms}/{totalForms}
                        </span>
                      </div>
                      <Progress value={(activeForms / totalForms) * 100} className="h-2" />
                    </div>
                    <div>
                      <div className="flex justify-between mb-2">
                        <span className="text-sm text-gray-600">Average Conversion Rate</span>
                        <span className="text-sm font-medium">{averageConversionRate.toFixed(1)}%</span>
                      </div>
                      <Progress value={averageConversionRate} className="h-2" />
                    </div>
                    <div>
                      <div className="flex justify-between mb-2">
                        <span className="text-sm text-gray-600">Error Rate</span>
                        <span className="text-sm font-medium">
                          {((totalErrors / totalSubmissions) * 100).toFixed(2)}%
                        </span>
                      </div>
                      <Progress value={(totalErrors / totalSubmissions) * 100} className="h-2" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Recent Activity</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {formsData.slice(0, 5).map((form) => (
                      <div key={form.formId} className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="flex items-center gap-3">
                          {getStatusIcon(form.status)}
                          <div>
                            <p className="font-medium text-sm">{form.formName}</p>
                            <p className="text-xs text-gray-500">
                              Last submission: {new Date(form.lastSubmission).toLocaleString()}
                            </p>
                          </div>
                        </div>
                        <Badge className={`${getStatusColor(form.status)} border-0`}>{form.status}</Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="forms" className="space-y-6">
            <div className="grid grid-cols-1 gap-6">
              {formsData.map((form) => (
                <Card key={form.formId}>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        {getStatusIcon(form.status)}
                        <div>
                          <CardTitle className="text-lg">{form.formName}</CardTitle>
                          <p className="text-sm text-gray-600">Form ID: {form.formId}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge className={`${getStatusColor(form.status)} border-0`}>{form.status}</Badge>
                        <Button variant="ghost" size="sm">
                          <Eye className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-blue-600">{form.submissionCount}</div>
                        <div className="text-sm text-gray-600">Submissions</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-green-600">{form.conversionRate}%</div>
                        <div className="text-sm text-gray-600">Conversion Rate</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-orange-600">
                          {Math.floor(form.averageCompletionTime / 60)}m
                        </div>
                        <div className="text-sm text-gray-600">Avg. Completion</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-red-600">{form.errorCount}</div>
                        <div className="text-sm text-gray-600">Errors</div>
                      </div>
                    </div>

                    {form.issues.length > 0 && (
                      <div className="space-y-2">
                        <h4 className="font-medium text-gray-900">Active Issues:</h4>
                        {form.issues.map((issue, index) => (
                          <div key={index} className={`p-3 rounded-lg border ${getSeverityColor(issue.severity)}`}>
                            <div className="flex items-center justify-between">
                              <div>
                                <p className="font-medium">{issue.type.replace("_", " ").toUpperCase()}</p>
                                <p className="text-sm">{issue.description}</p>
                                <p className="text-xs mt-1">{new Date(issue.timestamp).toLocaleString()}</p>
                              </div>
                              <Button
                                size="sm"
                                onClick={() => handleFixIssue(form.formId, issue.type)}
                                className="bg-blue-600 hover:bg-blue-700"
                              >
                                <Wrench className="w-4 h-4 mr-1" />
                                Fix
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="issues" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Critical Issues Requiring Attention</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {formsData
                    .filter((form) =>
                      form.issues.some((issue) => issue.severity === "critical" || issue.severity === "high"),
                    )
                    .map((form) => (
                      <div key={form.formId} className="border rounded-lg p-4">
                        <div className="flex items-center justify-between mb-3">
                          <h4 className="font-medium text-gray-900">{form.formName}</h4>
                          <Badge className={`${getStatusColor(form.status)} border-0`}>{form.status}</Badge>
                        </div>
                        <div className="space-y-2">
                          {form.issues
                            .filter((issue) => issue.severity === "critical" || issue.severity === "high")
                            .map((issue, index) => (
                              <div key={index} className={`p-3 rounded-lg border ${getSeverityColor(issue.severity)}`}>
                                <div className="flex items-center justify-between">
                                  <div>
                                    <div className="flex items-center gap-2">
                                      <AlertCircle className="w-4 h-4" />
                                      <span className="font-medium">{issue.type.replace("_", " ").toUpperCase()}</span>
                                      <Badge variant="outline" className="text-xs">
                                        {issue.severity}
                                      </Badge>
                                    </div>
                                    <p className="text-sm mt-1">{issue.description}</p>
                                    <p className="text-xs text-gray-500 mt-1">
                                      Reported: {new Date(issue.timestamp).toLocaleString()}
                                    </p>
                                  </div>
                                  <Button
                                    size="sm"
                                    onClick={() => handleFixIssue(form.formId, issue.type)}
                                    className="bg-red-600 hover:bg-red-700"
                                  >
                                    <Zap className="w-4 h-4 mr-1" />
                                    Fix Now
                                  </Button>
                                </div>
                              </div>
                            ))}
                        </div>
                      </div>
                    ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="analytics" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <Card>
                <CardHeader>
                  <CardTitle>Form Performance Trends</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Submission Rate Trend</span>
                      <div className="flex items-center gap-1 text-green-600">
                        <TrendingUp className="w-4 h-4" />
                        <span className="text-sm font-medium">+15.3%</span>
                      </div>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Error Rate Trend</span>
                      <div className="flex items-center gap-1 text-green-600">
                        <TrendingDown className="w-4 h-4" />
                        <span className="text-sm font-medium">-8.7%</span>
                      </div>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Completion Time Trend</span>
                      <div className="flex items-center gap-1 text-green-600">
                        <TrendingDown className="w-4 h-4" />
                        <span className="text-sm font-medium">-12.1%</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Issue Categories</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Validation Issues</span>
                      <span className="text-sm font-medium">45%</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Submission Errors</span>
                      <span className="text-sm font-medium">30%</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Payment Issues</span>
                      <span className="text-sm font-medium">15%</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Notification Failures</span>
                      <span className="text-sm font-medium">10%</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>

      <Footer />
    </div>
  )
}
