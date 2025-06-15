"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Search, Send, MessageSquare } from "lucide-react"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"

export default function AdminMessagesPage() {
  const [selectedConversation, setSelectedConversation] = useState(null)

  const conversations = [
    {
      id: 1,
      name: "John Smith",
      role: "Student",
      lastMessage: "Thank you for reviewing my application",
      time: "2 hours ago",
      unread: 2,
      avatar: "/placeholder.svg?height=40&width=40",
    },
    {
      id: 2,
      name: "Sarah Johnson",
      role: "Student",
      lastMessage: "When will the results be announced?",
      time: "1 day ago",
      unread: 0,
      avatar: "/placeholder.svg?height=40&width=40",
    },
    {
      id: 3,
      name: "System Admin",
      role: "Admin",
      lastMessage: "New policy updates available",
      time: "2 days ago",
      unread: 1,
      avatar: "/placeholder.svg?height=40&width=40",
    },
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Messages</h1>
              <p className="text-gray-600 mt-1">Communicate with students and system administrators</p>
            </div>
            <Button>
              <Send className="w-4 h-4 mr-2" />
              New Message
            </Button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Conversations List */}
            <div className="lg:col-span-1">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MessageSquare className="w-5 h-5" />
                    Conversations
                  </CardTitle>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <Input placeholder="Search conversations..." className="pl-10" />
                  </div>
                </CardHeader>
                <CardContent className="p-0">
                  <div className="space-y-1">
                    {conversations.map((conversation) => (
                      <div
                        key={conversation.id}
                        className="flex items-center gap-3 p-4 hover:bg-gray-50 cursor-pointer border-b border-gray-100 last:border-b-0"
                        onClick={() => setSelectedConversation(conversation)}
                      >
                        <Avatar className="w-10 h-10">
                          <AvatarImage src={conversation.avatar || "/placeholder.svg"} alt={conversation.name} />
                          <AvatarFallback>{conversation.name[0]}</AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <p className="text-sm font-medium text-gray-900 truncate">{conversation.name}</p>
                            <p className="text-xs text-gray-500">{conversation.time}</p>
                          </div>
                          <div className="flex items-center justify-between">
                            <p className="text-sm text-gray-600 truncate">{conversation.lastMessage}</p>
                            {conversation.unread > 0 && (
                              <Badge className="bg-blue-500 text-white text-xs">{conversation.unread}</Badge>
                            )}
                          </div>
                          <p className="text-xs text-gray-400">{conversation.role}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Message View */}
            <div className="lg:col-span-2">
              <Card className="h-[600px] flex flex-col">
                <CardHeader>
                  <CardTitle>{selectedConversation ? selectedConversation.name : "Select a conversation"}</CardTitle>
                  {selectedConversation && <CardDescription>{selectedConversation.role}</CardDescription>}
                </CardHeader>
                <CardContent className="flex-1 flex flex-col">
                  {selectedConversation ? (
                    <>
                      <div className="flex-1 bg-gray-50 rounded-lg p-4 mb-4 overflow-y-auto">
                        <div className="space-y-4">
                          <div className="flex justify-start">
                            <div className="bg-white p-3 rounded-lg shadow-sm max-w-xs">
                              <p className="text-sm">Hello, I have a question about my application status.</p>
                              <p className="text-xs text-gray-500 mt-1">10:30 AM</p>
                            </div>
                          </div>
                          <div className="flex justify-end">
                            <div className="bg-blue-500 text-white p-3 rounded-lg shadow-sm max-w-xs">
                              <p className="text-sm">
                                Hi! I'll check your application status and get back to you shortly.
                              </p>
                              <p className="text-xs text-blue-100 mt-1">10:35 AM</p>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Input placeholder="Type your message..." className="flex-1" />
                        <Button>
                          <Send className="w-4 h-4" />
                        </Button>
                      </div>
                    </>
                  ) : (
                    <div className="flex-1 flex items-center justify-center text-gray-500">
                      <div className="text-center">
                        <MessageSquare className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                        <p>Select a conversation to start messaging</p>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  )
}
