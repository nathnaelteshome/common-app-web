"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Plus, Search, TrendingUp, MessageSquare, CreditCard, Bell } from "lucide-react"
import Link from "next/link"

export function QuickActions() {
  const actions = [
    {
      title: "New Application",
      description: "Start a new university application",
      icon: Plus,
      href: "/student/applications/new",
      color: "bg-blue-500 hover:bg-blue-600",
    },
    {
      title: "Browse Universities",
      description: "Explore universities and programs",
      icon: Search,
      href: "/colleges",
      color: "bg-green-500 hover:bg-green-600",
    },
    {
      title: "Compare Universities",
      description: "Compare universities side-by-side",
      icon: TrendingUp,
      href: "/student/compare",
      color: "bg-purple-500 hover:bg-purple-600",
    },
    {
      title: "Messages",
      description: "Check messages from universities",
      icon: MessageSquare,
      href: "/student/messages",
      color: "bg-orange-500 hover:bg-orange-600",
    },
    {
      title: "Payment History",
      description: "View payment history and receipts",
      icon: CreditCard,
      href: "/student/payments",
      color: "bg-indigo-500 hover:bg-indigo-600",
    },
    {
      title: "Notifications",
      description: "View all notifications and updates",
      icon: Bell,
      href: "/student/notifications",
      color: "bg-pink-500 hover:bg-pink-600",
    },
  ]

  return (
    <Card>
      <CardHeader>
        <CardTitle>Quick Actions</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {actions.map((action) => {
            const Icon = action.icon
            return (
              <Button
                key={action.title}
                variant="outline"
                className="h-auto p-4 flex flex-col items-center gap-2 hover:shadow-md transition-all"
                asChild
              >
                <Link href={action.href}>
                  <div className={`w-10 h-10 rounded-lg ${action.color} flex items-center justify-center`}>
                    <Icon className="w-5 h-5 text-white" />
                  </div>
                  <div className="text-center">
                    <div className="font-medium text-sm">{action.title}</div>
                    <div className="text-xs text-gray-500 hidden sm:block">{action.description}</div>
                  </div>
                </Link>
              </Button>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}
