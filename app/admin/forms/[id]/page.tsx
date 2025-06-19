"use client"

import { useEffect, useState } from "react"
import { useRouter, useParams } from "next/navigation"
import { useAuthStore } from "@/store/auth-store"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { 
  ArrowLeft, 
  Edit, 
  Eye, 
  BarChart3,
  Settings,
  Copy,
  Trash2,
  FileText,
  Users,
  Calendar,
  Clock,
  ExternalLink
} from "lucide-react"
import Link from "next/link"
import { mockAdmissionForms } from "@/data/mock-admin-data"
import { toast } from "sonner"

export default function FormViewPage() {
  const { user, isAuthenticated } = useAuthStore()
  const router = useRouter()
  const params = useParams()
  const formId = params.id as string

  const [form, setForm] = useState<any>(null)
  const [loading, setLoading] = useState(true)

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

  const getFieldTypeIcon = (type: string) => {
    switch (type) {
      case "text":
      case "email":
      case "phone":
        return "📝"
      case "select":
        return "📋"
      case "radio":
        return "🔘"
      case "checkbox":
        return "☑️"
      case "textarea":
        return "📄"
      case "file":
        return "📎"
      case "date":
        return "📅"
      default:
        return "❓"
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
            <span className="ml-2 text-gray-600">Loading form...</span>
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
              <Link href="/admin/forms">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Forms
              </Link>
            </Button>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{form.name}</h1>
              <p className="text-gray-600">{form.description}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Badge className={`${getStatusColor(form.status)} border`}>
              {form.status.toUpperCase()}
            </Badge>
            <Button variant="outline" asChild>
              <Link href={`/admin/forms/${form.id}/edit`}>
                <Edit className="w-4 h-4 mr-2" />
                Edit Form
              </Link>
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Form Preview */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Eye className="w-5 h-5" />
                  Form Preview
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Form Header */}
                <div className="border-b pb-4">
                  <h2 className="text-xl font-semibold text-gray-900 mb-2">{form.name}</h2>
                  <p className="text-gray-600">{form.description}</p>
                  {form.settings?.deadline && (
                    <div className="flex items-center gap-2 mt-3 text-sm text-red-600">
                      <Clock className="w-4 h-4" />
                      Deadline: {new Date(form.settings.deadline).toLocaleDateString()}
                    </div>
                  )}
                </div>

                {/* Form Fields */}
                <div className="space-y-4">
                  {form.fields.map((field: any, index: number) => (
                    <div key={field.id} className="border rounded-lg p-4 bg-gray-50">
                      <div className="flex items-start gap-3">
                        <span className="text-2xl">{getFieldTypeIcon(field.type)}</span>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <label className="font-medium text-gray-900">
                              {field.label}
                              {field.required && <span className="text-red-500 ml-1">*</span>}
                            </label>
                            <Badge variant="outline" className="text-xs">
                              {field.type}
                            </Badge>
                          </div>
                          
                          {field.placeholder && (
                            <p className="text-sm text-gray-500 mb-2">
                              Placeholder: "{field.placeholder}"
                            </p>
                          )}
                          
                          {field.helpText && (
                            <p className="text-sm text-gray-600 mb-2">{field.helpText}</p>
                          )}

                          {field.options && field.options.length > 0 && (
                            <div className="mt-2">
                              <p className="text-sm font-medium text-gray-700 mb-1">Options:</p>
                              <div className="flex flex-wrap gap-1">
                                {field.options.map((option: string, idx: number) => (
                                  <Badge key={idx} variant="secondary" className="text-xs">
                                    {option}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                          )}

                          {field.validation && (
                            <div className="mt-2 text-xs text-gray-500">
                              <span className="font-medium">Validation: </span>
                              {JSON.stringify(field.validation)}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Form Information */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Form Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-3">
                  <FileText className="w-4 h-4 text-gray-500" />
                  <div>
                    <p className="text-sm font-medium">Total Fields</p>
                    <p className="text-sm text-gray-600">{form.fields.length} fields</p>
                  </div>
                </div>
                
                <Separator />
                
                <div className="flex items-center gap-3">
                  <Users className="w-4 h-4 text-gray-500" />
                  <div>
                    <p className="text-sm font-medium">Submissions</p>
                    <p className="text-sm text-gray-600">{form.submissions} submissions</p>
                  </div>
                </div>
                
                <Separator />
                
                <div className="flex items-center gap-3">
                  <BarChart3 className="w-4 h-4 text-gray-500" />
                  <div>
                    <p className="text-sm font-medium">Completion Rate</p>
                    <p className="text-sm text-gray-600">{form.completionRate}%</p>
                  </div>
                </div>

                <Separator />
                
                <div className="flex items-center gap-3">
                  <Calendar className="w-4 h-4 text-gray-500" />
                  <div>
                    <p className="text-sm font-medium">Last Updated</p>
                    <p className="text-sm text-gray-600">{new Date(form.updatedAt).toLocaleDateString()}</p>
                  </div>
                </div>

                {form.settings?.deadline && (
                  <>
                    <Separator />
                    <div className="flex items-center gap-3">
                      <Clock className="w-4 h-4 text-gray-500" />
                      <div>
                        <p className="text-sm font-medium">Application Deadline</p>
                        <p className="text-sm text-gray-600">{new Date(form.settings.deadline).toLocaleDateString()}</p>
                      </div>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button variant="outline" className="w-full" asChild>
                  <Link href={`/admin/forms/${form.id}/edit`}>
                    <Edit className="w-4 h-4 mr-2" />
                    Edit Form
                  </Link>
                </Button>
                
                <Button variant="outline" className="w-full" asChild>
                  <Link href={`/admin/forms/${form.id}/analytics`}>
                    <BarChart3 className="w-4 h-4 mr-2" />
                    View Analytics
                  </Link>
                </Button>
                
                <Button variant="outline" className="w-full">
                  <Copy className="w-4 h-4 mr-2" />
                  Duplicate Form
                </Button>
                
                <Button variant="outline" className="w-full">
                  <ExternalLink className="w-4 h-4 mr-2" />
                  Public Form Link
                </Button>

                <Separator />
                
                <Button variant="outline" className="w-full" asChild>
                  <Link href={`/admin/forms/${form.id}/settings`}>
                    <Settings className="w-4 h-4 mr-2" />
                    Form Settings
                  </Link>
                </Button>
                
                <Button variant="destructive" className="w-full">
                  <Trash2 className="w-4 h-4 mr-2" />
                  Delete Form
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  )
}