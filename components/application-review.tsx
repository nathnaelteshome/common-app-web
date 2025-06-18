"use client"

import { Label } from "@/components/ui/label"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Edit, FileText, Download, Send, CheckCircle } from "lucide-react"
import type University from "@/data/universities-data"

interface ApplicationData {
  university: University | null
  programId: string | null
  formData: any
  paymentData: any
}

interface ApplicationReviewProps {
  applicationData: ApplicationData
  onSubmit: () => void
  onBack: () => void
}

export function ApplicationReview({ applicationData, onSubmit, onBack }: ApplicationReviewProps) {
  const [agreedToTerms, setAgreedToTerms] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const { university, programId, formData, paymentData } = applicationData
  const program = university?.programs.find((p) => p.id === programId)

  const handleSubmit = async () => {
    if (!agreedToTerms) return

    setIsSubmitting(true)

    try {
      // Simulate submission
      await new Promise((resolve) => setTimeout(resolve, 2000))
      onSubmit()
    } catch (error) {
      console.error("Submission failed:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-4 mb-4">
          <Button variant="outline" size="sm" onClick={onBack}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
          <div>
            <CardTitle>Review & Submit Application</CardTitle>
            <p className="text-sm text-gray-600 mt-1">Please review your application before submitting</p>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Application Summary */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <CheckCircle className="w-5 h-5 text-blue-600 mt-0.5" />
            <div>
              <h3 className="font-semibold text-blue-900">Application Summary</h3>
              <p className="text-sm text-blue-700 mt-1">
                {program?.name} at {university?.name}
              </p>
              <div className="flex gap-2 mt-2">
                <Badge variant="outline">{program?.degree}</Badge>
                <Badge variant="outline">{program?.duration}</Badge>
              </div>
            </div>
          </div>
        </div>

        {/* Personal Information */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-lg font-semibold">Personal Information</h3>
            <Button variant="ghost" size="sm">
              <Edit className="w-4 h-4 mr-2" />
              Edit
            </Button>
          </div>
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <span className="font-medium">Name:</span> {formData?.personalInfo?.firstName}{" "}
                {formData?.personalInfo?.lastName}
              </div>
              <div>
                <span className="font-medium">Email:</span> {formData?.personalInfo?.email}
              </div>
              <div>
                <span className="font-medium">Phone:</span> {formData?.personalInfo?.phone}
              </div>
              <div>
                <span className="font-medium">Date of Birth:</span> {formData?.personalInfo?.dateOfBirth}
              </div>
              <div>
                <span className="font-medium">Nationality:</span> {formData?.personalInfo?.nationality}
              </div>
            </div>
          </div>
        </div>

        {/* Academic History */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-lg font-semibold">Academic History</h3>
            <Button variant="ghost" size="sm">
              <Edit className="w-4 h-4 mr-2" />
              Edit
            </Button>
          </div>
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <span className="font-medium">High School:</span> {formData?.academicHistory?.highSchoolName}
              </div>
              <div>
                <span className="font-medium">GPA:</span> {formData?.academicHistory?.highSchoolGPA}
              </div>
              <div>
                <span className="font-medium">Graduation Year:</span> {formData?.academicHistory?.graduationYear}
              </div>
            </div>
          </div>
        </div>

        {/* Documents */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-lg font-semibold">Documents</h3>
            <Button variant="ghost" size="sm">
              <Edit className="w-4 h-4 mr-2" />
              Edit
            </Button>
          </div>
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <FileText className="w-4 h-4" />
                  <span className="text-sm">Academic Transcript</span>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="text-xs">
                    Uploaded
                  </Badge>
                  <Button variant="ghost" size="sm">
                    <Download className="w-4 h-4" />
                  </Button>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <FileText className="w-4 h-4" />
                  <span className="text-sm">Personal Statement</span>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="text-xs">
                    Uploaded
                  </Badge>
                  <Button variant="ghost" size="sm">
                    <Download className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Payment Information */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-lg font-semibold">Payment Information</h3>
            <Button variant="ghost" size="sm">
              <Edit className="w-4 h-4 mr-2" />
              Edit
            </Button>
          </div>
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <span className="font-medium">Payment Method:</span> {paymentData?.paymentMethod}
              </div>
              <div>
                <span className="font-medium">Amount:</span> ${paymentData?.amount}
              </div>
              <div>
                <span className="font-medium">Transaction ID:</span> {paymentData?.transactionId}
              </div>
              <div>
                <span className="font-medium">Status:</span>
                <Badge variant="outline" className="ml-2 text-xs">
                  {paymentData?.status}
                </Badge>
              </div>
            </div>
          </div>
        </div>

        <Separator />

        {/* Terms and Conditions */}
        <div className="space-y-4">
          <div className="flex items-start space-x-3">
            <Checkbox id="terms" checked={agreedToTerms} onCheckedChange={setAgreedToTerms} />
            <div className="text-sm">
              <Label htmlFor="terms" className="cursor-pointer">
                I agree to the{" "}
                <a href="#" className="text-primary hover:underline">
                  Terms and Conditions
                </a>{" "}
                and{" "}
                <a href="#" className="text-primary hover:underline">
                  Privacy Policy
                </a>
              </Label>
              <p className="text-gray-600 mt-1">
                By submitting this application, I confirm that all information provided is accurate and complete.
              </p>
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <div className="flex justify-between pt-6 border-t">
          <Button variant="outline" onClick={onBack}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Payment
          </Button>

          <Button
            onClick={handleSubmit}
            disabled={!agreedToTerms || isSubmitting}
            className="bg-green-600 hover:bg-green-700"
          >
            {isSubmitting ? (
              "Submitting..."
            ) : (
              <>
                <Send className="w-4 h-4 mr-2" />
                Submit Application
              </>
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
