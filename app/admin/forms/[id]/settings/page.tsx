"use client"

import { useEffect, useState } from "react"
import { useRouter, useParams } from "next/navigation"
import { useAuthStore } from "@/store/auth-store"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { 
  ArrowLeft, 
  Settings,
  Save,
  Trash2,
  Copy,
  Eye,
  EyeOff,
  Calendar,
  Globe,
  Shield,
  Bell,
  FileText,
  AlertTriangle
} from "lucide-react"
import Link from "next/link"
import { mockAdmissionForms } from "@/data/mock-admin-data"
import { toast } from "sonner"

export default function FormSettingsPage() {
  const { user, isAuthenticated } = useAuthStore()
  const router = useRouter()
  const params = useParams()
  const formId = params.id as string

  const [form, setForm] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  // Form settings state
  const [settings, setSettings] = useState({
    // Basic Settings
    name: "",
    description: "",
    status: "draft",
    
    // Access & Visibility
    isPublic: true,
    requiresLogin: false,
    allowMultipleSubmissions: false,
    
    // Deadline & Scheduling
    hasDeadline: false,
    deadline: "",
    hasStartDate: false,
    startDate: "",
    
    // Notifications
    emailNotifications: true,
    notificationEmail: "",
    sendConfirmationEmail: true,
    confirmationEmailTemplate: "",
    
    // Submission Settings
    maxSubmissions: 0, // 0 = unlimited
    autoClose: false,
    redirectUrl: "",
    showProgressBar: true,
    
    // Security & Privacy
    enableCaptcha: false,
    requireEmailVerification: false,
    dataRetentionDays: 365,
    
    // Appearance
    customCss: "",
    headerText: "",
    footerText: "",
    
    // Advanced
    allowSaveDraft: true,
    trackAnalytics: true,
    enableFileUploads: true,
    maxFileSize: 10, // MB
    allowedFileTypes: ["pdf", "doc", "docx", "jpg", "png"]
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
      // Initialize settings with form data
      setSettings(prev => ({
        ...prev,
        name: foundForm.name,
        description: foundForm.description,
        status: foundForm.status,
        deadline: foundForm.settings?.deadline || "",
        hasDeadline: !!foundForm.settings?.deadline,
        notificationEmail: user?.email || ""
      }))
    } else {
      toast.error("Form not found")
      router.push("/admin/forms")
    }
    setLoading(false)
  }, [isAuthenticated, user, formId, router])

  const handleSettingChange = (key: string, value: any) => {
    setSettings(prev => ({
      ...prev,
      [key]: value
    }))
  }

  const handleSave = async () => {
    setSaving(true)
    try {
      // In real app, this would call API to save settings
      await new Promise(resolve => setTimeout(resolve, 1000)) // Simulate API call
      toast.success("Form settings saved successfully!")
    } catch (error) {
      toast.error("Failed to save settings")
    } finally {
      setSaving(false)
    }
  }

  const handleDuplicateForm = async () => {
    try {
      // In real app, this would call API to duplicate form
      await new Promise(resolve => setTimeout(resolve, 500))
      toast.success("Form duplicated successfully!")
      router.push("/admin/forms")
    } catch (error) {
      toast.error("Failed to duplicate form")
    }
  }

  const handleDeleteForm = async () => {
    if (!confirm(`Are you sure you want to delete "${form.name}"? This action cannot be undone.`)) {
      return
    }

    try {
      // In real app, this would call API to delete form
      await new Promise(resolve => setTimeout(resolve, 500))
      toast.success("Form deleted successfully!")
      router.push("/admin/forms")
    } catch (error) {
      toast.error("Failed to delete form")
    }
  }

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
            <span className="ml-2 text-gray-600">Loading form settings...</span>
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
              <h1 className="text-2xl font-bold text-gray-900">Form Settings</h1>
              <p className="text-gray-600">{form.name}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Badge className={`${getStatusColor(form.status)} border`}>
              {form.status.toUpperCase()}
            </Badge>
            <Button onClick={handleSave} disabled={saving}>
              <Save className="w-4 h-4 mr-2" />
              {saving ? "Saving..." : "Save Changes"}
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Settings */}
          <div className="lg:col-span-2 space-y-6">
            {/* Basic Settings */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="w-5 h-5" />
                  Basic Settings
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <Label htmlFor="name">Form Name</Label>
                  <Input
                    id="name"
                    value={settings.name}
                    onChange={(e) => handleSettingChange("name", e.target.value)}
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={settings.description}
                    onChange={(e) => handleSettingChange("description", e.target.value)}
                    rows={3}
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label htmlFor="status">Status</Label>
                  <Select value={settings.status} onValueChange={(value) => handleSettingChange("status", value)}>
                    <SelectTrigger className="mt-1">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="draft">Draft</SelectItem>
                      <SelectItem value="published">Published</SelectItem>
                      <SelectItem value="archived">Archived</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            {/* Access & Visibility */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Globe className="w-5 h-5" />
                  Access & Visibility
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="isPublic">Public Form</Label>
                    <p className="text-sm text-gray-600">Allow anyone to access this form</p>
                  </div>
                  <Switch
                    id="isPublic"
                    checked={settings.isPublic}
                    onCheckedChange={(checked) => handleSettingChange("isPublic", checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="requiresLogin">Require Login</Label>
                    <p className="text-sm text-gray-600">Users must be logged in to submit</p>
                  </div>
                  <Switch
                    id="requiresLogin"
                    checked={settings.requiresLogin}
                    onCheckedChange={(checked) => handleSettingChange("requiresLogin", checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="allowMultipleSubmissions">Multiple Submissions</Label>
                    <p className="text-sm text-gray-600">Allow users to submit multiple times</p>
                  </div>
                  <Switch
                    id="allowMultipleSubmissions"
                    checked={settings.allowMultipleSubmissions}
                    onCheckedChange={(checked) => handleSettingChange("allowMultipleSubmissions", checked)}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Deadline & Scheduling */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="w-5 h-5" />
                  Deadline & Scheduling
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="hasDeadline">Set Deadline</Label>
                    <p className="text-sm text-gray-600">Form will close automatically</p>
                  </div>
                  <Switch
                    id="hasDeadline"
                    checked={settings.hasDeadline}
                    onCheckedChange={(checked) => handleSettingChange("hasDeadline", checked)}
                  />
                </div>

                {settings.hasDeadline && (
                  <div>
                    <Label htmlFor="deadline">Deadline Date & Time</Label>
                    <Input
                      id="deadline"
                      type="datetime-local"
                      value={settings.deadline}
                      onChange={(e) => handleSettingChange("deadline", e.target.value)}
                      className="mt-1"
                    />
                  </div>
                )}

                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="hasStartDate">Set Start Date</Label>
                    <p className="text-sm text-gray-600">Form will open automatically</p>
                  </div>
                  <Switch
                    id="hasStartDate"
                    checked={settings.hasStartDate}
                    onCheckedChange={(checked) => handleSettingChange("hasStartDate", checked)}
                  />
                </div>

                {settings.hasStartDate && (
                  <div>
                    <Label htmlFor="startDate">Start Date & Time</Label>
                    <Input
                      id="startDate"
                      type="datetime-local"
                      value={settings.startDate}
                      onChange={(e) => handleSettingChange("startDate", e.target.value)}
                      className="mt-1"
                    />
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Notifications */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Bell className="w-5 h-5" />
                  Notifications
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="emailNotifications">Email Notifications</Label>
                    <p className="text-sm text-gray-600">Receive emails for new submissions</p>
                  </div>
                  <Switch
                    id="emailNotifications"
                    checked={settings.emailNotifications}
                    onCheckedChange={(checked) => handleSettingChange("emailNotifications", checked)}
                  />
                </div>

                {settings.emailNotifications && (
                  <div>
                    <Label htmlFor="notificationEmail">Notification Email</Label>
                    <Input
                      id="notificationEmail"
                      type="email"
                      value={settings.notificationEmail}
                      onChange={(e) => handleSettingChange("notificationEmail", e.target.value)}
                      className="mt-1"
                    />
                  </div>
                )}

                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="sendConfirmationEmail">Confirmation Emails</Label>
                    <p className="text-sm text-gray-600">Send confirmation to submitters</p>
                  </div>
                  <Switch
                    id="sendConfirmationEmail"
                    checked={settings.sendConfirmationEmail}
                    onCheckedChange={(checked) => handleSettingChange("sendConfirmationEmail", checked)}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Security & Privacy */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="w-5 h-5" />
                  Security & Privacy
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="enableCaptcha">Enable CAPTCHA</Label>
                    <p className="text-sm text-gray-600">Prevent spam submissions</p>
                  </div>
                  <Switch
                    id="enableCaptcha"
                    checked={settings.enableCaptcha}
                    onCheckedChange={(checked) => handleSettingChange("enableCaptcha", checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="requireEmailVerification">Email Verification</Label>
                    <p className="text-sm text-gray-600">Verify email addresses before submission</p>
                  </div>
                  <Switch
                    id="requireEmailVerification"
                    checked={settings.requireEmailVerification}
                    onCheckedChange={(checked) => handleSettingChange("requireEmailVerification", checked)}
                  />
                </div>

                <div>
                  <Label htmlFor="dataRetentionDays">Data Retention (Days)</Label>
                  <Input
                    id="dataRetentionDays"
                    type="number"
                    value={settings.dataRetentionDays}
                    onChange={(e) => handleSettingChange("dataRetentionDays", parseInt(e.target.value))}
                    className="mt-1"
                    min="1"
                    max="3650"
                  />
                  <p className="text-sm text-gray-600 mt-1">How long to keep submitted data (1-3650 days)</p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button variant="outline" className="w-full" asChild>
                  <Link href={`/admin/forms/${form.id}/preview`}>
                    <Eye className="w-4 h-4 mr-2" />
                    Preview Form
                  </Link>
                </Button>
                
                <Button variant="outline" className="w-full" onClick={handleDuplicateForm}>
                  <Copy className="w-4 h-4 mr-2" />
                  Duplicate Form
                </Button>

                <Separator />
                
                <Button 
                  variant="destructive" 
                  className="w-full" 
                  onClick={handleDeleteForm}
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  Delete Form
                </Button>
              </CardContent>
            </Card>

            {/* Form Statistics */}
            <Card>
              <CardHeader>
                <CardTitle>Form Statistics</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-gray-600">Total Fields</span>
                  <span className="font-semibold">{form.fields.length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Submissions</span>
                  <span className="font-semibold">{form.submissions}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Completion Rate</span>
                  <span className="font-semibold">{form.completionRate}%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Last Updated</span>
                  <span className="font-semibold">{new Date(form.updatedAt).toLocaleDateString()}</span>
                </div>
              </CardContent>
            </Card>

            {/* Advanced Settings */}
            <Card>
              <CardHeader>
                <CardTitle>Advanced Settings</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="showProgressBar" className="text-sm">Progress Bar</Label>
                    <p className="text-xs text-gray-600">Show completion progress</p>
                  </div>
                  <Switch
                    id="showProgressBar"
                    checked={settings.showProgressBar}
                    onCheckedChange={(checked) => handleSettingChange("showProgressBar", checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="allowSaveDraft" className="text-sm">Save Draft</Label>
                    <p className="text-xs text-gray-600">Allow saving incomplete forms</p>
                  </div>
                  <Switch
                    id="allowSaveDraft"
                    checked={settings.allowSaveDraft}
                    onCheckedChange={(checked) => handleSettingChange("allowSaveDraft", checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="trackAnalytics" className="text-sm">Analytics</Label>
                    <p className="text-xs text-gray-600">Track form performance</p>
                  </div>
                  <Switch
                    id="trackAnalytics"
                    checked={settings.trackAnalytics}
                    onCheckedChange={(checked) => handleSettingChange("trackAnalytics", checked)}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Warning */}
            <Card className="border-yellow-200 bg-yellow-50">
              <CardContent className="p-4">
                <div className="flex items-start gap-2 text-yellow-800">
                  <AlertTriangle className="w-5 h-5 mt-0.5" />
                  <div>
                    <p className="font-medium text-sm">Save Changes</p>
                    <p className="text-xs">Remember to save your changes before leaving this page.</p>
                  </div>
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