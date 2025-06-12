"use client"

import { useEffect, useState } from "react"
import { useRouter, useParams } from "next/navigation"
import { useAuthStore } from "@/store/auth-store"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { FormBuilder } from "@/components/form-builder"
import { TemplateLibrary } from "@/components/template-library"
import { TemplatePreview } from "@/components/template-preview"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Save, Eye, BookIcon as Publish, History, Sparkles, RefreshCw } from "lucide-react"
import Link from "next/link"
import { toast } from "sonner"
import { mockAdmissionForms } from "@/data/mock-admin-data"
import type { FormTemplate } from "@/data/form-templates"

export default function EditForm() {
  const { user, isAuthenticated } = useAuthStore()
  const router = useRouter()
  const params = useParams()
  const formId = params.id as string

  const [form, setForm] = useState(null)
  const [activeTab, setActiveTab] = useState<"builder" | "template">("builder")
  const [selectedTemplate, setSelectedTemplate] = useState<FormTemplate | null>(null)
  const [previewTemplate, setPreviewTemplate] = useState<FormTemplate | null>(null)
  const [formName, setFormName] = useState("")
  const [formDescription, setFormDescription] = useState("")
  const [formType, setFormType] = useState("")
  const [formFields, setFormFields] = useState([])
  const [isPreviewMode, setIsPreviewMode] = useState(false)
  const [originalTemplate, setOriginalTemplate] = useState<FormTemplate | null>(null)

  useEffect(() => {
    if (!isAuthenticated || user?.role !== "university") {
      router.push("/auth/sign-in")
      return
    }

    // Load form data
    const foundForm = mockAdmissionForms.find((f) => f.id === formId)
    if (foundForm) {
      setForm(foundForm)
      setFormName(foundForm.name)
      setFormDescription(foundForm.description)
      setFormType(foundForm.type)
      setFormFields(foundForm.fields)

      // Check if this form was created from a template
      // In a real app, you'd store this information in the form metadata
      if (foundForm.name.includes("(Copy)") || foundForm.name.includes("Template")) {
        // This is a template-based form
        // You could store the original template ID in the form metadata
      }
    } else {
      toast.error("Form not found")
      router.push("/admin/forms")
    }
  }, [isAuthenticated, user, router, formId])

  if (!isAuthenticated || user?.role !== "university") {
    return null
  }

  if (!form) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-[#0a5eb2] mx-auto mb-4"></div>
          <p className="text-gray-600">Loading form...</p>
        </div>
      </div>
    )
  }

  const handleSelectTemplate = (template: FormTemplate) => {
    setSelectedTemplate(template)

    // Show confirmation dialog before replacing current form
    if (
      window.confirm(
        `Are you sure you want to replace the current form with the "${template.name}" template? This action cannot be undone.`,
      )
    ) {
      setFormName(`${template.name} (Copy)`)
      setFormDescription(template.description)
      setFormType(template.category)
      setFormFields(template.fields.map((field) => ({ ...field, id: `field_${Date.now()}_${Math.random()}` })))
      setActiveTab("builder")
      toast.success(`Form replaced with template "${template.name}"`)
    }
  }

  const handlePreviewTemplate = (template: FormTemplate) => {
    setPreviewTemplate(template)
  }

  const handleApplyTemplate = (template: FormTemplate) => {
    // Merge template fields with existing fields
    const mergedFields = [
      ...formFields,
      ...template.fields.map((field) => ({
        ...field,
        id: `field_${Date.now()}_${Math.random()}`,
        label: `${field.label} (from template)`,
      })),
    ]

    setFormFields(mergedFields)
    setActiveTab("builder")
    toast.success(`Added ${template.fields.length} fields from template "${template.name}"`)
  }

  const handleSave = () => {
    if (!formName.trim()) {
      toast.error("Please enter a form name")
      return
    }

    // Save form changes
    toast.success("Form updated successfully")
  }

  const handlePublish = () => {
    if (!formName.trim()) {
      toast.error("Please enter a form name")
      return
    }

    if (formFields.length === 0) {
      toast.error("Please add at least one field to the form")
      return
    }

    // Publish form
    toast.success("Form published successfully")
  }

  const handlePreview = () => {
    setIsPreviewMode(!isPreviewMode)
  }

  const handleResetToOriginal = () => {
    if (window.confirm("Are you sure you want to reset the form to its original state? All changes will be lost.")) {
      const foundForm = mockAdmissionForms.find((f) => f.id === formId)
      if (foundForm) {
        setFormName(foundForm.name)
        setFormDescription(foundForm.description)
        setFormType(foundForm.type)
        setFormFields(foundForm.fields)
        toast.success("Form reset to original state")
      }
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <div className="container mx-auto px-4 py-8">
        {/* Header Section */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" asChild>
              <Link href="/admin/forms">
                <ArrowLeft className="w-4 h-4" />
              </Link>
            </Button>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Edit Form: {form.name}</h1>
              <p className="text-gray-600">
                {selectedTemplate
                  ? `Modified with template: ${selectedTemplate.name}`
                  : "Modify your admission form or apply a template"}
              </p>
            </div>
          </div>
          {activeTab === "builder" && (
            <div className="flex gap-2">
              <Button variant="outline" asChild>
                <Link href={`/admin/forms/${formId}/history`}>
                  <History className="w-4 h-4 mr-2" />
                  Version History
                </Link>
              </Button>
              <Button variant="outline" onClick={handleResetToOriginal}>
                <RefreshCw className="w-4 h-4 mr-2" />
                Reset
              </Button>
              <Button variant="outline" onClick={handlePreview}>
                <Eye className="w-4 h-4 mr-2" />
                {isPreviewMode ? "Edit" : "Preview"}
              </Button>
              <Button variant="outline" onClick={handleSave}>
                <Save className="w-4 h-4 mr-2" />
                Save Changes
              </Button>
              <Button className="bg-[#0a5eb2] hover:bg-[#0a5eb2]/90" onClick={handlePublish}>
                <Publish className="w-4 h-4 mr-2" />
                Publish
              </Button>
            </div>
          )}
        </div>

        {/* Main Content */}
        <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as "builder" | "template")}>
          <TabsList className="grid w-full grid-cols-2 mb-8">
            <TabsTrigger value="builder" className="flex items-center gap-2">
              <Eye className="w-4 h-4" />
              Form Builder
            </TabsTrigger>
            <TabsTrigger value="template" className="flex items-center gap-2">
              <Sparkles className="w-4 h-4" />
              Apply Template
            </TabsTrigger>
          </TabsList>

          <TabsContent value="builder" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
              {/* Form Settings */}
              <div className="lg:col-span-1">
                <Card>
                  <CardHeader>
                    <CardTitle>Form Settings</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label htmlFor="formName">Form Name *</Label>
                      <Input
                        id="formName"
                        value={formName}
                        onChange={(e) => setFormName(e.target.value)}
                        placeholder="e.g., Undergraduate Application"
                      />
                    </div>
                    <div>
                      <Label htmlFor="formDescription">Description</Label>
                      <Textarea
                        id="formDescription"
                        value={formDescription}
                        onChange={(e) => setFormDescription(e.target.value)}
                        placeholder="Brief description of this form"
                        rows={3}
                      />
                    </div>
                    <div>
                      <Label htmlFor="formType">Form Type</Label>
                      <Select value={formType} onValueChange={setFormType}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select form type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="undergraduate">Undergraduate Application</SelectItem>
                          <SelectItem value="graduate">Graduate Application</SelectItem>
                          <SelectItem value="transfer">Transfer Application</SelectItem>
                          <SelectItem value="international">International Application</SelectItem>
                          <SelectItem value="scholarship">Scholarship Application</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Form Statistics */}
                    <div className="pt-4 border-t">
                      <h4 className="font-medium mb-3">Form Statistics</h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Submissions:</span>
                          <span className="font-medium">{form.submissions}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Completion Rate:</span>
                          <span className="font-medium">{form.completionRate}%</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Status:</span>
                          <Badge variant="outline" className="capitalize">
                            {form.status}
                          </Badge>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Last Updated:</span>
                          <span className="font-medium">{new Date(form.updatedAt).toLocaleDateString()}</span>
                        </div>
                      </div>
                    </div>

                    {selectedTemplate && (
                      <div className="pt-4 border-t">
                        <h4 className="font-medium mb-3">Template Applied</h4>
                        <div className="space-y-2 text-sm">
                          <div>
                            <span className="text-gray-600">Template:</span>
                            <p className="font-medium">{selectedTemplate.name}</p>
                          </div>
                          <div>
                            <span className="text-gray-600">Version:</span>
                            <span className="ml-2">{selectedTemplate.version}</span>
                          </div>
                          <div>
                            <span className="text-gray-600">Added Fields:</span>
                            <span className="ml-2">{selectedTemplate.fields.length}</span>
                          </div>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>

              {/* Form Builder */}
              <div className="lg:col-span-3">
                <Card>
                  <CardHeader>
                    <CardTitle>{isPreviewMode ? "Form Preview" : "Form Builder"}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <FormBuilder
                      fields={formFields}
                      onFieldsChange={setFormFields}
                      isPreviewMode={isPreviewMode}
                      formName={formName}
                      formDescription={formDescription}
                    />
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="template" className="space-y-6">
            {/* Template Application Options */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <Card className="border-2 border-dashed border-orange-300 bg-orange-50">
                <CardContent className="p-6 text-center">
                  <RefreshCw className="w-12 h-12 text-orange-600 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Replace Form</h3>
                  <p className="text-gray-600 mb-4">Replace the entire form with a template (destructive action)</p>
                  <p className="text-sm text-orange-600 mb-4">⚠️ This will remove all existing fields</p>
                </CardContent>
              </Card>

              <Card className="border-2 border-dashed border-green-300 bg-green-50">
                <CardContent className="p-6 text-center">
                  <Sparkles className="w-12 h-12 text-green-600 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Merge Template</h3>
                  <p className="text-gray-600 mb-4">Add template fields to the existing form (safe action)</p>
                  <p className="text-sm text-green-600 mb-4">✓ Keeps existing fields and adds new ones</p>
                </CardContent>
              </Card>
            </div>

            {/* Template Library */}
            <TemplateLibrary
              onSelectTemplate={handleSelectTemplate}
              onPreviewTemplate={handlePreviewTemplate}
              selectedTemplateId={selectedTemplate?.id}
            />
          </TabsContent>
        </Tabs>

        {/* Template Preview Modal */}
        <TemplatePreview
          template={previewTemplate}
          isOpen={!!previewTemplate}
          onClose={() => setPreviewTemplate(null)}
          onUseTemplate={(template) => {
            // Show options for replace vs merge
            const action = window.confirm(
              `How would you like to apply "${template.name}"?\n\nOK = Replace entire form (destructive)\nCancel = Merge with existing form (safe)`,
            )

            if (action) {
              handleSelectTemplate(template)
            } else {
              handleApplyTemplate(template)
            }
          }}
        />
      </div>

      <Footer />
    </div>
  )
}
