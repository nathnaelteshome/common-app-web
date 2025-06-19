"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { LogOut, User } from "lucide-react"
import type { UserRole } from "@/types/auth"
import { UserDropdown } from "./user-dropdown"

interface UserActionsProps {
  isAuthenticated: boolean
  userRole?: UserRole
  onSignOut: () => Promise<void>
  userProfile?: {
    firstName?: string
    lastName?: string
    avatar?: string
  }
  email?: string
}

/**
 * UserActions component displays authentication-related actions
 * Shows sign-in/create account buttons for unauthenticated users
 * Shows profile links for authenticated users
 */
export function UserActions({
  isAuthenticated,
  userRole,
  onSignOut,
  userProfile,
  email,
}: UserActionsProps) {
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

  // For authenticated users
  if (isAuthenticated) {
    return (
      <div className="hidden md:flex items-center gap-1">
        {/* Profile Icon */}
        <Button variant="ghost" size="icon" className="relative hover:bg-gray-100 transition-colors" asChild>
          <Link href={getRouteByRole("profile")} aria-label="Profile">
            <User className="w-5 h-5 text-gray-600" />
          </Link>
        </Button>

        {/* Sign Out Icon */}
        <Button
          variant="ghost"
          size="icon"
          className="relative hover:bg-gray-100 transition-colors text-red-600 hover:text-red-700"
          onClick={async () => await onSignOut()}
          aria-label="Sign Out"
        >
          <LogOut className="w-5 h-5" />
        </Button>

        {/* User Avatar with Dropdown */}
        <UserDropdown userProfile={userProfile} email={email} userRole={userRole} />
      </div>
    )
  }

  // For unauthenticated users
  return (
    <div className="hidden md:flex items-center gap-4">
      <Button
        variant="outline"
        className="hidden lg:flex border-[#0a5eb2] text-[#0a5eb2] hover:bg-[#0a5eb2] hover:text-white transition-colors"
        asChild
      >
        <Link href="/auth/create-account">Create Account</Link>
      </Button>
      <Button className="bg-[#0a5eb2] hover:bg-[#0a5eb2]/90 text-white transition-colors" asChild>
        <Link href="/auth/sign-in">Sign-In</Link>
      </Button>
    </div>
  )
}
