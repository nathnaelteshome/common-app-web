import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import type { UserRole } from "@/types/auth"

interface UserDropdownProps {
  userProfile?: {
    firstName?: string
    lastName?: string
    avatar?: string
  }
  email?: string
  userRole?: UserRole
}

/**
 * UserDropdown component displays the user avatar with a dropdown menu
 * Contains user information and quick links
 */
export function UserDropdown({ userProfile, email, userRole }: UserDropdownProps) {
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

  // Get role display name
  const getRoleDisplayName = () => {
    switch (userRole) {
      case "university":
        return "University Admin"
      case "admin":
        return "System Admin"
      case "student":
      default:
        return "Student"
    }
  }

  return (
    <div className="relative ml-2">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            className="relative h-10 w-10 rounded-full hover:bg-gray-100 focus:ring-2 focus:ring-[#0a5eb2] focus:ring-offset-2 focus:outline-none transition-all"
            aria-label="User menu"
          >
            <Avatar className="h-8 w-8">
              <AvatarImage
                src={userProfile?.avatar || "/placeholder.svg?height=32&width=32"}
                alt={`${userProfile?.firstName} ${userProfile?.lastName}`}
              />
              <AvatarFallback className="bg-[#0a5eb2] text-white text-xs font-medium">
                {userProfile?.firstName?.[0]?.toUpperCase() || "U"}
                {userProfile?.lastName?.[0]?.toUpperCase() || "S"}
              </AvatarFallback>
            </Avatar>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          className="w-64 z-50 shadow-lg border border-gray-200"
          align="end"
          forceMount
          sideOffset={8}
          avoidCollisions={true}
        >
          {/* User Info Header */}
          <DropdownMenuLabel className="font-normal p-3">
            <div className="flex items-center space-x-3">
              <Avatar className="h-10 w-10">
                <AvatarImage
                  src={userProfile?.avatar || "/placeholder.svg?height=40&width=40"}
                  alt={`${userProfile?.firstName} ${userProfile?.lastName}`}
                />
                <AvatarFallback className="bg-[#0a5eb2] text-white">
                  {userProfile?.firstName?.[0]?.toUpperCase() || "U"}
                  {userProfile?.lastName?.[0]?.toUpperCase() || "S"}
                </AvatarFallback>
              </Avatar>
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium leading-none text-gray-900">
                  {userProfile?.firstName} {userProfile?.lastName}
                </p>
                <p className="text-xs leading-none text-gray-500">{email}</p>
                <p className="text-xs leading-none text-gray-400 capitalize bg-gray-100 px-2 py-1 rounded-full inline-block">
                  {getRoleDisplayName()} Account
                </p>
              </div>
            </div>
          </DropdownMenuLabel>

          <DropdownMenuSeparator />

          {/* Quick Links */}
          <DropdownMenuItem asChild className="cursor-pointer hover:bg-gray-50 p-2">
            <Link href={getRouteByRole("dashboard")} className="flex items-center w-full">
              <span className="text-sm">Dashboard</span>
            </Link>
          </DropdownMenuItem>

          <DropdownMenuItem asChild className="cursor-pointer hover:bg-gray-50 p-2">
            <Link href={getRouteByRole("applications")} className="flex items-center w-full">
              <span className="text-sm">Applications</span>
            </Link>
          </DropdownMenuItem>

          <DropdownMenuItem asChild className="cursor-pointer hover:bg-gray-50 p-2">
            <Link href={getRouteByRole("settings")} className="flex items-center w-full">
              <span className="text-sm">Settings</span>
            </Link>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}
