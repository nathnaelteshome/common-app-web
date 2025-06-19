"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Menu, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"
import { useAuthStore } from "@/store/auth-store"
import { useNavigation } from "@/hooks/use-navigation"

// Import sub-components
import { TopBar } from "./top-bar"
import { BrandLogo } from "./brand-logo"
import { NavigationLinks } from "./navigation-links"
import { UserActions } from "./user-actions"
import { MobileMenu } from "./mobile-menu"

/**
 * Header component for the application
 * Handles navigation, user authentication, and responsive design
 */
export function Header() {
  // State for mobile menu
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  // Hooks
  const router = useRouter()
  const { user, isAuthenticated, signOut } = useAuthStore()
  const { isActiveLink } = useNavigation()


  /**
   * Toggle mobile menu open/closed
   */
  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen)
  }

  /**
   * Handle user sign out
   */
  const handleSignOut = async () => {
    try {
      await signOut()
      toast.success("Successfully signed out")
      router.push("/")
    } catch (error) {
      console.error("Sign out error:", error)
      toast.error("Error signing out")
    }
  }

  return (
    <header className="w-full relative z-50">
      {/* Top Bar - Only show for non-authenticated users */}
      {!isAuthenticated && <TopBar />}

      {/* Main Navigation */}
      <div className="bg-white/95 backdrop-blur-md shadow-sm border-b border-gray-100 sticky top-0 z-40">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            {/* Brand/Logo */}
            <BrandLogo isAuthenticated={isAuthenticated} userRole={user?.role} />

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center gap-8">
              <NavigationLinks isAuthenticated={isAuthenticated} userRole={user?.role} isActiveLink={isActiveLink} />
            </nav>

            {/* Desktop Action Icons */}
            <UserActions
              isAuthenticated={isAuthenticated}
              userRole={user?.role}
              onSignOut={handleSignOut}
              userProfile={user?.profile}
              email={user?.email}
            />

            {/* Mobile Menu Button */}
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden text-primary hover:bg-primary/10 rounded-xl transition-colors duration-300"
              onClick={toggleMobileMenu}
              aria-label="Toggle mobile menu"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </Button>
          </div>

          {/* Mobile Navigation Menu */}
          {isMobileMenuOpen && (
            <MobileMenu
              isAuthenticated={isAuthenticated}
              userRole={user?.role}
              isActiveLink={isActiveLink}
              onLinkClick={() => setIsMobileMenuOpen(false)}
              onSignOut={handleSignOut}
              userProfile={user?.profile}
              email={user?.email}
            />
          )}
        </div>
      </div>
    </header>
  )
}
