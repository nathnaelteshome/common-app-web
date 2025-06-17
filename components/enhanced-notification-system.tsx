"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Bell, X, Check, Mail, Smartphone, Monitor, Settings } from "lucide-react"
import { toast } from "sonner"

interface NotificationPreferences {
  email: boolean
  push: boolean
  sms: boolean
  inApp: boolean
  applicationUpdates: boolean
  paymentReminders: boolean
  deadlineAlerts: boolean
  promotionalEmails: boolean
}

interface Notification {
  id: string
  title: string
  message: string
  type: "application" | "payment" | "deadline" | "system" | "promotional"
  priority: "low" | "medium" | "high" | "urgent"
  isRead: boolean
  createdAt: string
  actionUrl?: string
  channels: ("email" | "push" | "sms" | "in_app")[]
}

export function EnhancedNotificationSystem() {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [preferences, setPreferences] = useState<NotificationPreferences>({
    email: true,
    push: true,
    sms: false,
    inApp: true,
    applicationUpdates: true,
    paymentReminders: true,
    deadlineAlerts: true,
    promotionalEmails: false,
  })
  const [showSettings, setShowSettings] = useState(false)

  // Simulate real-time notifications
  useEffect(() => {
    const interval = setInterval(() => {
      // Simulate receiving a new notification
      if (Math.random() > 0.8) {
        const newNotification: Notification = {
          id: `notif-${Date.now()}`,
          title: "Application Status Update",
          message: "Your application to Addis Ababa University has been reviewed",
          type: "application",
          priority: "high",
          isRead: false,
          createdAt: new Date().toISOString(),
          actionUrl: "/student/applications",
          channels: ["email", "push", "in_app"],
        }

        setNotifications((prev) => [newNotification, ...prev])

        // Show toast notification
        toast.success(newNotification.title, {
          description: newNotification.message,
          action: {
            label: "View",
            onClick: () => (window.location.href = newNotification.actionUrl || "#"),
          },
        })

        // Send email notification (simulated)
        if (preferences.email && preferences.applicationUpdates) {
          console.log("📧 Email sent:", newNotification.title)
        }

        // Send push notification (simulated)
        if (preferences.push && preferences.applicationUpdates) {
          if ("Notification" in window && Notification.permission === "granted") {
            new Notification(newNotification.title, {
              body: newNotification.message,
              icon: "/favicon.ico",
            })
          }
        }
      }
    }, 30000) // Check every 30 seconds

    return () => clearInterval(interval)
  }, [preferences])

  // Request notification permission
  useEffect(() => {
    if ("Notification" in window && Notification.permission === "default") {
      Notification.requestPermission()
    }
  }, [])

  const markAsRead = (id: string) => {
    setNotifications((prev) => prev.map((notif) => (notif.id === id ? { ...notif, isRead: true } : notif)))
  }

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((notif) => ({ ...notif, isRead: true })))
  }

  const deleteNotification = (id: string) => {
    setNotifications((prev) => prev.filter((notif) => notif.id !== id))
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "urgent":
        return "bg-red-100 text-red-800 border-red-200"
      case "high":
        return "bg-orange-100 text-orange-800 border-orange-200"
      case "medium":
        return "bg-blue-100 text-blue-800 border-blue-200"
      case "low":
        return "bg-gray-100 text-gray-800 border-gray-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "application":
        return "📄"
      case "payment":
        return "💳"
      case "deadline":
        return "⏰"
      case "system":
        return "⚙️"
      case "promotional":
        return "🎉"
      default:
        return "📢"
    }
  }

  const unreadCount = notifications.filter((n) => !n.isRead).length

  return (
    <div className="relative">
      {/* Notification Bell */}
      <Button variant="ghost" size="sm" className="relative" onClick={() => setShowSettings(!showSettings)}>
        <Bell className="w-5 h-5" />
        {unreadCount > 0 && (
          <Badge className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-red-500 text-white text-xs flex items-center justify-center">
            {unreadCount > 9 ? "9+" : unreadCount}
          </Badge>
        )}
      </Button>

      {/* Notification Dropdown */}
      {showSettings && (
        <div className="absolute right-0 top-full mt-2 w-96 bg-white rounded-lg shadow-lg border z-50">
          <div className="p-4 border-b">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold">Notifications</h3>
              <div className="flex gap-2">
                {unreadCount > 0 && (
                  <Button variant="ghost" size="sm" onClick={markAllAsRead}>
                    <Check className="w-4 h-4 mr-1" />
                    Mark all read
                  </Button>
                )}
                <Button variant="ghost" size="sm" onClick={() => setShowSettings(false)}>
                  <X className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>

          <div className="max-h-96 overflow-y-auto">
            {notifications.length === 0 ? (
              <div className="p-8 text-center text-gray-500">
                <Bell className="w-12 h-12 mx-auto mb-2 text-gray-300" />
                <p>No notifications yet</p>
              </div>
            ) : (
              notifications.slice(0, 10).map((notification) => (
                <div
                  key={notification.id}
                  className={`p-4 border-b hover:bg-gray-50 ${!notification.isRead ? "bg-blue-50" : ""}`}
                >
                  <div className="flex items-start gap-3">
                    <span className="text-lg">{getTypeIcon(notification.type)}</span>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between mb-1">
                        <h4 className="font-medium text-sm">{notification.title}</h4>
                        <Badge className={`text-xs ${getPriorityColor(notification.priority)}`}>
                          {notification.priority}
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-600 mb-2">{notification.message}</p>
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-gray-500">
                          {new Date(notification.createdAt).toLocaleString()}
                        </span>
                        <div className="flex gap-1">
                          {!notification.isRead && (
                            <Button variant="ghost" size="sm" onClick={() => markAsRead(notification.id)}>
                              <Check className="w-3 h-3" />
                            </Button>
                          )}
                          <Button variant="ghost" size="sm" onClick={() => deleteNotification(notification.id)}>
                            <X className="w-3 h-3" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Notification Preferences */}
          <div className="p-4 border-t bg-gray-50">
            <h4 className="font-medium mb-3 flex items-center gap-2">
              <Settings className="w-4 h-4" />
              Notification Preferences
            </h4>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Mail className="w-4 h-4 text-gray-500" />
                  <span className="text-sm">Email Notifications</span>
                </div>
                <input
                  type="checkbox"
                  checked={preferences.email}
                  onChange={(e) => setPreferences((prev) => ({ ...prev, email: e.target.checked }))}
                  className="rounded"
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Monitor className="w-4 h-4 text-gray-500" />
                  <span className="text-sm">Push Notifications</span>
                </div>
                <input
                  type="checkbox"
                  checked={preferences.push}
                  onChange={(e) => setPreferences((prev) => ({ ...prev, push: e.target.checked }))}
                  className="rounded"
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Smartphone className="w-4 h-4 text-gray-500" />
                  <span className="text-sm">SMS Notifications</span>
                </div>
                <input
                  type="checkbox"
                  checked={preferences.sms}
                  onChange={(e) => setPreferences((prev) => ({ ...prev, sms: e.target.checked }))}
                  className="rounded"
                />
              </div>
            </div>

            <Button className="w-full mt-3" size="sm">
              Save Preferences
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
