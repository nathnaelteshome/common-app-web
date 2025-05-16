"use client"

import { JSX, SVGProps, useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  BarChart3,
  Bell,
  Calendar,
  CreditCard,
  FileText,
  FormInput,
  Home,
  MessageSquare,
  Newspaper,
  Settings,
} from "lucide-react"

export function Sidebar() {
  const pathname = usePathname()
  const [collapsed, setCollapsed] = useState(false)

  const toggleSidebar = () => {
    setCollapsed(!collapsed)
  }

  const menuItems = [
    { title: "Dashboard", icon: Home, path: "/admin" },
    { title: "Forms", icon: FormInput, path: "/forms" },
    { title: "Applications", icon: FileText, path: "/applications" },
    { title: "Payments", icon: CreditCard, path: "/payments" },
    { title: "Announcements", icon: Newspaper, path: "/announcements" },
    { title: "Reminders", icon: Bell, path: "/reminders" },
    { title: "Surveys", icon: MessageSquare, path: "/surveys" },
    { title: "Calendar", icon: Calendar, path: "/calendar" },
    { title: "Analytics", icon: BarChart3, path: "/analytics" },
    { title: "Settings", icon: Settings, path: "/settings" },
  ]

  return (
    <>
      {/* Mobile sidebar backdrop */}
      {!collapsed && <div className="md:hidden fixed inset-0 bg-black/50 z-40" onClick={toggleSidebar} />}

      {/* Sidebar toggle button for mobile */}
      <button
        className="md:hidden fixed bottom-4 right-4 bg-university text-white p-3 rounded-full shadow-lg z-50"
        onClick={toggleSidebar}
      >
        {collapsed ? <Menu className="h-6 w-6" /> : <X className="h-6 w-6" />}
      </button>

      {/* Sidebar */}
      <aside
        className={`fixed md:sticky top-0 left-0 z-40 h-screen md:h-[calc(100vh-4rem)] transition-all duration-300 
          ${collapsed ? "w-0 md:w-20 -translate-x-full md:translate-x-0" : "w-64 translate-x-0"}
          flex-shrink-0 bg-white border-r border-gray-200 overflow-hidden`}
      >
        {/* Sidebar header with collapse button */}
        <div className="h-16 flex items-center justify-between px-4 border-b">
          <h2 className={`text-lg font-semibold text-university ${collapsed ? "md:hidden" : ""}`}>Admin Portal</h2>
          <button className="hidden md:block p-2 rounded-md hover:bg-gray-100" onClick={toggleSidebar}>
            {collapsed ? <ChevronRight className="h-5 w-5" /> : <ChevronLeft className="h-5 w-5" />}
          </button>
        </div>

        {/* Sidebar menu */}
        <nav className="p-4 space-y-1 overflow-y-auto max-h-[calc(100vh-4rem-4rem)]">
          {menuItems.map((item) => (
            <Link
              key={item.path}
              href={item.path}
              className={`flex items-center space-x-3 px-3 py-2 rounded-md transition-colors
                ${
                  pathname === item.path
                    ? "bg-university/10 text-university font-medium"
                    : "hover:bg-gray-100 text-gray-700"
                }
                ${collapsed ? "md:justify-center md:px-2" : ""}`}
            >
              <item.icon className="h-5 w-5 flex-shrink-0" />
              <span className={collapsed ? "md:hidden" : ""}>{item.title}</span>
            </Link>
          ))}
        </nav>
      </aside>
    </>
  )
}

function ChevronLeft(props: JSX.IntrinsicAttributes & SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m15 18-6-6 6-6" />
    </svg>
  )
}

function ChevronRight(props: JSX.IntrinsicAttributes & SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m9 18 6-6-6-6" />
    </svg>
  )
}

function Menu(props: JSX.IntrinsicAttributes & SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <line x1="4" x2="20" y1="12" y2="12" />
      <line x1="4" x2="20" y1="6" y2="6" />
      <line x1="4" x2="20" y1="18" y2="18" />
    </svg>
  )
}

function X(props: JSX.IntrinsicAttributes & SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M18 6 6 18" />
      <path d="m6 6 12 12" />
    </svg>
  )
}
