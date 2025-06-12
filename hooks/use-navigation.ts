"use client"

import { usePathname } from "next/navigation"

/**
 * Custom hook for navigation-related functionality
 * Provides utilities for checking active links and paths
 */
export function useNavigation() {
  const pathname = usePathname()

  /**
   * Checks if a link is active based on the current pathname
   * @param href - The link href to check
   * @returns boolean - Whether the link is active
   */
  const isActiveLink = (href: string) => {
    if (href === "/") {
      return pathname === "/"
    }
    return pathname.startsWith(href)
  }

  return {
    pathname,
    isActiveLink,
  }
}
