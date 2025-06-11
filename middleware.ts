import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Get auth token from cookies
  const authToken = request.cookies.get("auth_token")?.value

  // Check if user is authenticated
  const isAuthenticated = !!authToken

  // Extract user role from token (frontend simulation)
  let userRole: string | null = null
  if (authToken?.startsWith("mock_token_")) {
    const userId = authToken.replace("mock_token_", "")

    // Frontend role determination based on user ID
    if (userId === "university-1" || userId === "university-2") {
      userRole = "university"
    } else if (userId === "student-1" || userId === "student-2") {
      userRole = "student"
    } else if (userId === "system-admin-1") {
      userRole = "admin"
    }
  }

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
      return NextResponse.redirect(new URL("/auth/sign-in?redirect=" + encodeURIComponent(pathname), request.url))
    }

    if (userRole !== "student") {
      return NextResponse.redirect(new URL("/unauthorized", request.url))
    }
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

  return NextResponse.next()
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|public).*)"],
}
