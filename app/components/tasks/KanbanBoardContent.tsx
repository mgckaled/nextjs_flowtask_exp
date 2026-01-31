'use client'

import { useState, useOptimistic, useCallback, startTransition } from 'react'
import { type Project, type Task, type TaskStatus } from "@/db/schema"
import {
  DndContext,
  DragOverlay,
  closestCorners,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragStartEvent,
  type DragEndEvent,
  type DragOverEvent,
} from "@dnd-kit/core"
import { sortableKeyboardCoordinates } from "@dnd-kit/sortable"
import KanbanColumn from "./KanbanColumn"
import TaskCard from "./TaskCard"
import { reorderTasks } from "@/app/actions/tasks"

const COLUMNS: TaskStatus[] = ['backlog', 'todo', 'in_progress', 'done']

type KanbanBoardContentProps = {
  project: Project
  tasks: Task[]
  onTaskClick: (task: Task) => void
  onAddTask: (status: TaskStatus) => void
}

export default function KanbanBoardContent({ project, tasks: initialTasks, onTaskClick, onAddTask }: KanbanBoardContentProps) {
  const [activeTask, setActiveTask] = useState<Task | null>(null)

  // Optimistic state
  const [optimisticTasks, updateOptimisticTasks] = useOptimistic(
    initialTasks,
    (state: Task[], update: { tasks: Task[] }) => update.tasks
  )

  // Group tasks by status
  const tasksByStatus = COLUMNS.reduce((acc, status) => {
    acc[status] = optimisticTasks
      .filter(t => t.status === status)
      .sort((a, b) => a.position - b.position)
    return acc
  }, {} as Record<TaskStatus, Task[]>)

  // Sensors for drag and drop
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  )

  const handleDragStart = useCallback((event: DragStartEvent) => {
    const task = optimisticTasks.find(t => t.id === event.active.id)
    if (task) setActiveTask(task)
  }, [optimisticTasks])

  const handleDragOver = useCallback((event: DragOverEvent) => {
    const { active, over } = event
    if (!over) return

    const activeId = active.id as string
    const overId = over.id as string

    const activeTask = optimisticTasks.find(t => t.id === activeId)
    if (!activeTask) return

    let targetStatus: TaskStatus
    const overTask = optimisticTasks.find(t => t.id === overId)

    if (overTask) {
      targetStatus = overTask.status
    } else if (COLUMNS.includes(overId as TaskStatus)) {
      targetStatus = overId as TaskStatus
    } else {
      return
    }

    if (activeTask.status !== targetStatus) {
      const newTasks = optimisticTasks.map(t => {
        if (t.id === activeId) {
          return { ...t, status: targetStatus }
        }
        return t
      })
      startTransition(() => {
        updateOptimisticTasks({ tasks: newTasks })
      })
    }
  }, [optimisticTasks, updateOptimisticTasks])

  const handleDragEnd = useCallback(async (event: DragEndEvent) => {
    const { active, over } = event
    setActiveTask(null)

    if (!over) return

    const activeId = active.id as string
    const overId = over.id as string

    const activeTask = optimisticTasks.find(t => t.id === activeId)
    if (!activeTask) return

    let targetStatus: TaskStatus
    const overTask = optimisticTasks.find(t => t.id === overId)

    if (overTask) {
      targetStatus = overTask.status
    } else if (COLUMNS.includes(overId as TaskStatus)) {
      targetStatus = overId as TaskStatus
    } else {
      return
    }

    const tasksInTargetColumn = optimisticTasks
      .filter(t => t.status === targetStatus && t.id !== activeId)
      .sort((a, b) => a.position - b.position)

    let newPosition = 0
    if (overTask && overTask.id !== activeId) {
      const overIndex = tasksInTargetColumn.findIndex(t => t.id === overId)
      newPosition = overIndex >= 0 ? overIndex : tasksInTargetColumn.length
    } else {
      newPosition = tasksInTargetColumn.length
    }

    const updates: { id: string; status: TaskStatus; position: number }[] = []
    const affectedStatuses = new Set([activeTask.status, targetStatus])

    affectedStatuses.forEach(status => {
      const columnTasks = optimisticTasks
        .filter(t => {
          if (t.id === activeId) {
            return status === targetStatus
          }
          return t.status === status
        })
        .sort((a, b) => a.position - b.position)

      if (status === targetStatus && activeTask.status !== targetStatus) {
        columnTasks.splice(newPosition, 0, { ...activeTask, status: targetStatus })
      }

      columnTasks.forEach((t, index) => {
        updates.push({
          id: t.id,
          status: status,
          position: index,
        })
      })
    })

    const newTasks = optimisticTasks.map(t => {
      const update = updates.find(u => u.id === t.id)
      if (update) {
        return { ...t, status: update.status, position: update.position }
      }
      return t
    })
    startTransition(() => {
      updateOptimisticTasks({ tasks: newTasks })
    })

    await reorderTasks({
      projectId: project.id,
      updates,
    })
  }, [optimisticTasks, project.id, updateOptimisticTasks])

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCorners}
      onDragStart={handleDragStart}
      onDragOver={handleDragOver}
      onDragEnd={handleDragEnd}
    >
      <div className="flex gap-4 overflow-x-auto pb-4">
        {COLUMNS.map((status) => (
          <KanbanColumn
            key={status}
            status={status}
            tasks={tasksByStatus[status]}
            onTaskClick={onTaskClick}
            onAddTask={() => onAddTask(status)}
          />
        ))}
      </div>

      <DragOverlay>
        {activeTask ? (
          <div className="rotate-3 opacity-90">
            <TaskCard task={activeTask} />
          </div>
        ) : null}
      </DragOverlay>
    </DndContext>
  )
}
