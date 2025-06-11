"use client"

import type React from "react"

import { usePathname } from "next/navigation"

interface NavigationIndicatorProps {
  href: string
  children: React.ReactNode
  className?: string
  mobile?: boolean
}

export function NavigationIndicator({ href, children, className = "", mobile = false }: NavigationIndicatorProps) {
  const pathname = usePathname()

  const isActive = () => {
    if (href === "/") {
      return pathname === "/"
    }
    return pathname.startsWith(href)
  }

  const active = isActive()

  if (mobile) {
    return (
      <div
        className={`
          ${className}
          ${
            active
              ? "text-primary bg-blue-50 border-l-4 border-primary"
              : "text-gray-700 hover:text-primary hover:bg-gray-50"
          }
          transition-all duration-200 ease-in-out
        `}
      >
        {children}
      </div>
    )
  }

  return (
    <div
      className={`
        ${className}
        ${active ? "text-primary" : "text-gray-700 hover:text-primary"}
        relative transition-colors duration-200 ease-in-out
      `}
    >
      {children}
      {active && (
        <span className="absolute -bottom-1 left-0 w-full h-0.5 bg-primary transition-all duration-200 ease-in-out"></span>
      )}
    </div>
  )
}
