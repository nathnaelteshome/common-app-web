"use client"

import { usePathname } from "next/navigation"

export function useActivePath() {
  const pathname = usePathname()

  const isActive = (href: string): boolean => {
    if (href === "/") {
      return pathname === "/"
    }
    return pathname.startsWith(href)
  }

  const getActiveClass = (href: string, activeClass: string, inactiveClass: string): string => {
    return isActive(href) ? activeClass : inactiveClass
  }

  return {
    pathname,
    isActive,
    getActiveClass,
  }
}
