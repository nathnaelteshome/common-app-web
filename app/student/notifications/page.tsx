"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useAuthStore } from "@/store/auth-store"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Bell, FileText, CreditCard, Clock, Megaphone, Settings, Check, Trash2, ExternalLink } from "lucide-react"
import Link from "next/link"
import { mockNotifications } from "@/data/mock-data"

export default function StudentNotifications() {
  const { user, isAuthenticated } = useAuthStore()
  const router = useRouter()
  const [notifications, setNotifications] = useState(mockNotifications)
  const [filter, setFilter] = useState("all")

  useEffect(() => {
    if (!isAuthenticated || user?.role !== "student") {
      router.push("/auth/sign-in")
    }
  }, [isAuthenticated, user, router])

  if (!isAuthenticated || user?.role !== "student") {
    return null
  }

  const markAsRead = (notificationId: string) => {
    setNotifications((prev) => prev.map((notif) => (notif.id === notificationId ? { ...notif, isRead: true } : notif)))
  }

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((notif) => ({ ...notif, isRead: true })))
  }

  const deleteNotification = (notificationId: string) => {
    setNotifications((prev) => prev.filter((notif) => notif.id !== notificationId))
  }

  const filteredNotifications = notifications.filter((notif) => {
    if (filter === "all") return true
    if (filter === "unread") return !notif.isRead
    return notif.type === filter
  })

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "application":
        return <FileText className="w-5 h-5 text-blue-600" />
      case "payment":
        return <CreditCard className="w-5 h-5 text-green-600" />
      case "deadline":
        return <Clock className="w-5 h-5 text-orange-600" />
      case "announcement":
        return <Megaphone className="w-5 h-5 text-purple-600" />
      default:
        return <Bell className="w-5 h-5 text-gray-600" />
    }
  }

  const getNotificationColor = (type: string) => {
    switch (type) {
      case "application":
        return "bg-blue-50 border-blue-200"
      case "payment":
        return "bg-green-50 border-green-200"
      case "deadline":
        return "bg-orange-50 border-orange-200"
      case "announcement":
        return "bg-purple-50 border-purple-200"
      default:
        return "bg-gray-50 border-gray-200"
    }
  }

  const unreadCount = notifications.filter((n) => !n.isRead).length

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <div className="container mx-auto px-4 py-8">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Notifications</h1>
            <p className="text-gray-600">
              Stay updated with your applications and important announcements
              {unreadCount > 0 && <Badge className="ml-2 bg-red-500 text-white">{unreadCount} unread</Badge>}
            </p>
          </div>
          <div className="flex gap-2 mt-4 md:mt-0">
            {unreadCount > 0 && (
              <Button variant="outline" onClick={markAllAsRead}>
                <Check className="w-4 h-4 mr-2" />
                Mark All Read
              </Button>
            )}
            <Button variant="outline" asChild>
              <Link href="/student/settings/notifications">
                <Settings className="w-4 h-4 mr-2" />
                Settings
              </Link>
            </Button>
          </div>
        </div>

        {/* Filter Tabs */}
        <Tabs value={filter} onValueChange={setFilter} className="space-y-6">
          <TabsList className="grid w-full grid-cols-6">
            <TabsTrigger value="all">All ({notifications.length})</TabsTrigger>
            <TabsTrigger value="unread">Unread ({notifications.filter((n) => !n.isRead).length})</TabsTrigger>
            <TabsTrigger value="application">
              Applications ({notifications.filter((n) => n.type === "application").length})
            </TabsTrigger>
            <TabsTrigger value="payment">
              Payments ({notifications.filter((n) => n.type === "payment").length})
            </TabsTrigger>
            <TabsTrigger value="deadline">
              Deadlines ({notifications.filter((n) => n.type === "deadline").length})
            </TabsTrigger>
            <TabsTrigger value="announcement">
              Announcements ({notifications.filter((n) => n.type === "announcement").length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value={filter}>
            <div className="space-y-4">
              {filteredNotifications.length === 0 ? (
                <Card className="text-center py-12">
                  <CardContent>
                    <Bell className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">No notifications</h3>
                    <p className="text-gray-600">
                      {filter === "all"
                        ? "You're all caught up! No notifications to show."
                        : `No ${filter} notifications found.`}
                    </p>
                  </CardContent>
                </Card>
              ) : (
                filteredNotifications.map((notification) => (
                  <Card
                    key={notification.id}
                    className={`transition-all hover:shadow-md ${
                      !notification.isRead ? "ring-2 ring-blue-200 bg-blue-50/30" : ""
                    }`}
                  >
                    <CardContent className="p-6">
                      <div className="flex items-start gap-4">
                        <div className={`p-2 rounded-lg ${getNotificationColor(notification.type)}`}>
                          {getNotificationIcon(notification.type)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between mb-2">
                            <h3 className="font-semibold text-gray-900">{notification.title}</h3>
                            <div className="flex items-center gap-2 ml-4">
                              {!notification.isRead && <Badge className="bg-blue-600 text-white text-xs">New</Badge>}
                              <span className="text-xs text-gray-500 whitespace-nowrap">
                                {new Date(notification.createdAt).toLocaleDateString()}
                              </span>
                            </div>
                          </div>
                          <p className="text-gray-600 mb-3">{notification.message}</p>
                          <div className="flex items-center gap-2">
                            {notification.actionUrl && (
                              <Button variant="outline" size="sm" asChild>
                                <Link href={notification.actionUrl}>
                                  <ExternalLink className="w-3 h-3 mr-1" />
                                  View Details
                                </Link>
                              </Button>
                            )}
                            {!notification.isRead && (
                              <Button variant="ghost" size="sm" onClick={() => markAsRead(notification.id)}>
                                <Check className="w-3 h-3 mr-1" />
                                Mark Read
                              </Button>
                            )}
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => deleteNotification(notification.id)}
                              className="text-red-600 hover:text-red-700 hover:bg-red-50"
                            >
                              <Trash2 className="w-3 h-3 mr-1" />
                              Delete
                            </Button>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>

      <Footer />
    </div>
  )
}
