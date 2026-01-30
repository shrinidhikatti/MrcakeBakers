import type { NextAuthConfig } from "next-auth"

export const authConfig = {
  pages: {
    signIn: "/login",
  },
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user
      const isAdminRoute = nextUrl.pathname.startsWith("/admin")
      const isDeliveryRoute = nextUrl.pathname.startsWith("/delivery")
      const isAuthRoute = nextUrl.pathname === "/login" || nextUrl.pathname === "/register"
      const isProtectedRoute =
        nextUrl.pathname.startsWith("/profile") ||
        nextUrl.pathname.startsWith("/checkout") ||
        nextUrl.pathname.startsWith("/order-success")

      if (isAdminRoute) {
        if (!isLoggedIn) return false
        return auth.user.role === "ADMIN"
      }

      if (isDeliveryRoute) {
        if (!isLoggedIn) return false
        return auth.user.role === "DELIVERY_PARTNER"
      }

      if (isProtectedRoute && !isLoggedIn) {
        return false
      }

      if (isAuthRoute && isLoggedIn) {
        return Response.redirect(new URL("/", nextUrl))
      }

      return true
    },
    async jwt({ token, user }) {
      if (user) {
        token.role = user.role
        token.id = user.id
      }
      return token
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.role = token.role as string
        session.user.id = token.id as string
      }
      return session
    },
  },
  providers: [], // Providers will be added in auth.ts
  session: {
    strategy: "jwt",
  },
} satisfies NextAuthConfig
