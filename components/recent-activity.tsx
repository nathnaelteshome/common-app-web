"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { FileText, CreditCard, Bell, CheckCircle, Loader2, Clock, XCircle } from "lucide-react"
import { applicationApi, type Application } from "@/lib/api/applications"

interface ActivityItem {
  id: string
  type: string
  title: string
  description: string
  timestamp: string
  icon: React.ComponentType<{ className?: string }>
  color: string
}

export function RecentActivity() {
  const [activities, setActivities] = useState<ActivityItem[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchRecentActivity = async () => {
      try {
        setLoading(true)
        const response = await applicationApi.listApplications({
          limit: 10,
          sortBy: "submitted_at",
          sortOrder: "desc"
        })

        if (response.success && response.data?.applications) {
          const recentActivities: ActivityItem[] = response.data.applications
            .map((app: Application) => {
              const getActivityForStatus = (status: string, app: Application) => {
                switch (status) {
                  case "submitted":
                    return {
                      id: `${app.id}-submitted`,
                      type: "application",
                      title: "Application Submitted",
                      description: `${app.program.university.name} - ${app.program.name}`,
                      timestamp: app.submittedAt,
                      icon: FileText,
                      color: "text-blue-600"
                    }
                  case "accepted":
                    return {
                      id: `${app.id}-accepted`,
                      type: "acceptance",
                      title: "Application Accepted",
                      description: `${app.program.university.name} - ${app.program.name}`,
                      timestamp: app.submittedAt, // Use submitted time as we don't have review time
                      icon: CheckCircle,
                      color: "text-green-600"
                    }
                  case "rejected":
                    return {
                      id: `${app.id}-rejected`,
                      type: "rejection",
                      title: "Application Rejected",
                      description: `${app.program.university.name} - ${app.program.name}`,
                      timestamp: app.submittedAt,
                      icon: XCircle,
                      color: "text-red-600"
                    }
                  case "under_review":
                    return {
                      id: `${app.id}-review`,
                      type: "review",
                      title: "Application Under Review",
                      description: `${app.program.university.name} - ${app.program.name}`,
                      timestamp: app.submittedAt,
                      icon: Clock,
                      color: "text-yellow-600"
                    }
                  case "waitlisted":
                    return {
                      id: `${app.id}-waitlisted`,
                      type: "waitlist",
                      title: "Application Waitlisted",
                      description: `${app.program.university.name} - ${app.program.name}`,
                      timestamp: app.submittedAt,
                      icon: Bell,
                      color: "text-orange-600"
                    }
                  default:
                    return null
                }
              }

              return getActivityForStatus(app.status, app)
            })
            .filter((activity): activity is ActivityItem => activity !== null)
            .slice(0, 4) // Show only 4 most recent activities

          // Add payment activities if applications have payment info
          const paymentActivities: ActivityItem[] = response.data.applications
            .filter(app => app.hasPayment)
            .slice(0, 2)
            .map(app => ({
              id: `${app.id}-payment`,
              type: "payment",
              title: "Payment Processed",
              description: `Application fee paid for ${app.program.university.name}`,
              timestamp: app.submittedAt, // Use submitted time as proxy for payment time
              icon: CreditCard,
              color: "text-green-600"
            }))

          // Combine and sort all activities by timestamp
          const allActivities = [...recentActivities, ...paymentActivities]
            .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
            .slice(0, 4)

          setActivities(allActivities)
        }
      } catch (error) {
        console.error("Error fetching recent activity:", error)
        setActivities([])
      } finally {
        setLoading(false)
      }
    }

    fetchRecentActivity()
  }, [])

  const getTimeAgo = (timestamp: string) => {
    const now = new Date()
    const time = new Date(timestamp)
    const diffInHours = Math.floor((now.getTime() - time.getTime()) / (1000 * 60 * 60))

    if (diffInHours < 1) return "Just now"
    if (diffInHours < 24) return `${diffInHours}h ago`
    const diffInDays = Math.floor(diffInHours / 24)
    return `${diffInDays}d ago`
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Activity</CardTitle>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="flex items-center justify-center h-20">
            <Loader2 className="w-6 h-6 animate-spin text-blue-600" />
            <span className="ml-2 text-sm text-gray-600">Loading activity...</span>
          </div>
        ) : activities.length === 0 ? (
          <div className="text-center py-6">
            <FileText className="w-8 h-8 text-gray-400 mx-auto mb-2" />
            <p className="text-sm text-gray-600">No recent activity</p>
            <p className="text-xs text-gray-500 mt-1">Start by creating your first application!</p>
          </div>
        ) : (
          <div className="space-y-3">
            {activities.map((activity) => {
              const Icon = activity.icon
              return (
                <div key={activity.id} className="flex items-start gap-3">
                  <div className={`w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center flex-shrink-0`}>
                    <Icon className={`w-4 h-4 ${activity.color}`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900">{activity.title}</p>
                    <p className="text-xs text-gray-600 truncate">{activity.description}</p>
                    <p className="text-xs text-gray-400 mt-1">{getTimeAgo(activity.timestamp)}</p>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
