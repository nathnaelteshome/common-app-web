"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Separator } from "@/components/ui/separator"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import {
  X,
  Star,
  Users,
  Copy,
  Eye,
  FileText,
  Upload,
  Calendar,
  Phone,
  Mail,
  Hash,
  Type,
  List,
  CheckSquare,
  MapPin,
} from "lucide-react"
import type { FormTemplate, FormField } from "@/data/form-templates"

interface TemplatePreviewProps {
  template: FormTemplate | null
  isOpen: boolean
  onClose: () => void
  onUseTemplate: (template: FormTemplate) => void
}

export function TemplatePreview({ template, isOpen, onClose, onUseTemplate }: TemplatePreviewProps) {
  const [activeTab, setActiveTab] = useState<"preview" | "details">("preview")

  if (!template) return null

  const getFieldIcon = (type: string) => {
    switch (type) {
      case "text":
        return <Type className="w-4 h-4" />
      case "email":
        return <Mail className="w-4 h-4" />
      case "number":
        return <Hash className="w-4 h-4" />
      case "date":
        return <Calendar className="w-4 h-4" />
      case "textarea":
        return <FileText className="w-4 h-4" />
      case "select":
        return <List className="w-4 h-4" />
      case "radio":
      case "checkbox":
        return <CheckSquare className="w-4 h-4" />
      case "file":
        return <Upload className="w-4 h-4" />
      case "phone":
        return <Phone className="w-4 h-4" />
      case "address":
        return <MapPin className="w-4 h-4" />
      default:
        return <Type className="w-4 h-4" />
    }
  }

  const renderFieldPreview = (field: FormField) => {
    const commonProps = {
      placeholder: field.placeholder || `Enter ${field.label.toLowerCase()}`,
      required: field.required,
      disabled: true,
    }

    switch (field.type) {
      case "text":
      case "email":
      case "phone":
        return <Input type={field.type} {...commonProps} />
      case "number":
        return <Input type="number" {...commonProps} />
      case "date":
        return <Input type="date" {...commonProps} />
      case "textarea":
        return <Textarea {...commonProps} rows={3} />
      case "select":
        return (
          <Select disabled>
            <SelectTrigger>
              <SelectValue placeholder={`Select ${field.label.toLowerCase()}`} />
            </SelectTrigger>
            <SelectContent>
              {field.options?.map((option, index) => (
                <SelectItem key={index} value={option}>
                  {option}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )
      case "radio":
        return (
          <div className="space-y-2">
            {field.options?.map((option, index) => (
              <div key={index} className="flex items-center space-x-2">
                <input type="radio" name={field.id} id={`${field.id}_${index}`} disabled />
                <Label htmlFor={`${field.id}_${index}`} className="text-gray-500">
                  {option}
                </Label>
              </div>
            ))}
          </div>
        )
      case "checkbox":
        return (
          <div className="space-y-2">
            {field.options?.map((option, index) => (
              <div key={index} className="flex items-center space-x-2">
                <Checkbox id={`${field.id}_${index}`} disabled />
                <Label htmlFor={`${field.id}_${index}`} className="text-gray-500">
                  {option}
                </Label>
              </div>
            ))}
          </div>
        )
      case "file":
        return (
          <div className="border-2 border-dashed border-gray-200 rounded-lg p-6 text-center bg-gray-50">
            <Upload className="w-8 h-8 text-gray-300 mx-auto mb-2" />
            <p className="text-sm text-gray-400">File upload area (preview)</p>
          </div>
        )
      case "address":
        return (
          <div className="space-y-2">
            <Input placeholder="Street Address" disabled />
            <div className="grid grid-cols-2 gap-2">
              <Input placeholder="City" disabled />
              <Input placeholder="State/Province" disabled />
            </div>
            <div className="grid grid-cols-2 gap-2">
              <Input placeholder="Postal Code" disabled />
              <Input placeholder="Country" disabled />
            </div>
          </div>
        )
      default:
        return <Input {...commonProps} />
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader className="flex-shrink-0">
          <div className="flex items-start justify-between">
            <div>
              <DialogTitle className="text-xl">{template.name}</DialogTitle>
              <DialogDescription className="mt-1">{template.description}</DialogDescription>
            </div>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="w-4 h-4" />
            </Button>
          </div>

          <div className="flex items-center gap-4 mt-4">
            <div className="flex items-center gap-1">
              <Star className="w-4 h-4 text-yellow-500 fill-current" />
              <span className="font-medium">{template.rating}</span>
            </div>
            <div className="flex items-center gap-1 text-gray-600">
              <Users className="w-4 h-4" />
              <span>{template.usageCount.toLocaleString()} uses</span>
            </div>
            <Badge variant="outline">{template.category}</Badge>
            <Badge variant="secondary">v{template.version}</Badge>
          </div>
        </DialogHeader>

        <div className="flex-1 overflow-hidden">
          <div className="flex border-b mb-4">
            <button
              className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
                activeTab === "preview"
                  ? "border-[#0a5eb2] text-[#0a5eb2]"
                  : "border-transparent text-gray-500 hover:text-gray-700"
              }`}
              onClick={() => setActiveTab("preview")}
            >
              <Eye className="w-4 h-4 mr-2 inline" />
              Form Preview
            </button>
            <button
              className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
                activeTab === "details"
                  ? "border-[#0a5eb2] text-[#0a5eb2]"
                  : "border-transparent text-gray-500 hover:text-gray-700"
              }`}
              onClick={() => setActiveTab("details")}
            >
              <FileText className="w-4 h-4 mr-2 inline" />
              Template Details
            </button>
          </div>

          <div className="overflow-y-auto h-full">
            {activeTab === "preview" ? (
              <div className="max-w-2xl mx-auto space-y-6">
                <div className="text-center mb-8">
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">{template.name}</h2>
                  <p className="text-gray-600">{template.description}</p>
                </div>

                <form className="space-y-6">
                  {template.fields.map((field) => (
                    <div key={field.id} className="space-y-2">
                      <Label htmlFor={field.id} className="text-sm font-medium">
                        {field.label}
                        {field.required && <span className="text-red-500 ml-1">*</span>}
                      </Label>
                      {renderFieldPreview(field)}
                      {field.helpText && <p className="text-xs text-gray-500">{field.helpText}</p>}
                    </div>
                  ))}

                  <div className="pt-6">
                    <Button type="button" className="w-full bg-gray-300 text-gray-500" disabled>
                      Submit Application (Preview Mode)
                    </Button>
                  </div>
                </form>
              </div>
            ) : (
              <div className="space-y-6">
                {/* Template Information */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Template Information</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label className="text-sm font-medium text-gray-500">Category</Label>
                        <p className="capitalize">{template.category}</p>
                      </div>
                      <div>
                        <Label className="text-sm font-medium text-gray-500">Type</Label>
                        <p className="capitalize">{template.type}</p>
                      </div>
                      <div>
                        <Label className="text-sm font-medium text-gray-500">Version</Label>
                        <p>{template.version}</p>
                      </div>
                      <div>
                        <Label className="text-sm font-medium text-gray-500">Fields Count</Label>
                        <p>{template.fields.length} fields</p>
                      </div>
                    </div>

                    <div>
                      <Label className="text-sm font-medium text-gray-500">Tags</Label>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {template.tags.map((tag) => (
                          <Badge key={tag} variant="outline" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Form Fields */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Form Fields ({template.fields.length})</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {template.fields.map((field, index) => (
                        <div key={field.id} className="flex items-center gap-3 p-3 border rounded-lg">
                          <div className="flex-shrink-0">{getFieldIcon(field.type)}</div>
                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                              <span className="font-medium">{field.label}</span>
                              {field.required && (
                                <Badge variant="destructive" className="text-xs">
                                  Required
                                </Badge>
                              )}
                            </div>
                            <p className="text-sm text-gray-500 capitalize">{field.type} field</p>
                            {field.helpText && <p className="text-xs text-gray-400 mt-1">{field.helpText}</p>}
                          </div>
                          <div className="text-sm text-gray-400">#{index + 1}</div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Settings */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Template Settings</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Allow Duplicates</span>
                        <Badge variant={template.settings.allowDuplicates ? "default" : "secondary"}>
                          {template.settings.allowDuplicates ? "Yes" : "No"}
                        </Badge>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Requires Approval</span>
                        <Badge variant={template.settings.requiresApproval ? "default" : "secondary"}>
                          {template.settings.requiresApproval ? "Yes" : "No"}
                        </Badge>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Auto Save</span>
                        <Badge variant={template.settings.autoSave ? "default" : "secondary"}>
                          {template.settings.autoSave ? "Enabled" : "Disabled"}
                        </Badge>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Show Progress</span>
                        <Badge variant={template.settings.showProgress ? "default" : "secondary"}>
                          {template.settings.showProgress ? "Yes" : "No"}
                        </Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}
          </div>
        </div>

        <Separator className="my-4" />

        <div className="flex justify-end gap-3 flex-shrink-0">
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
          <Button
            onClick={() => {
              onUseTemplate(template)
              onClose()
            }}
            className="bg-[#0a5eb2] hover:bg-[#0a5eb2]/90"
          >
            <Copy className="w-4 h-4 mr-2" />
            Use This Template
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
