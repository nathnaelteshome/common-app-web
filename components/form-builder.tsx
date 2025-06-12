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
    show: boolean
    conditions: Array<{
      field: string
      operator: string
      value: string
    }>
  }
}

interface FormBuilderProps {
  fields: FormField[]
  onFieldsChange: (fields: FormField[]) => void
  isPreviewMode?: boolean
  formName?: string
  formDescription?: string
}

const fieldTypes = [
  { type: "text", label: "Text Input", icon: Type },
  { type: "email", label: "Email", icon: Mail },
  { type: "number", label: "Number", icon: Hash },
  { type: "date", label: "Date", icon: Calendar },
  { type: "textarea", label: "Text Area", icon: FileText },
  { type: "select", label: "Dropdown", icon: List },
  { type: "radio", label: "Radio Buttons", icon: CheckSquare },
  { type: "checkbox", label: "Checkboxes", icon: CheckSquare },
  { type: "file", label: "File Upload", icon: Upload },
  { type: "phone", label: "Phone Number", icon: Phone },
  { type: "address", label: "Address", icon: MapPin },
]

export function FormBuilder({
  fields,
  onFieldsChange,
  isPreviewMode = false,
  formName,
  formDescription,
}: FormBuilderProps) {
  const [selectedField, setSelectedField] = useState<string | null>(null)
  const [showConditionalLogic, setShowConditionalLogic] = useState(false)

  const addField = useCallback(
    (type: string) => {
      const newField: FormField = {
        id: `field_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        type,
        label: `New ${type} field`,
        required: false,
        ...(type === "select" || type === "radio" || type === "checkbox" ? { options: ["Option 1", "Option 2"] } : {}),
      }
      onFieldsChange([...fields, newField])
    },
    [fields, onFieldsChange],
  )

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

  const renderFieldPreview = (field: FormField) => {
    const commonProps = {
      placeholder: field.placeholder || `Enter ${field.label.toLowerCase()}`,
      required: field.required,
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
          <Select>
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
                <input type="radio" name={field.id} id={`${field.id}_${index}`} />
                <Label htmlFor={`${field.id}_${index}`}>{option}</Label>
              </div>
            ))}
          </div>
        )
      case "checkbox":
        return (
          <div className="space-y-2">
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
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
            <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
            <p className="text-sm text-gray-600">Click to upload or drag and drop</p>
          </div>
        )
      case "address":
        return (
          <div className="space-y-2">
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
      <div className="max-w-2xl mx-auto">
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">{formName || "Form Preview"}</h2>
          {formDescription && <p className="text-gray-600">{formDescription}</p>}
        </div>

        <form className="space-y-6">
          {fields.map((field) => (
            <div key={field.id} className="space-y-2">
              <Label htmlFor={field.id} className="text-sm font-medium">
                {field.label}
                {field.required && <span className="text-red-500 ml-1">*</span>}
              </Label>
              {renderFieldPreview(field)}
            </div>
          ))}

          {fields.length === 0 && (
            <div className="text-center py-12 text-gray-500">
              <FileText className="w-12 h-12 mx-auto mb-4 text-gray-300" />
              <p>No fields added yet. Switch to edit mode to add fields.</p>
            </div>
          )}

          <div className="pt-6">
            <Button type="submit" className="w-full bg-[#0a5eb2] hover:bg-[#0a5eb2]/90">
              Submit Application
            </Button>
          </div>
        </form>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
      {/* Field Library */}
      <div className="lg:col-span-1">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Field Library</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {fieldTypes.map((fieldType) => {
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

        {/* Conditional Logic */}
        <Card className="mt-4">
          <CardHeader>
            <CardTitle className="text-lg">Advanced Features</CardTitle>
          </CardHeader>
          <CardContent>
            <Button
              variant="outline"
              className="w-full justify-start"
              onClick={() => setShowConditionalLogic(true)}
              disabled={fields.length === 0}
            >
              <Settings className="w-4 h-4 mr-2" />
              Conditional Logic
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Form Builder Area */}
      <div className="lg:col-span-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Form Builder</CardTitle>
          </CardHeader>
          <CardContent>
            {fields.length === 0 ? (
              <div className="text-center py-12 text-gray-500">
                <FileText className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                <p className="mb-4">Start building your form by adding fields from the library</p>
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
                                </div>
                                <div className="flex items-center gap-2">
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => setSelectedField(selectedField === field.id ? null : field.id)}
                                  >
                                    <Settings className="w-4 h-4" />
                                  </Button>
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => removeField(field.id)}
                                    className="text-red-600 hover:text-red-700"
                                  >
                                    <Trash2 className="w-4 h-4" />
                                  </Button>
                                </div>
                              </div>
                              <div className="space-y-2">
                                <Label className="text-sm font-medium">{field.label}</Label>
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
          <FieldSettings
            field={fields.find((f) => f.id === selectedField)!}
            onUpdate={(updates) => updateField(selectedField, updates)}
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

function FieldSettings({ field, onUpdate }: { field: FormField; onUpdate: (updates: Partial<FormField>) => void }) {
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
      <CardContent className="space-y-4">
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

        {(field.type === "text" || field.type === "textarea") && (
          <div className="space-y-3">
            <div>
              <Label htmlFor="minLength">Minimum Length</Label>
              <Input
                id="minLength"
                type="number"
                value={field.validation?.minLength || ""}
                onChange={(e) =>
                  onUpdate({
                    validation: { ...field.validation, minLength: Number.parseInt(e.target.value) || undefined },
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
                    validation: { ...field.validation, maxLength: Number.parseInt(e.target.value) || undefined },
                  })
                }
              />
            </div>
          </div>
        )}

        {field.type === "number" && (
          <div className="space-y-3">
            <div>
              <Label htmlFor="minValue">Minimum Value</Label>
              <Input
                id="minValue"
                type="number"
                value={field.validation?.min || ""}
                onChange={(e) =>
                  onUpdate({
                    validation: { ...field.validation, min: Number.parseInt(e.target.value) || undefined },
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
                    validation: { ...field.validation, max: Number.parseInt(e.target.value) || undefined },
                  })
                }
              />
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
