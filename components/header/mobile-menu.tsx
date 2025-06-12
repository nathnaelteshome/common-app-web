"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { MessageSquare, Bell, User, LogOut } from "lucide-react"
import { NavigationLinks } from "./navigation-links"
import type { UserRole } from "@/types/auth"

interface MobileMenuProps {
  isAuthenticated: boolean
  userRole?: UserRole
  isActiveLink: (href: string) => boolean
  onLinkClick: () => void
  unreadMessages: number
  unreadNotifications: number
  onSignOut: () => void
  userProfile?: {
    firstName?: string
    lastName?: string
    avatar?: string
  }
  email?: string
}

/**
 * MobileMenu component displays the mobile navigation menu
 * Shows different navigation based on authentication status and user role
 */
export function MobileMenu({
  isAuthenticated,
  userRole,
  isActiveLink,
  onLinkClick,
  unreadMessages,
  unreadNotifications,
  onSignOut,
  userProfile,
  email,
}: MobileMenuProps) {
  // Get the appropriate route based on user role
  const getRouteByRole = (basePath: string) => {
    if (!userRole) return "/"

    switch (userRole) {
      case "university":
        return `/admin/${basePath}`
      case "admin":
        return `/system-admin/${basePath}`
      case "student":
      default:
        return `/student/${basePath}`
    }
  }

  return (
    <div className="lg:hidden mt-4 pb-4 border-t border-gray-200">
      <nav className="flex flex-col space-y-4 pt-4">
        {/* Navigation Links */}
        <NavigationLinks
          isAuthenticated={isAuthenticated}
          userRole={userRole}
          isActiveLink={isActiveLink}
          isMobile={true}
          onLinkClick={onLinkClick}
        />

        {/* Mobile Profile Section for authenticated users */}
        {isAuthenticated && (
          <div className="pt-4 border-t border-gray-200">
            {/* User Info Card */}
            <div className="flex items-center gap-3 px-3 py-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg mb-4 border border-blue-100">
              <Avatar className="h-12 w-12 ring-2 ring-[#0a5eb2]">
                <AvatarImage
                  src={userProfile?.avatar || "/placeholder.svg?height=48&width=48"}
                  alt={`${userProfile?.firstName} ${userProfile?.lastName}`}
                />
                <AvatarFallback className="bg-[#0a5eb2] text-white">
                  {userProfile?.firstName?.[0]?.toUpperCase() || "U"}
                  {userProfile?.lastName?.[0]?.toUpperCase() || "S"}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">
                  {userProfile?.firstName} {userProfile?.lastName}
                </p>
                <p className="text-xs text-gray-500 truncate">{email}</p>
                <p className="text-xs text-[#0a5eb2] font-medium capitalize">
                  {userRole === "university" ? "University Admin" : userRole === "admin" ? "System Admin" : "Student"}{" "}
                  Account
                </p>
              </div>
            </div>

            {/* Mobile Quick Actions */}
            <div className="grid grid-cols-2 gap-2 mb-4">
              <Button
                variant="outline"
                className="flex flex-col items-center gap-1 h-auto py-3"
                onClick={onLinkClick}
                asChild
              >
                <Link href={getRouteByRole("messages")}>
                  <MessageSquare className="h-4 w-4" />
                  <span className="text-xs">Messages</span>
                  {unreadMessages > 0 && <Badge className="bg-[#fe7702] text-white text-xs">{unreadMessages}</Badge>}
                </Link>
              </Button>
              <Button
                variant="outline"
                className="flex flex-col items-center gap-1 h-auto py-3"
                onClick={onLinkClick}
                asChild
              >
                <Link href={getRouteByRole("notifications")}>
                  <Bell className="h-4 w-4" />
                  <span className="text-xs">Notifications</span>
                  {unreadNotifications > 0 && (
                    <Badge className="bg-red-500 text-white text-xs">{unreadNotifications}</Badge>
                  )}
                </Link>
              </Button>
            </div>

            {/* Mobile Profile Actions */}
            <div className="flex flex-col gap-2">
              <Button variant="outline" className="w-full justify-start" onClick={onLinkClick} asChild>
                <Link href={getRouteByRole("profile")} className="flex items-center">
                  <User className="mr-2 h-4 w-4" />
                  Profile
                </Link>
              </Button>

              <Button
                variant="ghost"
                className="w-full justify-start text-red-600 hover:text-red-600 hover:bg-red-50"
                onClick={() => {
                  onLinkClick()
                  onSignOut()
                }}
              >
                <LogOut className="mr-2 h-4 w-4" />
                Sign Out
              </Button>
            </div>
          </div>
        )}

        {/* Mobile Auth Buttons for Non-Authenticated Users */}
        {!isAuthenticated && (
          <div className="flex flex-col gap-3 pt-4 border-t border-gray-200">
            <Button
              variant="outline"
              className="w-full border-[#0a5eb2] text-[#0a5eb2] hover:bg-[#0a5eb2] hover:text-white"
              onClick={onLinkClick}
              asChild
            >
              <Link href="/auth/create-account">Create Account</Link>
            </Button>
            <Button className="w-full bg-[#0a5eb2] hover:bg-[#0a5eb2]/90 text-white" onClick={onLinkClick} asChild>
              <Link href="/auth/sign-in">Sign-In</Link>
            </Button>
          </div>
        )}
      </nav>
    </div>
  )
}
