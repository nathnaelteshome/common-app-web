import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, AlertCircle, FileText, Calendar, DollarSign, Clock } from "lucide-react"
import type { University } from "@/data/universities-data"

interface AdmissionRequirementsProps {
  university: University
}

export function AdmissionRequirements({ university }: AdmissionRequirementsProps) {
  const generalRequirements = [
    "High School Diploma or Equivalent",
    "Official Transcripts",
    "English Proficiency Test (TOEFL/IELTS)",
    "Personal Statement/Essay",
    "Letters of Recommendation (2-3)",
    "Application Fee Payment",
    "Passport Copy (for international students)",
    "Medical Certificate",
  ]

  const applicationProcess = [
    {
      step: 1,
      title: "Submit Online Application",
      description: "Complete the online application form with personal and academic information",
      deadline: "Application Deadline",
    },
    {
      step: 2,
      title: "Upload Required Documents",
      description: "Submit all required documents including transcripts and certificates",
      deadline: "Same as application",
    },
    {
      step: 3,
      title: "Pay Application Fee",
      description: "Pay the non-refundable application fee to process your application",
      deadline: "Within 48 hours",
    },
    {
      step: 4,
      title: "Entrance Examination",
      description: "Take the university entrance examination (if required for your program)",
      deadline: "As scheduled",
    },
    {
      step: 5,
      title: "Interview (if required)",
      description: "Attend an interview session for specific programs",
      deadline: "As scheduled",
    },
    {
      step: 6,
      title: "Admission Decision",
      description: "Receive admission decision via email and student portal",
      deadline: "4-6 weeks after deadline",
    },
  ]

  const importantDates = [
    {
      event: "Application Opens",
      date: "January 15, 2024",
      status: "completed" as const,
    },
    {
      event: "Application Deadline",
      date: "June 30, 2024",
      status: "upcoming" as const,
    },
    {
      event: "Entrance Exam",
      date: "July 15-20, 2024",
      status: "upcoming" as const,
    },
    {
      event: "Admission Results",
      date: "August 15, 2024",
      status: "upcoming" as const,
    },
    {
      event: "Registration Period",
      date: "September 1-15, 2024",
      status: "upcoming" as const,
    },
  ]

  return (
    <div className="space-y-6">
      {/* General Requirements */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="w-5 h-5" />
            Admission Requirements
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3">
            {generalRequirements.map((requirement, index) => (
              <div key={index} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                <span className="text-gray-700">{requirement}</span>
              </div>
            ))}
          </div>

          <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="font-semibold text-blue-900 mb-1">Important Note</h4>
                <p className="text-blue-800 text-sm">
                  Requirements may vary by program. Please check specific program requirements on the program detail
                  pages. International students may have additional requirements including visa documentation.
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Application Process */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="w-5 h-5" />
            Application Process
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {applicationProcess.map((step, index) => (
              <div key={step.step} className="flex gap-4">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center text-sm font-semibold">
                    {step.step}
                  </div>
                  {index < applicationProcess.length - 1 && <div className="w-0.5 h-8 bg-gray-200 mx-auto mt-2"></div>}
                </div>
                <div className="flex-1 pb-6">
                  <h4 className="font-semibold text-gray-900 mb-1">{step.title}</h4>
                  <p className="text-gray-600 text-sm mb-2">{step.description}</p>
                  <Badge variant="outline" className="text-xs">
                    {step.deadline}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Important Dates */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="w-5 h-5" />
            Important Dates
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {importantDates.map((date, index) => (
              <div key={index} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                <div className="flex items-center gap-3">
                  <div
                    className={`w-3 h-3 rounded-full ${date.status === "completed" ? "bg-green-500" : "bg-blue-500"}`}
                  ></div>
                  <span className="font-medium text-gray-900">{date.event}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-gray-600">{date.date}</span>
                  <Badge variant={date.status === "completed" ? "secondary" : "default"} className="text-xs">
                    {date.status === "completed" ? "Completed" : "Upcoming"}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Application Fee Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <DollarSign className="w-5 h-5" />
            Application Fees
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="p-4 border border-gray-200 rounded-lg">
              <h4 className="font-semibold text-gray-900 mb-2">Domestic Students</h4>
              <div className="text-2xl font-bold text-primary mb-1">500 ETB</div>
              <p className="text-sm text-gray-600">Non-refundable application fee</p>
            </div>
            <div className="p-4 border border-gray-200 rounded-lg">
              <h4 className="font-semibold text-gray-900 mb-2">International Students</h4>
              <div className="text-2xl font-bold text-primary mb-1">$50 USD</div>
              <p className="text-sm text-gray-600">Non-refundable application fee</p>
            </div>
          </div>

          <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
            <p className="text-yellow-800 text-sm">
              <strong>Payment Methods:</strong> Bank transfer, credit card, or mobile money. Fee waivers may be
              available for students with financial need.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
