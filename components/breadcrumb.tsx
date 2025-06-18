"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { ChevronRight, Home } from "lucide-react"

interface BreadcrumbItem {
  label: string
  href: string
}

interface BreadcrumbProps {
  items?: BreadcrumbItem[]
}

export function Breadcrumb({ items }: BreadcrumbProps) {
  const pathname = usePathname()

  // Don't show breadcrumb on home page
  if (pathname === "/") return null

  // Use provided items or generate from path
  let breadcrumbItems
  
  if (items) {
    // Use provided items
    breadcrumbItems = items.map(item => ({ name: item.label, href: item.href }))
  } else {
    // Auto-generate from path
    const pathSegments = pathname.split("/").filter(Boolean)
    breadcrumbItems = [
      { name: "Home", href: "/" },
      ...pathSegments.map((segment, index) => {
        const href = "/" + pathSegments.slice(0, index + 1).join("/")
        const name = segment.charAt(0).toUpperCase() + segment.slice(1).replace(/-/g, " ")
        return { name, href }
      }),
    ]
  }

  return (
    <nav className="bg-gray-50 py-4 px-4 border-b border-gray-200">
      <div className="container mx-auto">
        <ol className="flex items-center space-x-2 text-sm">
          {breadcrumbItems.map((item, index) => (
            <li key={item.href} className="flex items-center">
              {index > 0 && <ChevronRight className="w-4 h-4 text-gray-400 mx-2" />}
              {index === 0 && <Home className="w-4 h-4 mr-2 text-gray-500" />}
              {index === breadcrumbItems.length - 1 ? (
                <span className="text-primary font-medium">{item.name}</span>
              ) : (
                <Link href={item.href} className="text-gray-600 hover:text-primary transition-colors">
                  {item.name}
                </Link>
              )}
            </li>
          ))}
        </ol>
      </div>
    </nav>
  )
}
