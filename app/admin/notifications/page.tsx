"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Bell, Check, Trash2, Settings, FileText, CreditCard } from "lucide-react"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"

export default function AdminNotificationsPage() {
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      title: "New Application Received",
      message: "John Smith has submitted an application for Computer Science program",
      type: "application",
      time: "2 hours ago",
      isRead: false,
      icon: FileText,
    },
    {
      id: 2,
      title: "Payment Received",
      message: "Application fee payment received from Sarah Johnson",
      type: "payment",
      time: "4 hours ago",
      isRead: false,
      icon: CreditCard,
    },
    {
      id: 3,
      title: "System Update",
      message: "New features have been added to the admin panel",
      type: "system",
      time: "1 day ago",
      isRead: true,
      icon: Settings,
    },
    {
      id: 4,
      title: "Application Deadline Reminder",
      message: "Engineering program application deadline is in 3 days",
      type: "reminder",
      time: "2 days ago",
      isRead: true,
      icon: Bell,
    },
  ])

  const markAsRead = (id: number) => {
    setNotifications((prev) => prev.map((notif) => (notif.id === id ? { ...notif, isRead: true } : notif)))
  }

  const deleteNotification = (id: number) => {
    setNotifications((prev) => prev.filter((notif) => notif.id !== id))
  }

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((notif) => ({ ...notif, isRead: true })))
  }

  const unreadCount = notifications.filter((n) => !n.isRead).length

  const getTypeColor = (type: string) => {
    switch (type) {
      case "application":
        return "bg-blue-100 text-blue-800"
      case "payment":
        return "bg-green-100 text-green-800"
      case "system":
        return "bg-purple-100 text-purple-800"
      case "reminder":
        return "bg-orange-100 text-orange-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Notifications</h1>
              <p className="text-gray-600 mt-1">
                Stay updated with important university activities
                {unreadCount > 0 && <Badge className="ml-2 bg-red-500 text-white">{unreadCount} unread</Badge>}
              </p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" onClick={markAllAsRead} disabled={unreadCount === 0}>
                <Check className="w-4 h-4 mr-2" />
                Mark All Read
              </Button>
              <Button>
                <Settings className="w-4 h-4 mr-2" />
                Settings
              </Button>
            </div>
          </div>

          <Tabs defaultValue="all" className="w-full">
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="application">Applications</TabsTrigger>
              <TabsTrigger value="payment">Payments</TabsTrigger>
              <TabsTrigger value="system">System</TabsTrigger>
              <TabsTrigger value="reminder">Reminders</TabsTrigger>
            </TabsList>

            <TabsContent value="all" className="space-y-4">
              {notifications.map((notification) => {
                const IconComponent = notification.icon
                return (
                  <Card
                    key={notification.id}
                    className={`transition-all ${!notification.isRead ? "border-blue-200 bg-blue-50/30" : ""}`}
                  >
                    <CardContent className="p-6">
                      <div className="flex items-start gap-4">
                        <div className={`p-2 rounded-full ${getTypeColor(notification.type)}`}>
                          <IconComponent className="w-5 h-5" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-4">
                            <div>
                              <h3 className={`font-medium ${!notification.isRead ? "text-gray-900" : "text-gray-700"}`}>
                                {notification.title}
                              </h3>
                              <p className="text-sm text-gray-600 mt-1">{notification.message}</p>
                              <div className="flex items-center gap-2 mt-2">
                                <Badge variant="outline" className={getTypeColor(notification.type)}>
                                  {notification.type}
                                </Badge>
                                <span className="text-xs text-gray-500">{notification.time}</span>
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              {!notification.isRead && (
                                <Button variant="ghost" size="sm" onClick={() => markAsRead(notification.id)}>
                                  <Check className="w-4 h-4" />
                                </Button>
                              )}
                              <Button variant="ghost" size="sm" onClick={() => deleteNotification(notification.id)}>
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )
              })}
            </TabsContent>

            {/* Other tab contents would filter notifications by type */}
            <TabsContent value="application">
              <div className="space-y-4">
                {notifications
                  .filter((n) => n.type === "application")
                  .map((notification) => {
                    const IconComponent = notification.icon
                    return (
                      <Card
                        key={notification.id}
                        className={`transition-all ${!notification.isRead ? "border-blue-200 bg-blue-50/30" : ""}`}
                      >
                        <CardContent className="p-6">
                          <div className="flex items-start gap-4">
                            <div className={`p-2 rounded-full ${getTypeColor(notification.type)}`}>
                              <IconComponent className="w-5 h-5" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-start justify-between gap-4">
                                <div>
                                  <h3
                                    className={`font-medium ${!notification.isRead ? "text-gray-900" : "text-gray-700"}`}
                                  >
                                    {notification.title}
                                  </h3>
                                  <p className="text-sm text-gray-600 mt-1">{notification.message}</p>
                                  <div className="flex items-center gap-2 mt-2">
                                    <Badge variant="outline" className={getTypeColor(notification.type)}>
                                      {notification.type}
                                    </Badge>
                                    <span className="text-xs text-gray-500">{notification.time}</span>
                                  </div>
                                </div>
                                <div className="flex items-center gap-2">
                                  {!notification.isRead && (
                                    <Button variant="ghost" size="sm" onClick={() => markAsRead(notification.id)}>
                                      <Check className="w-4 h-4" />
                                    </Button>
                                  )}
                                  <Button variant="ghost" size="sm" onClick={() => deleteNotification(notification.id)}>
                                    <Trash2 className="w-4 h-4" />
                                  </Button>
                                </div>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    )
                  })}
              </div>
            </TabsContent>

            {/* Similar structure for other tabs */}
          </Tabs>
        </div>
      </div>

      <Footer />
    </div>
  )
}
