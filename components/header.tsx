"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Phone,
  Mail,
  MapPin,
  Facebook,
  Instagram,
  Linkedin,
  Youtube,
  Menu,
  X,
  Bell,
  MessageSquare,
  LogOut,
  User,
} from "lucide-react"
import { useState } from "react"
import { usePathname, useRouter } from "next/navigation"
import { useAuthStore } from "@/store/auth-store"
import { mockNotifications } from "@/data/mock-data"
import { toast } from "sonner"

export function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  const pathname = usePathname()
  const { user, isAuthenticated, signOut } = useAuthStore()
  const router = useRouter()

  const isActiveLink = (href: string) => {
    if (href === "/") {
      return pathname === "/"
    }
    return pathname.startsWith(href)
  }

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen)
  }

  const handleSignOut = () => {
    signOut()
    toast.success("Successfully signed out")
    router.push("/")
  }

  // Mock data for notifications and messages
  const unreadNotifications = mockNotifications.filter((n) => !n.isRead).length
  const unreadMessages = 5 // Mock unread messages count

  // Get the appropriate brand text and link based on user role
  const getBrandInfo = () => {
    if (!isAuthenticated) {
      return { text: "CommonApply", href: "/" }
    }

    switch (user?.role) {
      case "university":
        return { text: "Admin Dashboard", href: "/admin/dashboard" }
      case "admin":
        return { text: "System Admin Dashboard", href: "/system-admin/dashboard" }
      case "student":
      default:
        return { text: "CommonApply", href: "/" }
    }
  }

  const brandInfo = getBrandInfo()

  return (
    <header className="w-full">
      {/* Top Bar - Only show for students and non-authenticated users */}
      {(!isAuthenticated || user?.role === "student") && (
        <div className="bg-[#17254e] text-white py-2 px-4">
          <div className="container mx-auto flex flex-wrap items-center justify-between text-sm">
            <div className="flex flex-wrap items-center gap-2 md:gap-4">
              <div className="flex items-center gap-1 md:gap-2">
                <Phone className="w-3 h-3 md:w-4 md:h-4" />
                <span className="text-xs md:text-sm">(+251) 911221122</span>
              </div>
              <div className="flex items-center gap-1 md:gap-2">
                <Mail className="w-3 h-3 md:w-4 md:h-4" />
                <span className="text-xs md:text-sm hidden sm:inline">commonapply@gmail.com</span>
              </div>
              <div className="flex items-center gap-1 md:gap-2">
                <MapPin className="w-3 h-3 md:w-4 md:h-4" />
                <span className="text-xs md:text-sm hidden md:inline">Addis Ababa, Ethiopia</span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Facebook className="w-3 h-3 md:w-4 md:h-4 cursor-pointer hover:opacity-80" />
              <Instagram className="w-3 h-3 md:w-4 md:h-4 cursor-pointer hover:opacity-80" />
              <Linkedin className="w-3 h-3 md:w-4 md:h-4 cursor-pointer hover:opacity-80" />
              <Youtube className="w-3 h-3 md:w-4 md:h-4 cursor-pointer hover:opacity-80" />
            </div>
          </div>
        </div>
      )}

      {/* Main Navigation */}
      <div className="bg-white shadow-sm py-4 px-4">
        <div className="container mx-auto flex items-center justify-between">
          {/* Brand/Logo */}
          <Link href={brandInfo.href} className="text-xl md:text-2xl font-bold text-[#17254e] font-sora">
            {brandInfo.text}
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-8">
            {/* Student and non-authenticated user navigation */}
            {(!isAuthenticated || user?.role === "student") && (
              <>
                {!isAuthenticated && (
                  <Link
                    href="/"
                    className={`font-medium transition-colors relative ${
                      isActiveLink("/") ? "text-[#0a5eb2]" : "text-gray-700 hover:text-[#0a5eb2]"
                    }`}
                  >
                    Home
                    {isActiveLink("/") && <span className="absolute -bottom-1 left-0 w-full h-0.5 bg-[#0a5eb2]"></span>}
                  </Link>
                )}

                {isAuthenticated && user?.role === "student" && (
                  <>
                    <Link
                      href="/student/dashboard"
                      className={`font-medium transition-colors relative ${
                        isActiveLink("/student/dashboard") ? "text-[#0a5eb2]" : "text-gray-700 hover:text-[#0a5eb2]"
                      }`}
                    >
                      Dashboard
                      {isActiveLink("/student/dashboard") && (
                        <span className="absolute -bottom-1 left-0 w-full h-0.5 bg-[#0a5eb2]"></span>
                      )}
                    </Link>
                    <Link
                      href="/colleges"
                      className={`font-medium transition-colors relative ${
                        isActiveLink("/colleges") ? "text-[#0a5eb2]" : "text-gray-700 hover:text-[#0a5eb2]"
                      }`}
                    >
                      Find College
                      {isActiveLink("/colleges") && (
                        <span className="absolute -bottom-1 left-0 w-full h-0.5 bg-[#0a5eb2]"></span>
                      )}
                    </Link>
                    <Link
                      href="/student/payments"
                      className={`font-medium transition-colors relative ${
                        isActiveLink("/student/payments") ? "text-[#0a5eb2]" : "text-gray-700 hover:text-[#0a5eb2]"
                      }`}
                    >
                      Payment
                      {isActiveLink("/student/payments") && (
                        <span className="absolute -bottom-1 left-0 w-full h-0.5 bg-[#0a5eb2]"></span>
                      )}
                    </Link>
                  </>
                )}

                {!isAuthenticated && (
                  <>
                    <Link
                      href="/colleges"
                      className={`font-medium transition-colors relative ${
                        isActiveLink("/colleges") ? "text-[#0a5eb2]" : "text-gray-700 hover:text-[#0a5eb2]"
                      }`}
                    >
                      Colleges
                      {isActiveLink("/colleges") && (
                        <span className="absolute -bottom-1 left-0 w-full h-0.5 bg-[#0a5eb2]"></span>
                      )}
                    </Link>
                    <Link
                      href="/about"
                      className={`font-medium transition-colors relative ${
                        isActiveLink("/about") ? "text-[#0a5eb2]" : "text-gray-700 hover:text-[#0a5eb2]"
                      }`}
                    >
                      About Us
                      {isActiveLink("/about") && (
                        <span className="absolute -bottom-1 left-0 w-full h-0.5 bg-[#0a5eb2]"></span>
                      )}
                    </Link>
                    <Link
                      href="/blog"
                      className={`font-medium transition-colors relative ${
                        isActiveLink("/blog") ? "text-[#0a5eb2]" : "text-gray-700 hover:text-[#0a5eb2]"
                      }`}
                    >
                      Blog
                      {isActiveLink("/blog") && (
                        <span className="absolute -bottom-1 left-0 w-full h-0.5 bg-[#0a5eb2]"></span>
                      )}
                    </Link>
                    <Link
                      href="/contact"
                      className={`font-medium transition-colors relative ${
                        isActiveLink("/contact") ? "text-[#0a5eb2]" : "text-gray-700 hover:text-[#0a5eb2]"
                      }`}
                    >
                      Contact
                      {isActiveLink("/contact") && (
                        <span className="absolute -bottom-1 left-0 w-full h-0.5 bg-[#0a5eb2]"></span>
                      )}
                    </Link>
                  </>
                )}

                {isAuthenticated && user?.role === "student" && (
                  <>
                    <Link
                      href="/about"
                      className={`font-medium transition-colors relative ${
                        isActiveLink("/about") ? "text-[#0a5eb2]" : "text-gray-700 hover:text-[#0a5eb2]"
                      }`}
                    >
                      About Us
                      {isActiveLink("/about") && (
                        <span className="absolute -bottom-1 left-0 w-full h-0.5 bg-[#0a5eb2]"></span>
                      )}
                    </Link>
                    <Link
                      href="/blog"
                      className={`font-medium transition-colors relative ${
                        isActiveLink("/blog") ? "text-[#0a5eb2]" : "text-gray-700 hover:text-[#0a5eb2]"
                      }`}
                    >
                      Blog
                      {isActiveLink("/blog") && (
                        <span className="absolute -bottom-1 left-0 w-full h-0.5 bg-[#0a5eb2]"></span>
                      )}
                    </Link>
                    <Link
                      href="/contact"
                      className={`font-medium transition-colors relative ${
                        isActiveLink("/contact") ? "text-[#0a5eb2]" : "text-gray-700 hover:text-[#0a5eb2]"
                      }`}
                    >
                      Contact
                      {isActiveLink("/contact") && (
                        <span className="absolute -bottom-1 left-0 w-full h-0.5 bg-[#0a5eb2]"></span>
                      )}
                    </Link>
                  </>
                )}
              </>
            )}

            {/* Admin navigation - minimal, focused on admin functions */}
            {isAuthenticated && user?.role === "university" && (
              <>
                <Link
                  href="/admin/applications"
                  className={`font-medium transition-colors relative ${
                    isActiveLink("/admin/applications") ? "text-[#0a5eb2]" : "text-gray-700 hover:text-[#0a5eb2]"
                  }`}
                >
                  Applications
                  {isActiveLink("/admin/applications") && (
                    <span className="absolute -bottom-1 left-0 w-full h-0.5 bg-[#0a5eb2]"></span>
                  )}
                </Link>
                <Link
                  href="/admin/blog"
                  className={`font-medium transition-colors relative ${
                    isActiveLink("/admin/blog") ? "text-[#0a5eb2]" : "text-gray-700 hover:text-[#0a5eb2]"
                  }`}
                >
                  Blog
                  {isActiveLink("/admin/blog") && (
                    <span className="absolute -bottom-1 left-0 w-full h-0.5 bg-[#0a5eb2]"></span>
                  )}
                </Link>
                <Link
                  href="/admin/forms"
                  className={`font-medium transition-colors relative ${
                    isActiveLink("/admin/forms") ? "text-[#0a5eb2]" : "text-gray-700 hover:text-[#0a5eb2]"
                  }`}
                >
                  Forms
                  {isActiveLink("/admin/forms") && (
                    <span className="absolute -bottom-1 left-0 w-full h-0.5 bg-[#0a5eb2]"></span>
                  )}
                </Link>
                <Link
                  href="/admin/settings"
                  className={`font-medium transition-colors relative ${
                    isActiveLink("/admin/settings") ? "text-[#0a5eb2]" : "text-gray-700 hover:text-[#0a5eb2]"
                  }`}
                >
                  Settings
                  {isActiveLink("/admin/settings") && (
                    <span className="absolute -bottom-1 left-0 w-full h-0.5 bg-[#0a5eb2]"></span>
                  )}
                </Link>
              </>
            )}

            {/* System Admin navigation */}
            {isAuthenticated && user?.role === "admin" && (
              <>
                <Link
                  href="/system-admin/universities"
                  className={`font-medium transition-colors relative ${
                    isActiveLink("/system-admin/universities") ? "text-[#0a5eb2]" : "text-gray-700 hover:text-[#0a5eb2]"
                  }`}
                >
                  Universities
                  {isActiveLink("/system-admin/universities") && (
                    <span className="absolute -bottom-1 left-0 w-full h-0.5 bg-[#0a5eb2]"></span>
                  )}
                </Link>
                <Link
                  href="/system-admin/payments"
                  className={`font-medium transition-colors relative ${
                    isActiveLink("/system-admin/payments") ? "text-[#0a5eb2]" : "text-gray-700 hover:text-[#0a5eb2]"
                  }`}
                >
                  Payments
                  {isActiveLink("/system-admin/payments") && (
                    <span className="absolute -bottom-1 left-0 w-full h-0.5 bg-[#0a5eb2]"></span>
                  )}
                </Link>
                <Link
                  href="/system-admin/settings"
                  className={`font-medium transition-colors relative ${
                    isActiveLink("/system-admin/settings") ? "text-[#0a5eb2]" : "text-gray-700 hover:text-[#0a5eb2]"
                  }`}
                >
                  System Settings
                  {isActiveLink("/system-admin/settings") && (
                    <span className="absolute -bottom-1 left-0 w-full h-0.5 bg-[#0a5eb2]"></span>
                  )}
                </Link>
              </>
            )}
          </nav>

          {/* Desktop Action Icons - Always visible on large screens when authenticated */}
          {isAuthenticated ? (
            <div className="hidden md:flex items-center gap-1">
              {/* Messages Icon with Badge */}
              <Button variant="ghost" size="icon" className="relative hover:bg-gray-100 transition-colors" asChild>
                <Link
                  href={
                    user?.role === "university"
                      ? "/admin/messages"
                      : user?.role === "admin"
                        ? "/system-admin/messages"
                        : "/student/messages"
                  }
                  aria-label={`Messages ${unreadMessages > 0 ? `(${unreadMessages} unread)` : ""}`}
                >
                  <MessageSquare className="w-5 h-5 text-gray-600" />
                  {unreadMessages > 0 && (
                    <Badge className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center p-0 text-xs bg-[#fe7702] hover:bg-[#fe7702] border-2 border-white">
                      {unreadMessages > 99 ? "99+" : unreadMessages}
                    </Badge>
                  )}
                </Link>
              </Button>

              {/* Notifications Icon with Badge */}
              <Button variant="ghost" size="icon" className="relative hover:bg-gray-100 transition-colors" asChild>
                <Link
                  href={
                    user?.role === "university"
                      ? "/admin/notifications"
                      : user?.role === "admin"
                        ? "/system-admin/notifications"
                        : "/student/notifications"
                  }
                  aria-label={`Notifications ${unreadNotifications > 0 ? `(${unreadNotifications} unread)` : ""}`}
                >
                  <Bell className="w-5 h-5 text-gray-600" />
                  {unreadNotifications > 0 && (
                    <Badge className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center p-0 text-xs bg-red-500 hover:bg-red-500 border-2 border-white">
                      {unreadNotifications > 99 ? "99+" : unreadNotifications}
                    </Badge>
                  )}
                </Link>
              </Button>

              {/* Profile Icon */}
              <Button variant="ghost" size="icon" className="relative hover:bg-gray-100 transition-colors" asChild>
                <Link
                  href={
                    user?.role === "university"
                      ? "/admin/profile"
                      : user?.role === "admin"
                        ? "/system-admin/profile"
                        : "/student/profile"
                  }
                  aria-label="Profile"
                >
                  <User className="w-5 h-5 text-gray-600" />
                </Link>
              </Button>

              {/* Sign Out Icon */}
              <Button
                variant="ghost"
                size="icon"
                className="relative hover:bg-gray-100 transition-colors text-red-600 hover:text-red-700"
                onClick={handleSignOut}
                aria-label="Sign Out"
              >
                <LogOut className="w-5 h-5" />
              </Button>

              {/* User Avatar with Dropdown */}
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
                          src={user?.profile?.avatar || "/placeholder.svg?height=32&width=32"}
                          alt={`${user?.profile?.firstName} ${user?.profile?.lastName}`}
                        />
                        <AvatarFallback className="bg-[#0a5eb2] text-white text-xs font-medium">
                          {user?.profile?.firstName?.[0]?.toUpperCase() || "U"}
                          {user?.profile?.lastName?.[0]?.toUpperCase() || "S"}
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
                            src={user?.profile?.avatar || "/placeholder.svg?height=40&width=40"}
                            alt={`${user?.profile?.firstName} ${user?.profile?.lastName}`}
                          />
                          <AvatarFallback className="bg-[#0a5eb2] text-white">
                            {user?.profile?.firstName?.[0]?.toUpperCase() || "U"}
                            {user?.profile?.lastName?.[0]?.toUpperCase() || "S"}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex flex-col space-y-1">
                          <p className="text-sm font-medium leading-none text-gray-900">
                            {user?.profile?.firstName} {user?.profile?.lastName}
                          </p>
                          <p className="text-xs leading-none text-gray-500">{user?.email}</p>
                          <p className="text-xs leading-none text-gray-400 capitalize bg-gray-100 px-2 py-1 rounded-full inline-block">
                            {user?.role === "university"
                              ? "University Admin"
                              : user?.role === "admin"
                                ? "System Admin"
                                : "Student"}{" "}
                            Account
                          </p>
                        </div>
                      </div>
                    </DropdownMenuLabel>

                    <DropdownMenuSeparator />

                    {/* Quick Links */}
                    <DropdownMenuItem asChild className="cursor-pointer hover:bg-gray-50 p-2">
                      <Link
                        href={
                          user?.role === "university"
                            ? "/admin/dashboard"
                            : user?.role === "admin"
                              ? "/system-admin/dashboard"
                              : "/student/dashboard"
                        }
                        className="flex items-center w-full"
                      >
                        <span className="text-sm">Dashboard</span>
                      </Link>
                    </DropdownMenuItem>

                    <DropdownMenuItem asChild className="cursor-pointer hover:bg-gray-50 p-2">
                      <Link
                        href={
                          user?.role === "university"
                            ? "/admin/applications"
                            : user?.role === "admin"
                              ? "/system-admin/users"
                              : "/student/applications"
                        }
                        className="flex items-center w-full"
                      >
                        <span className="text-sm">{user?.role === "admin" ? "Users" : "Applications"}</span>
                      </Link>
                    </DropdownMenuItem>

                    <DropdownMenuItem asChild className="cursor-pointer hover:bg-gray-50 p-2">
                      <Link
                        href={
                          user?.role === "university"
                            ? "/admin/settings"
                            : user?.role === "admin"
                              ? "/system-admin/settings"
                              : "/student/settings"
                        }
                        className="flex items-center w-full"
                      >
                        <span className="text-sm">Settings</span>
                      </Link>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          ) : (
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
          )}

          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden text-[#0a5eb2]"
            onClick={toggleMobileMenu}
            aria-label="Toggle mobile menu"
          >
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </Button>
        </div>

        {/* Mobile Navigation Menu */}
        {isMobileMenuOpen && (
          <div className="lg:hidden mt-4 pb-4 border-t border-gray-200">
            <nav className="flex flex-col space-y-4 pt-4">
              {/* Student and non-authenticated user mobile navigation */}
              {(!isAuthenticated || user?.role === "student") && (
                <>
                  {!isAuthenticated && (
                    <Link
                      href="/"
                      className={`font-medium transition-colors px-2 py-1 rounded ${
                        isActiveLink("/") ? "text-[#0a5eb2] bg-blue-50" : "text-gray-700 hover:text-[#0a5eb2]"
                      }`}
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      Home
                    </Link>
                  )}

                  {isAuthenticated && user?.role === "student" && (
                    <>
                      <Link
                        href="/student/dashboard"
                        className={`font-medium transition-colors px-2 py-1 rounded ${
                          isActiveLink("/student/dashboard")
                            ? "text-[#0a5eb2] bg-blue-50"
                            : "text-gray-700 hover:text-[#0a5eb2]"
                        }`}
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        Dashboard
                      </Link>
                      <Link
                        href="/colleges"
                        className={`font-medium transition-colors px-2 py-1 rounded ${
                          isActiveLink("/colleges") ? "text-[#0a5eb2] bg-blue-50" : "text-gray-700 hover:text-[#0a5eb2]"
                        }`}
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        Find College
                      </Link>
                      <Link
                        href="/student/payments"
                        className={`font-medium transition-colors px-2 py-1 rounded ${
                          isActiveLink("/student/payments")
                            ? "text-[#0a5eb2] bg-blue-50"
                            : "text-gray-700 hover:text-[#0a5eb2]"
                        }`}
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        Payment
                      </Link>
                    </>
                  )}

                  <Link
                    href="/colleges"
                    className={`font-medium transition-colors px-2 py-1 rounded ${
                      isActiveLink("/colleges") ? "text-[#0a5eb2] bg-blue-50" : "text-gray-700 hover:text-[#0a5eb2]"
                    }`}
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Colleges
                  </Link>
                  <Link
                    href="/about"
                    className={`font-medium transition-colors px-2 py-1 rounded ${
                      isActiveLink("/about") ? "text-[#0a5eb2] bg-blue-50" : "text-gray-700 hover:text-[#0a5eb2]"
                    }`}
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    About Us
                  </Link>
                  <Link
                    href="/blog"
                    className={`font-medium transition-colors px-2 py-1 rounded ${
                      isActiveLink("/blog") ? "text-[#0a5eb2] bg-blue-50" : "text-gray-700 hover:text-[#0a5eb2]"
                    }`}
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Blog
                  </Link>
                  <Link
                    href="/contact"
                    className={`font-medium transition-colors px-2 py-1 rounded ${
                      isActiveLink("/contact") ? "text-[#0a5eb2] bg-blue-50" : "text-gray-700 hover:text-[#0a5eb2]"
                    }`}
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Contact
                  </Link>
                </>
              )}

              {/* Admin-specific mobile navigation */}
              {isAuthenticated && user?.role === "university" && (
                <>
                  <Link
                    href="/admin/applications"
                    className={`font-medium transition-colors px-2 py-1 rounded ${
                      isActiveLink("/admin/applications")
                        ? "text-[#0a5eb2] bg-blue-50"
                        : "text-gray-700 hover:text-[#0a5eb2]"
                    }`}
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Applications
                  </Link>
                  <Link
                    href="/admin/blog"
                    className={`font-medium transition-colors px-2 py-1 rounded ${
                      isActiveLink("/admin/blog") ? "text-[#0a5eb2] bg-blue-50" : "text-gray-700 hover:text-[#0a5eb2]"
                    }`}
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Blog
                  </Link>
                  <Link
                    href="/admin/forms"
                    className={`font-medium transition-colors px-2 py-1 rounded ${
                      isActiveLink("/admin/forms") ? "text-[#0a5eb2] bg-blue-50" : "text-gray-700 hover:text-[#0a5eb2]"
                    }`}
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Forms
                  </Link>
                  <Link
                    href="/admin/settings"
                    className={`font-medium transition-colors px-2 py-1 rounded ${
                      isActiveLink("/admin/settings")
                        ? "text-[#0a5eb2] bg-blue-50"
                        : "text-gray-700 hover:text-[#0a5eb2]"
                    }`}
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Settings
                  </Link>
                </>
              )}

              {/* System Admin mobile navigation */}
              {isAuthenticated && user?.role === "admin" && (
                <>
                  <Link
                    href="/system-admin/universities"
                    className={`font-medium transition-colors px-2 py-1 rounded ${
                      isActiveLink("/system-admin/universities")
                        ? "text-[#0a5eb2] bg-blue-50"
                        : "text-gray-700 hover:text-[#0a5eb2]"
                    }`}
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Universities
                  </Link>
                  <Link
                    href="/system-admin/payments"
                    className={`font-medium transition-colors px-2 py-1 rounded ${
                      isActiveLink("/system-admin/payments")
                        ? "text-[#0a5eb2] bg-blue-50"
                        : "text-gray-700 hover:text-[#0a5eb2]"
                    }`}
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Payments
                  </Link>
                  <Link
                    href="/system-admin/settings"
                    className={`font-medium transition-colors px-2 py-1 rounded ${
                      isActiveLink("/system-admin/settings")
                        ? "text-[#0a5eb2] bg-blue-50"
                        : "text-gray-700 hover:text-[#0a5eb2]"
                    }`}
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    System Settings
                  </Link>
                </>
              )}

              {/* Mobile Profile Section */}
              {isAuthenticated && (
                <div className="pt-4 border-t border-gray-200">
                  {/* User Info Card */}
                  <div className="flex items-center gap-3 px-3 py-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg mb-4 border border-blue-100">
                    <Avatar className="h-12 w-12 ring-2 ring-[#0a5eb2]">
                      <AvatarImage
                        src={user?.profile?.avatar || "/placeholder.svg?height=48&width=48"}
                        alt={`${user?.profile?.firstName} ${user?.profile?.lastName}`}
                      />
                      <AvatarFallback className="bg-[#0a5eb2] text-white">
                        {user?.profile?.firstName?.[0]?.toUpperCase() || "U"}
                        {user?.profile?.lastName?.[0]?.toUpperCase() || "S"}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">
                        {user?.profile?.firstName} {user?.profile?.lastName}
                      </p>
                      <p className="text-xs text-gray-500 truncate">{user?.email}</p>
                      <p className="text-xs text-[#0a5eb2] font-medium capitalize">
                        {user?.role === "university"
                          ? "University Admin"
                          : user?.role === "admin"
                            ? "System Admin"
                            : "Student"}{" "}
                        Account
                      </p>
                    </div>
                  </div>

                  {/* Mobile Quick Actions */}
                  <div className="grid grid-cols-2 gap-2 mb-4">
                    <Button
                      variant="outline"
                      className="flex flex-col items-center gap-1 h-auto py-3"
                      onClick={() => setIsMobileMenuOpen(false)}
                      asChild
                    >
                      <Link
                        href={
                          user?.role === "university"
                            ? "/admin/messages"
                            : user?.role === "admin"
                              ? "/system-admin/messages"
                              : "/student/messages"
                        }
                      >
                        <MessageSquare className="h-4 w-4" />
                        <span className="text-xs">Messages</span>
                        {unreadMessages > 0 && (
                          <Badge className="bg-[#fe7702] text-white text-xs">{unreadMessages}</Badge>
                        )}
                      </Link>
                    </Button>
                    <Button
                      variant="outline"
                      className="flex flex-col items-center gap-1 h-auto py-3"
                      onClick={() => setIsMobileMenuOpen(false)}
                      asChild
                    >
                      <Link
                        href={
                          user?.role === "university"
                            ? "/admin/notifications"
                            : user?.role === "admin"
                              ? "/system-admin/notifications"
                              : "/student/notifications"
                        }
                      >
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
                    <Button
                      variant="outline"
                      className="w-full justify-start"
                      onClick={() => setIsMobileMenuOpen(false)}
                      asChild
                    >
                      <Link
                        href={
                          user?.role === "university"
                            ? "/admin/profile"
                            : user?.role === "admin"
                              ? "/system-admin/profile"
                              : "/student/profile"
                        }
                        className="flex items-center"
                      >
                        <User className="mr-2 h-4 w-4" />
                        Profile
                      </Link>
                    </Button>

                    <Button
                      variant="ghost"
                      className="w-full justify-start text-red-600 hover:text-red-600 hover:bg-red-50"
                      onClick={() => {
                        setIsMobileMenuOpen(false)
                        handleSignOut()
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
                    onClick={() => setIsMobileMenuOpen(false)}
                    asChild
                  >
                    <Link href="/auth/create-account">Create Account</Link>
                  </Button>
                  <Button
                    className="w-full bg-[#0a5eb2] hover:bg-[#0a5eb2]/90 text-white"
                    onClick={() => setIsMobileMenuOpen(false)}
                    asChild
                  >
                    <Link href="/auth/sign-in">Sign-In</Link>
                  </Button>
                </div>
              )}
            </nav>
          </div>
        )}
      </div>
    </header>
  )
}
