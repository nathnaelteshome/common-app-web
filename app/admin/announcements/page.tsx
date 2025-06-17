"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useAuthStore } from "@/store/auth-store"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Switch } from "@/components/ui/switch"
import { Plus, Edit, Trash2, Eye, Send, Calendar, Users, Megaphone, Clock, CheckCircle, AlertTriangle } from "lucide-react"
import { toast } from "sonner"

interface Announcement {
  id: string
  title: string
  content: string
  type: "general" | "urgent" | "deadline" | "event" | "maintenance" | "celebration"
  targetAudience: "all" | "students" | "applicants" | "accepted" | "staff" | "specific"
  status: "draft" | "published" | "scheduled" | "archived"
  publishDate: string
  expiryDate?: string
  createdAt: string
  createdBy: string
  views: number
  attachments?: string[]
  isPinned: boolean
  allowComments: boolean
  sendNotification: boolean
  priority: "low" | "medium" | "high"
  tags: string[]
}

export default function AdminAnnouncements() {
  const { user, isAuthenticated } = useAuthStore()
  const router = useRouter()
  const [announcements, setAnnouncements] = useState<Announcement[]>([
    {
      id: "ann_1",
      title: "Application Deadline Extended",
      content:
        "We are pleased to announce that the application deadline for Fall 2024 has been extended to March 15, 2024. This gives prospective students additional time to complete their applications and gather required documents.",
      type: "deadline",
      targetAudience: "all",
      status: "published",
      publishDate: "2024-01-20T10:00:00Z",
      expiryDate: "2024-03-15T23:59:59Z",
      createdAt: "2024-01-20T09:30:00Z",
      createdBy: "admin_1",
      views: 1250,
      isPinned: true,
      allowComments: true,
      sendNotification: true,
      priority: "high",
      tags: ["deadline", "applications", "fall-2024"],
    },
    {
      id: "ann_2",
      title: "New Scholarship Program Available",
      content:
        "We are excited to introduce our new merit-based scholarship program for outstanding students. Applications are now open for the Academic Excellence Scholarship worth up to $10,000 per year.",
      type: "general",
      targetAudience: "students",
      status: "published",
      publishDate: "2024-01-18T14:00:00Z",
      createdAt: "2024-01-18T13:45:00Z",
      createdBy: "admin_1",
      views: 890,
      isPinned: false,
      allowComments: true,
      sendNotification: true,
      priority: "medium",
      tags: ["scholarship", "financial-aid", "merit"],
    },
  ])

  const [selectedAnnouncement, setSelectedAnnouncement] = useState<Announcement | null>(null)
  const [showCreateDialog, setShowCreateDialog] = useState(false)
  const [showEditDialog, setShowEditDialog] = useState(false)
  const [newAnnouncement, setNewAnnouncement] = useState<Partial<Announcement>>({
    title: "",
    content: "",
    type: "general",
    targetAudience: "all",
    status: "draft",
    publishDate: new Date().toISOString().slice(0, 16),
    isPinned: false,
    allowComments: true,
    sendNotification: true,
    priority: "medium",
    tags: [],
  })
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [typeFilter, setTypeFilter] = useState("all")

  useEffect(() => {
    if (!isAuthenticated || user?.role !== "university") {
      router.push("/auth/sign-in")
    }
  }, [isAuthenticated, user, router])

  if (!isAuthenticated || user?.role !== "university") {
    return null
  }

  const filteredAnnouncements = announcements.filter((ann) => {
    const matchesSearch =
      ann.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ann.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ann.tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase()))
    const matchesStatus = statusFilter === "all" || ann.status === statusFilter
    const matchesType = typeFilter === "all" || ann.type === typeFilter
    return matchesSearch && matchesStatus && matchesType
  })

  const createAnnouncement = async () => {
    if (!newAnnouncement.title || !newAnnouncement.content) {
      toast.error("Please fill in all required fields")
      return
    }

    try {
      const announcement: Announcement = {
        id: `ann_${Date.now()}`,
        title: newAnnouncement.title!,
        content: newAnnouncement.content!,
        type: newAnnouncement.type!,
        targetAudience: newAnnouncement.targetAudience!,
        status: newAnnouncement.status!,
        publishDate: newAnnouncement.publishDate!,
        expiryDate: newAnnouncement.expiryDate,
        createdAt: new Date().toISOString(),
        createdBy: user?.id || "admin",
        views: 0,
        isPinned: newAnnouncement.isPinned!,
        allowComments: newAnnouncement.allowComments!,
        sendNotification: newAnnouncement.sendNotification!,
        priority: newAnnouncement.priority!,
        tags: newAnnouncement.tags || [],
      }

      setAnnouncements((prev) => [announcement, ...prev])

      if (announcement.sendNotification && announcement.status === "published") {
        // Simulate sending notifications
        await new Promise((resolve) => setTimeout(resolve, 1000))
        toast.success("Announcement created and notifications sent!")
      } else {
        toast.success("Announcement created successfully!")
      }

      setShowCreateDialog(false)
      resetForm()
    } catch (error) {
      toast.error("Failed to create announcement")
    }
  }

  const updateAnnouncement = async () => {
    if (!selectedAnnouncement) return

    try {
      setAnnouncements((prev) => prev.map((ann) => (ann.id === selectedAnnouncement.id ? selectedAnnouncement : ann)))

      toast.success("Announcement updated successfully!")
      setShowEditDialog(false)
      setSelectedAnnouncement(null)
    } catch (error) {
      toast.error("Failed to update announcement")
    }
  }

  const deleteAnnouncement = async (id: string) => {
    if (!confirm("Are you sure you want to delete this announcement?")) return

    try {
      setAnnouncements((prev) => prev.filter((ann) => ann.id !== id))
      toast.success("Announcement deleted successfully!")
    } catch (error) {
      toast.error("Failed to delete announcement")
    }
  }

  const publishAnnouncement = async (id: string) => {
    try {
      setAnnouncements((prev) =>
        prev.map((ann) =>
          ann.id === id ? { ...ann, status: "published" as const, publishDate: new Date().toISOString() } : ann,
        ),
      )

      const announcement = announcements.find((ann) => ann.id === id)
      if (announcement?.sendNotification) {
        // Simulate sending notifications
        await new Promise((resolve) => setTimeout(resolve, 1000))
        toast.success("Announcement published and notifications sent!")
      } else {
        toast.success("Announcement published successfully!")
      }
    } catch (error) {
      toast.error("Failed to publish announcement")
    }
  }

  const resetForm = () => {
    setNewAnnouncement({
      title: "",
      content: "",
      type: "general",
      targetAudience: "all",
      status: "draft",
      publishDate: new Date().toISOString().slice(0, 16),
      isPinned: false,
      allowComments: true,
      sendNotification: true,
      priority: "medium",
      tags: [],
    })
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case "urgent":
        return "bg-red-100 text-red-800"
      case "deadline":
        return "bg-orange-100 text-orange-800"
      case "event":
        return "bg-blue-100 text-blue-800"
      case "maintenance":
        return "bg-yellow-100 text-yellow-800"
      case "celebration":
        return "bg-green-100 text-green-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "published":
        return "bg-green-100 text-green-800"
      case "draft":
        return "bg-gray-100 text-gray-800"
      case "scheduled":
        return "bg-blue-100 text-blue-800"
      case "archived":
        return "bg-yellow-100 text-yellow-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "bg-red-100 text-red-800"
      case "medium":
        return "bg-yellow-100 text-yellow-800"
      case "low":
        return "bg-green-100 text-green-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <div className="container mx-auto px-4 py-8">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Announcements & Advertisements</h1>
            <p className="text-gray-600">Create and manage announcements for students and staff</p>
          </div>
          <Button onClick={() => setShowCreateDialog(true)} className="bg-[#0a5eb2] hover:bg-[#0a5eb2]/90 mt-4 md:mt-0">
            <Plus className="w-4 h-4 mr-2" />
            Create Announcement
          </Button>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Announcements</p>
                  <p className="text-2xl font-bold">{announcements.length}</p>
                </div>
                <Megaphone className="h-8 w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Published</p>
                  <p className="text-2xl font-bold">
                    {announcements.filter((a) => a.status === "published").length}
                  </p>
                </div>
                <CheckCircle className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Views</p>
                  <p className="text-2xl font-bold">
                    {announcements.reduce((sum, a) => sum + a.views, 0)}
                  </p>
                </div>
                <Eye className="h-8 w-8 text-purple-600" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Pinned</p>
                  <p className="text-2xl font-bold">
                    {announcements.filter((a) => a.isPinned).length}
                  </p>
                </div>
                <AlertTriangle className="h-8 w-8 text-orange-600" />
              </div>
            </CardContent>
          </Card>
        </div>
        <Card className="mb-6">
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Input
                placeholder="Search announcements..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="published">Published</SelectItem>
                  <SelectItem value="draft">Draft</SelectItem>
                  <SelectItem value="scheduled">Scheduled</SelectItem>
                  <SelectItem value="archived">Archived</SelectItem>
                </SelectContent>
              </Select>
              <Select value={typeFilter} onValueChange={setTypeFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Filter by type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="general">General</SelectItem>
                  <SelectItem value="urgent">Urgent</SelectItem>
                  <SelectItem value="deadline">Deadline</SelectItem>
                  <SelectItem value="event">Event</SelectItem>
                  <SelectItem value="maintenance">Maintenance</SelectItem>
                  <SelectItem value="celebration">Celebration</SelectItem>
                </SelectContent>
              </Select>
              <Button variant="outline">
                <Calendar className="w-4 h-4 mr-2" />
                Date Range
              </Button>
            </div>
          </CardContent>
        </Card>
        <div className="space-y-4">
          {filteredAnnouncements.map((announcement) => (
    <Card key={announcement.id} className="hover:shadow-lg transition-shadow">
      <CardContent className="p-6">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <h3 className="text-lg font-semibold text-gray-900">{announcement.title}</h3>
              {announcement.isPinned && (
                <Badge variant="outline" className="bg-yellow-100 text-yellow-800">
                  Pinned
                </Badge>
              )}
              <Badge className={getTypeColor(announcement.type)}>{announcement.type}</Badge>
              <Badge className={getStatusColor(announcement.status)}>{announcement.status}</Badge>
              <Badge className={getPriorityColor(announcement.priority)}>{announcement.priority}</Badge>
            </div>

            <p className="text-gray-600 mb-4 line-clamp-2">{announcement.content}</p>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-gray-500 mb-4">
              <div className="flex items-center gap-1">
                <Users className="w-4 h-4" />
                <span>Audience: {announcement.targetAudience}</span>
              </div>
              <div className="flex items-center gap-1">
                <Eye className="w-4 h-4" />
                <span>Views: {announcement.views}</span>
              </div>
              <div className="flex items-center gap-1">
                <Calendar className="w-4 h-4" />
                <span>Published: {new Date(announcement.publishDate).toLocaleDateString()}</span>
              </div>
              {announcement.expiryDate && (
                <div className="flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  <span>Expires: {new Date(announcement.expiryDate).toLocaleDateString()}</span>
                </div>
              )}
            </div>

            <div className="flex items-center gap-1 mb-4">
              {announcement.tags.map((tag) => (
                <Badge key={tag} variant="outline" className="text-xs">
                  {tag}
                </Badge>
              ))}
            </div>

            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm">
                <Eye className="w-4 h-4 mr-1" />
                View
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setSelectedAnnouncement(announcement)
                  setShowEditDialog(true)
                }}
              >
                <Edit className="w-4 h-4 mr-1" />
                Edit
              </Button>
              {announcement.status === "draft" && (
                <Button
                  size="sm"
                  onClick={() => publishAnnouncement(announcement.id)}
                  className="bg-green-600 hover:bg-green-700"
                >
                  <Send className="w-4 h-4 mr-1" />
                  Publish
                </Button>
              )}
              <Button
                variant="outline"
                size="sm"
                onClick={() => deleteAnnouncement(announcement.id)}
                className="text-red-600 hover:text-red-700"
              >
                <Trash2 className="w-4 h-4 mr-1" />
                Delete
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
          ))}
        </div>
  filteredAnnouncements.length === 0 && (
    <Card className="text-center py-12">
      <CardContent>
        <Megaphone className="w-12 h-12 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-gray-900 mb-2">No announcements found</h3>
        <p className="text-gray-600 mb-6">
          {searchQuery || statusFilter !== "all" || typeFilter !== "all"
            ? "Try adjusting your search or filter criteria"
            : "Create your first announcement to get started"}
        </p>
        <Button onClick={() => setShowCreateDialog(true)} className="bg-[#0a5eb2] hover:bg-[#0a5eb2]/90">
          <Plus className="w-4 h-4 mr-2" />
          Create Announcement
        </Button>
      </CardContent>
    </Card>
  )
  ;(
    <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create New Announcement</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="title">Title *</Label>
              <Input
                id="title"
                value={newAnnouncement.title}
                onChange={(e) => setNewAnnouncement((prev) => ({ ...prev, title: e.target.value }))}
                placeholder="Enter announcement title"
              />
            </div>
            <div>
              <Label htmlFor="type">Type</Label>
              <Select
                value={newAnnouncement.type}
                onValueChange={(value: any) => setNewAnnouncement((prev) => ({ ...prev, type: value }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="general">General</SelectItem>
                  <SelectItem value="urgent">Urgent</SelectItem>
                  <SelectItem value="deadline">Deadline</SelectItem>
                  <SelectItem value="event">Event</SelectItem>
                  <SelectItem value="maintenance">Maintenance</SelectItem>
                  <SelectItem value="celebration">Celebration</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div>
            <Label htmlFor="content">Content *</Label>
            <Textarea
              id="content"
              value={newAnnouncement.content}
              onChange={(e) => setNewAnnouncement((prev) => ({ ...prev, content: e.target.value }))}
              placeholder="Enter announcement content"
              rows={6}
            />
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <Label htmlFor="audience">Target Audience</Label>
              <Select
                value={newAnnouncement.targetAudience}
                onValueChange={(value: any) => setNewAnnouncement((prev) => ({ ...prev, targetAudience: value }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Users</SelectItem>
                  <SelectItem value="students">Students</SelectItem>
                  <SelectItem value="applicants">Applicants</SelectItem>
                  <SelectItem value="accepted">Accepted Students</SelectItem>
                  <SelectItem value="staff">Staff</SelectItem>
                  <SelectItem value="specific">Specific Group</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="priority">Priority</Label>
              <Select
                value={newAnnouncement.priority}
                onValueChange={(value: any) => setNewAnnouncement((prev) => ({ ...prev, priority: value }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">Low</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="status">Status</Label>
              <Select
                value={newAnnouncement.status}
                onValueChange={(value: any) => setNewAnnouncement((prev) => ({ ...prev, status: value }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="draft">Draft</SelectItem>
                  <SelectItem value="published">Published</SelectItem>
                  <SelectItem value="scheduled">Scheduled</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="publishDate">Publish Date</Label>
              <Input
                id="publishDate"
                type="datetime-local"
                value={newAnnouncement.publishDate}
                onChange={(e) => setNewAnnouncement((prev) => ({ ...prev, publishDate: e.target.value }))}
              />
            </div>
            <div>
              <Label htmlFor="expiryDate">Expiry Date (Optional)</Label>
              <Input
                id="expiryDate"
                type="datetime-local"
                value={newAnnouncement.expiryDate || ""}
                onChange={(e) => setNewAnnouncement((prev) => ({ ...prev, expiryDate: e.target.value }))}
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="flex items-center space-x-2">
              <Switch
                id="pinned"
                checked={newAnnouncement.isPinned}
                onCheckedChange={(checked) => setNewAnnouncement((prev) => ({ ...prev, isPinned: checked }))}
              />
              <Label htmlFor="pinned">Pin announcement</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Switch
                id="comments"
                checked={newAnnouncement.allowComments}
                onCheckedChange={(checked) => setNewAnnouncement((prev) => ({ ...prev, allowComments: checked }))}
              />
              <Label htmlFor="comments">Allow comments</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Switch
                id="notification"
                checked={newAnnouncement.sendNotification}
                onCheckedChange={(checked) => setNewAnnouncement((prev) => ({ ...prev, sendNotification: checked }))}
              />
              <Label htmlFor="notification">Send notification</Label>
            </div>
          </div>

          <div>
            <Label htmlFor="tags">Tags (comma-separated)</Label>
            <Input
              id="tags"
              value={newAnnouncement.tags?.join(", ") || ""}
              onChange={(e) =>
                setNewAnnouncement((prev) => ({
                  ...prev,
                  tags: e.target.value
                    .split(",")
                    .map((tag) => tag.trim())
                    .filter(Boolean),
                }))
              }
              placeholder="Enter tags separated by commas"
            />
          </div>

          <div className="flex justify-end gap-2 pt-4 border-t">
            <Button variant="outline" onClick={() => setShowCreateDialog(false)}>
              Cancel
            </Button>
            <Button onClick={createAnnouncement} className="bg-[#0a5eb2] hover:bg-[#0a5eb2]/90">
              Create Announcement
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  ) < Dialog
  open = { showEditDialog }
  onOpenChange =
    { setShowEditDialog } >
    (
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Announcement</DialogTitle>
        </DialogHeader>

        {selectedAnnouncement && (
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="editTitle">Title *</Label>
                <Input
                  id="editTitle"
                  value={selectedAnnouncement.title}
                  onChange={(e) =>
                    setSelectedAnnouncement((prev) => (prev ? { ...prev, title: e.target.value } : null))
                  }
                  placeholder="Enter announcement title"
                />
              </div>
              <div>
                <Label htmlFor="editType">Type</Label>
                <Select
                  value={selectedAnnouncement.type}
                  onValueChange={(value: any) =>
                    setSelectedAnnouncement((prev) => (prev ? { ...prev, type: value } : null))
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="general">General</SelectItem>
                    <SelectItem value="urgent">Urgent</SelectItem>
                    <SelectItem value="deadline">Deadline</SelectItem>
                    <SelectItem value="event">Event</SelectItem>
                    <SelectItem value="maintenance">Maintenance</SelectItem>
                    <SelectItem value="celebration">Celebration</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <Label htmlFor="editContent">Content *</Label>
              <Textarea
                id="editContent"
                value={selectedAnnouncement.content}
                onChange={(e) =>
                  setSelectedAnnouncement((prev) => (prev ? { ...prev, content: e.target.value } : null))
                }
                placeholder="Enter announcement content"
                rows={6}
              />
            </div>

            <div className="flex justify-end gap-2 pt-4 border-t">
              <Button variant="outline" onClick={() => setShowEditDialog(false)}>
                Cancel
              </Button>
              <Button onClick={updateAnnouncement} className="bg-[#0a5eb2] hover:bg-[#0a5eb2]/90">
                Update Announcement
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    )
  </Dialog>
  </div>
      <Footer />
    </div>
  )
}
