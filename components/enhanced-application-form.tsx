"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Progress } from "@/components/ui/progress"
import { ArrowLeft, Upload, Save } from "lucide-react"
import type { ApplicationFormData } from "@/lib/validations/application"
import type University from "@/data/universities-data"

interface DynamicField {
  id: string
  type: "text" | "textarea" | "select" | "checkbox" | "radio" | "file" | "date" | "number" | "email" | "phone"
  label: string
  placeholder?: string
  required: boolean
  options?: string[]
  validation?: {
    min?: number
    max?: number
    pattern?: string
    message?: string
  }
  conditional?: {
    dependsOn: string
    value: any
    operator: "equals" | "not_equals" | "contains" | "greater_than" | "less_than"
  }
  section: string
}

interface EnhancedApplicationFormProps {
  university: University
  programId: string
  initialData?: Partial<ApplicationFormData>
  onComplete: (data: ApplicationFormData) => void
  onBack: () => void
}

export function EnhancedApplicationForm({
  university,
  programId,
  initialData,
  onComplete,
  onBack,
}: EnhancedApplicationFormProps) {
  const [currentSection, setCurrentSection] = useState(0)
  const [uploadedFiles, setUploadedFiles] = useState<Record<string, File>>({})
  const [isAutoSaving, setIsAutoSaving] = useState(false)
  const [dynamicFields, setDynamicFields] = useState<DynamicField[]>([])
  const [formData, setFormData] = useState<Record<string, any>>({})
  const [visibleFields, setVisibleFields] = useState<Set<string>>(new Set())

  const program = university.programs.find((p) => p.id === programId)

  // Dynamic form fields based on university and program requirements
  useEffect(() => {
    const fields: DynamicField[] = [
      // Personal Information Section
      {
        id: "firstName",
        type: "text",
        label: "First Name",
        required: true,
        section: "personal",
        validation: { min: 2, max: 50, message: "First name must be 2-50 characters" },
      },
      {
        id: "lastName",
        type: "text",
        label: "Last Name",
        required: true,
        section: "personal",
        validation: { min: 2, max: 50, message: "Last name must be 2-50 characters" },
      },
      {
        id: "email",
        type: "email",
        label: "Email Address",
        required: true,
        section: "personal",
      },
      {
        id: "phone",
        type: "phone",
        label: "Phone Number",
        required: true,
        section: "personal",
      },
      {
        id: "dateOfBirth",
        type: "date",
        label: "Date of Birth",
        required: true,
        section: "personal",
      },
      {
        id: "nationality",
        type: "select",
        label: "Nationality",
        required: true,
        section: "personal",
        options: ["Ethiopian", "Kenyan", "Ugandan", "Tanzanian", "Rwandan", "Other"],
      },
      {
        id: "gender",
        type: "radio",
        label: "Gender",
        required: true,
        section: "personal",
        options: ["Male", "Female", "Other", "Prefer not to say"],
      },
      {
        id: "address",
        type: "textarea",
        label: "Address",
        required: true,
        section: "personal",
      },

      // Academic History Section
      {
        id: "highSchoolName",
        type: "text",
        label: "High School Name",
        required: true,
        section: "academic",
      },
      {
        id: "highSchoolGPA",
        type: "number",
        label: "GPA/Grade",
        required: true,
        section: "academic",
        validation: { min: 0, max: 4, message: "GPA must be between 0 and 4" },
      },
      {
        id: "graduationYear",
        type: "number",
        label: "Graduation Year",
        required: true,
        section: "academic",
        validation: { min: 1990, max: 2030, message: "Invalid graduation year" },
      },
      {
        id: "hasUniversityExperience",
        type: "checkbox",
        label: "I have previous university experience",
        required: false,
        section: "academic",
      },
      {
        id: "previousUniversity",
        type: "text",
        label: "Previous University",
        required: false,
        section: "academic",
        conditional: {
          dependsOn: "hasUniversityExperience",
          value: true,
          operator: "equals",
        },
      },

      // Program-specific fields
      ...(program?.name.toLowerCase().includes("engineering")
        ? [
            {
              id: "mathsGrade",
              type: "select",
              label: "Mathematics Grade",
              required: true,
              section: "academic",
              options: ["A", "B", "C", "D", "E"],
            },
            {
              id: "physicsGrade",
              type: "select",
              label: "Physics Grade",
              required: true,
              section: "academic",
              options: ["A", "B", "C", "D", "E"],
            },
          ]
        : []),

      ...(program?.name.toLowerCase().includes("medicine")
        ? [
            {
              id: "biologyGrade",
              type: "select",
              label: "Biology Grade",
              required: true,
              section: "academic",
              options: ["A", "B", "C", "D", "E"],
            },
            {
              id: "chemistryGrade",
              type: "select",
              label: "Chemistry Grade",
              required: true,
              section: "academic",
              options: ["A", "B", "C", "D", "E"],
            },
          ]
        : []),

      // Documents Section
      {
        id: "transcript",
        type: "file",
        label: "Academic Transcript",
        required: true,
        section: "documents",
      },
      {
        id: "personalStatement",
        type: "file",
        label: "Personal Statement",
        required: true,
        section: "documents",
      },
      {
        id: "recommendationLetter",
        type: "file",
        label: "Recommendation Letter",
        required: false,
        section: "documents",
      },

      // Essays Section
      {
        id: "whyThisUniversity",
        type: "textarea",
        label: `Why do you want to study at ${university.name}?`,
        required: true,
        section: "essays",
        validation: { min: 100, max: 1000, message: "Essay must be 100-1000 characters" },
      },
      {
        id: "careerGoals",
        type: "textarea",
        label: "Career Goals",
        required: true,
        section: "essays",
        validation: { min: 100, max: 1000, message: "Essay must be 100-1000 characters" },
      },

      // Additional Information Section
      {
        id: "extracurriculars",
        type: "textarea",
        label: "Extracurricular Activities",
        required: false,
        section: "additional",
      },
      {
        id: "workExperience",
        type: "textarea",
        label: "Work Experience",
        required: false,
        section: "additional",
      },
      {
        id: "languages",
        type: "checkbox",
        label: "Languages Spoken",
        required: false,
        section: "additional",
        options: ["English", "Amharic", "Oromo", "Tigrinya", "Somali", "Arabic", "French"],
      },
      {
        id: "specialNeeds",
        type: "textarea",
        label: "Special Accommodations",
        required: false,
        section: "additional",
      },
    ]

    setDynamicFields(fields)
    updateVisibleFields(fields, formData)
  }, [university, program])

  const updateVisibleFields = (fields: DynamicField[], currentData: Record<string, any>) => {
    const visible = new Set<string>()

    fields.forEach((field) => {
      if (!field.conditional) {
        visible.add(field.id)
      } else {
        const dependentValue = currentData[field.conditional.dependsOn]
        const shouldShow = evaluateCondition(dependentValue, field.conditional.value, field.conditional.operator)
        if (shouldShow) {
          visible.add(field.id)
        }
      }
    })

    setVisibleFields(visible)
  }

  const evaluateCondition = (actualValue: any, expectedValue: any, operator: string): boolean => {
    switch (operator) {
      case "equals":
        return actualValue === expectedValue
      case "not_equals":
        return actualValue !== expectedValue
      case "contains":
        return Array.isArray(actualValue) && actualValue.includes(expectedValue)
      case "greater_than":
        return Number(actualValue) > Number(expectedValue)
      case "less_than":
        return Number(actualValue) < Number(expectedValue)
      default:
        return false
    }
  }

  const sections = [
    {
      id: "personal",
      title: "Personal Information",
      description: "Basic personal details",
    },
    {
      id: "academic",
      title: "Academic History",
      description: "Educational background",
    },
    {
      id: "documents",
      title: "Documents",
      description: "Required documents upload",
    },
    {
      id: "essays",
      title: "Essays",
      description: "Personal statements and essays",
    },
    {
      id: "additional",
      title: "Additional Information",
      description: "Extra details about yourself",
    },
  ]

  const handleFieldChange = (fieldId: string, value: any) => {
    const newData = { ...formData, [fieldId]: value }
    setFormData(newData)
    updateVisibleFields(dynamicFields, newData)

    // Auto-save
    setIsAutoSaving(true)
    setTimeout(() => {
      localStorage.setItem(`application-draft-${university.id}-${programId}`, JSON.stringify(newData))
      setIsAutoSaving(false)
    }, 1000)
  }

  const handleFileUpload = (fieldId: string, file: File) => {
    setUploadedFiles((prev) => ({ ...prev, [fieldId]: file }))
    handleFieldChange(fieldId, file)
  }

  const renderField = (field: DynamicField) => {
    if (!visibleFields.has(field.id)) return null

    const value = formData[field.id]

    switch (field.type) {
      case "text":
      case "email":
      case "phone":
        return (
          <div key={field.id} className="space-y-2">
            <Label htmlFor={field.id}>
              {field.label}
              {field.required && <span className="text-red-500 ml-1">*</span>}
            </Label>
            <Input
              id={field.id}
              type={field.type}
              value={value || ""}
              onChange={(e) => handleFieldChange(field.id, e.target.value)}
              placeholder={field.placeholder}
              required={field.required}
            />
          </div>
        )

      case "number":
        return (
          <div key={field.id} className="space-y-2">
            <Label htmlFor={field.id}>
              {field.label}
              {field.required && <span className="text-red-500 ml-1">*</span>}
            </Label>
            <Input
              id={field.id}
              type="number"
              value={value || ""}
              onChange={(e) => handleFieldChange(field.id, Number(e.target.value))}
              min={field.validation?.min}
              max={field.validation?.max}
              required={field.required}
            />
          </div>
        )

      case "date":
        return (
          <div key={field.id} className="space-y-2">
            <Label htmlFor={field.id}>
              {field.label}
              {field.required && <span className="text-red-500 ml-1">*</span>}
            </Label>
            <Input
              id={field.id}
              type="date"
              value={value || ""}
              onChange={(e) => handleFieldChange(field.id, e.target.value)}
              required={field.required}
            />
          </div>
        )

      case "textarea":
        return (
          <div key={field.id} className="space-y-2">
            <Label htmlFor={field.id}>
              {field.label}
              {field.required && <span className="text-red-500 ml-1">*</span>}
            </Label>
            <Textarea
              id={field.id}
              value={value || ""}
              onChange={(e) => handleFieldChange(field.id, e.target.value)}
              placeholder={field.placeholder}
              rows={4}
              required={field.required}
            />
            {field.validation && (
              <p className="text-xs text-gray-500">
                {field.validation.min &&
                  field.validation.max &&
                  `${field.validation.min}-${field.validation.max} characters`}
              </p>
            )}
          </div>
        )

      case "select":
        return (
          <div key={field.id} className="space-y-2">
            <Label htmlFor={field.id}>
              {field.label}
              {field.required && <span className="text-red-500 ml-1">*</span>}
            </Label>
            <Select value={value || ""} onValueChange={(val) => handleFieldChange(field.id, val)}>
              <SelectTrigger>
                <SelectValue placeholder={`Select ${field.label.toLowerCase()}`} />
              </SelectTrigger>
              <SelectContent>
                {field.options?.map((option) => (
                  <SelectItem key={option} value={option}>
                    {option}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )

      case "radio":
        return (
          <div key={field.id} className="space-y-2">
            <Label>
              {field.label}
              {field.required && <span className="text-red-500 ml-1">*</span>}
            </Label>
            <RadioGroup value={value || ""} onValueChange={(val) => handleFieldChange(field.id, val)}>
              {field.options?.map((option) => (
                <div key={option} className="flex items-center space-x-2">
                  <RadioGroupItem value={option} id={`${field.id}-${option}`} />
                  <Label htmlFor={`${field.id}-${option}`}>{option}</Label>
                </div>
              ))}
            </RadioGroup>
          </div>
        )

      case "checkbox":
        if (field.options) {
          // Multiple checkboxes
          return (
            <div key={field.id} className="space-y-2">
              <Label>
                {field.label}
                {field.required && <span className="text-red-500 ml-1">*</span>}
              </Label>
              <div className="space-y-2">
                {field.options.map((option) => (
                  <div key={option} className="flex items-center space-x-2">
                    <Checkbox
                      id={`${field.id}-${option}`}
                      checked={value?.includes(option) || false}
                      onCheckedChange={(checked) => {
                        const currentValues = value || []
                        if (checked) {
                          handleFieldChange(field.id, [...currentValues, option])
                        } else {
                          handleFieldChange(
                            field.id,
                            currentValues.filter((v: string) => v !== option),
                          )
                        }
                      }}
                    />
                    <Label htmlFor={`${field.id}-${option}`}>{option}</Label>
                  </div>
                ))}
              </div>
            </div>
          )
        } else {
          // Single checkbox
          return (
            <div key={field.id} className="flex items-center space-x-2">
              <Checkbox
                id={field.id}
                checked={value || false}
                onCheckedChange={(checked) => handleFieldChange(field.id, checked)}
              />
              <Label htmlFor={field.id}>{field.label}</Label>
            </div>
          )
        }

      case "file":
        return (
          <div key={field.id} className="space-y-2">
            <Label>
              {field.label}
              {field.required && <span className="text-red-500 ml-1">*</span>}
            </Label>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
              <Upload className="w-8 h-8 mx-auto mb-2 text-gray-400" />
              <p className="text-sm text-gray-600 mb-2">Upload your {field.label.toLowerCase()}</p>
              <input
                type="file"
                accept=".pdf,.doc,.docx"
                onChange={(e) => {
                  const file = e.target.files?.[0]
                  if (file) handleFileUpload(field.id, file)
                }}
                className="hidden"
                id={field.id}
              />
              <Label htmlFor={field.id} className="cursor-pointer">
                <Button type="button" variant="outline" size="sm">
                  Choose File
                </Button>
              </Label>
              {uploadedFiles[field.id] && (
                <p className="text-sm text-green-600 mt-2">✓ {uploadedFiles[field.id].name}</p>
              )}
            </div>
          </div>
        )

      default:
        return null
    }
  }

  const getCurrentSectionFields = () => {
    const currentSectionId = sections[currentSection].id
    return dynamicFields.filter((field) => field.section === currentSectionId && visibleFields.has(field.id))
  }

  const validateCurrentSection = () => {
    const currentFields = getCurrentSectionFields()
    return currentFields.every((field) => {
      if (!field.required) return true
      const value = formData[field.id]
      return value !== undefined && value !== null && value !== ""
    })
  }

  const handleNext = () => {
    if (validateCurrentSection() && currentSection < sections.length - 1) {
      setCurrentSection(currentSection + 1)
    }
  }

  const handlePrevious = () => {
    if (currentSection > 0) {
      setCurrentSection(currentSection - 1)
    }
  }

  const handleSubmit = () => {
    const formDataWithFiles = {
      personalInfo: {
        firstName: formData.firstName || "",
        lastName: formData.lastName || "",
        email: formData.email || "",
        phone: formData.phone || "",
        dateOfBirth: formData.dateOfBirth || "",
        nationality: formData.nationality || "",
        address: formData.address || "",
        city: "",
        postalCode: "",
      },
      academicHistory: {
        highSchoolName: formData.highSchoolName || "",
        highSchoolGPA: formData.highSchoolGPA || "",
        graduationYear: formData.graduationYear || "",
        previousEducation: [],
      },
      documents: {
        transcript: uploadedFiles.transcript || null,
        personalStatement: uploadedFiles.personalStatement || null,
        recommendationLetters: uploadedFiles.recommendationLetter ? [uploadedFiles.recommendationLetter] : [],
      },
      essays: {
        whyThisUniversity: formData.whyThisUniversity || "",
        careerGoals: formData.careerGoals || "",
        personalExperience: "",
      },
      additionalInfo: {
        extracurriculars: formData.extracurriculars || "",
        workExperience: formData.workExperience || "",
        languages: formData.languages || [],
        specialNeeds: formData.specialNeeds || "",
      },
    }
    onComplete(formDataWithFiles)
  }

  const progress = ((currentSection + 1) / sections.length) * 100
  const currentSectionFields = getCurrentSectionFields()

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-4 mb-4">
          <Button variant="outline" size="sm" onClick={onBack}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
          <div className="flex-1">
            <CardTitle>Dynamic Application Form</CardTitle>
            <p className="text-sm text-gray-600 mt-1">
              {program?.name} at {university.name}
            </p>
          </div>
          {isAutoSaving && (
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <Save className="w-4 h-4" />
              Auto-saving...
            </div>
          )}
        </div>

        {/* Progress Bar */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>
              Section {currentSection + 1} of {sections.length}
            </span>
            <span>{Math.round(progress)}% Complete</span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>

        {/* Section Navigation */}
        <div className="flex gap-2 mt-4 overflow-x-auto">
          {sections.map((section, index) => (
            <button
              key={section.id}
              onClick={() => setCurrentSection(index)}
              className={`px-3 py-1 text-xs rounded-full whitespace-nowrap ${
                index === currentSection
                  ? "bg-primary text-white"
                  : index < currentSection
                    ? "bg-green-100 text-green-700"
                    : "bg-gray-100 text-gray-500"
              }`}
            >
              {section.title}
            </button>
          ))}
        </div>
      </CardHeader>

      <CardContent>
        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-semibold mb-2">{sections[currentSection].title}</h3>
            <p className="text-gray-600 mb-6">{sections[currentSection].description}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">{currentSectionFields.map(renderField)}</div>

          {/* Navigation Buttons */}
          <div className="flex justify-between pt-6 border-t">
            <Button type="button" variant="outline" onClick={currentSection === 0 ? onBack : handlePrevious}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              {currentSection === 0 ? "Back to Program" : "Previous"}
            </Button>

            {currentSection < sections.length - 1 ? (
              <Button type="button" onClick={handleNext} disabled={!validateCurrentSection()}>
                Next Section
              </Button>
            ) : (
              <Button type="button" onClick={handleSubmit} disabled={!validateCurrentSection()}>
                Continue to Payment
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
