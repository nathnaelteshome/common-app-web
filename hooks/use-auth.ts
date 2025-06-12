"use client"

import { useEffect } from "react"
import { useAuthStore } from "@/store/auth-store"
import { authService } from "@/lib/auth-service"

export function useAuth() {
  const {
    user,
    isAuthenticated,
    isLoading,
    error,
    setUser,
    setLoading,
    setError,
    signOut,
    clearError,
    hasRole,
    hasPermission,
  } = useAuthStore()

  // Initialize auth state on app load
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        setLoading(true)
        const currentUser = await authService.getCurrentUser()
        if (currentUser) {
          setUser(currentUser)
        }
      } catch (error) {
        console.error("Failed to initialize auth:", error)
        setError("Failed to initialize authentication")
      } finally {
        setLoading(false)
      }
    }

    initializeAuth()
  }, [setUser, setLoading, setError])

  const handleSignOut = async () => {
    try {
      setLoading(true)
      await authService.signOut()
      signOut()
    } catch (error) {
      console.error("Sign out error:", error)
      setError("Failed to sign out")
    } finally {
      setLoading(false)
    }
  }

  return {
    user,
    isAuthenticated,
    isLoading,
    error,
    signOut: handleSignOut,
    clearError,
    hasRole,
    hasPermission,
  }
}
