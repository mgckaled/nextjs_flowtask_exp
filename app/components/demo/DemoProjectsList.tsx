'use client'

import { motion } from 'motion/react'

interface Project {
  id: string
  name: string
  color: string
  progress: number
  totalTasks: number
  completedTasks: number
}

const colorClasses = {
  blue: 'bg-blue-600 dark:bg-blue-500',
  green: 'bg-green-600 dark:bg-green-500',
  purple: 'bg-purple-600 dark:bg-purple-500',
}

function getProgressColor(progress: number) {
  if (progress < 30) return 'bg-red-500'
  if (progress < 70) return 'bg-yellow-500'
  return 'bg-green-500'
}

export default function DemoProjectsList({ projects }: { projects: Project[] }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
      className="rounded-lg border border-border bg-card p-6"
    >
      <h3 className="mb-6 text-xl font-semibold text-card-foreground">
        Seus Projetos
      </h3>

      <div className="space-y-4">
        {projects.map((project, index) => (
          <motion.div
            key={project.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className="group"
          >
            <div className="mb-2 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div
                  className={`h-3 w-3 rounded-full ${colorClasses[project.color as keyof typeof colorClasses] || colorClasses.blue}`}
                />
                <span className="font-medium text-card-foreground">
                  {project.name}
                </span>
              </div>
              <span className="text-sm text-muted-foreground">
                {project.progress}%
              </span>
            </div>

            <div className="relative h-2 overflow-hidden rounded-full bg-zinc-200 dark:bg-zinc-800">
              <motion.div
                className={`h-full rounded-full ${getProgressColor(project.progress)}`}
                initial={{ scaleX: 0 }}
                animate={{ scaleX: project.progress / 100 }}
                transition={{ duration: 1, ease: 'easeOut' }}
                style={{ transformOrigin: 'left' }}
              />
            </div>

            <div className="mt-1 text-xs text-zinc-500 dark:text-zinc-500">
              {project.completedTasks} de {project.totalTasks} tarefas
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  )
}
