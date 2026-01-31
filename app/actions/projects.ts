'use server'

import { auth } from "@/auth"
import { db } from "@/db"
import { projects, tasks, type Project, type ProjectWithTasks } from "@/db/schema"
import { eq, and, desc } from "drizzle-orm"
import { revalidatePath } from "next/cache"
import { createProjectSchema, updateProjectSchema, type CreateProjectData, type UpdateProjectData } from "@/lib/validations/project"

export type ActionState = {
  success: boolean
  message: string
  errors?: Record<string, string[]>
  data?: { id: string }
}

// Criar projeto
export async function createProject(data: CreateProjectData): Promise<ActionState> {
  const session = await auth()

  if (!session?.user?.id) {
    return { success: false, message: "Não autenticado" }
  }

  const validated = createProjectSchema.safeParse(data)
  if (!validated.success) {
    return {
      success: false,
      message: "Dados inválidos",
      errors: validated.error.flatten().fieldErrors as Record<string, string[]>,
    }
  }

  try {
    const [project] = await db
      .insert(projects)
      .values({
        userId: session.user.id,
        name: validated.data.name,
        description: validated.data.description,
        color: validated.data.color,
      })
      .returning({ id: projects.id })

    revalidatePath('/dashboard')
    return { success: true, message: "Projeto criado com sucesso!", data: { id: project.id } }
  } catch (error) {
    console.error("Erro ao criar projeto:", error)
    return { success: false, message: "Erro ao criar projeto" }
  }
}

// Atualizar projeto
export async function updateProject(id: string, data: UpdateProjectData): Promise<ActionState> {
  const session = await auth()

  if (!session?.user?.id) {
    return { success: false, message: "Não autenticado" }
  }

  const validated = updateProjectSchema.safeParse(data)
  if (!validated.success) {
    return {
      success: false,
      message: "Dados inválidos",
      errors: validated.error.flatten().fieldErrors as Record<string, string[]>,
    }
  }

  try {
    await db
      .update(projects)
      .set({
        ...validated.data,
        updatedAt: new Date(),
      })
      .where(and(eq(projects.id, id), eq(projects.userId, session.user.id)))

    revalidatePath('/dashboard')
    revalidatePath(`/projects/${id}`)
    return { success: true, message: "Projeto atualizado com sucesso!" }
  } catch (error) {
    console.error("Erro ao atualizar projeto:", error)
    return { success: false, message: "Erro ao atualizar projeto" }
  }
}

// Deletar projeto
export async function deleteProject(id: string): Promise<ActionState> {
  const session = await auth()

  if (!session?.user?.id) {
    return { success: false, message: "Não autenticado" }
  }

  try {
    await db
      .delete(projects)
      .where(and(eq(projects.id, id), eq(projects.userId, session.user.id)))

    revalidatePath('/dashboard')
    return { success: true, message: "Projeto excluído com sucesso!" }
  } catch (error) {
    console.error("Erro ao deletar projeto:", error)
    return { success: false, message: "Erro ao excluir projeto" }
  }
}

// Arquivar projeto
export async function archiveProject(id: string): Promise<ActionState> {
  const session = await auth()

  if (!session?.user?.id) {
    return { success: false, message: "Não autenticado" }
  }

  try {
    await db
      .update(projects)
      .set({
        status: 'archived',
        updatedAt: new Date(),
      })
      .where(and(eq(projects.id, id), eq(projects.userId, session.user.id)))

    revalidatePath('/dashboard')
    return { success: true, message: "Projeto arquivado com sucesso!" }
  } catch (error) {
    console.error("Erro ao arquivar projeto:", error)
    return { success: false, message: "Erro ao arquivar projeto" }
  }
}

// Buscar projetos do usuário com contagem de tarefas
export async function getProjects(): Promise<ProjectWithTasks[]> {
  const session = await auth()

  if (!session?.user?.id) {
    return []
  }

  try {
    const userProjects = await db.query.projects.findMany({
      where: and(eq(projects.userId, session.user.id), eq(projects.status, 'active')),
      orderBy: [desc(projects.updatedAt)],
      with: {
        tasks: true,
      },
    })

    return userProjects
  } catch (error) {
    console.error("Erro ao buscar projetos:", error)
    return []
  }
}

// Buscar projeto com tarefas
export async function getProjectWithTasks(id: string): Promise<ProjectWithTasks | null> {
  const session = await auth()

  if (!session?.user?.id) {
    return null
  }

  try {
    const project = await db.query.projects.findFirst({
      where: and(eq(projects.id, id), eq(projects.userId, session.user.id)),
      with: {
        tasks: {
          orderBy: [tasks.position],
        },
      },
    })

    return project || null
  } catch (error) {
    console.error("Erro ao buscar projeto:", error)
    return null
  }
}
