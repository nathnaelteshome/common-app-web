"use client"

import { useEffect, useState } from "react"
import { useRouter, useParams } from "next/navigation"
import { useAuthStore } from "@/store/auth-store"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { 
  ArrowLeft, 
  Save,
  Plus,
  Trash2,
  Loader2,
  AlertCircle
} from "lucide-react"
import Link from "next/link"
import { applicationApi, type ApplicationDetail, type CreateApplicationRequest } from "@/lib/api/applications"
import { toast } from "sonner"

interface AcademicEntry {
  institution: string
  degree: string
  field_of_study: string
  gpa: number
  start_date: string
  end_date: string
  is_completed: boolean
}

export default function EditApplicationPage() {
  const { user, isAuthenticated } = useAuthStore()
  const router = useRouter()
  const params = useParams()
  const applicationId = params.id as string

  const [application, setApplication] = useState<ApplicationDetail | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  // Form state
  const [personalStatement, setPersonalStatement] = useState("")
  const [academicHistory, setAcademicHistory] = useState<AcademicEntry[]>([])
  const [personalInfo, setPersonalInfo] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: ""
  })
  const [essays, setEssays] = useState<Record<string, string>>({})

  // Fetch application details
  useEffect(() => {
    if (!isAuthenticated || user?.role !== "student") {
      router.push("/auth/sign-in")
      return
    }

    if (!applicationId) {
      toast.error("Invalid application ID")
      router.push("/student/applications")
      return
    }

    fetchApplicationDetails()
  }, [isAuthenticated, user, applicationId, router])

  const fetchApplicationDetails = async () => {
    try {
      setLoading(true)
      const response = await applicationApi.getApplication(applicationId)
      
      if (response.success && response.data) {
        const app = response.data
        setApplication(app)
        
        // Pre-populate form with existing data
        setPersonalStatement(app.personal_statement || "")
        setAcademicHistory(app.academic_history || [])
        setPersonalInfo({
          firstName: app.student.studentProfile.first_name,
          lastName: app.student.studentProfile.last_name,
          email: app.student.email,
          phone: app.student.studentProfile.phone_number
        })
        
        // Check if application can be edited
        if (app.status !== "draft") {
          toast.error("This application cannot be edited as it has already been submitted")
          router.push(`/student/applications/${applicationId}`)
          return
        }
      } else {
        toast.error("Application not found")
        router.push("/student/applications")
      }
    } catch (error) {
      console.error("Error fetching application:", error)
      toast.error("Failed to load application details")
      router.push("/student/applications")
    } finally {
      setLoading(false)
    }
  }

  const addAcademicEntry = () => {
    setAcademicHistory(prev => [...prev, {
      institution: "",
      degree: "",
      field_of_study: "",
      gpa: 0,
      start_date: "",
      end_date: "",
      is_completed: false
    }])
  }

  const updateAcademicEntry = (index: number, field: keyof AcademicEntry, value: string | number | boolean) => {
    setAcademicHistory(prev => prev.map((entry, i) => 
      i === index ? { ...entry, [field]: value } : entry
    ))
  }

  const removeAcademicEntry = (index: number) => {
    setAcademicHistory(prev => prev.filter((_, i) => i !== index))
  }

  const handleSave = async () => {
    if (!application) return

    try {
      setSaving(true)
      
      const updateData: Partial<CreateApplicationRequest> = {
        personalStatement: personalStatement.trim(),
        academicHistory: academicHistory.filter(entry => 
          entry.institution && entry.degree && entry.field_of_study
        ),
        personalInfo,
        essays
      }

      const response = await applicationApi.updateApplication(application.id, updateData)
      
      if (response.success) {
        toast.success("Application saved successfully!")
        router.push(`/student/applications/${application.id}`)
      } else {
        toast.error("Failed to save application")
      }
    } catch (error) {
      console.error("Error saving application:", error)
      toast.error("Failed to save application")
    } finally {
      setSaving(false)
    }
  }

  if (!isAuthenticated || user?.role !== "student") {
    return null
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center h-64">
            <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
            <span className="ml-2 text-gray-600">Loading application...</span>
          </div>
        </div>
        <Footer />
      </div>
    )
  }

  if (!application) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <Card className="text-center py-12">
            <CardContent>
              <AlertCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Application not found</h3>
              <p className="text-gray-600 mb-6">The application you're trying to edit doesn't exist or cannot be modified.</p>
              <Button asChild>
                <Link href="/student/applications">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to Applications
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
              <Link href={`/student/applications/${application.id}`}>
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Application
              </Link>
            </Button>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Edit Application</h1>
              <p className="text-gray-600">{application.program.university.name} - {application.program.name}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Badge variant="outline" className="bg-yellow-50 text-yellow-800 border-yellow-200">
              DRAFT
            </Badge>
            <Button onClick={handleSave} disabled={saving}>
              {saving ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4 mr-2" />
                  Save Changes
                </>
              )}
            </Button>
          </div>
        </div>

        <div className="max-w-4xl mx-auto space-y-8">
          {/* Personal Information */}
          <Card>
            <CardHeader>
              <CardTitle>Personal Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="firstName">First Name</Label>
                  <Input
                    id="firstName"
                    value={personalInfo.firstName}
                    onChange={(e) => setPersonalInfo(prev => ({ ...prev, firstName: e.target.value }))}
                    placeholder="Enter your first name"
                  />
                </div>
                <div>
                  <Label htmlFor="lastName">Last Name</Label>
                  <Input
                    id="lastName"
                    value={personalInfo.lastName}
                    onChange={(e) => setPersonalInfo(prev => ({ ...prev, lastName: e.target.value }))}
                    placeholder="Enter your last name"
                  />
                </div>
                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={personalInfo.email}
                    onChange={(e) => setPersonalInfo(prev => ({ ...prev, email: e.target.value }))}
                    placeholder="Enter your email"
                  />
                </div>
                <div>
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input
                    id="phone"
                    value={personalInfo.phone}
                    onChange={(e) => setPersonalInfo(prev => ({ ...prev, phone: e.target.value }))}
                    placeholder="Enter your phone number"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Personal Statement */}
          <Card>
            <CardHeader>
              <CardTitle>Personal Statement</CardTitle>
            </CardHeader>
            <CardContent>
              <div>
                <Label htmlFor="personalStatement">Tell us about yourself and why you're applying</Label>
                <Textarea
                  id="personalStatement"
                  value={personalStatement}
                  onChange={(e) => setPersonalStatement(e.target.value)}
                  placeholder="Write your personal statement here..."
                  className="min-h-[200px] mt-2"
                />
                <p className="text-sm text-gray-500 mt-2">
                  {personalStatement.length} characters
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Academic History */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Academic History</CardTitle>
                <Button onClick={addAcademicEntry} variant="outline" size="sm">
                  <Plus className="w-4 h-4 mr-2" />
                  Add Education
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              {academicHistory.map((entry, index) => (
                <div key={index} className="border rounded-lg p-4 space-y-4">
                  <div className="flex items-center justify-between">
                    <h4 className="font-medium text-gray-900">Education #{index + 1}</h4>
                    <Button
                      onClick={() => removeAcademicEntry(index)}
                      variant="ghost"
                      size="sm"
                      className="text-red-600 hover:text-red-800"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label>Institution Name</Label>
                      <Input
                        value={entry.institution}
                        onChange={(e) => updateAcademicEntry(index, 'institution', e.target.value)}
                        placeholder="e.g., Harvard University"
                      />
                    </div>
                    <div>
                      <Label>Degree</Label>
                      <Input
                        value={entry.degree}
                        onChange={(e) => updateAcademicEntry(index, 'degree', e.target.value)}
                        placeholder="e.g., Bachelor of Science"
                      />
                    </div>
                    <div>
                      <Label>Field of Study</Label>
                      <Input
                        value={entry.field_of_study}
                        onChange={(e) => updateAcademicEntry(index, 'field_of_study', e.target.value)}
                        placeholder="e.g., Computer Science"
                      />
                    </div>
                    <div>
                      <Label>GPA</Label>
                      <Input
                        type="number"
                        step="0.1"
                        min="0"
                        max="4"
                        value={entry.gpa}
                        onChange={(e) => updateAcademicEntry(index, 'gpa', parseFloat(e.target.value) || 0)}
                        placeholder="e.g., 3.8"
                      />
                    </div>
                    <div>
                      <Label>Start Date</Label>
                      <Input
                        type="date"
                        value={entry.start_date}
                        onChange={(e) => updateAcademicEntry(index, 'start_date', e.target.value)}
                      />
                    </div>
                    <div>
                      <Label>End Date</Label>
                      <Input
                        type="date"
                        value={entry.end_date}
                        onChange={(e) => updateAcademicEntry(index, 'end_date', e.target.value)}
                        disabled={!entry.is_completed}
                      />
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id={`completed-${index}`}
                      checked={entry.is_completed}
                      onChange={(e) => updateAcademicEntry(index, 'is_completed', e.target.checked)}
                      className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    />
                    <Label htmlFor={`completed-${index}`} className="text-sm">
                      I have completed this education
                    </Label>
                  </div>
                </div>
              ))}
              
              {academicHistory.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  <p>No academic history added yet.</p>
                  <Button onClick={addAcademicEntry} variant="outline" className="mt-2">
                    <Plus className="w-4 h-4 mr-2" />
                    Add Your First Education
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Essays */}
          <Card>
            <CardHeader>
              <CardTitle>Additional Essays</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="whyProgram">Why are you interested in this program?</Label>
                <Textarea
                  id="whyProgram"
                  value={essays.whyThisProgram || ""}
                  onChange={(e) => setEssays(prev => ({ ...prev, whyThisProgram: e.target.value }))}
                  placeholder="Explain your interest in this specific program..."
                  className="min-h-[150px] mt-2"
                />
              </div>
              
              <div>
                <Label htmlFor="careerGoals">What are your career goals?</Label>
                <Textarea
                  id="careerGoals"
                  value={essays.careerGoals || ""}
                  onChange={(e) => setEssays(prev => ({ ...prev, careerGoals: e.target.value }))}
                  placeholder="Describe your career aspirations and how this program will help..."
                  className="min-h-[150px] mt-2"
                />
              </div>
            </CardContent>
          </Card>

          {/* Save Actions */}
          <div className="flex items-center justify-between pt-6">
            <Button variant="outline" asChild>
              <Link href={`/student/applications/${application.id}`}>
                Cancel Changes
              </Link>
            </Button>
            <Button onClick={handleSave} disabled={saving}>
              {saving ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Saving Changes...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4 mr-2" />
                  Save Application
                </>
              )}
            </Button>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  )
}