"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import type React from "react"

interface ActiveLinkProps {
  href: string
  children: React.ReactNode
  className?: string
  activeClassName?: string
  mobile?: boolean
  onClick?: () => void
}

export function ActiveLink({
  href,
  children,
  className = "",
  activeClassName = "",
  mobile = false,
  onClick,
}: ActiveLinkProps) {
  const pathname = usePathname()

  const isActive = () => {
    if (href === "/") {
      return pathname === "/"
    }
    return pathname.startsWith(href)
  }

  const active = isActive()

  const baseClasses = "font-medium transition-all duration-200 ease-in-out"

  const desktopActiveClasses = active
    ? "text-primary relative after:absolute after:-bottom-1 after:left-0 after:w-full after:h-0.5 after:bg-primary after:transition-all after:duration-200"
    : "text-gray-700 hover:text-primary"

  const mobileActiveClasses = active
    ? "text-primary bg-blue-50 border-l-4 border-primary"
    : "text-gray-700 hover:text-primary hover:bg-gray-50"

  const finalClassName = `
    ${baseClasses}
    ${mobile ? mobileActiveClasses : desktopActiveClasses}
    ${className}
    ${active ? activeClassName : ""}
  `.trim()

  return (
    <Link href={href} className={finalClassName} onClick={onClick}>
      {children}
    </Link>
  )
}
