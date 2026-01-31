import { z } from 'zod'

export const taskStatusValues = ['backlog', 'todo', 'in_progress', 'done'] as const
export const taskPriorityValues = ['high', 'medium', 'low'] as const

export const createTaskSchema = z.object({
  projectId: z.string().uuid('ID do projeto inválido'),
  title: z.string().min(1, 'Título é obrigatório').max(200, 'Título muito longo'),
  description: z.string().max(1000, 'Descrição muito longa').optional(),
  status: z.enum(taskStatusValues),
  priority: z.enum(taskPriorityValues),
})

export const updateTaskSchema = createTaskSchema.partial().omit({ projectId: true })

export const moveTaskSchema = z.object({
  status: z.enum(taskStatusValues),
  position: z.number().int().min(0),
})

export const reorderTasksSchema = z.object({
  projectId: z.string().uuid(),
  updates: z.array(z.object({
    id: z.string().uuid(),
    status: z.enum(taskStatusValues),
    position: z.number().int().min(0),
  })),
})

export type CreateTaskData = z.infer<typeof createTaskSchema>
export type UpdateTaskData = z.infer<typeof updateTaskSchema>
export type MoveTaskData = z.infer<typeof moveTaskSchema>
export type ReorderTasksData = z.infer<typeof reorderTasksSchema>
