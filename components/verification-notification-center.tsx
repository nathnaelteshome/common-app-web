"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Bell,
  CheckCircle,
  XCircle,
  Clock,
  AlertTriangle,
  Eye,
  BookMarkedIcon as MarkAsUnread,
  Trash2,
} from "lucide-react"
import { mockVerificationNotifications } from "@/data/mock-verification-data"
import { toast } from "sonner"

interface VerificationNotificationCenterProps {
  userRole: "admin" | "university"
  userId: string
}

export function VerificationNotificationCenter({ userRole, userId }: VerificationNotificationCenterProps) {
  const [notifications, setNotifications] = useState(mockVerificationNotifications)
  const [filter, setFilter] = useState("all")

  const userNotifications = notifications.filter(
    (notif) => notif.recipientRole === userRole && (userRole === "admin" || notif.recipientId === userId),
  )

  const filteredNotifications = userNotifications.filter((notif) => {
    if (filter === "all") return true
    if (filter === "unread") return !notif.isRead
    if (filter === "read") return notif.isRead
    return notif.type === filter
  })

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "new_request":
        return <Bell className="w-5 h-5 text-blue-600" />
      case "approval":
        return <CheckCircle className="w-5 h-5 text-green-600" />
      case "rejection":
        return <XCircle className="w-5 h-5 text-red-600" />
      case "status_update":
        return <Clock className="w-5 h-5 text-yellow-600" />
      case "document_required":
        return <AlertTriangle className="w-5 h-5 text-orange-600" />
      default:
        return <Bell className="w-5 h-5 text-gray-600" />
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "bg-red-100 text-red-800 border-red-200"
      case "medium":
        return "bg-yellow-100 text-yellow-800 border-yellow-200"
      case "low":
        return "bg-green-100 text-green-800 border-green-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  const markAsRead = (notificationId: string) => {
    setNotifications((prev) => prev.map((notif) => (notif.id === notificationId ? { ...notif, isRead: true } : notif)))
    toast.success("Notification marked as read")
  }

  const markAsUnread = (notificationId: string) => {
    setNotifications((prev) => prev.map((notif) => (notif.id === notificationId ? { ...notif, isRead: false } : notif)))
    toast.success("Notification marked as unread")
  }

  const deleteNotification = (notificationId: string) => {
    setNotifications((prev) => prev.filter((notif) => notif.id !== notificationId))
    toast.success("Notification deleted")
  }

  const markAllAsRead = () => {
    setNotifications((prev) =>
      prev.map((notif) => (notif.recipientRole === userRole ? { ...notif, isRead: true } : notif)),
    )
    toast.success("All notifications marked as read")
  }

  const unreadCount = userNotifications.filter((notif) => !notif.isRead).length

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Bell className="w-5 h-5" />
            Verification Notifications
            {unreadCount > 0 && <Badge className="bg-red-500 text-white">{unreadCount}</Badge>}
          </CardTitle>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={markAllAsRead}>
              Mark All Read
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <Tabs value={filter} onValueChange={setFilter} className="space-y-4">
          <TabsList className="grid w-full grid-cols-6">
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="unread">Unread</TabsTrigger>
            <TabsTrigger value="new_request">New Requests</TabsTrigger>
            <TabsTrigger value="approval">Approvals</TabsTrigger>
            <TabsTrigger value="rejection">Rejections</TabsTrigger>
            <TabsTrigger value="status_update">Updates</TabsTrigger>
          </TabsList>

          <TabsContent value={filter} className="space-y-4">
            {filteredNotifications.length === 0 ? (
              <div className="text-center py-8">
                <Bell className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">No notifications</h3>
                <p className="text-gray-600">You're all caught up!</p>
              </div>
            ) : (
              <div className="space-y-3">
                {filteredNotifications.map((notification) => (
                  <div
                    key={notification.id}
                    className={`p-4 border rounded-lg transition-colors ${
                      notification.isRead ? "bg-white" : "bg-blue-50 border-blue-200"
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-3 flex-1">
                        {getNotificationIcon(notification.type)}
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h4 className={`font-medium ${!notification.isRead ? "text-blue-900" : "text-gray-900"}`}>
                              {notification.title}
                            </h4>
                            <Badge className={`${getPriorityColor(notification.priority)} text-xs`}>
                              {notification.priority}
                            </Badge>
                            {!notification.isRead && <Badge className="bg-blue-500 text-white text-xs">New</Badge>}
                          </div>
                          <p className="text-sm text-gray-600 mb-2">{notification.message}</p>
                          <p className="text-xs text-gray-400">{new Date(notification.createdAt).toLocaleString()}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-1 ml-4">
                        {notification.actionUrl && (
                          <Button variant="ghost" size="sm" asChild>
                            <a href={notification.actionUrl}>
                              <Eye className="w-4 h-4" />
                            </a>
                          </Button>
                        )}
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() =>
                            notification.isRead ? markAsUnread(notification.id) : markAsRead(notification.id)
                          }
                        >
                          {notification.isRead ? (
                            <MarkAsUnread className="w-4 h-4" />
                          ) : (
                            <CheckCircle className="w-4 h-4" />
                          )}
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => deleteNotification(notification.id)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}
