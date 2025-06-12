import Link from "next/link"
import type { UserRole } from "@/types/auth"

interface BrandLogoProps {
  isAuthenticated: boolean
  userRole?: UserRole
}

/**
 * BrandLogo component displays the appropriate brand text and link based on user role
 */
export function BrandLogo({ isAuthenticated, userRole }: BrandLogoProps) {
  // Get the appropriate brand text and link based on user role
  const getBrandInfo = () => {
    if (!isAuthenticated) {
      return { text: "CommonApply", href: "/" }
    }

    switch (userRole) {
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
    <Link href={brandInfo.href} className="text-xl md:text-2xl font-bold text-[#17254e] font-sora">
      {brandInfo.text}
    </Link>
  )
}
