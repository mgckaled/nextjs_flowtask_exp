import ProjectForm from "@/app/components/projects/ProjectForm"
import { ArrowLeftIcon } from "@heroicons/react/24/outline"
import { Metadata } from "next"
import Link from "next/link"

export const metadata: Metadata = {
  title: "Novo Projeto | FlowTask",
  description: "Crie um novo projeto",
}

export default function NewProjectPage() {
  return (
    <div className="mx-auto max-w-2xl px-4 sm:px-6 lg:px-8 py-8">
      <Link
        href="/dashboard"
        className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
      >
        <ArrowLeftIcon className="h-4 w-4" />
        Voltar ao Dashboard
      </Link>

      <div className="mt-8">
        <h1 className="text-2xl font-bold text-foreground">
          Criar Novo Projeto
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Preencha os dados do seu novo projeto.
        </p>
      </div>

      <div className="mt-8">
        <ProjectForm />
      </div>
    </div>
  )
}
