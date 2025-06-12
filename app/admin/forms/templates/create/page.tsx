"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useAuthStore } from "@/store/auth-store"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { AdvancedFormDesigner } from "@/components/advanced-form-designer"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Save, Eye } from "lucide-react"
import Link from "next/link"
import { toast } from "sonner"

export default function CreateTemplate() {
  const { user, isAuthenticated } = useAuthStore()
  const router = useRouter()
  const [templateName, setTemplateName] = useState("")
  const [templateDescription, setTemplateDescription] = useState("")
  const [templateCategory, setTemplateCategory] = useState("")
  const [templateTags, setTemplateTags] = useState("")
  const [formFields, setFormFields] = useState([])
  const [formSections, setFormSections] = useState([])
  const [formStyling, setFormStyling] = useState({
    primaryColor: "#0a5eb2",
    backgroundColor: "#ffffff",
    fontFamily: "system",
    layout: "single",
  })
  const [isPreviewMode, setIsPreviewMode] = useState(false)

  useEffect(() => {
    if (!isAuthenticated || user?.role !== "university") {
      router.push("/auth/sign-in")
    }
  }, [isAuthenticated, user, router])

  if (!isAuthenticated || user?.role !== "university") {
    return null
  }

  const handleSaveTemplate = () => {
    if (!templateName.trim()) {
      toast.error("Please enter a template name")
      return
    }

    if (formFields.length === 0) {
      toast.error("Please add at least one field to the template")
      return
    }

    // Save template logic here
    const newTemplate = {
      id: `template_${Date.now()}`,
      name: templateName,
      description: templateDescription,
      category: templateCategory,
      type: "application",
      isDefault: false,
      usageCount: 0,
      rating: 0,
      tags: templateTags
        .split(",")
        .map((tag) => tag.trim())
        .filter(Boolean),
      fields: formFields,
      sections: formSections,
      settings: {
        allowDuplicates: false,
        requiresApproval: true,
        autoSave: true,
        showProgress: true,
        customStyling: formStyling,
      },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      createdBy: user?.email || "current-user",
      version: "1.0",
    }

    toast.success("Template created successfully")
    router.push("/admin/forms/templates")
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
              <Link href="/admin/forms/templates">
                <ArrowLeft className="w-4 h-4" />
              </Link>
            </Button>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Create Form Template</h1>
              <p className="text-gray-600">Design a reusable form template for your organization</p>
            </div>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={handlePreview}>
              <Eye className="w-4 h-4 mr-2" />
              {isPreviewMode ? "Edit" : "Preview"}
            </Button>
            <Button className="bg-[#0a5eb2] hover:bg-[#0a5eb2]/90" onClick={handleSaveTemplate}>
              <Save className="w-4 h-4 mr-2" />
              Save Template
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 mb-8">
          {/* Template Settings */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle>Template Settings</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="templateName">Template Name *</Label>
                  <Input
                    id="templateName"
                    value={templateName}
                    onChange={(e) => setTemplateName(e.target.value)}
                    placeholder="e.g., Advanced Undergraduate Application"
                  />
                </div>
                <div>
                  <Label htmlFor="templateDescription">Description</Label>
                  <Textarea
                    id="templateDescription"
                    value={templateDescription}
                    onChange={(e) => setTemplateDescription(e.target.value)}
                    placeholder="Describe what this template is for..."
                    rows={3}
                  />
                </div>
                <div>
                  <Label htmlFor="templateCategory">Category</Label>
                  <Select value={templateCategory} onValueChange={setTemplateCategory}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="undergraduate">Undergraduate</SelectItem>
                      <SelectItem value="graduate">Graduate</SelectItem>
                      <SelectItem value="transfer">Transfer</SelectItem>
                      <SelectItem value="international">International</SelectItem>
                      <SelectItem value="scholarship">Scholarship</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="templateTags">Tags (comma-separated)</Label>
                  <Input
                    id="templateTags"
                    value={templateTags}
                    onChange={(e) => setTemplateTags(e.target.value)}
                    placeholder="e.g., advanced, custom, detailed"
                  />
                </div>

                {/* Template Preview Info */}
                <div className="pt-4 border-t">
                  <h4 className="font-medium mb-3">Template Preview</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Fields:</span>
                      <Badge variant="outline">{formFields.length}</Badge>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Sections:</span>
                      <Badge variant="outline">{formSections.length}</Badge>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Layout:</span>
                      <Badge variant="outline" className="capitalize">
                        {formStyling.layout}
                      </Badge>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Template Designer */}
          <div className="lg:col-span-3">
            <Card>
              <CardHeader>
                <CardTitle>{isPreviewMode ? "Template Preview" : "Template Designer"}</CardTitle>
              </CardHeader>
              <CardContent>
                <AdvancedFormDesigner
                  fields={formFields}
                  sections={formSections}
                  onFieldsChange={setFormFields}
                  onSectionsChange={setFormSections}
                  isPreviewMode={isPreviewMode}
                  formName={templateName}
                  formDescription={templateDescription}
                  formStyling={formStyling}
                  onFormStylingChange={setFormStyling}
                />
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  )
}
