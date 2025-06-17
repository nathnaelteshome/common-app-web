"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useAuthStore } from "@/store/auth-store"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Switch } from "@/components/ui/switch"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { BarChart3, Plus, Edit, Trash2, Eye, Copy, Settings, Users, TrendingUp, CheckCircle } from "lucide-react"
import { systemAdminService } from "@/lib/services/system-admin-service"
import { toast } from "sonner"

interface Survey {
  id: string
  title: string
  description: string
  type: "feedback" | "satisfaction" | "research" | "evaluation"
  status: "draft" | "active" | "completed" | "archived"
  targetAudience: "students" | "universities" | "all"
  questions: SurveyQuestion[]
  responses: number
  completionRate: number
  createdAt: string
  updatedAt: string
  scheduledStart?: string
  scheduledEnd?: string
}

interface SurveyQuestion {
  id: string
  type: "text" | "multiple_choice" | "rating" | "scale" | "checkbox"
  question: string
  required: boolean
  options?: string[]
  min?: number
  max?: number
}

export default function SurveysManagementPage() {
  const { user, isAuthenticated } = useAuthStore()
  const router = useRouter()
  const [surveys, setSurveys] = useState<Survey[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [selectedSurvey, setSelectedSurvey] = useState<Survey | null>(null)
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [typeFilter, setTypeFilter] = useState("all")
  const [analytics, setAnalytics] = useState<any>(null)

  useEffect(() => {
    if (!isAuthenticated || user?.role !== "admin") {
      router.push("/auth/sign-in")
    } else {
      loadSurveys()
      loadAnalytics()
    }
  }, [isAuthenticated, user, router])

  const loadSurveys = async () => {
    try {
      setIsLoading(true)
      // Mock survey data
      const mockSurveys: Survey[] = [
        {
          id: "survey-1",
          title: "University Application Experience Survey",
          description: "Gather feedback on the application process to improve user experience",
          type: "feedback",
          status: "active",
          targetAudience: "students",
          questions: [
            {
              id: "q1",
              type: "rating",
              question: "How would you rate your overall application experience?",
              required: true,
              min: 1,
              max: 5,
            },
            {
              id: "q2",
              type: "multiple_choice",
              question: "Which part of the application process was most challenging?",
              required: true,
              options: ["Document Upload", "Form Filling", "Payment Process", "University Selection"],
            },
          ],
          responses: 245,
          completionRate: 78.5,
          createdAt: new Date(Date.now() - 86400000 * 7).toISOString(),
          updatedAt: new Date(Date.now() - 3600000).toISOString(),
          scheduledEnd: new Date(Date.now() + 86400000 * 30).toISOString(),
        },
        {
          id: "survey-2",
          title: "Platform Satisfaction Survey",
          description: "Measure overall satisfaction with CommonApply platform",
          type: "satisfaction",
          status: "completed",
          targetAudience: "all",
          questions: [
            {
              id: "q1",
              type: "scale",
              question: "How likely are you to recommend CommonApply to others?",
              required: true,
              min: 0,
              max: 10,
            },
          ],
          responses: 892,
          completionRate: 85.2,
          createdAt: new Date(Date.now() - 86400000 * 30).toISOString(),
          updatedAt: new Date(Date.now() - 86400000 * 5).toISOString(),
        },
      ]
      setSurveys(mockSurveys)
    } catch (error) {
      console.error("Failed to load surveys:", error)
      toast.error("Failed to load surveys")
    } finally {
      setIsLoading(false)
    }
  }

  const loadAnalytics = async () => {
    try {
      // Mock analytics data
      setAnalytics({
        totalSurveys: 12,
        activeSurveys: 3,
        totalResponses: 2847,
        averageCompletionRate: 81.3,
        responsesByMonth: [
          { month: "Jan", responses: 245 },
          { month: "Feb", responses: 312 },
          { month: "Mar", responses: 428 },
        ],
      })
    } catch (error) {
      console.error("Failed to load analytics:", error)
    }
  }

  const handleCreateSurvey = async (surveyData: any) => {
    try {
      const surveyId = await systemAdminService.createCustomSurvey(surveyData)
      toast.success("Survey created successfully")
      setIsCreateDialogOpen(false)
      await loadSurveys()
    } catch (error) {
      toast.error("Failed to create survey")
    }
  }

  const handleDeleteSurvey = async (surveyId: string) => {
    if (window.confirm("Are you sure you want to delete this survey?")) {
      try {
        // Simulate delete
        setSurveys((prev) => prev.filter((s) => s.id !== surveyId))
        toast.success("Survey deleted successfully")
      } catch (error) {
        toast.error("Failed to delete survey")
      }
    }
  }

  const filteredSurveys = surveys.filter((survey) => {
    const matchesSearch =
      survey.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      survey.description.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStatus = statusFilter === "all" || survey.status === statusFilter
    const matchesType = typeFilter === "all" || survey.type === typeFilter
    return matchesSearch && matchesStatus && matchesType
  })

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800"
      case "draft":
        return "bg-yellow-100 text-yellow-800"
      case "completed":
        return "bg-blue-100 text-blue-800"
      case "archived":
        return "bg-gray-100 text-gray-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case "feedback":
        return "bg-purple-100 text-purple-800"
      case "satisfaction":
        return "bg-blue-100 text-blue-800"
      case "research":
        return "bg-green-100 text-green-800"
      case "evaluation":
        return "bg-orange-100 text-orange-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  if (!isAuthenticated || user?.role !== "admin") {
    return null
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Survey Management</h1>
            <p className="text-gray-600">Create and manage customizable surveys for data collection</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline">
              <Settings className="w-4 h-4 mr-2" />
              Settings
            </Button>
            <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
              <DialogTrigger asChild>
                <Button className="bg-[#0a5eb2] hover:bg-[#0a5eb2]/90">
                  <Plus className="w-4 h-4 mr-2" />
                  Create Survey
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>Create Custom Survey</DialogTitle>
                  <DialogDescription>Create a new survey to collect feedback and data from users</DialogDescription>
                </DialogHeader>
                <CreateSurveyForm onSubmit={handleCreateSurvey} />
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {/* Analytics Overview */}
        {analytics && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Total Surveys</p>
                    <p className="text-3xl font-bold text-blue-600">{analytics.totalSurveys}</p>
                  </div>
                  <BarChart3 className="w-8 h-8 text-blue-600" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Active Surveys</p>
                    <p className="text-3xl font-bold text-green-600">{analytics.activeSurveys}</p>
                  </div>
                  <CheckCircle className="w-8 h-8 text-green-600" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Total Responses</p>
                    <p className="text-3xl font-bold text-purple-600">{analytics.totalResponses.toLocaleString()}</p>
                  </div>
                  <Users className="w-8 h-8 text-purple-600" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Avg. Completion</p>
                    <p className="text-3xl font-bold text-orange-600">{analytics.averageCompletionRate}%</p>
                  </div>
                  <TrendingUp className="w-8 h-8 text-orange-600" />
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        <Tabs defaultValue="surveys" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="surveys">Surveys</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
            <TabsTrigger value="templates">Templates</TabsTrigger>
          </TabsList>

          <TabsContent value="surveys" className="space-y-6">
            {/* Filters */}
            <Card>
              <CardContent className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div>
                    <Label htmlFor="search">Search Surveys</Label>
                    <Input
                      id="search"
                      placeholder="Search by title or description..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="status">Filter by Status</Label>
                    <Select value={statusFilter} onValueChange={setStatusFilter}>
                      <SelectTrigger>
                        <SelectValue placeholder="All statuses" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Status</SelectItem>
                        <SelectItem value="active">Active</SelectItem>
                        <SelectItem value="draft">Draft</SelectItem>
                        <SelectItem value="completed">Completed</SelectItem>
                        <SelectItem value="archived">Archived</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="type">Filter by Type</Label>
                    <Select value={typeFilter} onValueChange={setTypeFilter}>
                      <SelectTrigger>
                        <SelectValue placeholder="All types" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Types</SelectItem>
                        <SelectItem value="feedback">Feedback</SelectItem>
                        <SelectItem value="satisfaction">Satisfaction</SelectItem>
                        <SelectItem value="research">Research</SelectItem>
                        <SelectItem value="evaluation">Evaluation</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex items-end">
                    <Button variant="outline" className="w-full">
                      <BarChart3 className="w-4 h-4 mr-2" />
                      Export Data
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Surveys Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredSurveys.map((survey) => (
                <Card key={survey.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <Badge className={`${getTypeColor(survey.type)} border-0`}>{survey.type}</Badge>
                          <Badge className={`${getStatusColor(survey.status)} border-0`}>{survey.status}</Badge>
                        </div>
                        <CardTitle className="text-lg">{survey.title}</CardTitle>
                        <p className="text-sm text-gray-600 mt-1">{survey.description}</p>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="text-gray-600">Responses:</span>
                          <span className="ml-2 font-medium">{survey.responses}</span>
                        </div>
                        <div>
                          <span className="text-gray-600">Completion:</span>
                          <span className="ml-2 font-medium">{survey.completionRate}%</span>
                        </div>
                        <div>
                          <span className="text-gray-600">Questions:</span>
                          <span className="ml-2 font-medium">{survey.questions.length}</span>
                        </div>
                        <div>
                          <span className="text-gray-600">Audience:</span>
                          <span className="ml-2 font-medium capitalize">{survey.targetAudience}</span>
                        </div>
                      </div>

                      <div className="text-xs text-gray-500">
                        Created: {new Date(survey.createdAt).toLocaleDateString()}
                      </div>

                      <div className="flex gap-2">
                        <Button variant="outline" size="sm" className="flex-1">
                          <Eye className="w-4 h-4 mr-1" />
                          View
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setSelectedSurvey(survey)
                            setIsEditDialogOpen(true)
                          }}
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button variant="outline" size="sm" onClick={() => handleDeleteSurvey(survey.id)}>
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="analytics" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <Card>
                <CardHeader>
                  <CardTitle>Response Trends</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {analytics?.responsesByMonth.map((month: any) => (
                      <div key={month.month} className="flex justify-between items-center">
                        <span className="font-medium">{month.month}</span>
                        <span className="text-blue-600 font-semibold">{month.responses} responses</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Survey Performance</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {surveys.slice(0, 5).map((survey) => (
                      <div key={survey.id} className="space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="font-medium text-sm">{survey.title}</span>
                          <span className="text-sm text-gray-600">{survey.completionRate}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-blue-600 h-2 rounded-full"
                            style={{ width: `${survey.completionRate}%` }}
                          ></div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="templates" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Survey Templates</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {[
                    { name: "Student Satisfaction", description: "Measure student satisfaction with services" },
                    { name: "Application Feedback", description: "Collect feedback on application process" },
                    { name: "University Evaluation", description: "Evaluate university performance" },
                    { name: "Platform Usability", description: "Assess platform ease of use" },
                  ].map((template, index) => (
                    <Card key={index} className="hover:shadow-md transition-shadow cursor-pointer">
                      <CardContent className="p-4">
                        <h4 className="font-medium mb-2">{template.name}</h4>
                        <p className="text-sm text-gray-600 mb-3">{template.description}</p>
                        <Button size="sm" variant="outline" className="w-full">
                          <Copy className="w-4 h-4 mr-2" />
                          Use Template
                        </Button>
                      </CardContent>
                    </Card>
                  ))}
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

// Create Survey Form Component
function CreateSurveyForm({ onSubmit }: { onSubmit: (data: any) => void }) {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    type: "feedback",
    targetAudience: "students",
    questions: [] as SurveyQuestion[],
  })

  const [currentQuestion, setCurrentQuestion] = useState<Partial<SurveyQuestion>>({
    type: "text",
    question: "",
    required: false,
  })

  const addQuestion = () => {
    if (!currentQuestion.question) return

    const newQuestion: SurveyQuestion = {
      id: `q${formData.questions.length + 1}`,
      type: currentQuestion.type as any,
      question: currentQuestion.question,
      required: currentQuestion.required || false,
      options: currentQuestion.options,
      min: currentQuestion.min,
      max: currentQuestion.max,
    }

    setFormData((prev) => ({
      ...prev,
      questions: [...prev.questions, newQuestion],
    }))

    setCurrentQuestion({
      type: "text",
      question: "",
      required: false,
    })
  }

  const removeQuestion = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      questions: prev.questions.filter((_, i) => i !== index),
    }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (formData.questions.length === 0) {
      toast.error("Please add at least one question")
      return
    }
    onSubmit(formData)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="title">Survey Title</Label>
          <Input
            id="title"
            value={formData.title}
            onChange={(e) => setFormData((prev) => ({ ...prev, title: e.target.value }))}
            placeholder="e.g., Student Satisfaction Survey"
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="type">Survey Type</Label>
          <Select value={formData.type} onValueChange={(value) => setFormData((prev) => ({ ...prev, type: value }))}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="feedback">Feedback</SelectItem>
              <SelectItem value="satisfaction">Satisfaction</SelectItem>
              <SelectItem value="research">Research</SelectItem>
              <SelectItem value="evaluation">Evaluation</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          value={formData.description}
          onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
          placeholder="Describe the purpose of this survey"
          rows={3}
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="audience">Target Audience</Label>
        <Select
          value={formData.targetAudience}
          onValueChange={(value) => setFormData((prev) => ({ ...prev, targetAudience: value }))}
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="students">Students</SelectItem>
            <SelectItem value="universities">Universities</SelectItem>
            <SelectItem value="all">All Users</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Questions Section */}
      <div className="space-y-4">
        <h4 className="font-medium">Questions ({formData.questions.length})</h4>

        {/* Existing Questions */}
        {formData.questions.map((question, index) => (
          <div key={question.id} className="p-3 border rounded-lg">
            <div className="flex justify-between items-start">
              <div>
                <p className="font-medium">{question.question}</p>
                <div className="flex gap-2 mt-1">
                  <Badge variant="outline">{question.type}</Badge>
                  {question.required && <Badge variant="outline">Required</Badge>}
                </div>
              </div>
              <Button type="button" variant="ghost" size="sm" onClick={() => removeQuestion(index)}>
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          </div>
        ))}

        {/* Add New Question */}
        <div className="p-4 border-2 border-dashed border-gray-300 rounded-lg">
          <h5 className="font-medium mb-3">Add New Question</h5>
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <Select
                value={currentQuestion.type}
                onValueChange={(value) => setCurrentQuestion((prev) => ({ ...prev, type: value as any }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="text">Text</SelectItem>
                  <SelectItem value="multiple_choice">Multiple Choice</SelectItem>
                  <SelectItem value="rating">Rating</SelectItem>
                  <SelectItem value="scale">Scale</SelectItem>
                  <SelectItem value="checkbox">Checkbox</SelectItem>
                </SelectContent>
              </Select>
              <div className="flex items-center space-x-2">
                <Switch
                  id="required"
                  checked={currentQuestion.required}
                  onCheckedChange={(checked) => setCurrentQuestion((prev) => ({ ...prev, required: checked }))}
                />
                <Label htmlFor="required">Required</Label>
              </div>
            </div>

            <Input
              value={currentQuestion.question}
              onChange={(e) => setCurrentQuestion((prev) => ({ ...prev, question: e.target.value }))}
              placeholder="Enter your question"
            />

            {currentQuestion.type === "multiple_choice" && (
              <Textarea
                value={currentQuestion.options?.join("\n") || ""}
                onChange={(e) =>
                  setCurrentQuestion((prev) => ({
                    ...prev,
                    options: e.target.value.split("\n").filter((opt) => opt.trim()),
                  }))
                }
                placeholder="Enter options (one per line)"
                rows={3}
              />
            )}

            {(currentQuestion.type === "rating" || currentQuestion.type === "scale") && (
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label>Min Value</Label>
                  <Input
                    type="number"
                    value={currentQuestion.min || ""}
                    onChange={(e) =>
                      setCurrentQuestion((prev) => ({
                        ...prev,
                        min: Number.parseInt(e.target.value),
                      }))
                    }
                    placeholder="1"
                  />
                </div>
                <div>
                  <Label>Max Value</Label>
                  <Input
                    type="number"
                    value={currentQuestion.max || ""}
                    onChange={(e) =>
                      setCurrentQuestion((prev) => ({
                        ...prev,
                        max: Number.parseInt(e.target.value),
                      }))
                    }
                    placeholder="5"
                  />
                </div>
              </div>
            )}

            <Button type="button" onClick={addQuestion} variant="outline" className="w-full">
              <Plus className="w-4 h-4 mr-2" />
              Add Question
            </Button>
          </div>
        </div>
      </div>

      <div className="flex justify-end gap-2">
        <Button type="button" variant="outline">
          Cancel
        </Button>
        <Button type="submit">Create Survey</Button>
      </div>
    </form>
  )
}
