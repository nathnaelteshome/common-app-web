"use client"

import { useEffect, useState } from "react"
import { useRouter, useParams } from "next/navigation"
import { useAuthStore } from "@/store/auth-store"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { 
  ArrowLeft, 
  BarChart3,
  Users,
  TrendingUp,
  Clock,
  CheckCircle,
  XCircle,
  Eye,
  Download,
  Calendar,
  FileText,
  Activity
} from "lucide-react"
import Link from "next/link"
import { mockAdmissionForms } from "@/data/mock-admin-data"
import { toast } from "sonner"

export default function FormAnalyticsPage() {
  const { user, isAuthenticated } = useAuthStore()
  const router = useRouter()
  const params = useParams()
  const formId = params.id as string

  const [form, setForm] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [timeRange, setTimeRange] = useState("30d")

  // Mock analytics data - in real app, this would come from API
  const [analyticsData] = useState({
    totalViews: 1247,
    totalSubmissions: 89,
    completionRate: 67,
    avgCompletionTime: 8.5,
    dropoffRate: 33,
    topDropoffFields: [
      { fieldName: "Personal Statement", dropoffRate: 45 },
      { fieldName: "Academic History", dropoffRate: 28 },
      { fieldName: "References", dropoffRate: 22 }
    ],
    submissionsByDay: [
      { date: "2024-01-01", submissions: 5 },
      { date: "2024-01-02", submissions: 8 },
      { date: "2024-01-03", submissions: 12 },
      { date: "2024-01-04", submissions: 7 },
      { date: "2024-01-05", submissions: 15 },
      { date: "2024-01-06", submissions: 9 },
      { date: "2024-01-07", submissions: 11 }
    ],
    fieldAnalytics: [
      { fieldName: "Email", completionRate: 98, avgTime: 30 },
      { fieldName: "Full Name", completionRate: 95, avgTime: 25 },
      { fieldName: "Phone Number", completionRate: 92, avgTime: 35 },
      { fieldName: "Academic History", completionRate: 78, avgTime: 180 },
      { fieldName: "Personal Statement", completionRate: 65, avgTime: 450 },
      { fieldName: "References", completionRate: 71, avgTime: 120 }
    ],
    deviceBreakdown: {
      desktop: 68,
      mobile: 24,
      tablet: 8
    },
    geographicData: [
      { country: "United States", submissions: 45 },
      { country: "Canada", submissions: 18 },
      { country: "United Kingdom", submissions: 12 },
      { country: "Australia", submissions: 8 },
      { country: "Other", submissions: 6 }
    ]
  })

  useEffect(() => {
    if (!isAuthenticated || user?.role !== "university") {
      router.push("/auth/sign-in")
      return
    }

    // Find the form by ID
    const foundForm = mockAdmissionForms.find(f => f.id === formId)
    if (foundForm) {
      setForm(foundForm)
    } else {
      toast.error("Form not found")
      router.push("/admin/forms")
    }
    setLoading(false)
  }, [isAuthenticated, user, formId, router])

  const getStatusColor = (status: string) => {
    switch (status) {
      case "published":
        return "bg-green-100 text-green-800 border-green-200"
      case "draft":
        return "bg-yellow-100 text-yellow-800 border-yellow-200"
      case "archived":
        return "bg-gray-100 text-gray-800 border-gray-200"
      default:
        return "bg-blue-100 text-blue-800 border-blue-200"
    }
  }

  if (!isAuthenticated || user?.role !== "university") {
    return null
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <span className="ml-2 text-gray-600">Loading analytics...</span>
          </div>
        </div>
        <Footer />
      </div>
    )
  }

  if (!form) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <Card className="text-center py-12">
            <CardContent>
              <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Form not found</h3>
              <p className="text-gray-600 mb-6">The form you're looking for doesn't exist or has been deleted.</p>
              <Button asChild>
                <Link href="/admin/forms">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to Forms
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
              <Link href={`/admin/forms/${form.id}`}>
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Form
              </Link>
            </Button>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Form Analytics</h1>
              <p className="text-gray-600">{form.name}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Select value={timeRange} onValueChange={setTimeRange}>
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="7d">Last 7 days</SelectItem>
                <SelectItem value="30d">Last 30 days</SelectItem>
                <SelectItem value="90d">Last 90 days</SelectItem>
                <SelectItem value="1y">Last year</SelectItem>
              </SelectContent>
            </Select>
            <Badge className={`${getStatusColor(form.status)} border`}>
              {form.status.toUpperCase()}
            </Badge>
            <Button variant="outline">
              <Download className="w-4 h-4 mr-2" />
              Export Report
            </Button>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Views</p>
                  <p className="text-3xl font-bold text-gray-900">{analyticsData.totalViews.toLocaleString()}</p>
                  <p className="text-xs text-green-600">+12% from last period</p>
                </div>
                <div className="p-3 bg-blue-100 rounded-full">
                  <Eye className="w-6 h-6 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Submissions</p>
                  <p className="text-3xl font-bold text-gray-900">{analyticsData.totalSubmissions}</p>
                  <p className="text-xs text-green-600">+8% from last period</p>
                </div>
                <div className="p-3 bg-green-100 rounded-full">
                  <CheckCircle className="w-6 h-6 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Completion Rate</p>
                  <p className="text-3xl font-bold text-gray-900">{analyticsData.completionRate}%</p>
                  <p className="text-xs text-red-600">-3% from last period</p>
                </div>
                <div className="p-3 bg-purple-100 rounded-full">
                  <TrendingUp className="w-6 h-6 text-purple-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Avg. Time</p>
                  <p className="text-3xl font-bold text-gray-900">{analyticsData.avgCompletionTime}m</p>
                  <p className="text-xs text-gray-600">Average completion</p>
                </div>
                <div className="p-3 bg-orange-100 rounded-full">
                  <Clock className="w-6 h-6 text-orange-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Field Performance */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="w-5 h-5" />
                Field Performance
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {analyticsData.fieldAnalytics.map((field, index) => (
                  <div key={index} className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">{field.fieldName}</span>
                      <span className="text-sm text-gray-600">{field.completionRate}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-blue-600 h-2 rounded-full"
                        style={{ width: `${field.completionRate}%` }}
                      />
                    </div>
                    <div className="flex justify-between text-xs text-gray-500">
                      <span>Avg. time: {field.avgTime}s</span>
                      <span>Completion: {field.completionRate}%</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Top Dropoff Points */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <XCircle className="w-5 h-5" />
                Top Dropoff Points
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {analyticsData.topDropoffFields.map((field, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-red-50 rounded-lg">
                    <div>
                      <p className="font-medium text-gray-900">{field.fieldName}</p>
                      <p className="text-sm text-gray-600">High abandonment rate</p>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-bold text-red-600">{field.dropoffRate}%</p>
                      <p className="text-xs text-gray-500">dropoff rate</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Device Breakdown */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="w-5 h-5" />
                Device Breakdown
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Desktop</span>
                  <span className="font-semibold">{analyticsData.deviceBreakdown.desktop}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-blue-600 h-2 rounded-full"
                    style={{ width: `${analyticsData.deviceBreakdown.desktop}%` }}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Mobile</span>
                  <span className="font-semibold">{analyticsData.deviceBreakdown.mobile}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-green-600 h-2 rounded-full"
                    style={{ width: `${analyticsData.deviceBreakdown.mobile}%` }}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Tablet</span>
                  <span className="font-semibold">{analyticsData.deviceBreakdown.tablet}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-orange-600 h-2 rounded-full"
                    style={{ width: `${analyticsData.deviceBreakdown.tablet}%` }}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Geographic Distribution */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="w-5 h-5" />
                Geographic Distribution
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Country</TableHead>
                    <TableHead className="text-right">Submissions</TableHead>
                    <TableHead className="text-right">Percentage</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {analyticsData.geographicData.map((location, index) => (
                    <TableRow key={index}>
                      <TableCell className="font-medium">{location.country}</TableCell>
                      <TableCell className="text-right">{location.submissions}</TableCell>
                      <TableCell className="text-right">
                        {Math.round((location.submissions / analyticsData.totalSubmissions) * 100)}%
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>

        {/* Recommendations */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5" />
              Optimization Recommendations
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="p-4 bg-yellow-50 rounded-lg border border-yellow-200">
                <h4 className="font-semibold text-yellow-800 mb-2">High Dropoff Alert</h4>
                <p className="text-sm text-yellow-700 mb-3">
                  The "Personal Statement" field has a 45% dropoff rate. Consider simplifying instructions or breaking it into smaller sections.
                </p>
                <Button size="sm" variant="outline">
                  Optimize Field
                </Button>
              </div>

              <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                <h4 className="font-semibold text-blue-800 mb-2">Mobile Optimization</h4>
                <p className="text-sm text-blue-700 mb-3">
                  24% of users access your form on mobile. Ensure all fields are mobile-friendly for better completion rates.
                </p>
                <Button size="sm" variant="outline">
                  Test Mobile View
                </Button>
              </div>

              <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                <h4 className="font-semibold text-green-800 mb-2">Good Performance</h4>
                <p className="text-sm text-green-700 mb-3">
                  Your basic information fields have excellent completion rates (95%+). Keep the current design.
                </p>
                <Button size="sm" variant="outline">
                  View Details
                </Button>
              </div>

              <div className="p-4 bg-purple-50 rounded-lg border border-purple-200">
                <h4 className="font-semibold text-purple-800 mb-2">Time Optimization</h4>
                <p className="text-sm text-purple-700 mb-3">
                  Average completion time is 8.5 minutes. Consider adding progress indicators to reduce abandonment.
                </p>
                <Button size="sm" variant="outline">
                  Add Progress Bar
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Footer />
    </div>
  )
}