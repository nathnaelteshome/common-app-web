"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Switch } from "@/components/ui/switch"
import { Plus, Edit, Trash2, Send, AlertTriangle } from "lucide-react"
import { toast } from "sonner"
import { mockReminders } from "@/data/mock-reminders"

interface Reminder {
  id: string
  title: string
  description: string
  type: "deadline" | "review" | "follow_up" | "payment" | "document"
  triggerType: "date" | "days_before" | "days_after" | "condition"
  triggerValue: string | number
  targetAudience: "students" | "admins" | "specific"
  isActive: boolean
  createdAt: string
  lastTriggered?: string
  timesTriggered: number
  conditions?: {
    applicationStatus?: string[]
    paymentStatus?: string[]
    documentStatus?: string[]
  }
  notification: {
    email: boolean
    sms: boolean
    inApp: boolean
    subject: string
    message: string
  }
}

interface ReminderSystemProps {
  applications?: any[]
}

export function ReminderSystem({ applications = [] }: ReminderSystemProps) {
  const [reminders, setReminders] = useState(mockReminders)

  const [selectedReminder, setSelectedReminder] = useState<Reminder | null>(null)
  const [isEditing, setIsEditing] = useState(false)
  const [showCreateDialog, setShowCreateDialog] = useState(false)
  const [newReminder, setNewReminder] = useState<Partial<Reminder>>({
    title: "",
    description: "",
    type: "deadline",
    triggerType: "days_before",
    triggerValue: 7,
    targetAudience: "students",
    isActive: true,
    notification: {
      email: true,
      sms: false,
      inApp: true,
      subject: "",
      message: "",
    },
  })

  const [activeReminders, setActiveReminders] = useState<string[]>([])

  useEffect(() => {
    // Check for triggered reminders
    const checkReminders = () => {
      const now = new Date()
      const triggered: string[] = []

      reminders.forEach((reminder) => {
        if (!reminder.isActive) return

        // Simulate reminder triggering logic
        const shouldTrigger = Math.random() > 0.8 // 20% chance for demo

        if (shouldTrigger && !activeReminders.includes(reminder.id)) {
          triggered.push(reminder.id)
        }
      })

      if (triggered.length > 0) {
        setActiveReminders((prev) => [...prev, ...triggered])
        triggered.forEach((id) => {
          const reminder = reminders.find((r) => r.id === id)
          if (reminder) {
            toast.info(`Reminder triggered: ${reminder.title}`)
          }
        })
      }
    }

    const interval = setInterval(checkReminders, 30000) // Check every 30 seconds
    return () => clearInterval(interval)
  }, [reminders, activeReminders])

  const createReminder = () => {
    if (!newReminder.title || !newReminder.notification?.subject) {
      toast.error("Please fill in all required fields")
      return
    }

    const reminder: Reminder = {
      id: `reminder_${Date.now()}`,
      title: newReminder.title!,
      description: newReminder.description || "",
      type: newReminder.type!,
      triggerType: newReminder.triggerType!,
      triggerValue: newReminder.triggerValue!,
      targetAudience: newReminder.targetAudience!,
      isActive: newReminder.isActive!,
      createdAt: new Date().toISOString(),
      timesTriggered: 0,
      conditions: newReminder.conditions,
      notification: newReminder.notification!,
    }

    setReminders((prev) => [...prev, reminder])
    setShowCreateDialog(false)
    setNewReminder({
      title: "",
      description: "",
      type: "deadline",
      triggerType: "days_before",
      triggerValue: 7,
      targetAudience: "students",
      isActive: true,
      notification: {
        email: true,
        sms: false,
        inApp: true,
        subject: "",
        message: "",
      },
    })
    toast.success("Reminder created successfully")
  }

  const updateReminder = (id: string, updates: Partial<Reminder>) => {
    setReminders((prev) => prev.map((r) => (r.id === id ? { ...r, ...updates } : r)))
    toast.success("Reminder updated successfully")
  }

  const deleteReminder = (id: string) => {
    setReminders((prev) => prev.filter((r) => r.id !== id))
    toast.success("Reminder deleted successfully")
  }

  const testReminder = async (id: string) => {
    const reminder = reminders.find((r) => r.id === id)
    if (!reminder) return

    try {
      // Simulate sending test notification
      await new Promise((resolve) => setTimeout(resolve, 1000))

      updateReminder(id, {
        timesTriggered: reminder.timesTriggered + 1,
        lastTriggered: new Date().toISOString(),
      })

      toast.success("Test notification sent successfully")
    } catch (error) {
      toast.error("Failed to send test notification")
    }
  }

  const dismissActiveReminder = (id: string) => {
    setActiveReminders((prev) => prev.filter((reminderId) => reminderId !== id))
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case "deadline":
        return "bg-red-100 text-red-800"
      case "review":
        return "bg-blue-100 text-blue-800"
      case "follow_up":
        return "bg-yellow-100 text-yellow-800"
      case "payment":
        return "bg-green-100 text-green-800"
      case "document":
        return "bg-purple-100 text-purple-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getAudienceColor = (audience: string) => {
    switch (audience) {
      case "students":
        return "bg-blue-100 text-blue-800"
      case "admins":
        return "bg-orange-100 text-orange-800"
      case "specific":
        return "bg-purple-100 text-purple-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <div className="space-y-6">
      {/* Active Reminders Alert */}
      {activeReminders.length > 0 && (
        <Card className="border-orange-200 bg-orange-50">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-orange-600" />
                <span className="font-medium text-orange-800">
                  {activeReminders.length} reminder{activeReminders.length !== 1 ? "s" : ""} triggered
                </span>
              </div>
              <Button variant="outline" size="sm" onClick={() => setActiveReminders([])}>
                Dismiss All
              </Button>
            </div>
            <div className="mt-3 space-y-2">
              {activeReminders.map((id) => {
                const reminder = reminders.find((r) => r.id === id)
                if (!reminder) return null

                return (
                  <div key={id} className="flex items-center justify-between p-2 bg-white rounded border">
                    <span className="text-sm">{reminder.title}</span>
                    <Button variant="ghost" size="sm" onClick={() => dismissActiveReminder(id)}>
                      Dismiss
                    </Button>
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Reminder System</h2>
          <p className="text-gray-600">Automated reminders for applications and deadlines</p>
        </div>
        <Button onClick={() => setShowCreateDialog(true)} className="bg-[#0a5eb2] hover:bg-[#0a5eb2]/90">
          <Plus className="w-4 h-4 mr-2" />
          Create Reminder
        </Button>
      </div>

      {/* Reminders List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {reminders.map((reminder) => (
          <Card
            key={reminder.id}
            className={`${!reminder.isActive ? "opacity-50" : ""} hover:shadow-lg transition-shadow`}
          >
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <CardTitle className="text-lg">{reminder.title}</CardTitle>
                  <p className="text-sm text-gray-600 mt-1">{reminder.description}</p>
                </div>
                <div className="flex items-center gap-1">
                  <Badge className={getTypeColor(reminder.type)}>{reminder.type}</Badge>
                  {reminder.isActive && <div className="w-2 h-2 bg-green-500 rounded-full"></div>}
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-500">Trigger:</span>
                  <span className="font-medium">
                    {reminder.triggerValue} {reminder.triggerType.replace("_", " ")}
                  </span>
                </div>

                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-500">Audience:</span>
                  <Badge className={getAudienceColor(reminder.targetAudience)}>{reminder.targetAudience}</Badge>
                </div>

                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-500">Triggered:</span>
                  <span className="font-medium">{reminder.timesTriggered} times</span>
                </div>

                {reminder.lastTriggered && (
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-500">Last:</span>
                    <span className="font-medium">{new Date(reminder.lastTriggered).toLocaleDateString()}</span>
                  </div>
                )}

                <div className="flex items-center gap-1 text-xs">
                  {reminder.notification.email && <Badge variant="outline">Email</Badge>}
                  {reminder.notification.sms && <Badge variant="outline">SMS</Badge>}
                  {reminder.notification.inApp && <Badge variant="outline">In-App</Badge>}
                </div>

                <div className="flex items-center gap-2 pt-3 border-t">
                  <Button variant="outline" size="sm" onClick={() => testReminder(reminder.id)} className="flex-1">
                    <Send className="w-4 h-4 mr-1" />
                    Test
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setSelectedReminder(reminder)
                      setIsEditing(true)
                    }}
                  >
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => deleteReminder(reminder.id)}
                    className="text-red-600 hover:text-red-700"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Create Reminder Dialog */}
      <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Create New Reminder</DialogTitle>
          </DialogHeader>

          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="title">Title *</Label>
                <Input
                  id="title"
                  value={newReminder.title}
                  onChange={(e) => setNewReminder((prev) => ({ ...prev, title: e.target.value }))}
                  placeholder="Enter reminder title"
                />
              </div>
              <div>
                <Label htmlFor="type">Type</Label>
                <Select
                  value={newReminder.type}
                  onValueChange={(value: any) => setNewReminder((prev) => ({ ...prev, type: value }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="deadline">Deadline</SelectItem>
                    <SelectItem value="review">Review</SelectItem>
                    <SelectItem value="follow_up">Follow Up</SelectItem>
                    <SelectItem value="payment">Payment</SelectItem>
                    <SelectItem value="document">Document</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={newReminder.description}
                onChange={(e) => setNewReminder((prev) => ({ ...prev, description: e.target.value }))}
                placeholder="Enter reminder description"
                rows={3}
              />
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div>
                <Label htmlFor="triggerType">Trigger Type</Label>
                <Select
                  value={newReminder.triggerType}
                  onValueChange={(value: any) => setNewReminder((prev) => ({ ...prev, triggerType: value }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="days_before">Days Before</SelectItem>
                    <SelectItem value="days_after">Days After</SelectItem>
                    <SelectItem value="date">Specific Date</SelectItem>
                    <SelectItem value="condition">Condition Based</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="triggerValue">Trigger Value</Label>
                <Input
                  id="triggerValue"
                  type={newReminder.triggerType === "date" ? "date" : "number"}
                  value={newReminder.triggerValue}
                  onChange={(e) =>
                    setNewReminder((prev) => ({
                      ...prev,
                      triggerValue: newReminder.triggerType === "date" ? e.target.value : Number(e.target.value),
                    }))
                  }
                />
              </div>
              <div>
                <Label htmlFor="audience">Target Audience</Label>
                <Select
                  value={newReminder.targetAudience}
                  onValueChange={(value: any) => setNewReminder((prev) => ({ ...prev, targetAudience: value }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="students">Students</SelectItem>
                    <SelectItem value="admins">Admins</SelectItem>
                    <SelectItem value="specific">Specific Group</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="font-medium">Notification Settings</h4>

              <div className="grid grid-cols-3 gap-4">
                <div className="flex items-center space-x-2">
                  <Switch
                    id="email"
                    checked={newReminder.notification?.email}
                    onCheckedChange={(checked) =>
                      setNewReminder((prev) => ({
                        ...prev,
                        notification: { ...prev.notification!, email: checked },
                      }))
                    }
                  />
                  <Label htmlFor="email">Email</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Switch
                    id="sms"
                    checked={newReminder.notification?.sms}
                    onCheckedChange={(checked) =>
                      setNewReminder((prev) => ({
                        ...prev,
                        notification: { ...prev.notification!, sms: checked },
                      }))
                    }
                  />
                  <Label htmlFor="sms">SMS</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Switch
                    id="inApp"
                    checked={newReminder.notification?.inApp}
                    onCheckedChange={(checked) =>
                      setNewReminder((prev) => ({
                        ...prev,
                        notification: { ...prev.notification!, inApp: checked },
                      }))
                    }
                  />
                  <Label htmlFor="inApp">In-App</Label>
                </div>
              </div>

              <div>
                <Label htmlFor="subject">Subject *</Label>
                <Input
                  id="subject"
                  value={newReminder.notification?.subject}
                  onChange={(e) =>
                    setNewReminder((prev) => ({
                      ...prev,
                      notification: { ...prev.notification!, subject: e.target.value },
                    }))
                  }
                  placeholder="Enter notification subject"
                />
              </div>

              <div>
                <Label htmlFor="message">Message</Label>
                <Textarea
                  id="message"
                  value={newReminder.notification?.message}
                  onChange={(e) =>
                    setNewReminder((prev) => ({
                      ...prev,
                      notification: { ...prev.notification!, message: e.target.value },
                    }))
                  }
                  placeholder="Enter notification message"
                  rows={4}
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-4 border-t">
              <Button variant="outline" onClick={() => setShowCreateDialog(false)}>
                Cancel
              </Button>
              <Button onClick={createReminder} className="bg-[#0a5eb2] hover:bg-[#0a5eb2]/90">
                Create Reminder
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
