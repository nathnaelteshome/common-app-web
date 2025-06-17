"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
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
import { Switch } from "@/components/ui/switch"
import { ArrowLeft, Save, Eye, BookIcon as Publish, FileText, Sparkles, Zap } from "lucide-react"
import Link from "next/link"
import { toast } from "sonner"
import type { FormTemplate } from "@/data/form-templates"
import { AdvancedFormDesigner } from "@/components/advanced-form-designer"

export default function CreateForm() {
  const { user, isAuthenticated } = useAuthStore()
  const router = useRouter()
  const [activeTab, setActiveTab] = useState<"template" | "builder" | "advanced">("template")
  const [selectedTemplate, setSelectedTemplate] = useState<FormTemplate | null>(null)
  const [previewTemplate, setPreviewTemplate] = useState<FormTemplate | null>(null)
  const [formName, setFormName] = useState("")
  const [formDescription, setFormDescription] = useState("")
  const [formType, setFormType] = useState("")
  const [formFields, setFormFields] = useState([])
  const [isPreviewMode, setIsPreviewMode] = useState(false)
  const [formSections, setFormSections] = useState([])
  const [formSettings, setFormSettings] = useState({
    allowDuplicates: false,
    requiresApproval: true,
    autoSave: true,
    showProgress: true,
    enableConditionalLogic: true,
    enableAutoFilter: false,
    sendNotifications: true,
    collectAnalytics: true,
    deadline: "",
    maxSubmissions: 0,
    requirePayment: false,
    applicationFee: 0,
  })
  const [formStyling, setFormStyling] = useState({
    primaryColor: "#0a5eb2",
    backgroundColor: "#ffffff",
    fontFamily: "system",
    layout: "single",
  })

  useEffect(() => {
    if (!isAuthenticated || user?.role !== "university") {
      router.push("/auth/sign-in")
    }
  }, [isAuthenticated, user, router])

  if (!isAuthenticated || user?.role !== "university") {
    return null
  }

  const handleSelectTemplate = (template: FormTemplate) => {
    setSelectedTemplate(template)
    setFormName(`${template.name} (Copy)`)
    setFormDescription(template.description)
    setFormType(template.category)
    setFormFields(template.fields.map((field) => ({ ...field, id: `field_${Date.now()}_${Math.random()}` })))
    setActiveTab("builder")
    toast.success(`Template "${template.name}" loaded successfully`)
  }

  const handlePreviewTemplate = (template: FormTemplate) => {
    setPreviewTemplate(template)
  }

  const handleStartFromScratch = () => {
    setSelectedTemplate(null)
    setFormName("")
    setFormDescription("")
    setFormType("")
    setFormFields([])
    setIsPreviewMode(false)
    setActiveTab("builder")
    toast.success("Started with blank form")
  }

  const handleSaveDraft = async () => {
    if (!formName.trim()) {
      toast.error("Please enter a form name")
      return
    }

    try {
      // Simulate API call to save draft
      await new Promise((resolve) => setTimeout(resolve, 1000))

      const formData = {
        name: formName,
        description: formDescription,
        type: formType,
        fields: formFields,
        settings: formSettings,
        styling: formStyling,
        status: "draft",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }

      // Save to localStorage for demo
      const existingForms = JSON.parse(localStorage.getItem("admin-forms") || "[]")
      const newForm = { ...formData, id: `form_${Date.now()}` }
      existingForms.push(newForm)
      localStorage.setItem("admin-forms", JSON.stringify(existingForms))

      toast.success("Form saved as draft")
    } catch (error) {
      toast.error("Failed to save form")
    }
  }

  const handlePublish = async () => {
    if (!formName.trim()) {
      toast.error("Please enter a form name")
      return
    }

    if (formFields.length === 0) {
      toast.error("Please add at least one field to the form")
      return
    }

    try {
      // Simulate API call to publish form
      await new Promise((resolve) => setTimeout(resolve, 1500))

      const formData = {
        name: formName,
        description: formDescription,
        type: formType,
        fields: formFields,
        settings: formSettings,
        styling: formStyling,
        status: "published",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        publishedAt: new Date().toISOString(),
      }

      // Save to localStorage for demo
      const existingForms = JSON.parse(localStorage.getItem("admin-forms") || "[]")
      const newForm = { ...formData, id: `form_${Date.now()}` }
      existingForms.push(newForm)
      localStorage.setItem("admin-forms", JSON.stringify(existingForms))

      toast.success("Form published successfully")
      router.push("/admin/forms")
    } catch (error) {
      toast.error("Failed to publish form")
    }
  }

  const handlePreview = () => {
    setIsPreviewMode(!isPreviewMode)
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
              <h1 className="text-3xl font-bold text-gray-900">Create Admission Form</h1>
              <p className="text-gray-600">
                {selectedTemplate
                  ? `Based on template: ${selectedTemplate.name}`
                  : "Choose a template or start from scratch"}
              </p>
            </div>
          </div>
          {(activeTab === "builder" || activeTab === "advanced") && (
            <div className="flex gap-2">
              <Button variant="outline" onClick={handlePreview}>
                <Eye className="w-4 h-4 mr-2" />
                {isPreviewMode ? "Edit" : "Preview"}
              </Button>
              <Button variant="outline" onClick={handleSaveDraft}>
                <Save className="w-4 h-4 mr-2" />
                Save Draft
              </Button>
              <Button className="bg-[#0a5eb2] hover:bg-[#0a5eb2]/90" onClick={handlePublish}>
                <Publish className="w-4 h-4 mr-2" />
                Publish
              </Button>
            </div>
          )}
        </div>

        {/* Main Content */}
        <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as "template" | "builder" | "advanced")}>
          <TabsList className="grid w-full grid-cols-3 mb-8">
            <TabsTrigger value="template" className="flex items-center gap-2">
              <Sparkles className="w-4 h-4" />
              Choose Template
            </TabsTrigger>
            <TabsTrigger value="builder" className="flex items-center gap-2">
              <FileText className="w-4 h-4" />
              Form Builder
            </TabsTrigger>
            <TabsTrigger value="advanced" className="flex items-center gap-2">
              <Zap className="w-4 h-4" />
              Advanced Features
            </TabsTrigger>
          </TabsList>

          <TabsContent value="template" className="space-y-6">
            {/* Start from Scratch Option */}
            <Card className="border-2 border-dashed border-[#0a5eb2] bg-blue-50">
              <CardContent className="p-6 text-center">
                <FileText className="w-12 h-12 text-[#0a5eb2] mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Start from Scratch</h3>
                <p className="text-gray-600 mb-4">Create a completely custom form with your own fields and layout</p>
                <Button onClick={handleStartFromScratch} className="bg-[#0a5eb2] hover:bg-[#0a5eb2]/90">
                  <FileText className="w-4 h-4 mr-2" />
                  Create Blank Form
                </Button>
              </CardContent>
            </Card>

            {/* Template Library */}
            <TemplateLibrary
              onSelectTemplate={handleSelectTemplate}
              onPreviewTemplate={handlePreviewTemplate}
              selectedTemplateId={selectedTemplate?.id}
            />
          </TabsContent>

          <TabsContent value="builder" className="space-y-6">
            {formFields.length === 0 && !selectedTemplate ? (
              <Card className="text-center py-12">
                <CardContent>
                  <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Ready to Build Your Form</h3>
                  <p className="text-gray-600 mb-6">
                    Start adding fields to your form using the field library on the left, or go back to choose a
                    template
                  </p>
                  <div className="flex justify-center gap-4">
                    <Button variant="outline" onClick={() => setActiveTab("template")}>
                      <Sparkles className="w-4 h-4 mr-2" />
                      Choose Template
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ) : (
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

                      {/* Advanced Settings */}
                      <div className="pt-4 border-t space-y-4">
                        <h4 className="font-medium">Advanced Settings</h4>

                        <div className="flex items-center justify-between">
                          <Label htmlFor="autoSave">Auto-save drafts</Label>
                          <Switch
                            id="autoSave"
                            checked={formSettings.autoSave}
                            onCheckedChange={(checked) => setFormSettings((prev) => ({ ...prev, autoSave: checked }))}
                          />
                        </div>

                        <div className="flex items-center justify-between">
                          <Label htmlFor="showProgress">Show progress bar</Label>
                          <Switch
                            id="showProgress"
                            checked={formSettings.showProgress}
                            onCheckedChange={(checked) =>
                              setFormSettings((prev) => ({ ...prev, showProgress: checked }))
                            }
                          />
                        </div>

                        <div className="flex items-center justify-between">
                          <Label htmlFor="conditionalLogic">Enable conditional logic</Label>
                          <Switch
                            id="conditionalLogic"
                            checked={formSettings.enableConditionalLogic}
                            onCheckedChange={(checked) =>
                              setFormSettings((prev) => ({ ...prev, enableConditionalLogic: checked }))
                            }
                          />
                        </div>

                        <div className="flex items-center justify-between">
                          <Label htmlFor="autoFilter">Auto-filter applications</Label>
                          <Switch
                            id="autoFilter"
                            checked={formSettings.enableAutoFilter}
                            onCheckedChange={(checked) =>
                              setFormSettings((prev) => ({ ...prev, enableAutoFilter: checked }))
                            }
                          />
                        </div>

                        <div className="flex items-center justify-between">
                          <Label htmlFor="notifications">Send notifications</Label>
                          <Switch
                            id="notifications"
                            checked={formSettings.sendNotifications}
                            onCheckedChange={(checked) =>
                              setFormSettings((prev) => ({ ...prev, sendNotifications: checked }))
                            }
                          />
                        </div>

                        <div>
                          <Label htmlFor="deadline">Application Deadline</Label>
                          <Input
                            id="deadline"
                            type="datetime-local"
                            value={formSettings.deadline}
                            onChange={(e) => setFormSettings((prev) => ({ ...prev, deadline: e.target.value }))}
                          />
                        </div>

                        <div className="flex items-center justify-between">
                          <Label htmlFor="requirePayment">Require payment</Label>
                          <Switch
                            id="requirePayment"
                            checked={formSettings.requirePayment}
                            onCheckedChange={(checked) =>
                              setFormSettings((prev) => ({ ...prev, requirePayment: checked }))
                            }
                          />
                        </div>

                        {formSettings.requirePayment && (
                          <div>
                            <Label htmlFor="applicationFee">Application Fee ($)</Label>
                            <Input
                              id="applicationFee"
                              type="number"
                              min="0"
                              value={formSettings.applicationFee}
                              onChange={(e) =>
                                setFormSettings((prev) => ({ ...prev, applicationFee: Number(e.target.value) }))
                              }
                            />
                          </div>
                        )}
                      </div>

                      {selectedTemplate && (
                        <div className="pt-4 border-t">
                          <h4 className="font-medium mb-3">Template Info</h4>
                          <div className="space-y-2 text-sm">
                            <div>
                              <span className="text-gray-600">Based on:</span>
                              <p className="font-medium">{selectedTemplate.name}</p>
                            </div>
                            <div>
                              <span className="text-gray-600">Version:</span>
                              <span className="ml-2">{selectedTemplate.version}</span>
                            </div>
                            <div>
                              <span className="text-gray-600">Original Fields:</span>
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
                        enableConditionalLogic={formSettings.enableConditionalLogic}
                      />
                    </CardContent>
                  </Card>
                </div>
              </div>
            )}
          </TabsContent>

          <TabsContent value="advanced" className="space-y-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-lg font-semibold">Advanced Form Designer</h3>
                <p className="text-gray-600">
                  Create highly customizable forms with advanced styling and layout options
                </p>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" onClick={handlePreview}>
                  <Eye className="w-4 h-4 mr-2" />
                  {isPreviewMode ? "Edit" : "Preview"}
                </Button>
              </div>
            </div>

            <AdvancedFormDesigner
              fields={formFields}
              sections={formSections}
              onFieldsChange={setFormFields}
              onSectionsChange={setFormSections}
              isPreviewMode={isPreviewMode}
              formName={formName}
              formDescription={formDescription}
              formStyling={formStyling}
              onFormStylingChange={setFormStyling}
              formSettings={formSettings}
              onFormSettingsChange={setFormSettings}
            />
          </TabsContent>
        </Tabs>

        {/* Template Preview Modal */}
        <TemplatePreview
          template={previewTemplate}
          isOpen={!!previewTemplate}
          onClose={() => setPreviewTemplate(null)}
          onUseTemplate={handleSelectTemplate}
        />
      </div>

      <Footer />
    </div>
  )
}
