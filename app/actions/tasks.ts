'use server'

import { auth } from "@/auth"
import { db } from "@/db"
import { tasks, projects, type Task, type TaskStatus } from "@/db/schema"
import { eq, and, asc } from "drizzle-orm"
import { revalidatePath } from "next/cache"
import {
  createTaskSchema,
  updateTaskSchema,
  moveTaskSchema,
  reorderTasksSchema,
  type CreateTaskData,
  type UpdateTaskData,
  type MoveTaskData,
  type ReorderTasksData,
} from "@/lib/validations/task"

export type ActionState = {
  success: boolean
  message: string
  errors?: Record<string, string[]>
  data?: { id: string }
}

// Criar tarefa
export async function createTask(data: CreateTaskData): Promise<ActionState> {
  const session = await auth()

  if (!session?.user?.id) {
    return { success: false, message: "Não autenticado" }
  }

  const validated = createTaskSchema.safeParse(data)
  if (!validated.success) {
    return {
      success: false,
      message: "Dados inválidos",
      errors: validated.error.flatten().fieldErrors as Record<string, string[]>,
    }
  }

  // Verificar se o projeto pertence ao usuário
  const project = await db.query.projects.findFirst({
    where: and(eq(projects.id, validated.data.projectId), eq(projects.userId, session.user.id)),
  })

  if (!project) {
    return { success: false, message: "Projeto não encontrado" }
  }

  try {
    // Calcular posição (última posição + 1 para o status)
    const existingTasks = await db.query.tasks.findMany({
      where: and(
        eq(tasks.projectId, validated.data.projectId),
        eq(tasks.status, validated.data.status)
      ),
      orderBy: [asc(tasks.position)],
    })

    const newPosition = existingTasks.length

    const [task] = await db
      .insert(tasks)
      .values({
        projectId: validated.data.projectId,
        userId: session.user.id,
        title: validated.data.title,
        description: validated.data.description,
        status: validated.data.status,
        priority: validated.data.priority,
        position: newPosition,
      })
      .returning({ id: tasks.id })

    revalidatePath(`/projects/${validated.data.projectId}`)
    return { success: true, message: "Tarefa criada com sucesso!", data: { id: task.id } }
  } catch (error) {
    console.error("Erro ao criar tarefa:", error)
    return { success: false, message: "Erro ao criar tarefa" }
  }
}

// Atualizar tarefa
export async function updateTask(id: string, data: UpdateTaskData): Promise<ActionState> {
  const session = await auth()

  if (!session?.user?.id) {
    return { success: false, message: "Não autenticado" }
  }

  const validated = updateTaskSchema.safeParse(data)
  if (!validated.success) {
    return {
      success: false,
      message: "Dados inválidos",
      errors: validated.error.flatten().fieldErrors as Record<string, string[]>,
    }
  }

  try {
    const task = await db.query.tasks.findFirst({
      where: and(eq(tasks.id, id), eq(tasks.userId, session.user.id)),
    })

    if (!task) {
      return { success: false, message: "Tarefa não encontrada" }
    }

    await db
      .update(tasks)
      .set({
        ...validated.data,
        updatedAt: new Date(),
      })
      .where(eq(tasks.id, id))

    revalidatePath(`/projects/${task.projectId}`)
    return { success: true, message: "Tarefa atualizada com sucesso!" }
  } catch (error) {
    console.error("Erro ao atualizar tarefa:", error)
    return { success: false, message: "Erro ao atualizar tarefa" }
  }
}

// Deletar tarefa
export async function deleteTask(id: string): Promise<ActionState> {
  const session = await auth()

  if (!session?.user?.id) {
    return { success: false, message: "Não autenticado" }
  }

  try {
    const task = await db.query.tasks.findFirst({
      where: and(eq(tasks.id, id), eq(tasks.userId, session.user.id)),
    })

    if (!task) {
      return { success: false, message: "Tarefa não encontrada" }
    }

    await db.delete(tasks).where(eq(tasks.id, id))

    revalidatePath(`/projects/${task.projectId}`)
    return { success: true, message: "Tarefa excluída com sucesso!" }
  } catch (error) {
    console.error("Erro ao deletar tarefa:", error)
    return { success: false, message: "Erro ao excluir tarefa" }
  }
}

// Mover tarefa (drag & drop)
export async function moveTask(id: string, data: MoveTaskData): Promise<ActionState> {
  const session = await auth()

  if (!session?.user?.id) {
    return { success: false, message: "Não autenticado" }
  }

  const validated = moveTaskSchema.safeParse(data)
  if (!validated.success) {
    return {
      success: false,
      message: "Dados inválidos",
      errors: validated.error.flatten().fieldErrors as Record<string, string[]>,
    }
  }

  try {
    const task = await db.query.tasks.findFirst({
      where: and(eq(tasks.id, id), eq(tasks.userId, session.user.id)),
    })

    if (!task) {
      return { success: false, message: "Tarefa não encontrada" }
    }

    await db
      .update(tasks)
      .set({
        status: validated.data.status,
        position: validated.data.position,
        updatedAt: new Date(),
      })
      .where(eq(tasks.id, id))

    revalidatePath(`/projects/${task.projectId}`)
    return { success: true, message: "Tarefa movida com sucesso!" }
  } catch (error) {
    console.error("Erro ao mover tarefa:", error)
    return { success: false, message: "Erro ao mover tarefa" }
  }
}

// Reordenar múltiplas tarefas (batch update após drag & drop)
export async function reorderTasks(data: ReorderTasksData): Promise<ActionState> {
  const session = await auth()

  if (!session?.user?.id) {
    return { success: false, message: "Não autenticado" }
  }

  const validated = reorderTasksSchema.safeParse(data)
  if (!validated.success) {
    return {
      success: false,
      message: "Dados inválidos",
      errors: validated.error.flatten().fieldErrors as Record<string, string[]>,
    }
  }

  // Verificar se o projeto pertence ao usuário
  const project = await db.query.projects.findFirst({
    where: and(eq(projects.id, validated.data.projectId), eq(projects.userId, session.user.id)),
  })

  if (!project) {
    return { success: false, message: "Projeto não encontrado" }
  }

  try {
    // Atualizar tarefas sequencialmente para economizar compute units
    for (const update of validated.data.updates) {
      await db
        .update(tasks)
        .set({
          status: update.status as TaskStatus,
          position: update.position,
          updatedAt: new Date(),
        })
        .where(and(eq(tasks.id, update.id), eq(tasks.userId, session.user.id)))
    }

    revalidatePath(`/projects/${validated.data.projectId}`)
    return { success: true, message: "Tarefas reordenadas com sucesso!" }
  } catch (error) {
    console.error("Erro ao reordenar tarefas:", error)
    return { success: false, message: "Erro ao reordenar tarefas" }
  }
}

// Buscar tarefas por projeto
export async function getTasksByProject(projectId: string): Promise<Task[]> {
  const session = await auth()

  if (!session?.user?.id) {
    return []
  }

  try {
    const projectTasks = await db.query.tasks.findMany({
      where: and(eq(tasks.projectId, projectId), eq(tasks.userId, session.user.id)),
      orderBy: [asc(tasks.position)],
    })

    return projectTasks
  } catch (error) {
    console.error("Erro ao buscar tarefas:", error)
    return []
  }
}
