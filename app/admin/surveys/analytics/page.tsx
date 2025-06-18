"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useAuthStore } from "@/store/auth-store"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  Area,
  AreaChart,
} from "recharts"
import {
  TrendingUp,
  Users,
  MessageSquare,
  Star,
  Download,
  Filter,
  Calendar,
  BarChart3,
  PieChartIcon,
  LineChartIcon,
  FileText,
  Target,
  Lightbulb,
} from "lucide-react"
import Link from "next/link"
import { mockSurveyAnalytics, getSurveyStatistics, getTopInsights } from "@/data/mock-survey-analytics"

interface SurveyAnalytics {
  surveyId: string
  surveyTitle: string
  totalResponses: number
  completionRate: number
  averageRating: number
  responsesByDate: Array<{ date: string; responses: number }>
  questionAnalytics: Array<{
    questionId: string
    question: string
    type: string
    responses: number
    averageRating?: number
    optionBreakdown?: Array<{ option: string; count: number; percentage: number }>
    sentiment?: "positive" | "neutral" | "negative"
  }>
  insights: Array<{
    type: "improvement" | "strength" | "concern" | "trend"
    title: string
    description: string
    impact: "high" | "medium" | "low"
    actionable: boolean
  }>
}

export default function SurveyAnalytics() {
  const { user, isAuthenticated } = useAuthStore()
  const router = useRouter()
  const [selectedSurvey, setSelectedSurvey] = useState("all")
  const [dateRange, setDateRange] = useState("30")
  const [chartType, setChartType] = useState("bar")

  const [analytics, setAnalytics] = useState(mockSurveyAnalytics)

  useEffect(() => {
    if (!isAuthenticated || user?.role !== "university") {
      router.push("/auth/sign-in")
    }
  }, [isAuthenticated, user, router])

  if (!isAuthenticated || user?.role !== "university") {
    return null
  }

  const currentAnalytics =
    selectedSurvey === "all"
      ? analytics[0] // Show first survey for demo
      : analytics.find((a) => a.surveyId === selectedSurvey) || analytics[0]

  const totalResponses = analytics.reduce((sum, a) => sum + a.totalResponses, 0)
  const averageCompletionRate = analytics.reduce((sum, a) => sum + a.completionRate, 0) / analytics.length
  const averageRating = analytics.reduce((sum, a) => sum + a.averageRating, 0) / analytics.length

  const surveyStats = getSurveyStatistics()
  const topInsights = getTopInsights(3)

  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884D8"]

  const renderChart = () => {
    switch (chartType) {
      case "pie":
        return (
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={currentAnalytics.questionAnalytics[1]?.optionBreakdown || []}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ option, percentage }) => `${option}: ${percentage}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="count"
              >
                {currentAnalytics.questionAnalytics[1]?.optionBreakdown?.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        )

      case "line":
        return (
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={currentAnalytics.responsesByDate}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="responses" stroke="#0a5eb2" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        )

      case "area":
        return (
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={currentAnalytics.responsesByDate}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Area type="monotone" dataKey="responses" stroke="#0a5eb2" fill="#0a5eb2" fillOpacity={0.3} />
            </AreaChart>
          </ResponsiveContainer>
        )

      default:
        return (
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={currentAnalytics.questionAnalytics[1]?.optionBreakdown || []}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="option" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="count" fill="#0a5eb2" />
            </BarChart>
          </ResponsiveContainer>
        )
    }
  }

  const getInsightIcon = (type: string) => {
    switch (type) {
      case "improvement":
        return <Target className="w-5 h-5 text-orange-600" />
      case "strength":
        return <Star className="w-5 h-5 text-green-600" />
      case "concern":
        return <MessageSquare className="w-5 h-5 text-red-600" />
      case "trend":
        return <TrendingUp className="w-5 h-5 text-blue-600" />
      default:
        return <Lightbulb className="w-5 h-5 text-purple-600" />
    }
  }

  const getInsightColor = (type: string) => {
    switch (type) {
      case "improvement":
        return "bg-orange-100 text-orange-800"
      case "strength":
        return "bg-green-100 text-green-800"
      case "concern":
        return "bg-red-100 text-red-800"
      case "trend":
        return "bg-blue-100 text-blue-800"
      default:
        return "bg-purple-100 text-purple-800"
    }
  }

  const getImpactColor = (impact: string) => {
    switch (impact) {
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

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <div className="container mx-auto px-4 py-8">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Survey Analytics</h1>
            <p className="text-gray-600">Analyze survey responses to improve admission process</p>
          </div>
          <div className="flex gap-2 mt-4 md:mt-0">
            <Button variant="outline" asChild>
              <Link href="/admin/surveys">
                <MessageSquare className="w-4 h-4 mr-2" />
                Manage Surveys
              </Link>
            </Button>
            <Button variant="outline">
              <Download className="w-4 h-4 mr-2" />
              Export Report
            </Button>
          </div>
        </div>

        {/* Overview Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Responses</p>
                  <p className="text-2xl font-bold">{totalResponses.toLocaleString()}</p>
                </div>
                <Users className="h-8 w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Avg. Completion Rate</p>
                  <p className="text-2xl font-bold">{averageCompletionRate.toFixed(1)}%</p>
                </div>
                <BarChart3 className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Avg. Rating</p>
                  <p className="text-2xl font-bold">{averageRating.toFixed(1)}/5</p>
                </div>
                <Star className="h-8 w-8 text-yellow-600" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Active Surveys</p>
                  <p className="text-2xl font-bold">{analytics.length}</p>
                </div>
                <FileText className="h-8 w-8 text-purple-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card className="mb-6">
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Select value={selectedSurvey} onValueChange={setSelectedSurvey}>
                <SelectTrigger>
                  <SelectValue placeholder="Select survey" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Surveys</SelectItem>
                  {analytics.map((survey) => (
                    <SelectItem key={survey.surveyId} value={survey.surveyId}>
                      {survey.surveyTitle}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={dateRange} onValueChange={setDateRange}>
                <SelectTrigger>
                  <SelectValue placeholder="Date range" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="7">Last 7 days</SelectItem>
                  <SelectItem value="30">Last 30 days</SelectItem>
                  <SelectItem value="90">Last 90 days</SelectItem>
                  <SelectItem value="365">Last year</SelectItem>
                </SelectContent>
              </Select>
              <Select value={chartType} onValueChange={setChartType}>
                <SelectTrigger>
                  <SelectValue placeholder="Chart type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="bar">Bar Chart</SelectItem>
                  <SelectItem value="pie">Pie Chart</SelectItem>
                  <SelectItem value="line">Line Chart</SelectItem>
                  <SelectItem value="area">Area Chart</SelectItem>
                </SelectContent>
              </Select>
              <Button variant="outline">
                <Filter className="w-4 h-4 mr-2" />
                Advanced Filters
              </Button>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Chart */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Response Analysis</CardTitle>
                  <div className="flex gap-2">
                    <Button
                      variant={chartType === "bar" ? "default" : "outline"}
                      size="sm"
                      onClick={() => setChartType("bar")}
                    >
                      <BarChart3 className="w-4 h-4" />
                    </Button>
                    <Button
                      variant={chartType === "pie" ? "default" : "outline"}
                      size="sm"
                      onClick={() => setChartType("pie")}
                    >
                      <PieChartIcon className="w-4 h-4" />
                    </Button>
                    <Button
                      variant={chartType === "line" ? "default" : "outline"}
                      size="sm"
                      onClick={() => setChartType("line")}
                    >
                      <LineChartIcon className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>{renderChart()}</CardContent>
            </Card>

            {/* Question Breakdown */}
            <Card className="mt-6">
              <CardHeader>
                <CardTitle>Question Analysis</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {currentAnalytics.questionAnalytics.map((question) => (
                    <div key={question.questionId} className="border-b pb-4 last:border-b-0">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1">
                          <h4 className="font-medium text-gray-900">{question.question}</h4>
                          <p className="text-sm text-gray-600">{question.responses} responses</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge variant="outline">{question.type}</Badge>
                          {question.sentiment && (
                            <Badge
                              className={
                                question.sentiment === "positive"
                                  ? "bg-green-100 text-green-800"
                                  : question.sentiment === "negative"
                                    ? "bg-red-100 text-red-800"
                                    : "bg-gray-100 text-gray-800"
                              }
                            >
                              {question.sentiment}
                            </Badge>
                          )}
                        </div>
                      </div>

                      {question.averageRating && (
                        <div className="mb-3">
                          <div className="flex items-center gap-2">
                            <span className="text-sm text-gray-600">Average Rating:</span>
                            <span className="font-medium">{question.averageRating}/5</span>
                            <div className="flex">
                              {[1, 2, 3, 4, 5].map((star) => (
                                <Star
                                  key={star}
                                  className={`w-4 h-4 ${
                                    star <= question.averageRating! ? "text-yellow-400 fill-current" : "text-gray-300"
                                  }`}
                                />
                              ))}
                            </div>
                          </div>
                        </div>
                      )}

                      {question.optionBreakdown && (
                        <div className="space-y-2">
                          {question.optionBreakdown.map((option) => (
                            <div key={option.option} className="flex items-center justify-between">
                              <span className="text-sm text-gray-700">{option.option}</span>
                              <div className="flex items-center gap-2 flex-1 max-w-xs">
                                <Progress value={option.percentage} className="flex-1" />
                                <span className="text-sm font-medium w-12 text-right">{option.percentage}%</span>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Insights Panel */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Key Insights</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {currentAnalytics.insights.map((insight, index) => (
                    <div key={index} className="border rounded-lg p-4">
                      <div className="flex items-start gap-3">
                        {getInsightIcon(insight.type)}
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <Badge className={getInsightColor(insight.type)}>{insight.type}</Badge>
                            <Badge className={getImpactColor(insight.impact)}>{insight.impact} impact</Badge>
                            {insight.actionable && (
                              <Badge variant="outline" className="bg-blue-100 text-blue-800">
                                Actionable
                              </Badge>
                            )}
                          </div>
                          <h4 className="font-medium text-gray-900 mb-1">{insight.title}</h4>
                          <p className="text-sm text-gray-600">{insight.description}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Survey Performance */}
            <Card>
              <CardHeader>
                <CardTitle>Survey Performance</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Completion Rate</span>
                      <span>{currentAnalytics.completionRate}%</span>
                    </div>
                    <Progress value={currentAnalytics.completionRate} />
                  </div>

                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Response Rate</span>
                      <span>78%</span>
                    </div>
                    <Progress value={78} />
                  </div>

                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Satisfaction Score</span>
                      <span>{((currentAnalytics.averageRating / 5) * 100).toFixed(0)}%</span>
                    </div>
                    <Progress value={(currentAnalytics.averageRating / 5) * 100} />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <Button variant="outline" className="w-full justify-start">
                    <FileText className="w-4 h-4 mr-2" />
                    Generate Report
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <Download className="w-4 h-4 mr-2" />
                    Export Data
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <MessageSquare className="w-4 h-4 mr-2" />
                    Create Follow-up Survey
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <Calendar className="w-4 h-4 mr-2" />
                    Schedule Review
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  )
}
