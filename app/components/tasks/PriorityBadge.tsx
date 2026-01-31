'use client'

import { type TaskPriority } from "@/db/schema"

const priorityConfig: Record<TaskPriority, { label: string; color: string; bg: string }> = {
  high: { label: 'Alta', color: 'text-red-600', bg: 'bg-red-100 dark:bg-red-900/30' },
  medium: { label: 'Média', color: 'text-yellow-600', bg: 'bg-yellow-100 dark:bg-yellow-900/30' },
  low: { label: 'Baixa', color: 'text-green-600', bg: 'bg-green-100 dark:bg-green-900/30' },
}

type PriorityBadgeProps = {
  priority: TaskPriority
  size?: 'sm' | 'md'
}

export default function PriorityBadge({ priority, size = 'sm' }: PriorityBadgeProps) {
  const config = priorityConfig[priority]

  return (
    <span
      className={`inline-flex items-center rounded-full font-medium ${config.bg} ${config.color} ${
        size === 'sm' ? 'px-2 py-0.5 text-xs' : 'px-2.5 py-1 text-sm'
      }`}
    >
      {config.label}
    </span>
  )
}
