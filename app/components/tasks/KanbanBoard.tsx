'use client'

import { useState, useOptimistic, useCallback } from 'react'
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
import { sortableKeyboardCoordinates, arrayMove } from "@dnd-kit/sortable"
import KanbanColumn from "./KanbanColumn"
import TaskCard from "./TaskCard"
import TaskModal from "./TaskModal"
import { reorderTasks } from "@/app/actions/tasks"
import { useKeyboardShortcut } from "@/lib/hooks/useKeyboardShortcut"

const COLUMNS: TaskStatus[] = ['backlog', 'todo', 'in_progress', 'done']

type KanbanBoardProps = {
  project: Project
  tasks: Task[]
}

export default function KanbanBoard({ project, tasks: initialTasks }: KanbanBoardProps) {
  const [activeTask, setActiveTask] = useState<Task | null>(null)
  const [selectedTask, setSelectedTask] = useState<Task | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [defaultStatus, setDefaultStatus] = useState<TaskStatus>('todo')

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

    // Find the task being dragged
    const activeTask = optimisticTasks.find(t => t.id === activeId)
    if (!activeTask) return

    // Determine target status
    let targetStatus: TaskStatus
    const overTask = optimisticTasks.find(t => t.id === overId)

    if (overTask) {
      targetStatus = overTask.status
    } else if (COLUMNS.includes(overId as TaskStatus)) {
      targetStatus = overId as TaskStatus
    } else {
      return
    }

    // If status changed, update optimistically
    if (activeTask.status !== targetStatus) {
      const newTasks = optimisticTasks.map(t => {
        if (t.id === activeId) {
          return { ...t, status: targetStatus }
        }
        return t
      })
      updateOptimisticTasks({ tasks: newTasks })
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

    // Determine target status
    let targetStatus: TaskStatus
    const overTask = optimisticTasks.find(t => t.id === overId)

    if (overTask) {
      targetStatus = overTask.status
    } else if (COLUMNS.includes(overId as TaskStatus)) {
      targetStatus = overId as TaskStatus
    } else {
      return
    }

    // Calculate new positions
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

    // Build updates array
    const updates: { id: string; status: TaskStatus; position: number }[] = []

    // Reposition all tasks in affected columns
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

      // Insert active task at new position if this is target column
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

    // Apply optimistic update
    const newTasks = optimisticTasks.map(t => {
      const update = updates.find(u => u.id === t.id)
      if (update) {
        return { ...t, status: update.status, position: update.position }
      }
      return t
    })
    updateOptimisticTasks({ tasks: newTasks })

    // Persist to server
    await reorderTasks({
      projectId: project.id,
      updates,
    })
  }, [optimisticTasks, project.id, updateOptimisticTasks])

  const handleOpenModal = useCallback((status: TaskStatus = 'todo', task?: Task) => {
    setDefaultStatus(status)
    setSelectedTask(task || null)
    setIsModalOpen(true)
  }, [])

  const handleCloseModal = useCallback(() => {
    setIsModalOpen(false)
    setSelectedTask(null)
  }, [])

  // Keyboard shortcut: Cmd/Ctrl + K to open task modal
  useKeyboardShortcut('k', () => {
    if (!isModalOpen) {
      handleOpenModal('todo')
    }
  }, { ctrl: true, meta: true })

  return (
    <>
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
              onTaskClick={(task) => handleOpenModal(task.status, task)}
              onAddTask={() => handleOpenModal(status)}
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

      <TaskModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        projectId={project.id}
        task={selectedTask}
        defaultStatus={defaultStatus}
      />
    </>
  )
}
