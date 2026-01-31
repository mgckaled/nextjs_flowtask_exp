'use client'

import { useState, useCallback } from 'react'
import { type Project, type Task, type TaskStatus } from "@/db/schema"
import ProjectHeader from "./ProjectHeader"
import KanbanBoardContent from "../tasks/KanbanBoardContent"
import TaskModal from "../tasks/TaskModal"
import { useKeyboardShortcut } from "@/lib/hooks/useKeyboardShortcut"

type ProjectBoardClientProps = {
  project: Project
  tasks: Task[]
}

export default function ProjectBoardClient({ project, tasks }: ProjectBoardClientProps) {
  const [selectedTask, setSelectedTask] = useState<Task | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [defaultStatus, setDefaultStatus] = useState<TaskStatus>('todo')

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
      <ProjectHeader project={project} onOpenTaskModal={() => handleOpenModal('todo')} />
      <div className="mt-8">
        <KanbanBoardContent
          project={project}
          tasks={tasks}
          onTaskClick={(task) => handleOpenModal(task.status, task)}
          onAddTask={(status) => handleOpenModal(status)}
        />
      </div>
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
