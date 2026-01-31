'use client'

import { type Project } from "@/db/schema"
import Link from "next/link"
import { motion } from "motion/react"
import { FolderIcon, CheckCircleIcon } from "@heroicons/react/24/solid"

type ProjectCardProps = {
  project: Project & { tasks?: { status: string }[] }
}

export default function ProjectCard({ project }: ProjectCardProps) {
  const tasks = project.tasks || []
  const totalTasks = tasks.length
  const completedTasks = tasks.filter(t => t.status === 'done').length

  return (
    <Link href={`/projects/${project.id}`}>
      <motion.div
        className="group relative overflow-hidden rounded-xl border border-border bg-card p-6 transition-shadow hover:shadow-lg"
        whileHover={{ y: -4 }}
        transition={{ duration: 0.2 }}
      >
        <div className="flex items-start gap-4">
          <div
            className="flex h-10 w-10 items-center justify-center rounded-lg"
            style={{ backgroundColor: `${project.color}20` }}
          >
            <FolderIcon
              className="h-5 w-5"
              style={{ color: project.color || '#9333ea' }}
            />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-foreground truncate group-hover:text-purple-600 transition-colors">
              {project.name}
            </h3>
            {project.description && (
              <p className="mt-1 text-sm text-muted-foreground line-clamp-2">
                {project.description}
              </p>
            )}
          </div>
        </div>

        <div className="mt-4 flex items-center gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-1.5">
            <div className="h-4 w-4 rounded-full border-2 border-muted-foreground" />
            <span>{totalTasks} tarefas</span>
          </div>
          <div className="flex items-center gap-1.5">
            <CheckCircleIcon className="h-4 w-4 text-green-500" />
            <span>{completedTasks} concluídas</span>
          </div>
        </div>

        {totalTasks > 0 && (
          <div className="mt-4">
            <div className="h-1.5 w-full rounded-full bg-muted">
              <div
                className="h-full rounded-full bg-gradient-to-r from-purple-600 to-pink-600 transition-all"
                style={{ width: `${(completedTasks / totalTasks) * 100}%` }}
              />
            </div>
          </div>
        )}

        <div
          className="absolute bottom-0 left-0 h-1 w-full"
          style={{ backgroundColor: project.color || '#9333ea' }}
        />
      </motion.div>
    </Link>
  )
}
