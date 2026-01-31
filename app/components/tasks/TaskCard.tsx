'use client'

import { type Task } from "@/db/schema"
import { useSortable } from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"
import { Bars3Icon } from "@heroicons/react/24/outline"
import PriorityBadge from "./PriorityBadge"

type TaskCardProps = {
  task: Task
  onClick?: () => void
}

export default function TaskCard({ task, onClick }: TaskCardProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: task.id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`group relative rounded-lg border border-border bg-card p-3 shadow-sm transition-shadow hover:shadow-md ${
        isDragging ? 'opacity-50 shadow-lg' : ''
      }`}
    >
      <div className="flex items-start gap-2">
        <button
          {...attributes}
          {...listeners}
          className="mt-0.5 cursor-grab touch-none text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100 active:cursor-grabbing"
          aria-label="Arrastar tarefa"
        >
          <Bars3Icon className="h-4 w-4" />
        </button>

        <div className="flex-1 min-w-0" onClick={onClick} role="button" tabIndex={0}>
          <h4 className="font-medium text-foreground text-sm leading-tight">
            {task.title}
          </h4>
          {task.description && (
            <p className="mt-1 text-xs text-muted-foreground line-clamp-2">
              {task.description}
            </p>
          )}
          <div className="mt-2">
            <PriorityBadge priority={task.priority} />
          </div>
        </div>
      </div>
    </div>
  )
}
