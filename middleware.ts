import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Allow debug page access without restrictions
  if (pathname === "/debug-auth") {
    return NextResponse.next()
  }

  // Get auth token from cookies
  const authToken = request.cookies.get("auth_token")?.value

  // Check if user is authenticated
  const isAuthenticated = !!authToken
  
  // Add debugging for development
  if (process.env.NODE_ENV === 'development') {
    console.log("Middleware - Path:", pathname)
    console.log("Middleware - Has token:", !!authToken)
    console.log("Middleware - Token preview:", authToken ? authToken.substring(0, 20) + "..." : "none")
  }

  // Extract user role from JWT token
  let userRole: string | null = null
  if (authToken) {
    try {
      // For JWT tokens, decode the payload to get the role
      if (authToken.includes('.')) {
        // JWT token format: header.payload.signature
        const parts = authToken.split('.')
        if (parts.length === 3) {
          const payload = parts[1]
          // Add padding if needed for base64 decoding
          const paddedPayload = payload + '='.repeat((4 - payload.length % 4) % 4)
          const decodedPayload = JSON.parse(atob(paddedPayload))
          userRole = decodedPayload.role || null
          
          // Log for debugging (remove in production)
          if (process.env.NODE_ENV === 'development') {
            console.log("Decoded JWT payload:", decodedPayload)
            console.log("Extracted role:", userRole)
          }
        }
      } else if (authToken.startsWith("mock_token_")) {
        // Fallback for mock tokens (development)
        const userId = authToken.replace("mock_token_", "")
        
        if (userId === "university-1" || userId === "university-2") {
          userRole = "university"
        } else if (userId === "student-1" || userId === "student-2") {
          userRole = "student"
        } else if (userId === "system-admin-1") {
          userRole = "admin"
        }
      }
    } catch (error) {
      console.error("Failed to decode auth token:", error)
      if (process.env.NODE_ENV === 'development') {
        console.log("Token:", authToken?.substring(0, 50) + "...")
      }
      userRole = null
    }
  }
  
  // More debugging
  if (process.env.NODE_ENV === 'development') {
    console.log("Middleware - Final role:", userRole)
    console.log("Middleware - Is authenticated:", isAuthenticated)
  }

  // Add API base URL to headers for backend communication
  const requestHeaders = new Headers(request.headers)
  requestHeaders.set("x-api-base-url", process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:3001")

  // Redirect authenticated admin users away from homepage and public pages
  if (isAuthenticated && userRole === "admin") {
    // Block access to public pages for system admins
    if (
      pathname === "/" ||
      pathname === "/about" ||
      pathname === "/blog" ||
      pathname === "/contact" ||
      pathname === "/colleges"
    ) {
      return NextResponse.redirect(new URL("/system-admin/dashboard", request.url))
    }
  }

  // Redirect authenticated university admins away from homepage and public pages
  if (isAuthenticated && userRole === "university") {
    // Block access to public pages for university admins
    if (
      pathname === "/" ||
      pathname === "/about" ||
      pathname === "/blog" ||
      pathname === "/contact" ||
      pathname === "/colleges"
    ) {
      return NextResponse.redirect(new URL("/admin/dashboard", request.url))
    }
  }

  // Redirect authenticated students away from homepage to their dashboard
  if (isAuthenticated && userRole === "student" && pathname === "/") {
    return NextResponse.redirect(new URL("/student/dashboard", request.url))
  }

  // Protect system admin routes - only allow admin role
  if (pathname.startsWith("/system-admin")) {
    if (!isAuthenticated) {
      return NextResponse.redirect(new URL("/auth/sign-in?redirect=" + encodeURIComponent(pathname), request.url))
    }

    if (userRole !== "admin") {
      return NextResponse.redirect(new URL("/unauthorized", request.url))
    }
  }

  // Protect admin routes - only allow university role
  if (pathname.startsWith("/admin")) {
    if (!isAuthenticated) {
      return NextResponse.redirect(new URL("/auth/sign-in?redirect=" + encodeURIComponent(pathname), request.url))
    }

    if (userRole !== "university") {
      return NextResponse.redirect(new URL("/unauthorized", request.url))
    }
  }

  // Protect student routes - only allow student role
  if (pathname.startsWith("/student")) {
    if (!isAuthenticated) {
      console.log("Middleware: Redirecting to sign-in - not authenticated")
      return NextResponse.redirect(new URL("/auth/sign-in?redirect=" + encodeURIComponent(pathname), request.url))
    }

    if (userRole !== "student") {
      console.log(`Middleware: Redirecting to unauthorized - role '${userRole}' is not 'student'`)
      return NextResponse.redirect(new URL("/unauthorized", request.url))
    }
    
    console.log("Middleware: Allowing access to student route")
  }

  // Redirect authenticated users away from auth pages
  if (isAuthenticated && pathname.startsWith("/auth/")) {
    if (userRole === "admin") {
      return NextResponse.redirect(new URL("/system-admin/dashboard", request.url))
    } else if (userRole === "university") {
      return NextResponse.redirect(new URL("/admin/dashboard", request.url))
    } else if (userRole === "student") {
      return NextResponse.redirect(new URL("/student/dashboard", request.url))
    }
  }

  return NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  })
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|public).*)"],
}
