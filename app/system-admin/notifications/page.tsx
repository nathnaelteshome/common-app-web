"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useAuthStore } from "@/store/auth-store"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Switch } from "@/components/ui/switch"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Bell,
  Plus,
  Edit,
  Eye,
  Send,
  Copy,
  Settings,
  BarChart3,
  Mail,
  MessageSquare,
  Smartphone,
  Monitor,
} from "lucide-react"
import { notificationService } from "@/lib/services/notification-service"
import { toast } from "sonner"

interface NotificationTemplate {
  id: string
  name: string
  type: "email" | "sms" | "push" | "in_app"
  subject: string
  content: string
  variables: string[]
  isActive: boolean
  usageCount: number
  createdAt: string
  updatedAt: string
}

export default function NotificationTemplatesPage() {
  const { user, isAuthenticated } = useAuthStore()
  const router = useRouter()
  const [templates, setTemplates] = useState<NotificationTemplate[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [selectedTemplate, setSelectedTemplate] = useState<NotificationTemplate | null>(null)
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [typeFilter, setTypeFilter] = useState("all")
  const [analytics, setAnalytics] = useState<any>(null)

  useEffect(() => {
    if (!isAuthenticated || user?.role !== "admin") {
      router.push("/auth/sign-in")
    } else {
      loadTemplates()
      loadAnalytics()
    }
  }, [isAuthenticated, user, router])

  const loadTemplates = async () => {
    try {
      setIsLoading(true)
      const templatesData = notificationService.getTemplates()
      setTemplates(templatesData)
    } catch (error) {
      console.error("Failed to load templates:", error)
      toast.error("Failed to load notification templates")
    } finally {
      setIsLoading(false)
    }
  }

  const loadAnalytics = async () => {
    try {
      const analyticsData = await notificationService.getNotificationAnalytics()
      setAnalytics(analyticsData)
    } catch (error) {
      console.error("Failed to load analytics:", error)
    }
  }

  const handleCreateTemplate = async (templateData: any) => {
    try {
      const templateId = await notificationService.createTemplate(templateData)
      toast.success("Template created successfully")
      setIsCreateDialogOpen(false)
      await loadTemplates()
    } catch (error) {
      toast.error("Failed to create template")
    }
  }

  const handleUpdateTemplate = async (templateId: string, updates: any) => {
    try {
      await notificationService.updateTemplate(templateId, updates)
      toast.success("Template updated successfully")
      setIsEditDialogOpen(false)
      setSelectedTemplate(null)
      await loadTemplates()
    } catch (error) {
      toast.error("Failed to update template")
    }
  }

  const handleTestTemplate = async (template: NotificationTemplate) => {
    try {
      const testData = {
        studentName: "John Doe",
        universityName: "Test University",
        applicationId: "APP123",
        deadline: "2024-08-30",
      }

      const result = await notificationService.testTemplate(template.id, testData)
      toast.success("Test notification sent successfully")
    } catch (error) {
      toast.error("Failed to send test notification")
    }
  }

  const filteredTemplates = templates.filter((template) => {
    const matchesSearch =
      template.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      template.subject.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesType = typeFilter === "all" || template.type === typeFilter
    return matchesSearch && matchesType
  })

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "email":
        return <Mail className="w-4 h-4" />
      case "sms":
        return <MessageSquare className="w-4 h-4" />
      case "push":
        return <Smartphone className="w-4 h-4" />
      case "in_app":
        return <Monitor className="w-4 h-4" />
      default:
        return <Bell className="w-4 h-4" />
    }
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case "email":
        return "bg-blue-100 text-blue-800"
      case "sms":
        return "bg-green-100 text-green-800"
      case "push":
        return "bg-purple-100 text-purple-800"
      case "in_app":
        return "bg-orange-100 text-orange-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  if (!isAuthenticated || user?.role !== "admin") {
    return null
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Notification Templates</h1>
            <p className="text-gray-600">Configure and manage notification templates for the platform</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline">
              <Settings className="w-4 h-4 mr-2" />
              Settings
            </Button>
            <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
              <DialogTrigger asChild>
                <Button className="bg-[#0a5eb2] hover:bg-[#0a5eb2]/90">
                  <Plus className="w-4 h-4 mr-2" />
                  Create Template
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>Create Notification Template</DialogTitle>
                  <DialogDescription>Create a new notification template for automated communications</DialogDescription>
                </DialogHeader>
                <CreateTemplateForm onSubmit={handleCreateTemplate} />
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {/* Analytics Overview */}
        {analytics && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Total Sent</p>
                    <p className="text-3xl font-bold text-blue-600">{analytics.totalSent.toLocaleString()}</p>
                  </div>
                  <Send className="w-8 h-8 text-blue-600" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Delivery Rate</p>
                    <p className="text-3xl font-bold text-green-600">{analytics.deliveryRate.toFixed(1)}%</p>
                  </div>
                  <BarChart3 className="w-8 h-8 text-green-600" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Open Rate</p>
                    <p className="text-3xl font-bold text-purple-600">{analytics.openRate.toFixed(1)}%</p>
                  </div>
                  <Eye className="w-8 h-8 text-purple-600" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Click Rate</p>
                    <p className="text-3xl font-bold text-orange-600">{analytics.clickRate.toFixed(1)}%</p>
                  </div>
                  <Monitor className="w-8 h-8 text-orange-600" />
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        <Tabs defaultValue="templates" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="templates">Templates</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>

          <TabsContent value="templates" className="space-y-6">
            {/* Filters */}
            <Card>
              <CardContent className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="search">Search Templates</Label>
                    <Input
                      id="search"
                      placeholder="Search by name or subject..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="type">Filter by Type</Label>
                    <Select value={typeFilter} onValueChange={setTypeFilter}>
                      <SelectTrigger>
                        <SelectValue placeholder="All types" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Types</SelectItem>
                        <SelectItem value="email">Email</SelectItem>
                        <SelectItem value="sms">SMS</SelectItem>
                        <SelectItem value="push">Push Notification</SelectItem>
                        <SelectItem value="in_app">In-App</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex items-end">
                    <Button variant="outline" className="w-full">
                      <Bell className="w-4 h-4 mr-2" />
                      Bulk Actions
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Templates Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredTemplates.map((template) => (
                <Card key={template.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          {getTypeIcon(template.type)}
                          <Badge className={`${getTypeColor(template.type)} border-0`}>{template.type}</Badge>
                        </div>
                        <CardTitle className="text-lg">{template.name}</CardTitle>
                        <p className="text-sm text-gray-600 mt-1">{template.subject}</p>
                      </div>
                      <Switch
                        checked={template.isActive}
                        onCheckedChange={(checked) => handleUpdateTemplate(template.id, { isActive: checked })}
                      />
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="text-sm text-gray-600">
                        <p className="line-clamp-3">{template.content}</p>
                      </div>

                      <div className="flex items-center justify-between text-sm text-gray-500">
                        <span>Used {template.usageCount} times</span>
                        <span>{new Date(template.updatedAt).toLocaleDateString()}</span>
                      </div>

                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleTestTemplate(template)}
                          className="flex-1"
                        >
                          <Send className="w-4 h-4 mr-1" />
                          Test
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setSelectedTemplate(template)
                            setIsEditDialogOpen(true)
                          }}
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button variant="outline" size="sm">
                          <Copy className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="analytics" className="space-y-6">
            {analytics && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <Card>
                  <CardHeader>
                    <CardTitle>Channel Performance</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {analytics.channelPerformance.map((channel: any) => (
                        <div key={channel.channel} className="space-y-2">
                          <div className="flex justify-between items-center">
                            <div className="flex items-center gap-2">
                              {getTypeIcon(channel.channel)}
                              <span className="font-medium">{channel.channel}</span>
                            </div>
                            <span className="text-sm text-gray-600">
                              {((channel.delivered / channel.sent) * 100).toFixed(1)}% delivery
                            </span>
                          </div>
                          <div className="grid grid-cols-3 gap-4 text-sm">
                            <div>
                              <span className="text-gray-600">Sent:</span>
                              <span className="ml-1 font-medium">{channel.sent}</span>
                            </div>
                            <div>
                              <span className="text-gray-600">Delivered:</span>
                              <span className="ml-1 font-medium">{channel.delivered}</span>
                            </div>
                            <div>
                              <span className="text-gray-600">Opened:</span>
                              <span className="ml-1 font-medium">{channel.opened}</span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Template Performance</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {analytics.templatePerformance.slice(0, 5).map((template: any) => (
                        <div key={template.templateId} className="space-y-2">
                          <div className="flex justify-between items-center">
                            <span className="font-medium">{template.templateName}</span>
                            <span className="text-sm text-gray-600">
                              {((template.delivered / template.sent) * 100).toFixed(1)}%
                            </span>
                          </div>
                          <div className="grid grid-cols-3 gap-4 text-sm">
                            <div>
                              <span className="text-gray-600">Sent:</span>
                              <span className="ml-1 font-medium">{template.sent}</span>
                            </div>
                            <div>
                              <span className="text-gray-600">Delivered:</span>
                              <span className="ml-1 font-medium">{template.delivered}</span>
                            </div>
                            <div>
                              <span className="text-gray-600">Opened:</span>
                              <span className="ml-1 font-medium">{template.opened}</span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}
          </TabsContent>

          <TabsContent value="settings" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Notification Settings</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h4 className="font-medium">Email Configuration</h4>
                    <div className="space-y-2">
                      <Label htmlFor="smtp-server">SMTP Server</Label>
                      <Input id="smtp-server" defaultValue="smtp.gmail.com" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="smtp-port">SMTP Port</Label>
                      <Input id="smtp-port" defaultValue="587" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="from-email">From Email</Label>
                      <Input id="from-email" defaultValue="noreply@commonapply.com" />
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h4 className="font-medium">SMS Configuration</h4>
                    <div className="space-y-2">
                      <Label htmlFor="sms-provider">SMS Provider</Label>
                      <Select defaultValue="twilio">
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="twilio">Twilio</SelectItem>
                          <SelectItem value="nexmo">Nexmo</SelectItem>
                          <SelectItem value="aws-sns">AWS SNS</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="sms-from">From Number</Label>
                      <Input id="sms-from" defaultValue="+1234567890" />
                    </div>
                  </div>
                </div>

                <div className="flex gap-2 pt-4">
                  <Button>Save Configuration</Button>
                  <Button variant="outline">Test Connection</Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Edit Template Dialog */}
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Edit Notification Template</DialogTitle>
              <DialogDescription>Update the notification template configuration</DialogDescription>
            </DialogHeader>
            {selectedTemplate && (
              <EditTemplateForm
                template={selectedTemplate}
                onSubmit={(updates) => handleUpdateTemplate(selectedTemplate.id, updates)}
              />
            )}
          </DialogContent>
        </Dialog>
      </div>

      <Footer />
    </div>
  )
}

// Create Template Form Component
function CreateTemplateForm({ onSubmit }: { onSubmit: (data: any) => void }) {
  const [formData, setFormData] = useState({
    name: "",
    type: "email",
    subject: "",
    content: "",
    variables: [] as string[],
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit(formData)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="name">Template Name</Label>
          <Input
            id="name"
            value={formData.name}
            onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
            placeholder="e.g., Application Confirmation"
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="type">Type</Label>
          <Select value={formData.type} onValueChange={(value) => setFormData((prev) => ({ ...prev, type: value }))}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="email">Email</SelectItem>
              <SelectItem value="sms">SMS</SelectItem>
              <SelectItem value="push">Push Notification</SelectItem>
              <SelectItem value="in_app">In-App</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="subject">Subject</Label>
        <Input
          id="subject"
          value={formData.subject}
          onChange={(e) => setFormData((prev) => ({ ...prev, subject: e.target.value }))}
          placeholder="e.g., Your application has been received"
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="content">Content</Label>
        <Textarea
          id="content"
          value={formData.content}
          onChange={(e) => setFormData((prev) => ({ ...prev, content: e.target.value }))}
          placeholder="Enter the notification content. Use {{variableName}} for dynamic content."
          rows={6}
          required
        />
      </div>

      <div className="flex justify-end gap-2">
        <Button type="button" variant="outline">
          Cancel
        </Button>
        <Button type="submit">Create Template</Button>
      </div>
    </form>
  )
}

// Edit Template Form Component
function EditTemplateForm({ template, onSubmit }: { template: NotificationTemplate; onSubmit: (data: any) => void }) {
  const [formData, setFormData] = useState({
    name: template.name,
    type: template.type,
    subject: template.subject,
    content: template.content,
    isActive: template.isActive,
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit(formData)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="edit-name">Template Name</Label>
          <Input
            id="edit-name"
            value={formData.name}
            onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="edit-type">Type</Label>
          <Select value={formData.type} onValueChange={(value) => setFormData((prev) => ({ ...prev, type: value }))}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="email">Email</SelectItem>
              <SelectItem value="sms">SMS</SelectItem>
              <SelectItem value="push">Push Notification</SelectItem>
              <SelectItem value="in_app">In-App</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="edit-subject">Subject</Label>
        <Input
          id="edit-subject"
          value={formData.subject}
          onChange={(e) => setFormData((prev) => ({ ...prev, subject: e.target.value }))}
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="edit-content">Content</Label>
        <Textarea
          id="edit-content"
          value={formData.content}
          onChange={(e) => setFormData((prev) => ({ ...prev, content: e.target.value }))}
          rows={6}
          required
        />
      </div>

      <div className="flex items-center space-x-2">
        <Switch
          id="edit-active"
          checked={formData.isActive}
          onCheckedChange={(checked) => setFormData((prev) => ({ ...prev, isActive: checked }))}
        />
        <Label htmlFor="edit-active">Active</Label>
      </div>

      <div className="flex justify-end gap-2">
        <Button type="button" variant="outline">
          Cancel
        </Button>
        <Button type="submit">Update Template</Button>
      </div>
    </form>
  )
}
