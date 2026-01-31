'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { type Task, type TaskStatus, type TaskPriority } from "@/db/schema"
import { createTaskSchema, updateTaskSchema, type CreateTaskData, type UpdateTaskData } from '@/lib/validations/task'
import { createTask, updateTask, deleteTask } from '@/app/actions/tasks'
import { motion, AnimatePresence } from 'motion/react'
import { XMarkIcon, TrashIcon, ArrowPathIcon } from '@heroicons/react/24/outline'

type TaskModalProps = {
  isOpen: boolean
  onClose: () => void
  projectId: string
  task?: Task | null
  defaultStatus?: TaskStatus
}

const statusOptions: { value: TaskStatus; label: string }[] = [
  { value: 'backlog', label: 'Backlog' },
  { value: 'todo', label: 'A Fazer' },
  { value: 'in_progress', label: 'Em Progresso' },
  { value: 'done', label: 'Concluído' },
]

const priorityOptions: { value: TaskPriority; label: string }[] = [
  { value: 'high', label: 'Alta' },
  { value: 'medium', label: 'Média' },
  { value: 'low', label: 'Baixa' },
]

export default function TaskModal({ isOpen, onClose, projectId, task, defaultStatus = 'todo' }: TaskModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const modalRef = useRef<HTMLDivElement>(null)

  const isEditing = !!task

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CreateTaskData>({
    resolver: zodResolver(createTaskSchema),
    defaultValues: {
      projectId,
      title: task?.title || '',
      description: task?.description || '',
      status: task?.status || defaultStatus,
      priority: task?.priority || 'medium',
    },
  })

  // Reset form when modal opens/closes or task changes
  useEffect(() => {
    if (isOpen) {
      reset({
        projectId,
        title: task?.title || '',
        description: task?.description || '',
        status: task?.status || defaultStatus,
        priority: task?.priority || 'medium',
      })
      setError(null)
    }
  }, [isOpen, task, projectId, defaultStatus, reset])

  // Handle keyboard shortcuts
  useEffect(() => {
    if (!isOpen) return

    const handleKeyDown = (e: KeyboardEvent) => {
      // Escape to close
      if (e.key === 'Escape') {
        e.preventDefault()
        onClose()
      }
      // Cmd/Ctrl + Enter to submit
      if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') {
        e.preventDefault()
        handleSubmit(onSubmit)()
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, onClose, handleSubmit])

  // Focus trap
  useEffect(() => {
    if (!isOpen || !modalRef.current) return

    const modal = modalRef.current
    const focusableElements = modal.querySelectorAll<HTMLElement>(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    )
    const firstElement = focusableElements[0]
    const lastElement = focusableElements[focusableElements.length - 1]

    const handleTabKey = (e: KeyboardEvent) => {
      if (e.key !== 'Tab') return

      if (e.shiftKey) {
        if (document.activeElement === firstElement) {
          e.preventDefault()
          lastElement?.focus()
        }
      } else {
        if (document.activeElement === lastElement) {
          e.preventDefault()
          firstElement?.focus()
        }
      }
    }

    modal.addEventListener('keydown', handleTabKey)
    return () => modal.removeEventListener('keydown', handleTabKey)
  }, [isOpen])

  const onSubmit = useCallback(async (data: CreateTaskData) => {
    setIsSubmitting(true)
    setError(null)

    try {
      let result
      if (isEditing && task) {
        const updateData: UpdateTaskData = {
          title: data.title,
          description: data.description,
          status: data.status,
          priority: data.priority,
        }
        result = await updateTask(task.id, updateData)
      } else {
        result = await createTask(data)
      }

      if (result.success) {
        onClose()
      } else {
        setError(result.message)
      }
    } catch {
      setError('Erro ao salvar tarefa')
    } finally {
      setIsSubmitting(false)
    }
  }, [isEditing, task, onClose])

  const handleDelete = useCallback(async () => {
    if (!task || !confirm('Tem certeza que deseja excluir esta tarefa?')) return

    setIsDeleting(true)
    setError(null)

    try {
      const result = await deleteTask(task.id)
      if (result.success) {
        onClose()
      } else {
        setError(result.message)
      }
    } catch {
      setError('Erro ao excluir tarefa')
    } finally {
      setIsDeleting(false)
    }
  }, [task, onClose])

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm"
            onClick={onClose}
          />

          {/* Modal */}
          <motion.div
            ref={modalRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby="modal-title"
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.2 }}
            className="fixed left-1/2 top-1/2 z-50 w-full max-w-lg -translate-x-1/2 -translate-y-1/2 rounded-xl border border-border bg-card p-6 shadow-xl"
          >
            <div className="flex items-center justify-between">
              <h2 id="modal-title" className="text-lg font-semibold text-foreground">
                {isEditing ? 'Editar Tarefa' : 'Nova Tarefa'}
              </h2>
              <button
                type="button"
                onClick={onClose}
                className="rounded-md p-1 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                aria-label="Fechar modal"
              >
                <XMarkIcon className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="mt-6 space-y-4">
              <input type="hidden" {...register('projectId')} />
              <div>
                <label htmlFor="title" className="block text-sm font-medium text-foreground">
                  Título *
                </label>
                <input
                  {...register('title', {
                    required: 'Título é obrigatório',
                  })}
                  type="text"
                  id="title"
                  autoFocus
                  placeholder="Ex: Implementar login"
                  className="mt-1.5 w-full rounded-lg border border-border bg-background px-4 py-2.5 text-foreground placeholder:text-muted-foreground focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-500/20"
                />
                {errors.title && (
                  <p className="mt-1.5 text-sm text-red-500">{errors.title.message}</p>
                )}
              </div>

              <div>
                <label htmlFor="description" className="block text-sm font-medium text-foreground">
                  Descrição
                </label>
                <textarea
                  {...register('description')}
                  id="description"
                  rows={3}
                  placeholder="Detalhes da tarefa..."
                  className="mt-1.5 w-full rounded-lg border border-border bg-background px-4 py-2.5 text-foreground placeholder:text-muted-foreground focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-500/20 resize-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="status" className="block text-sm font-medium text-foreground">
                    Status
                  </label>
                  <select
                    {...register('status')}
                    id="status"
                    className="mt-1.5 w-full rounded-lg border border-border bg-background px-4 py-2.5 text-foreground focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-500/20"
                  >
                    {statusOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label htmlFor="priority" className="block text-sm font-medium text-foreground">
                    Prioridade
                  </label>
                  <select
                    {...register('priority')}
                    id="priority"
                    className="mt-1.5 w-full rounded-lg border border-border bg-background px-4 py-2.5 text-foreground focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-500/20"
                  >
                    {priorityOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {error && (
                <div className="rounded-lg bg-red-500/10 p-4 text-sm text-red-500">
                  {error}
                </div>
              )}

              <div className="flex items-center justify-between pt-2">
                {isEditing ? (
                  <button
                    type="button"
                    onClick={handleDelete}
                    disabled={isDeleting}
                    className="inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-red-500 transition-colors hover:bg-red-500/10 disabled:opacity-50"
                  >
                    {isDeleting ? (
                      <ArrowPathIcon className="h-4 w-4 animate-spin" />
                    ) : (
                      <TrashIcon className="h-4 w-4" />
                    )}
                    Excluir
                  </button>
                ) : (
                  <div />
                )}

                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={onClose}
                    className="rounded-lg border border-border bg-background px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-muted"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="inline-flex items-center gap-2 rounded-lg bg-gradient-to-r from-purple-600 to-pink-600 px-4 py-2 text-sm font-medium text-white transition-opacity hover:opacity-90 disabled:opacity-50"
                  >
                    {isSubmitting ? (
                      <>
                        <ArrowPathIcon className="h-4 w-4 animate-spin" />
                        Salvando...
                      </>
                    ) : (
                      'Salvar'
                    )}
                  </button>
                </div>
              </div>

              <p className="text-center text-xs text-muted-foreground">
                <kbd className="rounded border border-border bg-muted px-1.5 py-0.5 font-mono text-xs">⌘</kbd>
                {' + '}
                <kbd className="rounded border border-border bg-muted px-1.5 py-0.5 font-mono text-xs">Enter</kbd>
                {' para salvar • '}
                <kbd className="rounded border border-border bg-muted px-1.5 py-0.5 font-mono text-xs">Esc</kbd>
                {' para fechar'}
              </p>
            </form>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
