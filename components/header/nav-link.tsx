"use client"

import type React from "react"

import Link from "next/link"

interface NavLinkProps {
  href: string
  isActive: boolean
  onClick?: () => void
  children: React.ReactNode
  isMobile?: boolean
}

/**
 * NavLink component for consistent navigation link styling
 * Handles both desktop and mobile navigation links
 */
export function NavLink({ href, isActive, onClick, children, isMobile = false }: NavLinkProps) {
  if (isMobile) {
    return (
      <Link
        href={href}
        className={`font-medium transition-colors px-2 py-1 rounded ${
          isActive ? "text-[#0a5eb2] bg-blue-50" : "text-gray-700 hover:text-[#0a5eb2]"
        }`}
        onClick={onClick}
      >
        {children}
      </Link>
    )
  }

  return (
    <Link
      href={href}
      className={`font-medium transition-colors relative ${
        isActive ? "text-[#0a5eb2]" : "text-gray-700 hover:text-[#0a5eb2]"
      }`}
    >
      {children}
      {isActive && <span className="absolute -bottom-1 left-0 w-full h-0.5 bg-[#0a5eb2]"></span>}
    </Link>
  )
}
