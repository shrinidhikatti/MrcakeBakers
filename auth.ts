import NextAuth from "next-auth"
import Credentials from "next-auth/providers/credentials"
import { prisma } from "@/lib/prisma"
import bcrypt from "bcryptjs"
import { authConfig } from "./auth.config"

export const { handlers, signIn, signOut, auth } = NextAuth({
  ...authConfig,
  providers: [
    Credentials({
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null
        }

        const email = credentials.email as string
        const password = credentials.password as string

        // Check User table
        const user = await prisma.user.findUnique({
          where: { email },
        })

        if (user && user.password) {
          const isValid = await bcrypt.compare(password, user.password)
          if (isValid) {
            return {
              id: user.id,
              email: user.email,
              name: user.name,
              role: user.role,
              image: user.image,
            }
          }
        }

        // Check DeliveryPartner table
        const deliveryPartner = await prisma.deliveryPartner.findUnique({
          where: { email },
        })

        if (deliveryPartner) {
          const isValid = await bcrypt.compare(password, deliveryPartner.password)
          if (isValid) {
            return {
              id: deliveryPartner.id,
              email: deliveryPartner.email,
              name: deliveryPartner.name,
              role: "DELIVERY_PARTNER",
              image: null,
            }
          }
        }

        return null
      },
    }),
  ],
})
