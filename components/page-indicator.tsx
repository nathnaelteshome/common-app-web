"use client"

import { usePathname } from "next/navigation"

const pageNames: Record<string, string> = {
  "/": "Home",
  "/colleges": "Colleges",
  "/about": "About Us",
  "/blog": "Blog",
  "/contact": "Contact Us",
}

export function PageIndicator() {
  const pathname = usePathname()

  // Handle dynamic routes like /blog/[slug]
  const getPageName = () => {
    if (pathname.startsWith("/blog/") && pathname !== "/blog") {
      return "Blog Post"
    }
    return pageNames[pathname] || "Page"
  }

  return (
    <div className="bg-primary/5 py-2 px-4">
      <div className="container mx-auto">
        <div className="flex items-center justify-between">
          <span className="text-sm text-primary font-medium">Current Page: {getPageName()}</span>
          <div className="flex items-center space-x-2">
            {Object.entries(pageNames).map(([path, name]) => (
              <div
                key={path}
                className={`w-2 h-2 rounded-full transition-colors ${
                  pathname === path || (path !== "/" && pathname.startsWith(path)) ? "bg-primary" : "bg-gray-300"
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
