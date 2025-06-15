"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Calendar, Clock, AlertTriangle } from "lucide-react"
import Link from "next/link"

export function UpcomingDeadlines() {
  const deadlines = [
    {
      id: "1",
      university: "Addis Ababa University",
      program: "Computer Science",
      deadline: "2024-02-15",
      daysLeft: 5,
      status: "urgent",
    },
    {
      id: "2",
      university: "Jimma University",
      program: "Medicine",
      deadline: "2024-02-28",
      daysLeft: 18,
      status: "warning",
    },
    {
      id: "3",
      university: "Hawassa University",
      program: "Engineering",
      deadline: "2024-03-15",
      daysLeft: 33,
      status: "normal",
    },
  ]

  const getStatusColor = (status: string) => {
    switch (status) {
      case "urgent":
        return "bg-red-100 text-red-800"
      case "warning":
        return "bg-yellow-100 text-yellow-800"
      default:
        return "bg-blue-100 text-blue-800"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "urgent":
        return <AlertTriangle className="w-4 h-4 text-red-600" />
      case "warning":
        return <Clock className="w-4 h-4 text-yellow-600" />
      default:
        return <Calendar className="w-4 h-4 text-blue-600" />
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calendar className="w-5 h-5" />
          Upcoming Deadlines
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {deadlines.map((deadline) => (
            <div key={deadline.id} className="p-3 border rounded-lg hover:bg-gray-50 transition-colors">
              <div className="flex items-start justify-between mb-2">
                <div className="flex-1">
                  <h4 className="font-medium text-sm text-gray-900">{deadline.university}</h4>
                  <p className="text-xs text-gray-600">{deadline.program}</p>
                </div>
                {getStatusIcon(deadline.status)}
              </div>
              <div className="flex items-center justify-between">
                <div className="text-xs text-gray-500">{new Date(deadline.deadline).toLocaleDateString()}</div>
                <Badge className={`${getStatusColor(deadline.status)} border-0 text-xs`}>
                  {deadline.daysLeft} days left
                </Badge>
              </div>
            </div>
          ))}
        </div>
        <Button variant="outline" size="sm" className="w-full mt-4" asChild>
          <Link href="/student/applications">View All Applications</Link>
        </Button>
      </CardContent>
    </Card>
  )
}
