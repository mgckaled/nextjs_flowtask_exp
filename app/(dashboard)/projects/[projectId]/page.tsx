import { getProjectWithTasks } from "@/app/actions/projects"
import { notFound } from "next/navigation"
import { Metadata } from "next"
import ProjectBoardClient from "@/app/components/projects/ProjectBoardClient"

type Props = {
  params: Promise<{ projectId: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { projectId } = await params
  const project = await getProjectWithTasks(projectId)

  if (!project) {
    return { title: "Projeto não encontrado | FlowTask" }
  }

  return {
    title: `${project.name} | FlowTask`,
    description: project.description || `Gerencie as tarefas do projeto ${project.name}`,
  }
}

export default async function ProjectPage({ params }: Props) {
  const { projectId } = await params
  const project = await getProjectWithTasks(projectId)

  if (!project) {
    notFound()
  }

  return (
    <div className="mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-8 py-8">
      <ProjectBoardClient project={project} tasks={project.tasks} />
    </div>
  )
}
