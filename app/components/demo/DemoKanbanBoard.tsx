'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import {
  PencilSquareIcon,
  RocketLaunchIcon,
  CheckCircleIcon,
} from '@heroicons/react/24/outline'

type TaskStatus = 'todo' | 'in_progress' | 'done'

interface Task {
  id: string
  title: string
  description: string
  status: TaskStatus
  project: string
  priority: 'low' | 'medium' | 'high'
  assignee: string
}

const COLUMNS: {
  id: TaskStatus
  title: string
  icon: React.ComponentType<{ className?: string }>
}[] = [
  { id: 'todo', title: 'To Do', icon: PencilSquareIcon },
  { id: 'in_progress', title: 'In Progress', icon: RocketLaunchIcon },
  { id: 'done', title: 'Done', icon: CheckCircleIcon },
]

const priorityColors = {
  high: 'border-l-red-500',
  medium: 'border-l-yellow-500',
  low: 'border-l-green-500',
}

function TaskCard({
  task,
  onDragStart,
  isDragging,
}: {
  task: Task
  onDragStart: () => void
  isDragging: boolean
}) {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: isDragging ? 0.5 : 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.9 }}
      whileHover={{ y: -2, boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }}
      draggable
      onDragStart={onDragStart}
      className={`cursor-grab rounded-lg border-l-4 bg-white p-4 active:cursor-grabbing dark:bg-zinc-900 ${priorityColors[task.priority]}`}
    >
      <h4 className="mb-2 font-semibold text-zinc-900 dark:text-zinc-100">
        {task.title}
      </h4>
      <p className="mb-3 text-sm text-zinc-600 dark:text-zinc-400">
        {task.description}
      </p>
      <div className="flex items-center justify-between">
        <span className="text-xs text-blue-600 dark:text-blue-400">
          {task.project}
        </span>
        <span className="text-xs text-zinc-500 dark:text-zinc-500">
          {task.assignee}
        </span>
      </div>
    </motion.div>
  )
}

export default function DemoKanbanBoard({
  tasks,
  onMoveTask,
}: {
  tasks: Task[]
  onMoveTask: (taskId: string, newStatus: TaskStatus) => void
}) {
  const [draggedTask, setDraggedTask] = useState<string | null>(null)
  const [dragOverColumn, setDragOverColumn] = useState<TaskStatus | null>(null)

  const handleDragStart = (taskId: string) => {
    setDraggedTask(taskId)
  }

  const handleDragEnd = () => {
    setDraggedTask(null)
    setDragOverColumn(null)
  }

  const handleDrop = (status: TaskStatus) => {
    if (draggedTask) {
      onMoveTask(draggedTask, status)
    }
    handleDragEnd()
  }

  return (
    <div>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="mb-4 flex items-center justify-between"
      >
        <h2 className="text-3xl font-bold text-zinc-900 dark:text-zinc-100">
          Organize Tarefas Visualmente
        </h2>
        <span className="text-sm text-zinc-500 dark:text-zinc-500">
          💡 Arraste os cards entre as colunas
        </span>
      </motion.div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        {COLUMNS.map((column) => {
          const columnTasks = tasks.filter((t) => t.status === column.id)
          const isOver = dragOverColumn === column.id

          return (
            <motion.div
              key={column.id}
              onDragOver={(e) => {
                e.preventDefault()
                setDragOverColumn(column.id)
              }}
              onDragLeave={() => setDragOverColumn(null)}
              onDrop={() => handleDrop(column.id)}
              animate={{
                borderColor: isOver ? 'rgb(59 130 246)' : 'rgb(228 228 231)',
                scale: isOver ? 1.02 : 1,
              }}
              className="flex min-h-125 flex-col rounded-lg border-2 border-dashed border-zinc-300 p-4 transition-colors dark:border-zinc-700"
            >
              <div className="mb-4 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <column.icon className="h-5 w-5 text-blue-600 dark:text-blue-500" />
                  <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">
                    {column.title}
                  </h3>
                </div>
                <span className="text-sm text-zinc-500 dark:text-zinc-400">
                  {columnTasks.length}
                </span>
              </div>

              <div className="flex-1 space-y-3">
                <AnimatePresence>
                  {columnTasks.map((task) => (
                    <TaskCard
                      key={task.id}
                      task={task}
                      onDragStart={() => handleDragStart(task.id)}
                      isDragging={draggedTask === task.id}
                    />
                  ))}
                </AnimatePresence>
              </div>
            </motion.div>
          )
        })}
      </div>
    </div>
  )
}
