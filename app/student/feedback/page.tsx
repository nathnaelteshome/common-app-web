"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useAuthStore } from "@/store/auth-store"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Checkbox } from "@/components/ui/checkbox"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { MessageSquare, Star, Send, CheckCircle, Clock, Gift } from "lucide-react"
import { toast } from "sonner"

interface Survey {
  id: string
  title: string
  description: string
  type: "experience" | "feature" | "satisfaction" | "improvement"
  status: "available" | "completed" | "expired"
  reward: number
  estimatedTime: number
  questions: SurveyQuestion[]
  completedAt?: string
}

interface SurveyQuestion {
  id: string
  type: "rating" | "multiple_choice" | "text" | "checkbox" | "scale"
  question: string
  required: boolean
  options?: string[]
  min?: number
  max?: number
}

const mockSurveys: Survey[] = [
  {
    id: "survey-1",
    title: "University Application Experience",
    description: "Help us improve the application process by sharing your experience",
    type: "experience",
    status: "available",
    reward: 50,
    estimatedTime: 5,
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
        options: ["Document Upload", "Form Filling", "Payment Process", "University Selection", "None"],
      },
      {
        id: "q3",
        type: "text",
        question: "What improvements would you suggest for the application process?",
        required: false,
      },
    ],
  },
  {
    id: "survey-2",
    title: "Platform Features Feedback",
    description: "Rate our platform features and suggest improvements",
    type: "feature",
    status: "available",
    reward: 30,
    estimatedTime: 3,
    questions: [
      {
        id: "q1",
        type: "scale",
        question: "How useful is the university comparison feature?",
        required: true,
        min: 1,
        max: 10,
      },
      {
        id: "q2",
        type: "checkbox",
        question: "Which features do you use most frequently?",
        required: true,
        options: ["University Search", "Application Tracking", "Document Upload", "Payment History", "Notifications"],
      },
    ],
  },
  {
    id: "survey-3",
    title: "Customer Satisfaction Survey",
    description: "Tell us about your satisfaction with our services",
    type: "satisfaction",
    status: "completed",
    reward: 25,
    estimatedTime: 2,
    completedAt: "2024-01-15",
    questions: [],
  },
]

export default function StudentFeedbackPage() {
  const { user, isAuthenticated } = useAuthStore()
  const router = useRouter()
  const [surveys, setSurveys] = useState<Survey[]>(mockSurveys)
  const [activeSurvey, setActiveSurvey] = useState<Survey | null>(null)
  const [responses, setResponses] = useState<Record<string, any>>({})
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    if (!isAuthenticated || user?.role !== "student") {
      router.push("/auth/sign-in")
    }
  }, [isAuthenticated, user, router])

  if (!isAuthenticated || user?.role !== "student") {
    return null
  }

  const availableSurveys = surveys.filter((s) => s.status === "available")
  const completedSurveys = surveys.filter((s) => s.status === "completed")
  const totalRewards = completedSurveys.reduce((sum, s) => sum + s.reward, 0)

  const handleStartSurvey = (survey: Survey) => {
    setActiveSurvey(survey)
    setResponses({})
    setCurrentQuestionIndex(0)
  }

  const handleResponseChange = (questionId: string, value: any) => {
    setResponses((prev) => ({
      ...prev,
      [questionId]: value,
    }))
  }

  const handleNextQuestion = () => {
    if (activeSurvey && currentQuestionIndex < activeSurvey.questions.length - 1) {
      setCurrentQuestionIndex((prev) => prev + 1)
    }
  }

  const handlePreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex((prev) => prev - 1)
    }
  }

  const handleSubmitSurvey = async () => {
    if (!activeSurvey) return

    setIsSubmitting(true)

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 2000))

      // Update survey status
      setSurveys((prev) =>
        prev.map((s) =>
          s.id === activeSurvey.id ? { ...s, status: "completed" as const, completedAt: new Date().toISOString() } : s,
        ),
      )

      toast.success(`Survey completed! You earned ${activeSurvey.reward} points.`)
      setActiveSurvey(null)
      setResponses({})
      setCurrentQuestionIndex(0)
    } catch (error) {
      toast.error("Failed to submit survey. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  const renderQuestion = (question: SurveyQuestion) => {
    const value = responses[question.id]

    switch (question.type) {
      case "rating":
        return (
          <div className="space-y-4">
            <div className="flex justify-center space-x-2">
              {[1, 2, 3, 4, 5].map((rating) => (
                <button
                  key={rating}
                  onClick={() => handleResponseChange(question.id, rating)}
                  className={`p-2 rounded-full transition-colors ${
                    value === rating ? "text-yellow-500" : "text-gray-300 hover:text-yellow-400"
                  }`}
                >
                  <Star className="w-8 h-8 fill-current" />
                </button>
              ))}
            </div>
            <div className="text-center text-sm text-gray-600">
              {value ? `${value} out of 5 stars` : "Click to rate"}
            </div>
          </div>
        )

      case "multiple_choice":
        return (
          <RadioGroup value={value} onValueChange={(val) => handleResponseChange(question.id, val)}>
            {question.options?.map((option) => (
              <div key={option} className="flex items-center space-x-2">
                <RadioGroupItem value={option} id={option} />
                <Label htmlFor={option}>{option}</Label>
              </div>
            ))}
          </RadioGroup>
        )

      case "checkbox":
        return (
          <div className="space-y-3">
            {question.options?.map((option) => (
              <div key={option} className="flex items-center space-x-2">
                <Checkbox
                  id={option}
                  checked={value?.includes(option) || false}
                  onCheckedChange={(checked) => {
                    const currentValues = value || []
                    if (checked) {
                      handleResponseChange(question.id, [...currentValues, option])
                    } else {
                      handleResponseChange(
                        question.id,
                        currentValues.filter((v: string) => v !== option),
                      )
                    }
                  }}
                />
                <Label htmlFor={option}>{option}</Label>
              </div>
            ))}
          </div>
        )

      case "scale":
        return (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Poor</span>
              <span className="text-sm text-gray-600">Excellent</span>
            </div>
            <div className="flex justify-center space-x-2">
              {Array.from({ length: question.max || 10 }, (_, i) => i + 1).map((num) => (
                <button
                  key={num}
                  onClick={() => handleResponseChange(question.id, num)}
                  className={`w-8 h-8 rounded-full border-2 transition-colors ${
                    value === num ? "bg-blue-600 border-blue-600 text-white" : "border-gray-300 hover:border-blue-400"
                  }`}
                >
                  {num}
                </button>
              ))}
            </div>
            <div className="text-center text-sm text-gray-600">{value ? `Selected: ${value}` : "Select a rating"}</div>
          </div>
        )

      case "text":
        return (
          <Textarea
            value={value || ""}
            onChange={(e) => handleResponseChange(question.id, e.target.value)}
            placeholder="Type your response here..."
            rows={4}
            className="w-full"
          />
        )

      default:
        return null
    }
  }

  const getSurveyTypeColor = (type: string) => {
    switch (type) {
      case "experience":
        return "bg-blue-100 text-blue-800"
      case "feature":
        return "bg-green-100 text-green-800"
      case "satisfaction":
        return "bg-purple-100 text-purple-800"
      case "improvement":
        return "bg-orange-100 text-orange-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  if (activeSurvey) {
    const currentQuestion = activeSurvey.questions[currentQuestionIndex]
    const progress = ((currentQuestionIndex + 1) / activeSurvey.questions.length) * 100

    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <Card className="max-w-2xl mx-auto">
            <CardHeader>
              <div className="flex items-center justify-between mb-4">
                <Button variant="outline" onClick={() => setActiveSurvey(null)} disabled={isSubmitting}>
                  ← Back to Surveys
                </Button>
                <Badge className={getSurveyTypeColor(activeSurvey.type)}>{activeSurvey.type}</Badge>
              </div>
              <CardTitle>{activeSurvey.title}</CardTitle>
              <div className="space-y-2">
                <div className="flex justify-between text-sm text-gray-600">
                  <span>
                    Question {currentQuestionIndex + 1} of {activeSurvey.questions.length}
                  </span>
                  <span>{Math.round(progress)}% Complete</span>
                </div>
                <Progress value={progress} className="h-2" />
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold mb-4">
                  {currentQuestion.question}
                  {currentQuestion.required && <span className="text-red-500 ml-1">*</span>}
                </h3>
                {renderQuestion(currentQuestion)}
              </div>

              <div className="flex justify-between">
                <Button
                  variant="outline"
                  onClick={handlePreviousQuestion}
                  disabled={currentQuestionIndex === 0 || isSubmitting}
                >
                  Previous
                </Button>

                {currentQuestionIndex === activeSurvey.questions.length - 1 ? (
                  <Button
                    onClick={handleSubmitSurvey}
                    disabled={isSubmitting}
                    className="bg-green-600 hover:bg-green-700"
                  >
                    {isSubmitting ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                        Submitting...
                      </>
                    ) : (
                      <>
                        <Send className="w-4 h-4 mr-2" />
                        Submit Survey
                      </>
                    )}
                  </Button>
                ) : (
                  <Button
                    onClick={handleNextQuestion}
                    disabled={currentQuestion.required && !responses[currentQuestion.id]}
                  >
                    Next
                  </Button>
                )}
              </div>
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
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Feedback & Surveys</h1>
          <p className="text-gray-600">Share your experience and earn rewards by completing surveys</p>
        </div>

        {/* Rewards Summary */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Rewards Earned</p>
                  <p className="text-2xl font-bold text-green-600">{totalRewards} Points</p>
                </div>
                <Gift className="w-8 h-8 text-green-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Surveys Completed</p>
                  <p className="text-2xl font-bold text-blue-600">{completedSurveys.length}</p>
                </div>
                <CheckCircle className="w-8 h-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Available Surveys</p>
                  <p className="text-2xl font-bold text-orange-600">{availableSurveys.length}</p>
                </div>
                <Clock className="w-8 h-8 text-orange-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Available Surveys */}
        <div className="space-y-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Available Surveys</h2>
            {availableSurveys.length === 0 ? (
              <Card>
                <CardContent className="p-8 text-center">
                  <MessageSquare className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">No surveys available</h3>
                  <p className="text-gray-600">Check back later for new surveys and opportunities to earn rewards.</p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {availableSurveys.map((survey) => (
                  <Card key={survey.id} className="hover:shadow-lg transition-shadow">
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between mb-4">
                        <Badge className={getSurveyTypeColor(survey.type)}>{survey.type}</Badge>
                        <div className="flex items-center gap-2 text-green-600">
                          <Gift className="w-4 h-4" />
                          <span className="font-semibold">{survey.reward} pts</span>
                        </div>
                      </div>

                      <h3 className="text-lg font-semibold text-gray-900 mb-2">{survey.title}</h3>
                      <p className="text-gray-600 mb-4">{survey.description}</p>

                      <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                        <span>⏱️ ~{survey.estimatedTime} minutes</span>
                        <span>📝 {survey.questions.length} questions</span>
                      </div>

                      <Button
                        onClick={() => handleStartSurvey(survey)}
                        className="w-full bg-blue-600 hover:bg-blue-700"
                      >
                        Start Survey
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>

          {/* Completed Surveys */}
          {completedSurveys.length > 0 && (
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Completed Surveys</h2>
              <div className="space-y-4">
                {completedSurveys.map((survey) => (
                  <Card key={survey.id} className="opacity-75">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <h3 className="font-semibold text-gray-900">{survey.title}</h3>
                          <p className="text-sm text-gray-600">
                            Completed on {new Date(survey.completedAt!).toLocaleDateString()}
                          </p>
                        </div>
                        <div className="flex items-center gap-4">
                          <div className="flex items-center gap-1 text-green-600">
                            <Gift className="w-4 h-4" />
                            <span className="font-semibold">+{survey.reward} pts</span>
                          </div>
                          <CheckCircle className="w-5 h-5 text-green-600" />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
      <Footer />
    </div>
  )
}
