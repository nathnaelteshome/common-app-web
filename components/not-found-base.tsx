"use client"

import type React from "react"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Home, Search } from "lucide-react"
import Link from "next/link"
import { useState } from "react"
import { useRouter } from "next/navigation"

interface NotFoundBaseProps {
  title?: string
  description?: string
  illustration?: React.ReactNode
  primaryAction?: {
    label: string
    href: string
    icon?: React.ReactNode
  }
  secondaryActions?: Array<{
    label: string
    href: string
    icon?: React.ReactNode
  }>
  showSearch?: boolean
  searchPlaceholder?: string
  onSearch?: (query: string) => void
  className?: string
}

export function NotFoundBase({
  title = "Page Not Found",
  description = "Sorry, we couldn't find the page you're looking for.",
  illustration,
  primaryAction = {
    label: "Go Home",
    href: "/",
    icon: <Home className="w-4 h-4" />,
  },
  secondaryActions = [],
  showSearch = false,
  searchPlaceholder = "Search...",
  onSearch,
  className = "",
}: NotFoundBaseProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const router = useRouter()

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      if (onSearch) {
        onSearch(searchQuery)
      } else {
        router.push(`/search?q=${encodeURIComponent(searchQuery)}`)
      }
    }
  }

  const defaultIllustration = (
    <div className="relative w-64 h-64 mx-auto mb-8">
      <div className="absolute inset-0 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full opacity-20" />
      <div className="absolute inset-8 bg-gradient-to-br from-blue-200 to-purple-200 rounded-full opacity-30" />
      <div className="absolute inset-16 bg-gradient-to-br from-blue-300 to-purple-300 rounded-full opacity-40" />
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="text-8xl font-bold text-gray-300">404</div>
      </div>
    </div>
  )

  return (
    <div
      className={`min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-4 ${className}`}
    >
      <Card className="w-full max-w-2xl shadow-xl">
        <CardContent className="p-8 text-center">
          {illustration || defaultIllustration}

          <h1 className="text-4xl font-bold text-gray-900 mb-4">{title}</h1>

          <p className="text-lg text-gray-600 mb-8 max-w-md mx-auto">{description}</p>

          {showSearch && (
            <form onSubmit={handleSearch} className="mb-8">
              <div className="flex gap-2 max-w-md mx-auto">
                <Input
                  type="text"
                  placeholder={searchPlaceholder}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="flex-1"
                />
                <Button type="submit" size="icon">
                  <Search className="w-4 h-4" />
                </Button>
              </div>
            </form>
          )}

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button asChild size="lg" className="min-w-[140px]">
              <Link href={primaryAction.href}>
                {primaryAction.icon}
                {primaryAction.label}
              </Link>
            </Button>

            {secondaryActions.map((action, index) => (
              <Button key={index} asChild variant="outline" size="lg" className="min-w-[140px]">
                <Link href={action.href}>
                  {action.icon}
                  {action.label}
                </Link>
              </Button>
            ))}
          </div>

          <div className="mt-8 pt-8 border-t border-gray-200">
            <p className="text-sm text-gray-500">
              Need help?{" "}
              <Link href="/contact" className="text-blue-600 hover:underline">
                Contact our support team
              </Link>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
