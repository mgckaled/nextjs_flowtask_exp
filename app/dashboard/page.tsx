import { auth } from "@/auth"
import { redirect } from "next/navigation"
import { db } from "@/db"
import { userProfiles } from "@/db/schema"
import { eq } from "drizzle-orm"

export const metadata = {
  title: "Dashboard | FlowTask",
  description: "Gerencie seus projetos e tarefas",
}

export default async function DashboardPage() {
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

  return (
    <main className="min-h-screen bg-background p-8">
      <div className="mx-auto max-w-7xl">
        <h1 className="text-3xl font-bold text-foreground">
          Bem-vindo ao Dashboard, {session.user.name}!
        </h1>
        <p className="mt-2 text-muted-foreground">
          Empresa: {profile.company} | Cargo: {profile.jobTitle}
        </p>

        {/* Placeholder content */}
        <div className="mt-8 rounded-xl border border-border bg-card p-8 text-center">
          <p className="text-lg text-muted-foreground">
            O conteúdo do dashboard será implementado em breve.
          </p>
        </div>
      </div>
    </main>
  )
}
