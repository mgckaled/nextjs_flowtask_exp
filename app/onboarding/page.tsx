import { auth } from "@/auth"
import { redirect } from "next/navigation"
import { db } from "@/db"
import { userProfiles } from "@/db/schema"
import { eq } from "drizzle-orm"
import OnboardingForm from "../components/onboarding/OnboardingForm"

export const metadata = {
  title: "Complete seu Perfil | FlowTask",
  description: "Preencha suas informações para começar a usar o FlowTask",
}

interface OnboardingPageProps {
  searchParams: Promise<{ callbackUrl?: string }>
}

export default async function OnboardingPage({ searchParams }: OnboardingPageProps) {
  const session = await auth()
  const params = await searchParams

  if (!session?.user?.id) {
    redirect("/api/auth/signin")
  }

  // Verifica se já completou onboarding
  const existingProfile = await db.query.userProfiles.findFirst({
    where: eq(userProfiles.userId, session.user.id),
  })

  if (existingProfile?.onboardingCompleted) {
    redirect(params.callbackUrl || "/dashboard")
  }

  return (
    <main className="min-h-screen bg-background">
      <OnboardingForm
        userName={session.user.name || "Usuário"}
        callbackUrl={params.callbackUrl}
      />
    </main>
  )
}
