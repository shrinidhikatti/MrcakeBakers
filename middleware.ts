import { auth } from "@/auth"
import { NextResponse } from "next/server"

export default auth((req) => {
  const { nextUrl } = req
  const isLoggedIn = !!req.auth

  const isAdminRoute = nextUrl.pathname.startsWith("/admin")
  const isDeliveryRoute = nextUrl.pathname.startsWith("/delivery")
  const isAuthRoute = nextUrl.pathname === "/login" || nextUrl.pathname === "/register"
  const isProtectedRoute =
    nextUrl.pathname.startsWith("/profile") ||
    nextUrl.pathname.startsWith("/checkout") ||
    nextUrl.pathname.startsWith("/order-success")

  if (isAdminRoute) {
    if (!isLoggedIn) {
      return NextResponse.redirect(new URL("/login", nextUrl))
    }
    if (req.auth?.user?.role !== "ADMIN") {
      return NextResponse.redirect(new URL("/", nextUrl))
    }
  }

  if (isDeliveryRoute) {
    if (!isLoggedIn) {
      return NextResponse.redirect(new URL("/login", nextUrl))
    }
    if (req.auth?.user?.role !== "DELIVERY_PARTNER") {
      return NextResponse.redirect(new URL("/", nextUrl))
    }
  }

  if (isProtectedRoute && !isLoggedIn) {
    return NextResponse.redirect(new URL("/login", nextUrl))
  }

  if (isAuthRoute && isLoggedIn) {
    return NextResponse.redirect(new URL("/", nextUrl))
  }

  return NextResponse.next()
})

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
}
