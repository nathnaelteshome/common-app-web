"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Search, MoreVertical, Archive, Star, Reply } from "lucide-react"
import { useAuthStore } from "@/store/auth-store"

// Mock messages data
const mockMessages = [
  {
    id: 1,
    sender: "University of Addis Ababa",
    senderAvatar: "/placeholder.svg?height=40&width=40",
    subject: "Application Status Update",
    preview: "Your application for Computer Science has been reviewed...",
    content:
      "Dear Student, We are pleased to inform you that your application for the Computer Science program has been reviewed and moved to the next stage. Please check your application portal for detailed information.",
    timestamp: "2 hours ago",
    isRead: false,
    isStarred: true,
    type: "university",
  },
  {
    id: 2,
    sender: "CommonApply Support",
    senderAvatar: "/placeholder.svg?height=40&width=40",
    subject: "Welcome to CommonApply",
    preview: "Thank you for joining CommonApply platform...",
    content:
      "Welcome to CommonApply! We're excited to help you with your university application journey. Here are some tips to get started with your applications.",
    timestamp: "1 day ago",
    isRead: true,
    isStarred: false,
    type: "system",
  },
  {
    id: 3,
    sender: "Jimma University",
    senderAvatar: "/placeholder.svg?height=40&width=40",
    subject: "Document Verification Required",
    preview: "Please submit additional documents for verification...",
    content:
      "We need you to submit additional documents for your application verification. Please upload your high school transcripts and recommendation letters.",
    timestamp: "3 days ago",
    isRead: false,
    isStarred: false,
    type: "university",
  },
  {
    id: 4,
    sender: "Hawassa University",
    senderAvatar: "/placeholder.svg?height=40&width=40",
    subject: "Interview Invitation",
    preview: "You have been invited for an interview...",
    content:
      "Congratulations! You have been selected for an interview for the Engineering program. Please schedule your interview through the provided link.",
    timestamp: "5 days ago",
    isRead: true,
    isStarred: true,
    type: "university",
  },
  {
    id: 5,
    sender: "CommonApply Notifications",
    senderAvatar: "/placeholder.svg?height=40&width=40",
    subject: "Application Deadline Reminder",
    preview: "Don't forget about upcoming deadlines...",
    content:
      "This is a reminder that several application deadlines are approaching. Please review your pending applications and submit them before the deadline.",
    timestamp: "1 week ago",
    isRead: true,
    isStarred: false,
    type: "system",
  },
]

export default function MessagesPage() {
  const { user } = useAuthStore()
  const [selectedMessage, setSelectedMessage] = useState(mockMessages[0])
  const [searchQuery, setSearchQuery] = useState("")
  const [activeTab, setActiveTab] = useState("all")

  const filteredMessages = mockMessages.filter((message) => {
    const matchesSearch =
      message.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
      message.sender.toLowerCase().includes(searchQuery.toLowerCase()) ||
      message.preview.toLowerCase().includes(searchQuery.toLowerCase())

    if (activeTab === "all") return matchesSearch
    if (activeTab === "unread") return matchesSearch && !message.isRead
    if (activeTab === "starred") return matchesSearch && message.isStarred
    if (activeTab === "university") return matchesSearch && message.type === "university"
    if (activeTab === "system") return matchesSearch && message.type === "system"

    return matchesSearch
  })

  const unreadCount = mockMessages.filter((m) => !m.isRead).length

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Messages</h1>
            <p className="text-gray-600 mt-1">Manage your communications with universities and system notifications</p>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="secondary" className="bg-red-100 text-red-700">
              {unreadCount} Unread
            </Badge>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Messages List */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader className="pb-3">
                <div className="flex items-center gap-2">
                  <Search className="w-4 h-4 text-gray-400" />
                  <Input
                    placeholder="Search messages..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="border-0 focus-visible:ring-0 focus-visible:ring-offset-0"
                  />
                </div>
              </CardHeader>
              <CardContent className="p-0">
                <Tabs value={activeTab} onValueChange={setActiveTab}>
                  <TabsList className="grid w-full grid-cols-3 mb-4 mx-4">
                    <TabsTrigger value="all" className="text-xs">
                      All
                    </TabsTrigger>
                    <TabsTrigger value="unread" className="text-xs">
                      Unread
                    </TabsTrigger>
                    <TabsTrigger value="starred" className="text-xs">
                      Starred
                    </TabsTrigger>
                  </TabsList>

                  <div className="max-h-[600px] overflow-y-auto">
                    {filteredMessages.map((message) => (
                      <div
                        key={message.id}
                        onClick={() => setSelectedMessage(message)}
                        className={`p-4 border-b border-gray-100 cursor-pointer hover:bg-gray-50 transition-colors ${
                          selectedMessage.id === message.id ? "bg-blue-50 border-l-4 border-l-[#0a5eb2]" : ""
                        }`}
                      >
                        <div className="flex items-start gap-3">
                          <Avatar className="h-10 w-10">
                            <AvatarImage src={message.senderAvatar || "/placeholder.svg"} alt={message.sender} />
                            <AvatarFallback className="bg-[#0a5eb2] text-white text-xs">
                              {message.sender
                                .split(" ")
                                .map((n) => n[0])
                                .join("")}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between">
                              <p className={`text-sm truncate ${!message.isRead ? "font-semibold" : "font-medium"}`}>
                                {message.sender}
                              </p>
                              <div className="flex items-center gap-1">
                                {message.isStarred && <Star className="w-3 h-3 text-yellow-500 fill-current" />}
                                {!message.isRead && <div className="w-2 h-2 bg-[#0a5eb2] rounded-full" />}
                              </div>
                            </div>
                            <p className={`text-sm truncate ${!message.isRead ? "font-medium" : ""}`}>
                              {message.subject}
                            </p>
                            <p className="text-xs text-gray-500 truncate">{message.preview}</p>
                            <p className="text-xs text-gray-400 mt-1">{message.timestamp}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </Tabs>
              </CardContent>
            </Card>
          </div>

          {/* Message Content */}
          <div className="lg:col-span-2">
            <Card className="h-full">
              <CardHeader className="border-b border-gray-100">
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3">
                    <Avatar className="h-12 w-12">
                      <AvatarImage
                        src={selectedMessage.senderAvatar || "/placeholder.svg"}
                        alt={selectedMessage.sender}
                      />
                      <AvatarFallback className="bg-[#0a5eb2] text-white">
                        {selectedMessage.sender
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <CardTitle className="text-lg">{selectedMessage.subject}</CardTitle>
                      <CardDescription className="flex items-center gap-2">
                        <span>From: {selectedMessage.sender}</span>
                        <Badge variant="outline" className="text-xs">
                          {selectedMessage.type === "university" ? "University" : "System"}
                        </Badge>
                      </CardDescription>
                      <p className="text-xs text-gray-500 mt-1">{selectedMessage.timestamp}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button variant="ghost" size="icon">
                      <Star
                        className={`w-4 h-4 ${selectedMessage.isStarred ? "text-yellow-500 fill-current" : "text-gray-400"}`}
                      />
                    </Button>
                    <Button variant="ghost" size="icon">
                      <Archive className="w-4 h-4 text-gray-400" />
                    </Button>
                    <Button variant="ghost" size="icon">
                      <MoreVertical className="w-4 h-4 text-gray-400" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="flex-1 p-6">
                <div className="prose max-w-none">
                  <p className="text-gray-700 leading-relaxed">{selectedMessage.content}</p>
                </div>

                {selectedMessage.type === "university" && (
                  <div className="mt-6 pt-6 border-t border-gray-100">
                    <div className="flex items-center gap-2">
                      <Button size="sm" className="bg-[#0a5eb2] hover:bg-[#0a5eb2]/90">
                        <Reply className="w-4 h-4 mr-2" />
                        Reply
                      </Button>
                      <Button variant="outline" size="sm">
                        View Application
                      </Button>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
