"use client"

import { useState, useEffect } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Progress } from "@/components/ui/progress"
import { ArrowLeft, Upload, FileText, Save } from "lucide-react"
import { applicationFormSchema, type ApplicationFormData } from "@/lib/validations/application"
import type { University } from "@/data/universities-data"

interface ApplicationFormProps {
  university: University
  programId: string
  initialData?: Partial<ApplicationFormData>
  onComplete: (data: ApplicationFormData) => void
  onBack: () => void
}

export function ApplicationForm({ university, programId, initialData, onComplete, onBack }: ApplicationFormProps) {
  const [currentSection, setCurrentSection] = useState(0)
  const [uploadedFiles, setUploadedFiles] = useState<Record<string, File>>({})
  const [isAutoSaving, setIsAutoSaving] = useState(false)

  const form = useForm<ApplicationFormData>({
    resolver: zodResolver(applicationFormSchema),
    defaultValues: {
      personalInfo: {
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        dateOfBirth: "",
        nationality: "",
        address: "",
        city: "",
        postalCode: "",
        ...initialData?.personalInfo,
      },
      academicHistory: {
        highSchoolName: "",
        highSchoolGPA: "",
        graduationYear: "",
        previousEducation: [],
        ...initialData?.academicHistory,
      },
      documents: {
        transcript: null,
        personalStatement: null,
        recommendationLetters: [],
        ...initialData?.documents,
      },
      essays: {
        whyThisUniversity: "",
        careerGoals: "",
        personalExperience: "",
        ...initialData?.essays,
      },
      additionalInfo: {
        extracurriculars: "",
        workExperience: "",
        languages: [],
        specialNeeds: "",
        ...initialData?.additionalInfo,
      },
    },
  })

  // Add null checks
  if (!university) {
    return (
      <Card>
        <CardContent className="p-8 text-center">
          <p className="text-gray-600">University information not available. Please go back and select a university.</p>
          <Button onClick={onBack} className="mt-4">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Selection
          </Button>
        </CardContent>
      </Card>
    )
  }

  if (!programId) {
    return (
      <Card>
        <CardContent className="p-8 text-center">
          <p className="text-gray-600">Program information not available. Please go back and select a program.</p>
          <Button onClick={onBack} className="mt-4">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Selection
          </Button>
        </CardContent>
      </Card>
    )
  }

  const program = university?.programs?.find((p) => p.id === programId)

  if (!program) {
    return (
      <Card>
        <CardContent className="p-8 text-center">
          <p className="text-gray-600">Selected program not found. Please go back and select a valid program.</p>
          <Button onClick={onBack} className="mt-4">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Selection
          </Button>
        </CardContent>
      </Card>
    )
  }

  const sections = [
    {
      id: "personal",
      title: "Personal Information",
      description: "Basic personal details",
      fields: ["firstName", "lastName", "email", "phone", "dateOfBirth", "nationality", "address"],
    },
    {
      id: "academic",
      title: "Academic History",
      description: "Educational background",
      fields: ["highSchoolName", "highSchoolGPA", "graduationYear"],
    },
    {
      id: "documents",
      title: "Documents",
      description: "Required documents upload",
      fields: ["transcript", "personalStatement"],
    },
    {
      id: "essays",
      title: "Essays",
      description: "Personal statements and essays",
      fields: ["whyThisUniversity", "careerGoals"],
    },
    {
      id: "additional",
      title: "Additional Information",
      description: "Extra details about yourself",
      fields: ["extracurriculars", "workExperience"],
    },
  ]

  // Auto-save functionality
  useEffect(() => {
    const subscription = form.watch(() => {
      setIsAutoSaving(true)
      const timer = setTimeout(() => {
        // Simulate auto-save
        localStorage.setItem(`application-draft-${university?.id}-${programId}`, JSON.stringify(form.getValues()))
        setIsAutoSaving(false)
      }, 1000)

      return () => clearTimeout(timer)
    })

    return () => subscription.unsubscribe()
  }, [form, university?.id, programId])

  const handleFileUpload = (fieldName: string, file: File) => {
    setUploadedFiles((prev) => ({ ...prev, [fieldName]: file }))
    form.setValue(`documents.${fieldName}` as any, file)
  }

  const validateCurrentSection = async () => {
    const currentSectionFields = sections[currentSection].fields
    const isValid = await form.trigger(currentSectionFields as any)
    return isValid
  }

  const handleNext = async () => {
    const isValid = await validateCurrentSection()
    if (isValid && currentSection < sections.length - 1) {
      setCurrentSection(currentSection + 1)
    }
  }

  const handlePrevious = () => {
    if (currentSection > 0) {
      setCurrentSection(currentSection - 1)
    }
  }

  const handleSubmit = async (data: ApplicationFormData) => {
    // Add uploaded files to the data
    const formDataWithFiles = {
      ...data,
      documents: {
        ...data.documents,
        ...uploadedFiles,
      },
    }
    onComplete(formDataWithFiles)
  }

  const progress = ((currentSection + 1) / sections.length) * 100

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-4 mb-4">
          <Button variant="outline" size="sm" onClick={onBack}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
          <div className="flex-1">
            <CardTitle>Application Form</CardTitle>
            <p className="text-sm text-gray-600 mt-1">
              {program?.name} at {university?.name}
            </p>
          </div>
          {isAutoSaving && (
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <Save className="w-4 h-4" />
              Saving...
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
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
          {/* Personal Information Section */}
          {currentSection === 0 && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Personal Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="firstName">First Name *</Label>
                  <Input
                    id="firstName"
                    {...form.register("personalInfo.firstName")}
                    className={form.formState.errors.personalInfo?.firstName ? "border-red-500" : ""}
                  />
                  {form.formState.errors.personalInfo?.firstName && (
                    <p className="text-red-500 text-sm mt-1">{form.formState.errors.personalInfo.firstName.message}</p>
                  )}
                </div>

                <div>
                  <Label htmlFor="lastName">Last Name *</Label>
                  <Input
                    id="lastName"
                    {...form.register("personalInfo.lastName")}
                    className={form.formState.errors.personalInfo?.lastName ? "border-red-500" : ""}
                  />
                  {form.formState.errors.personalInfo?.lastName && (
                    <p className="text-red-500 text-sm mt-1">{form.formState.errors.personalInfo.lastName.message}</p>
                  )}
                </div>

                <div>
                  <Label htmlFor="email">Email Address *</Label>
                  <Input
                    id="email"
                    type="email"
                    {...form.register("personalInfo.email")}
                    className={form.formState.errors.personalInfo?.email ? "border-red-500" : ""}
                  />
                  {form.formState.errors.personalInfo?.email && (
                    <p className="text-red-500 text-sm mt-1">{form.formState.errors.personalInfo.email.message}</p>
                  )}
                </div>

                <div>
                  <Label htmlFor="phone">Phone Number *</Label>
                  <Input
                    id="phone"
                    {...form.register("personalInfo.phone")}
                    className={form.formState.errors.personalInfo?.phone ? "border-red-500" : ""}
                  />
                  {form.formState.errors.personalInfo?.phone && (
                    <p className="text-red-500 text-sm mt-1">{form.formState.errors.personalInfo.phone.message}</p>
                  )}
                </div>

                <div>
                  <Label htmlFor="dateOfBirth">Date of Birth *</Label>
                  <Input
                    id="dateOfBirth"
                    type="date"
                    {...form.register("personalInfo.dateOfBirth")}
                    className={form.formState.errors.personalInfo?.dateOfBirth ? "border-red-500" : ""}
                  />
                  {form.formState.errors.personalInfo?.dateOfBirth && (
                    <p className="text-red-500 text-sm mt-1">
                      {form.formState.errors.personalInfo.dateOfBirth.message}
                    </p>
                  )}
                </div>

                <div>
                  <Label htmlFor="nationality">Nationality *</Label>
                  <Input
                    id="nationality"
                    {...form.register("personalInfo.nationality")}
                    className={form.formState.errors.personalInfo?.nationality ? "border-red-500" : ""}
                  />
                  {form.formState.errors.personalInfo?.nationality && (
                    <p className="text-red-500 text-sm mt-1">
                      {form.formState.errors.personalInfo.nationality.message}
                    </p>
                  )}
                </div>
              </div>

              <div>
                <Label htmlFor="address">Address *</Label>
                <Textarea
                  id="address"
                  {...form.register("personalInfo.address")}
                  className={form.formState.errors.personalInfo?.address ? "border-red-500" : ""}
                />
                {form.formState.errors.personalInfo?.address && (
                  <p className="text-red-500 text-sm mt-1">{form.formState.errors.personalInfo.address.message}</p>
                )}
              </div>
            </div>
          )}

          {/* Academic History Section */}
          {currentSection === 1 && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Academic History</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="highSchoolName">High School Name *</Label>
                  <Input
                    id="highSchoolName"
                    {...form.register("academicHistory.highSchoolName")}
                    className={form.formState.errors.academicHistory?.highSchoolName ? "border-red-500" : ""}
                  />
                  {form.formState.errors.academicHistory?.highSchoolName && (
                    <p className="text-red-500 text-sm mt-1">
                      {form.formState.errors.academicHistory.highSchoolName.message}
                    </p>
                  )}
                </div>

                <div>
                  <Label htmlFor="highSchoolGPA">GPA/Grade *</Label>
                  <Input
                    id="highSchoolGPA"
                    {...form.register("academicHistory.highSchoolGPA")}
                    className={form.formState.errors.academicHistory?.highSchoolGPA ? "border-red-500" : ""}
                  />
                  {form.formState.errors.academicHistory?.highSchoolGPA && (
                    <p className="text-red-500 text-sm mt-1">
                      {form.formState.errors.academicHistory.highSchoolGPA.message}
                    </p>
                  )}
                </div>

                <div>
                  <Label htmlFor="graduationYear">Graduation Year *</Label>
                  <Input
                    id="graduationYear"
                    type="number"
                    min="1990"
                    max="2030"
                    {...form.register("academicHistory.graduationYear")}
                    className={form.formState.errors.academicHistory?.graduationYear ? "border-red-500" : ""}
                  />
                  {form.formState.errors.academicHistory?.graduationYear && (
                    <p className="text-red-500 text-sm mt-1">
                      {form.formState.errors.academicHistory.graduationYear.message}
                    </p>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Documents Section */}
          {currentSection === 2 && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Required Documents</h3>
              <div className="space-y-4">
                <div>
                  <Label>Academic Transcript *</Label>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                    <Upload className="w-8 h-8 mx-auto mb-2 text-gray-400" />
                    <p className="text-sm text-gray-600 mb-2">Upload your official academic transcript</p>
                    <input
                      type="file"
                      accept=".pdf,.doc,.docx"
                      onChange={(e) => {
                        const file = e.target.files?.[0]
                        if (file) handleFileUpload("transcript", file)
                      }}
                      className="hidden"
                      id="transcript"
                    />
                    <Label htmlFor="transcript" className="cursor-pointer">
                      <Button type="button" variant="outline" size="sm">
                        Choose File
                      </Button>
                    </Label>
                    {uploadedFiles.transcript && (
                      <p className="text-sm text-green-600 mt-2">✓ {uploadedFiles.transcript.name}</p>
                    )}
                  </div>
                </div>

                <div>
                  <Label>Personal Statement *</Label>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                    <FileText className="w-8 h-8 mx-auto mb-2 text-gray-400" />
                    <p className="text-sm text-gray-600 mb-2">Upload your personal statement or essay</p>
                    <input
                      type="file"
                      accept=".pdf,.doc,.docx"
                      onChange={(e) => {
                        const file = e.target.files?.[0]
                        if (file) handleFileUpload("personalStatement", file)
                      }}
                      className="hidden"
                      id="personalStatement"
                    />
                    <Label htmlFor="personalStatement" className="cursor-pointer">
                      <Button type="button" variant="outline" size="sm">
                        Choose File
                      </Button>
                    </Label>
                    {uploadedFiles.personalStatement && (
                      <p className="text-sm text-green-600 mt-2">✓ {uploadedFiles.personalStatement.name}</p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Essays Section */}
          {currentSection === 3 && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Essays</h3>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="whyThisUniversity">Why do you want to study at {university?.name}? *</Label>
                  <Textarea
                    id="whyThisUniversity"
                    rows={4}
                    placeholder="Explain your motivation for choosing this university..."
                    {...form.register("essays.whyThisUniversity")}
                    className={form.formState.errors.essays?.whyThisUniversity ? "border-red-500" : ""}
                  />
                  {form.formState.errors.essays?.whyThisUniversity && (
                    <p className="text-red-500 text-sm mt-1">
                      {form.formState.errors.essays.whyThisUniversity.message}
                    </p>
                  )}
                </div>

                <div>
                  <Label htmlFor="careerGoals">Career Goals *</Label>
                  <Textarea
                    id="careerGoals"
                    rows={4}
                    placeholder="Describe your career aspirations and how this program will help..."
                    {...form.register("essays.careerGoals")}
                    className={form.formState.errors.essays?.careerGoals ? "border-red-500" : ""}
                  />
                  {form.formState.errors.essays?.careerGoals && (
                    <p className="text-red-500 text-sm mt-1">{form.formState.errors.essays.careerGoals.message}</p>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Additional Information Section */}
          {currentSection === 4 && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Additional Information</h3>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="extracurriculars">Extracurricular Activities</Label>
                  <Textarea
                    id="extracurriculars"
                    rows={3}
                    placeholder="List your extracurricular activities, volunteer work, etc..."
                    {...form.register("additionalInfo.extracurriculars")}
                  />
                </div>

                <div>
                  <Label htmlFor="workExperience">Work Experience</Label>
                  <Textarea
                    id="workExperience"
                    rows={3}
                    placeholder="Describe any relevant work experience..."
                    {...form.register("additionalInfo.workExperience")}
                  />
                </div>

                <div>
                  <Label htmlFor="specialNeeds">Special Accommodations</Label>
                  <Textarea
                    id="specialNeeds"
                    rows={2}
                    placeholder="Any special accommodations or support needed..."
                    {...form.register("additionalInfo.specialNeeds")}
                  />
                </div>
              </div>
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="flex justify-between pt-6 border-t">
            <Button type="button" variant="outline" onClick={currentSection === 0 ? onBack : handlePrevious}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              {currentSection === 0 ? "Back to Program" : "Previous"}
            </Button>

            {currentSection < sections.length - 1 ? (
              <Button type="button" onClick={handleNext}>
                Next Section
              </Button>
            ) : (
              <Button type="submit">Continue to Payment</Button>
            )}
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
