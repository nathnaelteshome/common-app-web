"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Bell, Search, Filter, Calendar, User, AlertCircle, Info, CheckCircle, Loader2 } from "lucide-react"
import { announcementService, type Announcement } from "@/lib/api/announcements"
import { toast } from "sonner"

export default function AnnouncementsPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [filterType, setFilterType] = useState("all")
  const [filterPriority, setFilterPriority] = useState("all")
  const [announcements, setAnnouncements] = useState<Announcement[]>([])
  const [loading, setLoading] = useState(true)
  const [readStatus, setReadStatus] = useState<Record<string, boolean>>({})

  // Fetch announcements from API
  const fetchAnnouncements = async () => {
    try {
      setLoading(true)
      const response = await announcementService.getAnnouncementsByAudience("students", {
        status: "published",
        page: 1,
        limit: 100,
        sortBy: "publishDate",
        sortOrder: "desc"
      })
      
      if (response.announcements) {
        setAnnouncements(response.announcements)
        // Initialize read status for announcements
        const initialReadStatus: Record<string, boolean> = {}
        response.announcements.forEach(ann => {
          // For now, we'll assume all announcements are unread initially
          // In a real implementation, this would come from user's read status
          initialReadStatus[ann.id] = false
        })
        setReadStatus(initialReadStatus)
      }
    } catch (error) {
      console.error("Error fetching announcements:", error)
      toast.error("Failed to load announcements")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchAnnouncements()
  }, [])

  // Filter announcements
  const filteredAnnouncements = announcements.filter((announcement) => {
    const matchesSearch =
      announcement.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      announcement.content.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesType = filterType === "all" || announcement.type === filterType
    const matchesPriority = filterPriority === "all" || announcement.priority === filterPriority

    return matchesSearch && matchesType && matchesPriority
  })

  const unreadCount = Object.values(readStatus).filter(isRead => !isRead).length

  // Mark announcement as read
  const markAsRead = async (announcementId: string) => {
    try {
      await announcementService.markAnnouncementRead(announcementId)
      setReadStatus(prev => ({ ...prev, [announcementId]: true }))
    } catch (error) {
      console.error("Error marking announcement as read:", error)
    }
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "urgent":
        return <AlertCircle className="w-4 h-4" />
      case "event":
        return <Calendar className="w-4 h-4" />
      case "general":
        return <Info className="w-4 h-4" />
      case "deadline":
        return <AlertCircle className="w-4 h-4" />
      case "maintenance":
        return <AlertCircle className="w-4 h-4" />
      case "celebration":
        return <CheckCircle className="w-4 h-4" />
      default:
        return <Bell className="w-4 h-4" />
    }
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case "urgent":
        return "bg-red-100 text-red-800"
      case "event":
        return "bg-purple-100 text-purple-800"
      case "general":
        return "bg-blue-100 text-blue-800"
      case "deadline":
        return "bg-orange-100 text-orange-800"
      case "maintenance":
        return "bg-yellow-100 text-yellow-800"
      case "celebration":
        return "bg-green-100 text-green-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "bg-red-500"
      case "medium":
        return "bg-yellow-500"
      case "low":
        return "bg-green-500"
      default:
        return "bg-gray-500"
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col gap-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Announcements</h1>
            <p className="text-gray-600 mt-1">
              Stay updated with the latest news and updates
              {unreadCount > 0 && <Badge className="ml-2 bg-red-500">{unreadCount} unread</Badge>}
            </p>
          </div>
        </div>

        {/* Filters */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Filter className="w-5 h-5" />
              Filters
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    placeholder="Search announcements..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <Select value={filterType} onValueChange={setFilterType}>
                <SelectTrigger className="w-full sm:w-[180px]">
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
              <Select value={filterPriority} onValueChange={setFilterPriority}>
                <SelectTrigger className="w-full sm:w-[180px]">
                  <SelectValue placeholder="Filter by priority" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Priorities</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="low">Low</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Announcements Tabs */}
        <Tabs defaultValue="all" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="all">All Announcements</TabsTrigger>
            <TabsTrigger value="unread">Unread ({unreadCount})</TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="space-y-4">
            {loading ? (
              <div className="flex items-center justify-center h-64">
                <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
                <span className="ml-2 text-gray-600">Loading announcements...</span>
              </div>
            ) : filteredAnnouncements.length === 0 ? (
              <Card>
                <CardContent className="flex flex-col items-center justify-center py-12">
                  <Bell className="w-12 h-12 text-gray-400 mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">No announcements found</h3>
                  <p className="text-gray-600 text-center">
                    {searchTerm || filterType !== "all" || filterPriority !== "all"
                      ? "Try adjusting your search terms or filters to find what you're looking for."
                      : "No announcements available at the moment."}
                  </p>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-4">
                {filteredAnnouncements.map((announcement) => {
                  const isRead = readStatus[announcement.id]
                  return (
                    <Card
                      key={announcement.id}
                      className={`${!isRead ? "border-l-4 border-l-blue-500" : ""}`}
                    >
                      <CardHeader>
                        <div className="flex items-start justify-between">
                          <div className="flex items-start gap-3">
                            <div className={`p-2 rounded-full ${getTypeColor(announcement.type)}`}>
                              {getTypeIcon(announcement.type)}
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-1">
                                <CardTitle className="text-lg">{announcement.title}</CardTitle>
                                {!isRead && (
                                  <Badge variant="secondary" className="text-xs">
                                    New
                                  </Badge>
                                )}
                                {announcement.isPinned && (
                                  <Badge variant="outline" className="text-xs bg-yellow-50 text-yellow-800">
                                    Pinned
                                  </Badge>
                                )}
                              </div>
                              <div className="flex items-center gap-4 text-sm text-gray-600">
                                <div className="flex items-center gap-1">
                                  <Calendar className="w-4 h-4" />
                                  {new Date(announcement.publishDate).toLocaleDateString()}
                                </div>
                                <Badge className={`text-xs ${getTypeColor(announcement.type)}`}>
                                  {announcement.type}
                                </Badge>
                                <div className="flex items-center gap-1">
                                  <div
                                    className={`w-2 h-2 rounded-full ${getPriorityColor(announcement.priority)}`}
                                  ></div>
                                  <span className="capitalize">{announcement.priority}</span>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <p className="text-gray-700 mb-4">{announcement.content}</p>
                        {announcement.priority === "high" && (
                          <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg mb-4">
                            <AlertCircle className="w-4 h-4 text-red-600" />
                            <span className="text-sm text-red-800">High Priority</span>
                          </div>
                        )}
                        {announcement.tags && announcement.tags.length > 0 && (
                          <div className="flex items-center gap-2 mb-4">
                            {announcement.tags.map((tag) => (
                              <Badge key={tag} variant="outline" className="text-xs">
                                {tag}
                              </Badge>
                            ))}
                          </div>
                        )}
                        <div className="flex items-center justify-between mt-4">
                          <span className="text-sm text-gray-500">
                            Views: {announcement.views} • Created: {new Date(announcement.createdAt).toLocaleDateString()}
                          </span>
                          {!isRead && (
                            <Button 
                              size="sm" 
                              variant="outline"
                              onClick={() => markAsRead(announcement.id)}
                            >
                              <CheckCircle className="w-4 h-4 mr-2" />
                              Mark as Read
                            </Button>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  )
                })}
              </div>
            )}
          </TabsContent>

          <TabsContent value="unread" className="space-y-4">
            {loading ? (
              <div className="flex items-center justify-center h-64">
                <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
                <span className="ml-2 text-gray-600">Loading announcements...</span>
              </div>
            ) : filteredAnnouncements.filter((a) => !readStatus[a.id]).length === 0 ? (
              <Card>
                <CardContent className="flex flex-col items-center justify-center py-12">
                  <CheckCircle className="w-12 h-12 text-green-400 mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">All caught up!</h3>
                  <p className="text-gray-600 text-center">You have no unread announcements.</p>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-4">
                {filteredAnnouncements
                  .filter((a) => !readStatus[a.id])
                  .map((announcement) => (
                    <Card key={announcement.id} className="border-l-4 border-l-blue-500">
                      <CardHeader>
                        <div className="flex items-start justify-between">
                          <div className="flex items-start gap-3">
                            <div className={`p-2 rounded-full ${getTypeColor(announcement.type)}`}>
                              {getTypeIcon(announcement.type)}
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-1">
                                <CardTitle className="text-lg">{announcement.title}</CardTitle>
                                <Badge variant="secondary" className="text-xs">
                                  New
                                </Badge>
                                {announcement.isPinned && (
                                  <Badge variant="outline" className="text-xs bg-yellow-50 text-yellow-800">
                                    Pinned
                                  </Badge>
                                )}
                              </div>
                              <div className="flex items-center gap-4 text-sm text-gray-600">
                                <div className="flex items-center gap-1">
                                  <Calendar className="w-4 h-4" />
                                  {new Date(announcement.publishDate).toLocaleDateString()}
                                </div>
                                <Badge className={`text-xs ${getTypeColor(announcement.type)}`}>
                                  {announcement.type}
                                </Badge>
                                <div className="flex items-center gap-1">
                                  <div
                                    className={`w-2 h-2 rounded-full ${getPriorityColor(announcement.priority)}`}
                                  ></div>
                                  <span className="capitalize">{announcement.priority}</span>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <p className="text-gray-700 mb-4">{announcement.content}</p>
                        {announcement.priority === "high" && (
                          <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg mb-4">
                            <AlertCircle className="w-4 h-4 text-red-600" />
                            <span className="text-sm text-red-800">High Priority</span>
                          </div>
                        )}
                        {announcement.tags && announcement.tags.length > 0 && (
                          <div className="flex items-center gap-2 mb-4">
                            {announcement.tags.map((tag) => (
                              <Badge key={tag} variant="outline" className="text-xs">
                                {tag}
                              </Badge>
                            ))}
                          </div>
                        )}
                        <div className="flex items-center justify-between mt-4">
                          <span className="text-sm text-gray-500">
                            Views: {announcement.views} • Created: {new Date(announcement.createdAt).toLocaleDateString()}
                          </span>
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => markAsRead(announcement.id)}
                          >
                            <CheckCircle className="w-4 h-4 mr-2" />
                            Mark as Read
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
