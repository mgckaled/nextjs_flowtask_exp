'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { createProjectSchema, type CreateProjectData } from '@/lib/validations/project'
import { createProject } from '@/app/actions/projects'
import { ArrowPathIcon } from '@heroicons/react/24/outline'

const COLORS = [
  '#9333ea', // purple
  '#ec4899', // pink
  '#3b82f6', // blue
  '#10b981', // green
  '#f59e0b', // amber
  '#ef4444', // red
  '#8b5cf6', // violet
  '#06b6d4', // cyan
]

export default function ProjectForm() {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<CreateProjectData>({
    resolver: zodResolver(createProjectSchema),
    defaultValues: {
      name: '',
      description: '',
      color: '#9333ea',
    },
  })

  const selectedColor = watch('color')

  const onSubmit = async (data: CreateProjectData) => {
    setIsSubmitting(true)
    setError(null)

    try {
      const result = await createProject(data)

      if (result.success && result.data?.id) {
        router.push(`/projects/${result.data.id}`)
      } else {
        setError(result.message)
      }
    } catch {
      setError('Erro ao criar projeto')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-foreground">
          Nome do Projeto *
        </label>
        <input
          {...register('name')}
          type="text"
          id="name"
          placeholder="Ex: Redesign do Site"
          className="mt-1.5 w-full rounded-lg border border-border bg-background px-4 py-2.5 text-foreground placeholder:text-muted-foreground focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-500/20"
        />
        {errors.name && (
          <p className="mt-1.5 text-sm text-red-500">{errors.name.message}</p>
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
          placeholder="Descreva o objetivo do projeto..."
          className="mt-1.5 w-full rounded-lg border border-border bg-background px-4 py-2.5 text-foreground placeholder:text-muted-foreground focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-500/20 resize-none"
        />
        {errors.description && (
          <p className="mt-1.5 text-sm text-red-500">{errors.description.message}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-foreground">
          Cor do Projeto
        </label>
        <div className="mt-2 flex flex-wrap gap-2">
          {COLORS.map((color) => (
            <button
              key={color}
              type="button"
              onClick={() => setValue('color', color)}
              className={`h-8 w-8 rounded-full transition-transform hover:scale-110 ${
                selectedColor === color
                  ? 'ring-2 ring-offset-2 ring-offset-background ring-purple-500'
                  : ''
              }`}
              style={{ backgroundColor: color }}
              aria-label={`Selecionar cor ${color}`}
            />
          ))}
        </div>
      </div>

      {error && (
        <div className="rounded-lg bg-red-500/10 p-4 text-sm text-red-500">
          {error}
        </div>
      )}

      <div className="flex gap-3">
        <button
          type="button"
          onClick={() => router.back()}
          className="flex-1 rounded-lg border border-border bg-background px-4 py-2.5 text-sm font-medium text-foreground transition-colors hover:bg-muted"
        >
          Cancelar
        </button>
        <button
          type="submit"
          disabled={isSubmitting}
          className="flex-1 inline-flex items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-purple-600 to-pink-600 px-4 py-2.5 text-sm font-medium text-white transition-opacity hover:opacity-90 disabled:opacity-50"
        >
          {isSubmitting ? (
            <>
              <ArrowPathIcon className="h-4 w-4 animate-spin" />
              Criando...
            </>
          ) : (
            'Criar Projeto'
          )}
        </button>
      </div>
    </form>
  )
}
