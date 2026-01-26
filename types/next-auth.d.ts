import { DefaultSession } from "next-auth"

declare module "next-auth" {
  interface Session {
    user: {
      id: string
      hasCompletedProfile?: boolean
      plan?: string
    } & DefaultSession["user"]
  }
}
