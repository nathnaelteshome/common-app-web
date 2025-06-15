"use client"

import { useState, useCallback } from "react"
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import {
  Type,
  Mail,
  Hash,
  Calendar,
  FileText,
  List,
  CheckSquare,
  Upload,
  Phone,
  MapPin,
  Plus,
  Trash2,
  Settings,
  GripVertical,
  Palette,
  Layout,
  Copy,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Bold,
  Italic,
  Underline,
} from "lucide-react"
import { ConditionalLogicBuilder } from "@/components/conditional-logic-builder"

interface FormField {
  id: string
  type: string
  label: string
  placeholder?: string
  required: boolean
  options?: string[]
  validation?: {
    minLength?: number
    maxLength?: number
    pattern?: string
    min?: number
    max?: number
  }
  conditionalLogic?: {
    action: "show" | "hide" | "require"
    conditions: Array<{
      field: string
      operator: string
      value: string
    }>
    logic: "and" | "or"
  }[]
  helpText?: string
  defaultValue?: string
  styling?: {
    width?: "full" | "half" | "third" | "quarter"
    alignment?: "left" | "center" | "right"
    labelStyle?: {
      bold?: boolean
      italic?: boolean
      underline?: boolean
      color?: string
    }
    fieldStyle?: {
      backgroundColor?: string
      borderColor?: string
      borderRadius?: string
    }
  }
  section?: string
}

interface FormSection {
  id: string
  title: string
  description?: string
  collapsible?: boolean
  styling?: {
    backgroundColor?: string
    borderColor?: string
    titleColor?: string
  }
}

interface AdvancedFormDesignerProps {
  fields: FormField[]
  sections: FormSection[]
  onFieldsChange: (fields: FormField[]) => void
  onSectionsChange: (sections: FormSection[]) => void
  isPreviewMode?: boolean
  formName?: string
  formDescription?: string
  formStyling?: {
    primaryColor?: string
    backgroundColor?: string
    fontFamily?: string
    layout?: "single" | "two-column" | "three-column"
  }
  onFormStylingChange?: (styling: any) => void
}

const fieldTypes = [
  { type: "text", label: "Text Input", icon: Type, category: "basic" },
  { type: "email", label: "Email", icon: Mail, category: "basic" },
  { type: "number", label: "Number", icon: Hash, category: "basic" },
  { type: "date", label: "Date", icon: Calendar, category: "basic" },
  { type: "textarea", label: "Text Area", icon: FileText, category: "basic" },
  { type: "select", label: "Dropdown", icon: List, category: "choice" },
  { type: "radio", label: "Radio Buttons", icon: CheckSquare, category: "choice" },
  { type: "checkbox", label: "Checkboxes", icon: CheckSquare, category: "choice" },
  { type: "file", label: "File Upload", icon: Upload, category: "advanced" },
  { type: "phone", label: "Phone Number", icon: Phone, category: "basic" },
  { type: "address", label: "Address", icon: MapPin, category: "advanced" },
  { type: "section", label: "Section Divider", icon: Layout, category: "layout" },
  { type: "heading", label: "Heading", icon: Type, category: "layout" },
  { type: "paragraph", label: "Paragraph", icon: FileText, category: "layout" },
]

const fieldCategories = [
  { id: "all", name: "All Fields" },
  { id: "basic", name: "Basic Fields" },
  { id: "choice", name: "Choice Fields" },
  { id: "advanced", name: "Advanced Fields" },
  { id: "layout", name: "Layout Elements" },
]

export function AdvancedFormDesigner({
  fields,
  sections,
  onFieldsChange,
  onSectionsChange,
  isPreviewMode = false,
  formName,
  formDescription,
  formStyling,
  onFormStylingChange,
}: AdvancedFormDesignerProps) {
  const [selectedField, setSelectedField] = useState<string | null>(null)
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [showConditionalLogic, setShowConditionalLogic] = useState(false)
  const [activeDesignTab, setActiveDesignTab] = useState("fields")

  const addField = useCallback(
    (type: string) => {
      const newField: FormField = {
        id: `field_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        type,
        label:
          type === "section"
            ? "New Section"
            : type === "heading"
              ? "New Heading"
              : type === "paragraph"
                ? "New Paragraph"
                : `New ${type} field`,
        required: false,
        styling: {
          width: "full",
          alignment: "left",
        },
        ...(type === "select" || type === "radio" || type === "checkbox" ? { options: ["Option 1", "Option 2"] } : {}),
      }
      onFieldsChange([...fields, newField])
    },
    [fields, onFieldsChange],
  )

  const addSection = useCallback(() => {
    const newSection: FormSection = {
      id: `section_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      title: "New Section",
      description: "",
      collapsible: false,
    }
    onSectionsChange([...sections, newSection])
  }, [sections, onSectionsChange])

  const updateField = useCallback(
    (fieldId: string, updates: Partial<FormField>) => {
      const updatedFields = fields.map((field) => (field.id === fieldId ? { ...field, ...updates } : field))
      onFieldsChange(updatedFields)
    },
    [fields, onFieldsChange],
  )

  const removeField = useCallback(
    (fieldId: string) => {
      const updatedFields = fields.filter((field) => field.id !== fieldId)
      onFieldsChange(updatedFields)
      if (selectedField === fieldId) {
        setSelectedField(null)
      }
    },
    [fields, onFieldsChange, selectedField],
  )

  const duplicateField = useCallback(
    (fieldId: string) => {
      const fieldToDuplicate = fields.find((field) => field.id === fieldId)
      if (fieldToDuplicate) {
        const duplicatedField = {
          ...fieldToDuplicate,
          id: `field_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          label: `${fieldToDuplicate.label} (Copy)`,
        }
        onFieldsChange([...fields, duplicatedField])
      }
    },
    [fields, onFieldsChange],
  )

  const onDragEnd = useCallback(
    (result: any) => {
      if (!result.destination) return

      const items = Array.from(fields)
      const [reorderedItem] = items.splice(result.source.index, 1)
      items.splice(result.destination.index, 0, reorderedItem)

      onFieldsChange(items)
    },
    [fields, onFieldsChange],
  )

  const filteredFieldTypes =
    selectedCategory === "all" ? fieldTypes : fieldTypes.filter((type) => type.category === selectedCategory)

  const renderFieldPreview = (field: FormField) => {
    const widthClass = {
      full: "w-full",
      half: "w-1/2",
      third: "w-1/3",
      quarter: "w-1/4",
    }[field.styling?.width || "full"]

    const alignmentClass = {
      left: "text-left",
      center: "text-center",
      right: "text-right",
    }[field.styling?.alignment || "left"]

    const commonProps = {
      placeholder: field.placeholder || `Enter ${field.label.toLowerCase()}`,
      required: field.required,
      className: `${widthClass} ${alignmentClass}`,
      style: {
        backgroundColor: field.styling?.fieldStyle?.backgroundColor,
        borderColor: field.styling?.fieldStyle?.borderColor,
        borderRadius: field.styling?.fieldStyle?.borderRadius,
      },
    }

    const labelStyle = {
      fontWeight: field.styling?.labelStyle?.bold ? "bold" : "normal",
      fontStyle: field.styling?.labelStyle?.italic ? "italic" : "normal",
      textDecoration: field.styling?.labelStyle?.underline ? "underline" : "none",
      color: field.styling?.labelStyle?.color,
    }

    switch (field.type) {
      case "section":
        return (
          <div className="w-full py-4">
            <Separator />
            <h3 className="text-lg font-semibold mt-4" style={labelStyle}>
              {field.label}
            </h3>
            {field.helpText && <p className="text-sm text-gray-600 mt-1">{field.helpText}</p>}
          </div>
        )
      case "heading":
        return (
          <div className={`w-full ${alignmentClass}`}>
            <h2 className="text-xl font-bold" style={labelStyle}>
              {field.label}
            </h2>
          </div>
        )
      case "paragraph":
        return (
          <div className={`w-full ${alignmentClass}`}>
            <p className="text-gray-700" style={labelStyle}>
              {field.label}
            </p>
          </div>
        )
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
          <Select>
            <SelectTrigger className={widthClass}>
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
          <div className={`space-y-2 ${widthClass}`}>
            {field.options?.map((option, index) => (
              <div key={index} className="flex items-center space-x-2">
                <input type="radio" name={field.id} id={`${field.id}_${index}`} />
                <Label htmlFor={`${field.id}_${index}`}>{option}</Label>
              </div>
            ))}
          </div>
        )
      case "checkbox":
        return (
          <div className={`space-y-2 ${widthClass}`}>
            {field.options?.map((option, index) => (
              <div key={index} className="flex items-center space-x-2">
                <Checkbox id={`${field.id}_${index}`} />
                <Label htmlFor={`${field.id}_${index}`}>{option}</Label>
              </div>
            ))}
          </div>
        )
      case "file":
        return (
          <div className={`border-2 border-dashed border-gray-300 rounded-lg p-6 text-center ${widthClass}`}>
            <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
            <p className="text-sm text-gray-600">Click to upload or drag and drop</p>
          </div>
        )
      case "address":
        return (
          <div className={`space-y-2 ${widthClass}`}>
            <Input placeholder="Street Address" />
            <div className="grid grid-cols-2 gap-2">
              <Input placeholder="City" />
              <Input placeholder="State/Province" />
            </div>
            <div className="grid grid-cols-2 gap-2">
              <Input placeholder="Postal Code" />
              <Input placeholder="Country" />
            </div>
          </div>
        )
      default:
        return <Input {...commonProps} />
    }
  }

  if (isPreviewMode) {
    return (
      <div
        className="max-w-4xl mx-auto"
        style={{
          backgroundColor: formStyling?.backgroundColor,
          fontFamily: formStyling?.fontFamily,
        }}
      >
        <div className="mb-8 p-6 bg-white rounded-lg shadow-sm">
          <h2 className="text-2xl font-bold text-gray-900 mb-2" style={{ color: formStyling?.primaryColor }}>
            {formName || "Form Preview"}
          </h2>
          {formDescription && <p className="text-gray-600">{formDescription}</p>}
        </div>

        <form className="space-y-6 p-6 bg-white rounded-lg shadow-sm">
          <div
            className={`grid gap-6 ${
              formStyling?.layout === "two-column"
                ? "grid-cols-2"
                : formStyling?.layout === "three-column"
                  ? "grid-cols-3"
                  : "grid-cols-1"
            }`}
          >
            {fields.map((field) => (
              <div key={field.id} className="space-y-2">
                {field.type !== "section" && field.type !== "heading" && field.type !== "paragraph" && (
                  <Label
                    htmlFor={field.id}
                    className="text-sm font-medium"
                    style={{
                      fontWeight: field.styling?.labelStyle?.bold ? "bold" : "normal",
                      fontStyle: field.styling?.labelStyle?.italic ? "italic" : "normal",
                      textDecoration: field.styling?.labelStyle?.underline ? "underline" : "none",
                      color: field.styling?.labelStyle?.color || formStyling?.primaryColor,
                    }}
                  >
                    {field.label}
                    {field.required && <span className="text-red-500 ml-1">*</span>}
                  </Label>
                )}
                {renderFieldPreview(field)}
                {field.helpText && field.type !== "section" && (
                  <p className="text-xs text-gray-500">{field.helpText}</p>
                )}
              </div>
            ))}
          </div>

          {fields.length === 0 && (
            <div className="text-center py-12 text-gray-500">
              <FileText className="w-12 h-12 mx-auto mb-4 text-gray-300" />
              <p>No fields added yet. Switch to design mode to add fields.</p>
            </div>
          )}

          <div className="pt-6">
            <Button type="submit" className="w-full" style={{ backgroundColor: formStyling?.primaryColor }}>
              Submit Application
            </Button>
          </div>
        </form>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
      {/* Design Tools Sidebar */}
      <div className="lg:col-span-1">
        <Tabs value={activeDesignTab} onValueChange={setActiveDesignTab}>
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="fields">Fields</TabsTrigger>
            <TabsTrigger value="style">Style</TabsTrigger>
            <TabsTrigger value="layout">Layout</TabsTrigger>
          </TabsList>

          <TabsContent value="fields" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Field Library</CardTitle>
              </CardHeader>
              <CardContent>
                {/* Category Filter */}
                <div className="mb-4">
                  <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {fieldCategories.map((category) => (
                        <SelectItem key={category.id} value={category.id}>
                          {category.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  {filteredFieldTypes.map((fieldType) => {
                    const Icon = fieldType.icon
                    return (
                      <Button
                        key={fieldType.type}
                        variant="outline"
                        className="w-full justify-start"
                        onClick={() => addField(fieldType.type)}
                      >
                        <Icon className="w-4 h-4 mr-2" />
                        {fieldType.label}
                      </Button>
                    )
                  })}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Sections</CardTitle>
              </CardHeader>
              <CardContent>
                <Button onClick={addSection} className="w-full" variant="outline">
                  <Plus className="w-4 h-4 mr-2" />
                  Add Section
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="style" className="space-y-4">
            <FormStylingPanel formStyling={formStyling} onFormStylingChange={onFormStylingChange} />
          </TabsContent>

          <TabsContent value="layout" className="space-y-4">
            <LayoutPanel formStyling={formStyling} onFormStylingChange={onFormStylingChange} />
          </TabsContent>
        </Tabs>
      </div>

      {/* Form Builder Area */}
      <div className="lg:col-span-3">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Form Designer</CardTitle>
          </CardHeader>
          <CardContent>
            {fields.length === 0 ? (
              <div className="text-center py-12 text-gray-500">
                <FileText className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                <p className="mb-4">Start designing your form by adding fields from the library</p>
                <Button onClick={() => addField("text")} className="bg-[#0a5eb2] hover:bg-[#0a5eb2]/90">
                  <Plus className="w-4 h-4 mr-2" />
                  Add Your First Field
                </Button>
              </div>
            ) : (
              <DragDropContext onDragEnd={onDragEnd}>
                <Droppable droppableId="form-fields">
                  {(provided) => (
                    <div {...provided.droppableProps} ref={provided.innerRef} className="space-y-4">
                      {fields.map((field, index) => (
                        <Draggable key={field.id} draggableId={field.id} index={index}>
                          {(provided, snapshot) => (
                            <div
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              className={`border rounded-lg p-4 bg-white ${
                                snapshot.isDragging ? "shadow-lg" : ""
                              } ${selectedField === field.id ? "ring-2 ring-[#0a5eb2]" : ""}`}
                            >
                              <div className="flex items-center justify-between mb-3">
                                <div className="flex items-center gap-2">
                                  <div {...provided.dragHandleProps}>
                                    <GripVertical className="w-4 h-4 text-gray-400 cursor-grab" />
                                  </div>
                                  <span className="font-medium">{field.label}</span>
                                  {field.required && <span className="text-red-500">*</span>}
                                  <Badge variant="outline" className="text-xs">
                                    {field.type}
                                  </Badge>
                                </div>
                                <div className="flex items-center gap-2">
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => duplicateField(field.id)}
                                    title="Duplicate field"
                                  >
                                    <Copy className="w-4 h-4" />
                                  </Button>
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => setSelectedField(selectedField === field.id ? null : field.id)}
                                    title="Edit field"
                                  >
                                    <Settings className="w-4 h-4" />
                                  </Button>
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => removeField(field.id)}
                                    className="text-red-600 hover:text-red-700"
                                    title="Delete field"
                                  >
                                    <Trash2 className="w-4 h-4" />
                                  </Button>
                                </div>
                              </div>
                              <div className="space-y-2">
                                {field.type !== "section" && field.type !== "heading" && field.type !== "paragraph" && (
                                  <Label className="text-sm font-medium">{field.label}</Label>
                                )}
                                {renderFieldPreview(field)}
                              </div>
                            </div>
                          )}
                        </Draggable>
                      ))}
                      {provided.placeholder}
                    </div>
                  )}
                </Droppable>
              </DragDropContext>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Field Settings */}
      <div className="lg:col-span-1">
        {selectedField ? (
          <AdvancedFieldSettings
            field={fields.find((f) => f.id === selectedField)!}
            onUpdate={(updates) => updateField(selectedField, updates)}
            allFields={fields}
          />
        ) : (
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Field Settings</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-500 text-sm">Select a field to edit its settings</p>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Conditional Logic Modal */}
      {showConditionalLogic && (
        <ConditionalLogicBuilder
          fields={fields}
          onClose={() => setShowConditionalLogic(false)}
          onUpdate={onFieldsChange}
        />
      )}
    </div>
  )
}

// Form Styling Panel Component
function FormStylingPanel({ formStyling, onFormStylingChange }: any) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2">
          <Palette className="w-4 h-4" />
          Form Styling
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Label htmlFor="primaryColor">Primary Color</Label>
          <Input
            id="primaryColor"
            type="color"
            value={formStyling?.primaryColor || "#0a5eb2"}
            onChange={(e) => onFormStylingChange?.({ ...formStyling, primaryColor: e.target.value })}
          />
        </div>
        <div>
          <Label htmlFor="backgroundColor">Background Color</Label>
          <Input
            id="backgroundColor"
            type="color"
            value={formStyling?.backgroundColor || "#ffffff"}
            onChange={(e) => onFormStylingChange?.({ ...formStyling, backgroundColor: e.target.value })}
          />
        </div>
        <div>
          <Label htmlFor="fontFamily">Font Family</Label>
          <Select
            value={formStyling?.fontFamily || "system"}
            onValueChange={(value) => onFormStylingChange?.({ ...formStyling, fontFamily: value })}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="system">System Default</SelectItem>
              <SelectItem value="Arial, sans-serif">Arial</SelectItem>
              <SelectItem value="Helvetica, sans-serif">Helvetica</SelectItem>
              <SelectItem value="Georgia, serif">Georgia</SelectItem>
              <SelectItem value="Times New Roman, serif">Times New Roman</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardContent>
    </Card>
  )
}

// Layout Panel Component
function LayoutPanel({ formStyling, onFormStylingChange }: any) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2">
          <Layout className="w-4 h-4" />
          Layout Options
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Label>Form Layout</Label>
          <div className="grid grid-cols-1 gap-2 mt-2">
            {[
              { value: "single", label: "Single Column" },
              { value: "two-column", label: "Two Columns" },
              { value: "three-column", label: "Three Columns" },
            ].map((layout) => (
              <Button
                key={layout.value}
                variant={formStyling?.layout === layout.value ? "default" : "outline"}
                className="justify-start"
                onClick={() => onFormStylingChange?.({ ...formStyling, layout: layout.value })}
              >
                {layout.label}
              </Button>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

// Advanced Field Settings Component
function AdvancedFieldSettings({ field, onUpdate, allFields }: any) {
  const [options, setOptions] = useState(field.options || [])

  const addOption = () => {
    const newOptions = [...options, `Option ${options.length + 1}`]
    setOptions(newOptions)
    onUpdate({ options: newOptions })
  }

  const updateOption = (index: number, value: string) => {
    const newOptions = [...options]
    newOptions[index] = value
    setOptions(newOptions)
    onUpdate({ options: newOptions })
  }

  const removeOption = (index: number) => {
    const newOptions = options.filter((_, i) => i !== index)
    setOptions(newOptions)
    onUpdate({ options: newOptions })
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Field Settings</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="basic" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="basic">Basic</TabsTrigger>
            <TabsTrigger value="style">Style</TabsTrigger>
            <TabsTrigger value="advanced">Advanced</TabsTrigger>
          </TabsList>

          <TabsContent value="basic" className="space-y-4">
            <div>
              <Label htmlFor="fieldLabel">Label</Label>
              <Input id="fieldLabel" value={field.label} onChange={(e) => onUpdate({ label: e.target.value })} />
            </div>

            <div>
              <Label htmlFor="fieldPlaceholder">Placeholder</Label>
              <Input
                id="fieldPlaceholder"
                value={field.placeholder || ""}
                onChange={(e) => onUpdate({ placeholder: e.target.value })}
              />
            </div>

            <div>
              <Label htmlFor="helpText">Help Text</Label>
              <Textarea
                id="helpText"
                value={field.helpText || ""}
                onChange={(e) => onUpdate({ helpText: e.target.value })}
                rows={2}
              />
            </div>

            <div className="flex items-center space-x-2">
              <Switch
                id="fieldRequired"
                checked={field.required}
                onCheckedChange={(checked) => onUpdate({ required: checked })}
              />
              <Label htmlFor="fieldRequired">Required field</Label>
            </div>

            {(field.type === "select" || field.type === "radio" || field.type === "checkbox") && (
              <div>
                <Label>Options</Label>
                <div className="space-y-2 mt-2">
                  {options.map((option, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <Input
                        value={option}
                        onChange={(e) => updateOption(index, e.target.value)}
                        placeholder={`Option ${index + 1}`}
                      />
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => removeOption(index)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  ))}
                  <Button variant="outline" onClick={addOption} className="w-full">
                    <Plus className="w-4 h-4 mr-2" />
                    Add Option
                  </Button>
                </div>
              </div>
            )}
          </TabsContent>

          <TabsContent value="style" className="space-y-4">
            <div>
              <Label>Field Width</Label>
              <Select
                value={field.styling?.width || "full"}
                onValueChange={(value) =>
                  onUpdate({
                    styling: { ...field.styling, width: value },
                  })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="full">Full Width</SelectItem>
                  <SelectItem value="half">Half Width</SelectItem>
                  <SelectItem value="third">One Third</SelectItem>
                  <SelectItem value="quarter">One Quarter</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>Text Alignment</Label>
              <div className="flex gap-2 mt-2">
                {[
                  { value: "left", icon: AlignLeft },
                  { value: "center", icon: AlignCenter },
                  { value: "right", icon: AlignRight },
                ].map(({ value, icon: Icon }) => (
                  <Button
                    key={value}
                    variant={field.styling?.alignment === value ? "default" : "outline"}
                    size="icon"
                    onClick={() =>
                      onUpdate({
                        styling: { ...field.styling, alignment: value },
                      })
                    }
                  >
                    <Icon className="w-4 h-4" />
                  </Button>
                ))}
              </div>
            </div>

            <div>
              <Label>Label Style</Label>
              <div className="flex gap-2 mt-2">
                {[
                  { key: "bold", icon: Bold },
                  { key: "italic", icon: Italic },
                  { key: "underline", icon: Underline },
                ].map(({ key, icon: Icon }) => (
                  <Button
                    key={key}
                    variant={field.styling?.labelStyle?.[key] ? "default" : "outline"}
                    size="icon"
                    onClick={() =>
                      onUpdate({
                        styling: {
                          ...field.styling,
                          labelStyle: {
                            ...field.styling?.labelStyle,
                            [key]: !field.styling?.labelStyle?.[key],
                          },
                        },
                      })
                    }
                  >
                    <Icon className="w-4 h-4" />
                  </Button>
                ))}
              </div>
            </div>

            <div>
              <Label htmlFor="labelColor">Label Color</Label>
              <Input
                id="labelColor"
                type="color"
                value={field.styling?.labelStyle?.color || "#000000"}
                onChange={(e) =>
                  onUpdate({
                    styling: {
                      ...field.styling,
                      labelStyle: {
                        ...field.styling?.labelStyle,
                        color: e.target.value,
                      },
                    },
                  })
                }
              />
            </div>
          </TabsContent>

          <TabsContent value="advanced" className="space-y-4">
            {(field.type === "text" || field.type === "textarea") && (
              <>
                <div>
                  <Label htmlFor="minLength">Minimum Length</Label>
                  <Input
                    id="minLength"
                    type="number"
                    value={field.validation?.minLength || ""}
                    onChange={(e) =>
                      onUpdate({
                        validation: {
                          ...field.validation,
                          minLength: Number.parseInt(e.target.value) || undefined,
                        },
                      })
                    }
                  />
                </div>
                <div>
                  <Label htmlFor="maxLength">Maximum Length</Label>
                  <Input
                    id="maxLength"
                    type="number"
                    value={field.validation?.maxLength || ""}
                    onChange={(e) =>
                      onUpdate({
                        validation: {
                          ...field.validation,
                          maxLength: Number.parseInt(e.target.value) || undefined,
                        },
                      })
                    }
                  />
                </div>
              </>
            )}

            {field.type === "number" && (
              <>
                <div>
                  <Label htmlFor="minValue">Minimum Value</Label>
                  <Input
                    id="minValue"
                    type="number"
                    value={field.validation?.min || ""}
                    onChange={(e) =>
                      onUpdate({
                        validation: {
                          ...field.validation,
                          min: Number.parseInt(e.target.value) || undefined,
                        },
                      })
                    }
                  />
                </div>
                <div>
                  <Label htmlFor="maxValue">Maximum Value</Label>
                  <Input
                    id="maxValue"
                    type="number"
                    value={field.validation?.max || ""}
                    onChange={(e) =>
                      onUpdate({
                        validation: {
                          ...field.validation,
                          max: Number.parseInt(e.target.value) || undefined,
                        },
                      })
                    }
                  />
                </div>
              </>
            )}

            <div>
              <Label htmlFor="defaultValue">Default Value</Label>
              <Input
                id="defaultValue"
                value={field.defaultValue || ""}
                onChange={(e) => onUpdate({ defaultValue: e.target.value })}
              />
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}
