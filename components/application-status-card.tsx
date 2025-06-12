"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Clock, CheckCircle, XCircle, AlertCircle, Eye, Edit } from "lucide-react"
import Link from "next/link"

interface Application {
  id: string
  universityName: string
  programName: string
  status: string
  progress: number
  deadline: string
  applicationFee: number
  paymentStatus: string
  lastUpdated: string
}

interface ApplicationStatusCardProps {
  application: Application
}

export function ApplicationStatusCard({ application }: ApplicationStatusCardProps) {
  const getStatusIcon = (status: string) => {
    switch (status) {
      case "accepted":
        return <CheckCircle className="w-4 h-4 text-green-600" />
      case "rejected":
        return <XCircle className="w-4 h-4 text-red-600" />
      case "under-review":
        return <Clock className="w-4 h-4 text-blue-600" />
      case "waitlisted":
        return <AlertCircle className="w-4 h-4 text-yellow-600" />
      default:
        return <Clock className="w-4 h-4 text-gray-600" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "accepted":
        return "bg-green-100 text-green-800"
      case "rejected":
        return "bg-red-100 text-red-800"
      case "under-review":
        return "bg-blue-100 text-blue-800"
      case "waitlisted":
        return "bg-yellow-100 text-yellow-800"
      case "submitted":
        return "bg-purple-100 text-purple-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const isDeadlineNear = () => {
    const deadline = new Date(application.deadline)
    const now = new Date()
    const daysUntilDeadline = Math.ceil((deadline.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))
    return daysUntilDeadline <= 7 && daysUntilDeadline > 0
  }

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className="p-4">
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1">
            <h3 className="font-semibold text-gray-900 mb-1">{application.universityName}</h3>
            <p className="text-sm text-gray-600">{application.programName}</p>
          </div>
          <div className="flex items-center gap-2">
            {getStatusIcon(application.status)}
            <Badge className={`${getStatusColor(application.status)} border-0 text-xs`}>
              {application.status.replace("-", " ")}
            </Badge>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mb-3">
          <div className="flex items-center justify-between text-xs text-gray-600 mb-1">
            <span>Progress</span>
            <span>{application.progress}%</span>
          </div>
          <Progress value={application.progress} className="h-1.5" />
        </div>

        {/* Details */}
        <div className="grid grid-cols-2 gap-3 text-xs mb-3">
          <div>
            <span className="text-gray-500">Deadline:</span>
            <div className={`font-medium ${isDeadlineNear() ? "text-red-600" : "text-gray-900"}`}>
              {new Date(application.deadline).toLocaleDateString()}
              {isDeadlineNear() && <span className="ml-1 text-red-500">⚠️</span>}
            </div>
          </div>
          <div>
            <span className="text-gray-500">Fee:</span>
            <div className="font-medium text-gray-900">${application.applicationFee}</div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-2">
          <Button variant="outline" size="sm" className="flex-1" asChild>
            <Link href={`/student/applications/${application.id}`}>
              <Eye className="w-3 h-3 mr-1" />
              View
            </Link>
          </Button>
          {application.status === "draft" && (
            <Button variant="outline" size="sm" className="flex-1" asChild>
              <Link href={`/student/applications/${application.id}/edit`}>
                <Edit className="w-3 h-3 mr-1" />
                Edit
              </Link>
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
