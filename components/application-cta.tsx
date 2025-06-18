import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Calendar, Clock, Users, DollarSign, GraduationCap, ArrowRight, AlertTriangle } from "lucide-react"
import Link from "next/link"
import type University from "@/data/universities-data"

interface ApplicationCTAProps {
  university: University
}

export function ApplicationCTA({ university }: ApplicationCTAProps) {
  // Calculate days until deadline (mock calculation)
  const applicationDeadline = new Date("2024-06-30")
  const today = new Date()
  const daysUntilDeadline = Math.ceil((applicationDeadline.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))
  const isUrgent = daysUntilDeadline <= 30

  const quickStats = [
    {
      icon: Users,
      label: "Acceptance Rate",
      value: `${university.profile.acceptance_rate}%`,
      color: "text-green-600",
    },
    {
      icon: Clock,
      label: "Application Time",
      value: "30-45 min",
      color: "text-blue-600",
    },
    {
      icon: DollarSign,
      label: "Application Fee",
      value: "500 ETB",
      color: "text-purple-600",
    },
    {
      icon: GraduationCap,
      label: "Programs Available",
      value: `${university.programs.length}`,
      color: "text-orange-600",
    },
  ]

  return (
    <div className="space-y-4">
      {/* Main Application CTA */}
      <Card className="border-primary/20 bg-gradient-to-br from-primary/5 to-primary/10">
        <CardHeader className="pb-4">
          <CardTitle className="text-center">Apply to {university.name}</CardTitle>

          {/* Deadline Warning */}
          {isUrgent && (
            <div className="flex items-center gap-2 p-3 bg-orange-50 border border-orange-200 rounded-lg">
              <AlertTriangle className="w-4 h-4 text-orange-600 flex-shrink-0" />
              <div className="text-sm">
                <span className="font-semibold text-orange-900">Deadline Approaching!</span>
                <span className="text-orange-700 ml-1">Only {daysUntilDeadline} days left to apply</span>
              </div>
            </div>
          )}
        </CardHeader>

        <CardContent className="space-y-4">
          {/* Quick Stats */}
          <div className="grid grid-cols-2 gap-3">
            {quickStats.map((stat, index) => (
              <div key={index} className="text-center p-3 bg-white/50 rounded-lg border border-white/20">
                <stat.icon className={`w-4 h-4 mx-auto mb-1 ${stat.color}`} />
                <div className="text-sm font-semibold text-gray-900">{stat.value}</div>
                <div className="text-xs text-gray-600">{stat.label}</div>
              </div>
            ))}
          </div>

          {/* Application Deadline */}
          <div className="text-center p-3 bg-white/50 rounded-lg border border-white/20">
            <Calendar className="w-5 h-5 mx-auto mb-2 text-primary" />
            <div className="text-sm font-semibold text-gray-900">Application Deadline</div>
            <div className="text-lg font-bold text-primary">June 30, 2024</div>
            <div className="text-xs text-gray-600">{daysUntilDeadline} days remaining</div>
          </div>

          {/* CTA Buttons */}
          <div className="space-y-2">
            <Button asChild className="w-full bg-primary hover:bg-primary/90" size="lg">
              <Link href={`/apply?university=${university.id}`}>
                Start Application
                <ArrowRight className="w-4 h-4 ml-2" />
              </Link>
            </Button>

            <Button variant="outline" asChild className="w-full" size="sm">
              <Link href={`/universities/${university.profile.slug}/programs`}>View All Programs</Link>
            </Button>
          </div>

          {/* Benefits */}
          <div className="text-center text-xs text-gray-600">
            <p>✓ Free application review</p>
            <p>✓ Fast admission decision</p>
            <p>✓ Scholarship opportunities</p>
          </div>
        </CardContent>
      </Card>

      {/* Application Requirements Quick Check */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm">Application Checklist</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2 text-sm">
            {[
              "High School Certificate",
              "Official Transcripts",
              "English Proficiency",
              "Personal Statement",
              "Application Fee",
            ].map((requirement, index) => (
              <div key={index} className="flex items-center gap-2">
                <div className="w-4 h-4 border border-gray-300 rounded"></div>
                <span className="text-gray-700">{requirement}</span>
              </div>
            ))}
          </div>

          <Button variant="ghost" size="sm" className="w-full mt-3 text-xs" asChild>
            <Link href={`/universities/${university.profile.slug}/requirements`}>View Full Requirements</Link>
          </Button>
        </CardContent>
      </Card>

      {/* Contact Information */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm">Need Help?</CardTitle>
        </CardHeader>
        <CardContent className="text-sm space-y-2">
          <div>
            <div className="font-medium text-gray-900">Admissions Office</div>
            <div className="text-gray-600">admissions@{university.profile.slug}.edu.et</div>
          </div>
          <div>
            <div className="font-medium text-gray-900">Phone</div>
            <div className="text-gray-600">+251-11-{Math.floor(Math.random() * 900000 + 100000)}</div>
          </div>
          <Button variant="ghost" size="sm" className="w-full mt-2 text-xs" asChild>
            <Link href="/contact">Contact Admissions</Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
