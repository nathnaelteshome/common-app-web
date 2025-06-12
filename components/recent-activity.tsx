"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { FileText, CreditCard, Bell, CheckCircle } from "lucide-react"

export function RecentActivity() {
  const activities = [
    {
      id: "1",
      type: "application",
      title: "Application Submitted",
      description: "Addis Ababa University - Computer Science",
      timestamp: "2024-01-15T10:30:00Z",
      icon: FileText,
      color: "text-blue-600",
    },
    {
      id: "2",
      type: "payment",
      title: "Payment Processed",
      description: "$50 application fee paid",
      timestamp: "2024-01-14T15:45:00Z",
      icon: CreditCard,
      color: "text-green-600",
    },
    {
      id: "3",
      type: "notification",
      title: "Status Update",
      description: "Application under review",
      timestamp: "2024-01-13T09:20:00Z",
      icon: Bell,
      color: "text-yellow-600",
    },
    {
      id: "4",
      type: "acceptance",
      title: "Application Accepted",
      description: "Jimma University - Medicine",
      timestamp: "2024-01-12T14:15:00Z",
      icon: CheckCircle,
      color: "text-green-600",
    },
  ]

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
      </CardContent>
    </Card>
  )
}
