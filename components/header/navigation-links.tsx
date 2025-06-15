"use client"

import { NavLink } from "./nav-link"
import type { UserRole } from "@/types/auth"

interface NavigationLinksProps {
  isAuthenticated: boolean
  userRole?: UserRole
  isActiveLink: (href: string) => boolean
  isMobile?: boolean
  onLinkClick?: () => void
}

/**
 * NavigationLinks component renders the appropriate navigation links based on user role
 */
export function NavigationLinks({
  isAuthenticated,
  userRole,
  isActiveLink,
  isMobile = false,
  onLinkClick,
}: NavigationLinksProps) {
  // Student and non-authenticated user navigation
  if (!isAuthenticated || userRole === "student") {
    return (
      <>
        {!isAuthenticated && (
          <NavLink href="/" isActive={isActiveLink("/")} onClick={onLinkClick} isMobile={isMobile}>
            Home
          </NavLink>
        )}

        {isAuthenticated && userRole === "student" && (
          <>
            <NavLink
              href="/student/dashboard"
              isActive={isActiveLink("/student/dashboard")}
              onClick={onLinkClick}
              isMobile={isMobile}
            >
              Dashboard
            </NavLink>
            <NavLink href="/colleges" isActive={isActiveLink("/colleges")} onClick={onLinkClick} isMobile={isMobile}>
              Find College
            </NavLink>
            <NavLink
              href="/student/payments"
              isActive={isActiveLink("/student/payments")}
              onClick={onLinkClick}
              isMobile={isMobile}
            >
              Payment
            </NavLink>
          </>
        )}

        <NavLink href="/colleges" isActive={isActiveLink("/colleges")} onClick={onLinkClick} isMobile={isMobile}>
          Colleges
        </NavLink>
        <NavLink href="/about" isActive={isActiveLink("/about")} onClick={onLinkClick} isMobile={isMobile}>
          About Us
        </NavLink>
        <NavLink href="/blog" isActive={isActiveLink("/blog")} onClick={onLinkClick} isMobile={isMobile}>
          Blog
        </NavLink>
        <NavLink href="/contact" isActive={isActiveLink("/contact")} onClick={onLinkClick} isMobile={isMobile}>
          Contact
        </NavLink>
      </>
    )
  }

  // University admin navigation
  if (userRole === "university") {
    return (
      <>
        <NavLink
          href="/admin/applications"
          isActive={isActiveLink("/admin/applications")}
          onClick={onLinkClick}
          isMobile={isMobile}
        >
          Applications
        </NavLink>
        <NavLink href="/admin/forms" isActive={isActiveLink("/admin/forms")} onClick={onLinkClick} isMobile={isMobile}>
          Forms
        </NavLink>
        <NavLink
          href="/admin/settings"
          isActive={isActiveLink("/admin/settings")}
          onClick={onLinkClick}
          isMobile={isMobile}
        >
          Settings
        </NavLink>
      </>
    )
  }

  // System admin navigation
  return (
    <>
      <NavLink
        href="/system-admin/universities"
        isActive={isActiveLink("/system-admin/universities")}
        onClick={onLinkClick}
        isMobile={isMobile}
      >
        Universities
      </NavLink>
      <NavLink
        href="/system-admin/payments"
        isActive={isActiveLink("/system-admin/payments")}
        onClick={onLinkClick}
        isMobile={isMobile}
      >
        Payments
      </NavLink>
      <NavLink
        href="/system-admin/settings"
        isActive={isActiveLink("/system-admin/settings")}
        onClick={onLinkClick}
        isMobile={isMobile}
      >
        System Settings
      </NavLink>
    </>
  )
}
