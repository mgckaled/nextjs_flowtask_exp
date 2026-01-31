import { getProjects } from "@/app/actions/projects"
import { auth } from "@/auth"
import Link from "next/link"
import { PlusIcon, FolderOpenIcon } from "@heroicons/react/24/outline"
import ProjectCard from "@/app/components/projects/ProjectCard"

export const metadata = {
  title: "Dashboard | FlowTask",
  description: "Gerencie seus projetos e tarefas",
}

export default async function DashboardPage() {
  const session = await auth()
  const projects = await getProjects()

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">
            Olá, {session?.user?.name?.split(' ')[0]}
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Gerencie seus projetos e tarefas
          </p>
        </div>
        <Link
          href="/projects/new"
          className="inline-flex items-center gap-2 rounded-lg bg-gradient-to-r from-purple-600 to-pink-600 px-4 py-2 text-sm font-medium text-white transition-opacity hover:opacity-90"
        >
          <PlusIcon className="h-4 w-4" />
          Novo Projeto
        </Link>
      </div>

      <section className="mt-8">
        <h2 className="text-lg font-semibold text-foreground mb-4">
          Seus Projetos
        </h2>

        {projects.length === 0 ? (
          <div className="rounded-xl border border-border bg-card p-12 text-center">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-muted">
              <FolderOpenIcon className="h-6 w-6 text-muted-foreground" />
            </div>
            <h3 className="mt-4 text-lg font-medium text-foreground">
              Nenhum projeto ainda
            </h3>
            <p className="mt-2 text-sm text-muted-foreground">
              Crie seu primeiro projeto para começar a organizar suas tarefas.
            </p>
            <Link
              href="/projects/new"
              className="mt-6 inline-flex items-center gap-2 rounded-lg bg-gradient-to-r from-purple-600 to-pink-600 px-4 py-2 text-sm font-medium text-white transition-opacity hover:opacity-90"
            >
              <PlusIcon className="h-4 w-4" />
              Criar Projeto
            </Link>
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {projects.map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </div>
        )}
      </section>
    </div>
  )
}
