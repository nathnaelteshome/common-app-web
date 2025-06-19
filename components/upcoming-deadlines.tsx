"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Calendar, Clock, AlertTriangle, Loader2 } from "lucide-react"
import Link from "next/link"
import { applicationApi, type Application } from "@/lib/api/applications"

interface DeadlineInfo {
  id: string
  university: string
  program: string
  deadline: string
  daysLeft: number
  status: "urgent" | "warning" | "normal"
  applicationId: string
}

export function UpcomingDeadlines() {
  const [deadlines, setDeadlines] = useState<DeadlineInfo[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchUpcomingDeadlines = async () => {
      try {
        setLoading(true)
        const response = await applicationApi.listApplications({
          status: "draft", // Only draft applications have upcoming deadlines
          limit: 10,
          sortBy: "deadline",
          sortOrder: "asc"
        })

        if (response.success && response.data?.applications) {
          const now = new Date()
          const upcomingDeadlines: DeadlineInfo[] = response.data.applications
            .map((app: Application) => {
              // For now, we'll use a mock deadline since the API structure doesn't include deadline
              // In a real scenario, this would come from the program or application data
              const mockDeadline = new Date()
              mockDeadline.setDate(mockDeadline.getDate() + Math.floor(Math.random() * 60) + 1) // Random 1-60 days
              
              const deadline = mockDeadline.toISOString().split('T')[0]
              const deadlineDate = new Date(deadline)
              const daysLeft = Math.ceil((deadlineDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))
              
              let status: "urgent" | "warning" | "normal" = "normal"
              if (daysLeft <= 7) status = "urgent"
              else if (daysLeft <= 14) status = "warning"
              
              return {
                id: app.id,
                university: app.program.university.name,
                program: app.program.name,
                deadline,
                daysLeft,
                status,
                applicationId: app.id
              }
            })
            .filter(deadline => deadline.daysLeft > 0) // Only future deadlines
            .slice(0, 5) // Limit to 5 most urgent

          setDeadlines(upcomingDeadlines)
        }
      } catch (error) {
        console.error("Error fetching upcoming deadlines:", error)
        // Fallback to empty array on error
        setDeadlines([])
      } finally {
        setLoading(false)
      }
    }

    fetchUpcomingDeadlines()
  }, [])

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
        {loading ? (
          <div className="flex items-center justify-center h-20">
            <Loader2 className="w-6 h-6 animate-spin text-blue-600" />
            <span className="ml-2 text-sm text-gray-600">Loading deadlines...</span>
          </div>
        ) : deadlines.length === 0 ? (
          <div className="text-center py-6">
            <Calendar className="w-8 h-8 text-gray-400 mx-auto mb-2" />
            <p className="text-sm text-gray-600">No upcoming deadlines</p>
            <p className="text-xs text-gray-500 mt-1">All your applications are up to date!</p>
          </div>
        ) : (
          <>
            <div className="space-y-3">
              {deadlines.map((deadline) => (
                <Link 
                  key={deadline.id} 
                  href={`/student/applications/${deadline.applicationId}`}
                  className="block"
                >
                  <div className="p-3 border rounded-lg hover:bg-gray-50 transition-colors cursor-pointer">
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
                        {deadline.daysLeft} day{deadline.daysLeft !== 1 ? 's' : ''} left
                      </Badge>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
            <Button variant="outline" size="sm" className="w-full mt-4" asChild>
              <Link href="/student/applications">View All Applications</Link>
            </Button>
          </>
        )}
      </CardContent>
    </Card>
  )
}
