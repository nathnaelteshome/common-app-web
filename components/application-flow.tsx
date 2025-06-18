"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { CheckCircle, University, FileText, CreditCard, Send } from "lucide-react"
import { UniversitySelection } from "@/components/university-selection"
import { ProgramSelection } from "@/components/program-selection"
import { ApplicationForm } from "@/components/application-form"
import { PaymentStep } from "@/components/payment-step"
import { ApplicationReview } from "@/components/application-review"
import type UniversityType from "@/data/universities-data"

interface ApplicationFlowProps {
  university: UniversityType | null
  programId: string | null
}

type ApplicationStep =
  | "university-selection"
  | "program-selection"
  | "application-form"
  | "payment"
  | "review"
  | "submitted"

interface ApplicationData {
  university: UniversityType | null
  programId: string | null
  formData: Record<string, any>
  paymentData: Record<string, any>
}

export function ApplicationFlow({ university: initialUniversity, programId: initialProgramId }: ApplicationFlowProps) {
  const [currentStep, setCurrentStep] = useState<ApplicationStep>("university-selection")
  const [applicationData, setApplicationData] = useState<ApplicationData>({
    university: initialUniversity,
    programId: initialProgramId,
    formData: {},
    paymentData: {},
  })

  const steps = [
    {
      id: "university-selection",
      title: "Select University",
      icon: University,
      description: "Choose your preferred university",
    },
    {
      id: "program-selection",
      title: "Select Program",
      icon: FileText,
      description: "Choose your academic program",
    },
    {
      id: "application-form",
      title: "Application Form",
      icon: FileText,
      description: "Complete your application",
    },
    {
      id: "payment",
      title: "Payment",
      icon: CreditCard,
      description: "Pay application fee",
    },
    {
      id: "review",
      title: "Review & Submit",
      icon: Send,
      description: "Review and submit application",
    },
  ]

  // Auto-advance if university and program are pre-selected
  useEffect(() => {
    if (initialUniversity && initialProgramId) {
      setCurrentStep("application-form")
    } else if (initialUniversity) {
      setCurrentStep("program-selection")
    }
  }, [initialUniversity, initialProgramId])

  const getCurrentStepIndex = () => {
    return steps.findIndex((step) => step.id === currentStep)
  }

  const getStepStatus = (stepId: string) => {
    const stepIndex = steps.findIndex((step) => step.id === stepId)
    const currentIndex = getCurrentStepIndex()

    if (stepIndex < currentIndex) return "completed"
    if (stepIndex === currentIndex) return "current"
    return "upcoming"
  }

  const handleStepComplete = (stepId: ApplicationStep, data?: any) => {
    // Update application data
    if (data) {
      setApplicationData((prev) => ({
        ...prev,
        ...data,
      }))
    }

    // Move to next step
    const currentIndex = getCurrentStepIndex()
    if (currentIndex < steps.length - 1) {
      const nextStep = steps[currentIndex + 1]
      setCurrentStep(nextStep.id as ApplicationStep)
    }
  }

  const progress = ((getCurrentStepIndex() + 1) / steps.length) * 100

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">University Application</h1>
          <p className="text-gray-600">Complete your application in a few simple steps</p>
        </div>

        {/* Progress Bar */}
        <Card className="mb-8">
          <CardContent className="p-6">
            <div className="mb-4">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium text-gray-700">
                  Step {getCurrentStepIndex() + 1} of {steps.length}
                </span>
                <span className="text-sm text-gray-500">{Math.round(progress)}% Complete</span>
              </div>
              <Progress value={progress} className="h-2" />
            </div>

            {/* Step Indicators */}
            <div className="flex justify-between">
              {steps.map((step, index) => {
                const status = getStepStatus(step.id)
                const Icon = step.icon

                return (
                  <div key={step.id} className="flex flex-col items-center">
                    <div
                      className={`
                      w-10 h-10 rounded-full flex items-center justify-center mb-2
                      ${
                        status === "completed"
                          ? "bg-green-600 text-white"
                          : status === "current"
                            ? "bg-primary text-white"
                            : "bg-gray-200 text-gray-400"
                      }
                    `}
                    >
                      {status === "completed" ? <CheckCircle className="w-5 h-5" /> : <Icon className="w-5 h-5" />}
                    </div>
                    <div className="text-center">
                      <div
                        className={`text-xs font-medium ${
                          status === "current"
                            ? "text-primary"
                            : status === "completed"
                              ? "text-green-600"
                              : "text-gray-500"
                        }`}
                      >
                        {step.title}
                      </div>
                      <div className="text-xs text-gray-400 hidden sm:block">{step.description}</div>
                    </div>
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>

        {/* Current Step Content */}
        <div className="mb-8">
          {currentStep === "university-selection" && (
            <UniversitySelection
              selectedUniversity={applicationData.university}
              onComplete={(university) => handleStepComplete("program-selection", { university })}
            />
          )}

          {currentStep === "program-selection" && applicationData.university && (
            <ProgramSelection
              university={applicationData.university}
              selectedProgramId={applicationData.programId}
              onComplete={(programId) => handleStepComplete("application-form", { programId })}
              onBack={() => setCurrentStep("university-selection")}
            />
          )}

          {currentStep === "program-selection" && !applicationData.university && (
            <Card className="text-center">
              <CardContent className="p-8">
                <p className="text-gray-600 mb-4">Please select a university first.</p>
                <Button onClick={() => setCurrentStep("university-selection")}>Select University</Button>
              </CardContent>
            </Card>
          )}

          {currentStep === "application-form" && applicationData.university && applicationData.programId && (
            <ApplicationForm
              university={applicationData.university}
              programId={applicationData.programId}
              initialData={applicationData.formData}
              onComplete={(formData) => handleStepComplete("payment", { formData })}
              onBack={() => setCurrentStep("program-selection")}
            />
          )}

          {currentStep === "application-form" && (!applicationData.university || !applicationData.programId) && (
            <Card className="text-center">
              <CardContent className="p-8">
                <p className="text-gray-600 mb-4">Missing university or program information.</p>
                <Button onClick={() => setCurrentStep("university-selection")}>Start Over</Button>
              </CardContent>
            </Card>
          )}

          {currentStep === "payment" && (
            <PaymentStep
              university={applicationData.university!}
              programId={applicationData.programId!}
              onComplete={(paymentData) => handleStepComplete("review", { paymentData })}
              onBack={() => setCurrentStep("application-form")}
            />
          )}

          {currentStep === "review" && (
            <ApplicationReview
              applicationData={applicationData}
              onSubmit={() => setCurrentStep("submitted")}
              onBack={() => setCurrentStep("payment")}
            />
          )}

          {currentStep === "submitted" && (
            <Card className="text-center">
              <CardContent className="p-8">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle className="w-8 h-8 text-green-600" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Application Submitted Successfully!</h2>
                <p className="text-gray-600 mb-6">
                  Your application has been submitted to {applicationData.university?.name}. You will receive a
                  confirmation email shortly.
                </p>
                <div className="flex gap-4 justify-center">
                  <Button asChild>
                    <a href="/student/applications">View My Applications</a>
                  </Button>
                  <Button variant="outline" asChild>
                    <a href="/colleges">Apply to More Universities</a>
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}
