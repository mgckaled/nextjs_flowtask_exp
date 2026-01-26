import { auth } from "@/auth"
import { redirect } from "next/navigation"
import { getUserAccountData } from "@/app/actions/account"
import AccountPageContent from "@/app/components/account/AccountPageContent"

export const metadata = {
  title: "Minha Conta | FlowTask",
  description: "Gerencie suas informações e preferências",
}

export default async function AccountPage() {
  const session = await auth()

  if (!session?.user?.id) {
    redirect("/api/auth/signin")
  }

  const userData = await getUserAccountData()

  if (!userData) {
    redirect("/")
  }

  return (
    <main className="min-h-screen bg-background">
      <AccountPageContent user={userData} />
    </main>
  )
}
