import { auth } from "@/auth"
import { redirect } from "next/navigation"
import Link from "next/link"
import { CheckCircleIcon } from "@heroicons/react/24/solid"

export const metadata = {
  title: "Pagamento Confirmado | FlowTask",
  description: "Seu pagamento foi processado com sucesso",
}

export default async function CheckoutSuccessPage() {
  const session = await auth()

  if (!session?.user) {
    redirect("/")
  }

  return (
    <main className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="text-center max-w-md">
        <div className="rounded-full bg-green-100 dark:bg-green-900/30 p-4 w-20 h-20 mx-auto mb-6 flex items-center justify-center">
          <CheckCircleIcon className="w-12 h-12 text-green-600 dark:text-green-400" />
        </div>

        <h1 className="text-3xl font-bold text-foreground mb-3">
          Pagamento Confirmado!
        </h1>

        <p className="text-muted-foreground mb-8">
          Obrigado por assinar o FlowTask, {session.user.name}! Seu plano já está ativo
          e você tem acesso a todos os recursos premium.
        </p>

        <div className="space-y-3">
          <Link
            href="/dashboard"
            className="block w-full px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg hover:opacity-90 transition-opacity font-medium"
          >
            Ir para o Dashboard
          </Link>

          <Link
            href="/"
            className="block w-full px-6 py-3 border border-border text-foreground rounded-lg hover:bg-muted transition-colors font-medium"
          >
            Voltar para Home
          </Link>
        </div>

        <p className="text-sm text-muted-foreground mt-8">
          Um email de confirmação foi enviado para {session.user.email}
        </p>
      </div>
    </main>
  )
}
