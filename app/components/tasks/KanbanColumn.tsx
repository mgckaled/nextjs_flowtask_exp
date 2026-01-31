'use client'

import { type Task, type TaskStatus } from "@/db/schema"
import { useDroppable } from "@dnd-kit/core"
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable"
import TaskCard from "./TaskCard"
import { PlusIcon } from "@heroicons/react/24/outline"

const columnConfig: Record<TaskStatus, { title: string; color: string }> = {
  backlog: { title: 'Backlog', color: 'bg-zinc-500' },
  todo: { title: 'A Fazer', color: 'bg-blue-500' },
  in_progress: { title: 'Em Progresso', color: 'bg-yellow-500' },
  done: { title: 'Concluído', color: 'bg-green-500' },
}

type KanbanColumnProps = {
  status: TaskStatus
  tasks: Task[]
  onTaskClick?: (task: Task) => void
  onAddTask?: () => void
}

export default function KanbanColumn({ status, tasks, onTaskClick, onAddTask }: KanbanColumnProps) {
  const { setNodeRef, isOver } = useDroppable({ id: status })
  const config = columnConfig[status]

  return (
    <div className="flex w-72 flex-shrink-0 flex-col rounded-xl bg-muted/50">
      <div className="flex items-center justify-between p-3">
        <div className="flex items-center gap-2">
          <div className={`h-2.5 w-2.5 rounded-full ${config.color}`} />
          <h3 className="font-semibold text-foreground text-sm">{config.title}</h3>
          <span className="rounded-full bg-muted px-2 py-0.5 text-xs font-medium text-muted-foreground">
            {tasks.length}
          </span>
        </div>
        <button
          type="button"
          onClick={onAddTask}
          className="rounded-md p-1 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
          aria-label={`Adicionar tarefa em ${config.title}`}
        >
          <PlusIcon className="h-4 w-4" />
        </button>
      </div>

      <div
        ref={setNodeRef}
        className={`flex-1 space-y-2 p-2 transition-colors ${
          isOver ? 'bg-purple-500/10' : ''
        }`}
        style={{ minHeight: '200px' }}
      >
        <SortableContext items={tasks.map(t => t.id)} strategy={verticalListSortingStrategy}>
          {tasks.map((task) => (
            <TaskCard
              key={task.id}
              task={task}
              onClick={() => onTaskClick?.(task)}
            />
          ))}
        </SortableContext>

        {tasks.length === 0 && !isOver && (
          <div className="flex h-24 items-center justify-center rounded-lg border-2 border-dashed border-border">
            <p className="text-xs text-muted-foreground">Arraste tarefas aqui</p>
          </div>
        )}
      </div>
    </div>
  )
}
