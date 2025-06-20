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
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { 
  ArrowLeft, 
  Eye, 
  ExternalLink,
  FileText,
  Clock,
  Calendar,
  Send
} from "lucide-react"
import Link from "next/link"
import { mockAdmissionForms } from "@/data/mock-admin-data"
import { toast } from "sonner"

export default function FormPreviewPage() {
  const { user, isAuthenticated } = useAuthStore()
  const router = useRouter()
  const params = useParams()
  const formId = params.id as string

  const [form, setForm] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [formData, setFormData] = useState<Record<string, any>>({})

  useEffect(() => {
    if (!isAuthenticated || user?.role !== "university") {
      router.push("/auth/sign-in")
      return
    }

    // Find the form by ID
    const foundForm = mockAdmissionForms.find(f => f.id === formId)
    if (foundForm) {
      setForm(foundForm)
      // Initialize form data with empty values
      const initialData: Record<string, any> = {}
      foundForm.fields.forEach((field: any) => {
        initialData[field.id] = field.type === 'checkbox' ? [] : ''
      })
      setFormData(initialData)
    } else {
      toast.error("Form not found")
      router.push("/admin/forms")
    }
    setLoading(false)
  }, [isAuthenticated, user, formId, router])

  const handleInputChange = (fieldId: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [fieldId]: value
    }))
  }

  const handleCheckboxChange = (fieldId: string, option: string, checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      [fieldId]: checked 
        ? [...(prev[fieldId] || []), option]
        : (prev[fieldId] || []).filter((item: string) => item !== option)
    }))
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

  const renderField = (field: any) => {
    switch (field.type) {
      case "text":
      case "email":
      case "phone":
        return (
          <Input
            placeholder={field.placeholder}
            value={formData[field.id] || ''}
            onChange={(e) => handleInputChange(field.id, e.target.value)}
            required={field.required}
          />
        )

      case "textarea":
        return (
          <Textarea
            placeholder={field.placeholder}
            value={formData[field.id] || ''}
            onChange={(e) => handleInputChange(field.id, e.target.value)}
            required={field.required}
            rows={4}
          />
        )

      case "select":
        return (
          <Select
            value={formData[field.id] || ''}
            onValueChange={(value) => handleInputChange(field.id, value)}
          >
            <SelectTrigger>
              <SelectValue placeholder={field.placeholder || "Select an option"} />
            </SelectTrigger>
            <SelectContent>
              {field.options?.map((option: string, idx: number) => (
                <SelectItem key={idx} value={option}>
                  {option}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )

      case "radio":
        return (
          <RadioGroup
            value={formData[field.id] || ''}
            onValueChange={(value) => handleInputChange(field.id, value)}
          >
            {field.options?.map((option: string, idx: number) => (
              <div key={idx} className="flex items-center space-x-2">
                <RadioGroupItem value={option} id={`${field.id}-${idx}`} />
                <Label htmlFor={`${field.id}-${idx}`}>{option}</Label>
              </div>
            ))}
          </RadioGroup>
        )

      case "checkbox":
        return (
          <div className="space-y-2">
            {field.options?.map((option: string, idx: number) => (
              <div key={idx} className="flex items-center space-x-2">
                <Checkbox
                  id={`${field.id}-${idx}`}
                  checked={(formData[field.id] || []).includes(option)}
                  onCheckedChange={(checked) => handleCheckboxChange(field.id, option, checked as boolean)}
                />
                <Label htmlFor={`${field.id}-${idx}`}>{option}</Label>
              </div>
            ))}
          </div>
        )

      case "file":
        return (
          <Input
            type="file"
            onChange={(e) => handleInputChange(field.id, e.target.files?.[0])}
            required={field.required}
          />
        )

      case "date":
        return (
          <Input
            type="date"
            value={formData[field.id] || ''}
            onChange={(e) => handleInputChange(field.id, e.target.value)}
            required={field.required}
          />
        )

      default:
        return (
          <Input
            placeholder={field.placeholder}
            value={formData[field.id] || ''}
            onChange={(e) => handleInputChange(field.id, e.target.value)}
            required={field.required}
          />
        )
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
            <span className="ml-2 text-gray-600">Loading form preview...</span>
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
              <h1 className="text-2xl font-bold text-gray-900">Form Preview</h1>
              <p className="text-gray-600">Preview how your form appears to applicants</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Badge className={`${getStatusColor(form.status)} border`}>
              {form.status.toUpperCase()}
            </Badge>
            <Button variant="outline" asChild>
              <Link href={`/admin/forms/${form.id}/edit`}>
                <ExternalLink className="w-4 h-4 mr-2" />
                Edit Form
              </Link>
            </Button>
          </div>
        </div>

        <div className="max-w-4xl mx-auto">
          {/* Form Preview */}
          <Card>
            <CardHeader className="border-b bg-white">
              <div className="text-center">
                <CardTitle className="text-2xl font-bold text-gray-900 mb-2">
                  {form.name}
                </CardTitle>
                <p className="text-gray-600 mb-4">{form.description}</p>
                
                {form.settings?.deadline && (
                  <div className="flex items-center justify-center gap-2 text-sm text-red-600 bg-red-50 rounded-lg px-3 py-2 inline-flex">
                    <Clock className="w-4 h-4" />
                    Application Deadline: {new Date(form.settings.deadline).toLocaleDateString()}
                  </div>
                )}
              </div>
            </CardHeader>
            
            <CardContent className="p-8">
              <form className="space-y-6">
                {form.fields.map((field: any, index: number) => (
                  <div key={field.id} className="space-y-2">
                    <Label htmlFor={field.id} className="text-sm font-medium text-gray-900">
                      {field.label}
                      {field.required && <span className="text-red-500 ml-1">*</span>}
                    </Label>
                    
                    {field.helpText && (
                      <p className="text-sm text-gray-600">{field.helpText}</p>
                    )}
                    
                    {renderField(field)}
                    
                    {field.validation && (
                      <p className="text-xs text-gray-500">
                        Validation: {JSON.stringify(field.validation)}
                      </p>
                    )}
                  </div>
                ))}

                <div className="pt-6 border-t">
                  <div className="flex items-center justify-between">
                    <div className="text-sm text-gray-500">
                      <p>* Required fields</p>
                      <p className="flex items-center gap-1 mt-1">
                        <Calendar className="w-4 h-4" />
                        Form created: {new Date(form.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    
                    <Button className="bg-[#0a5eb2] hover:bg-[#0a5eb2]/90">
                      <Send className="w-4 h-4 mr-2" />
                      Submit Application
                    </Button>
                  </div>
                </div>
              </form>
            </CardContent>
          </Card>

          {/* Preview Notice */}
          <Card className="mt-6 border-yellow-200 bg-yellow-50">
            <CardContent className="p-4">
              <div className="flex items-center gap-2 text-yellow-800">
                <Eye className="w-5 h-5" />
                <div>
                  <p className="font-medium">Preview Mode</p>
                  <p className="text-sm">This is how your form will appear to applicants. No data will be submitted in preview mode.</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <Footer />
    </div>
  )
}