import { auth } from "@/auth"
import { redirect } from "next/navigation"
import { db } from "@/db"
import { userProfiles } from "@/db/schema"
import { eq } from "drizzle-orm"

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await auth()

  if (!session?.user?.id) {
    redirect("/api/auth/signin")
  }

  // Verifica se completou onboarding
  const profile = await db.query.userProfiles.findFirst({
    where: eq(userProfiles.userId, session.user.id),
  })

  if (!profile?.onboardingCompleted) {
    redirect("/onboarding")
  }

  return <>{children}</>
}
