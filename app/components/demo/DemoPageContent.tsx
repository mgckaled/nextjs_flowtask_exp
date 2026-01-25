'use client'

import { useState, useCallback, useEffect } from 'react'
import { motion } from 'motion/react'
import Link from 'next/link'
import { useSession, signIn } from 'next-auth/react'
import AnimatedBackground from '../shared/AnimatedBackground'
import DemoHero from './DemoHero'
import DemoMetricsCards from './DemoMetricsCards'
import DemoKanbanBoard from './DemoKanbanBoard'
import DemoProjectsList from './DemoProjectsList'
import DemoActivityChart from './DemoActivityChart'

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

interface Project {
  id: string
  name: string
  color: string
  progress: number
  totalTasks: number
  completedTasks: number
}

const INITIAL_TASKS: Task[] = [
  {
    id: 't1',
    title: 'Definir requisitos do projeto',
    description: 'Reunir com stakeholders e documentar necessidades',
    status: 'todo',
    project: 'Website Redesign',
    priority: 'high',
    assignee: 'Ana Silva',
  },
  {
    id: 't2',
    title: 'Design de telas de onboarding',
    description: 'Criar fluxo completo de primeiro acesso',
    status: 'todo',
    project: 'Mobile App',
    priority: 'medium',
    assignee: 'Carlos Souza',
  },
  {
    id: 't3',
    title: 'Escrever testes unitários',
    description: 'Cobertura mínima de 80% nos controllers',
    status: 'todo',
    project: 'API Backend',
    priority: 'low',
    assignee: 'Fernanda Lima',
  },
  {
    id: 't4',
    title: 'Criar protótipo inicial',
    description: 'Usar Figma para wireframes das principais telas',
    status: 'in_progress',
    project: 'Website Redesign',
    priority: 'high',
    assignee: 'Ana Silva',
  },
  {
    id: 't5',
    title: 'Implementar navegação',
    description: 'React Navigation com Stack e Tabs',
    status: 'in_progress',
    project: 'Mobile App',
    priority: 'high',
    assignee: 'Carlos Souza',
  },
  {
    id: 't6',
    title: 'Revisar código do PR #234',
    description: 'Verificar implementação de autenticação JWT',
    status: 'in_progress',
    project: 'API Backend',
    priority: 'medium',
    assignee: 'João Pereira',
  },
  {
    id: 't7',
    title: 'Configurar CI/CD',
    description: 'Implementar pipeline com GitHub Actions e Vercel',
    status: 'done',
    project: 'API Backend',
    priority: 'high',
    assignee: 'Maria Costa',
  },
  {
    id: 't8',
    title: 'Otimizar performance',
    description: 'Reduzir tempo de carregamento em 30%',
    status: 'done',
    project: 'Website Redesign',
    priority: 'medium',
    assignee: 'João Pereira',
  },
  {
    id: 't9',
    title: 'Integração com API',
    description: 'Conectar app mobile com backend',
    status: 'done',
    project: 'Mobile App',
    priority: 'low',
    assignee: 'Maria Costa',
  },
]

const INITIAL_PROJECTS: Project[] = [
  {
    id: 'p1',
    name: 'Website Redesign',
    color: 'blue',
    progress: 67,
    totalTasks: 3,
    completedTasks: 2,
  },
  {
    id: 'p2',
    name: 'API Backend',
    color: 'green',
    progress: 33,
    totalTasks: 3,
    completedTasks: 1,
  },
  {
    id: 'p3',
    name: 'Mobile App',
    color: 'purple',
    progress: 33,
    totalTasks: 3,
    completedTasks: 1,
  },
]

const INITIAL_METRICS = {
  activeProjects: 3,
  completedTasks: 3,
  teamMembers: 5,
  timeSaved: 156,
}

const WEEKLY_ACTIVITY = [12, 19, 15, 23, 18, 25, 21]

export default function DemoPageContent() {
  const { data: session } = useSession()
  const [tasks, setTasks] = useState<Task[]>(INITIAL_TASKS)
  const [projects, setProjects] = useState<Project[]>(INITIAL_PROJECTS)
  const [metrics, setMetrics] = useState(INITIAL_METRICS)

  const moveTask = useCallback((taskId: string, newStatus: TaskStatus) => {
    setTasks((prev) => {
      const task = prev.find((t) => t.id === taskId)
      if (!task) return prev

      const wasCompleted = task.status === 'done'
      const isNowCompleted = newStatus === 'done'

      if (isNowCompleted && !wasCompleted) {
        setMetrics((m) => ({ ...m, completedTasks: m.completedTasks + 1 }))
      } else if (!isNowCompleted && wasCompleted) {
        setMetrics((m) => ({ ...m, completedTasks: m.completedTasks - 1 }))
      }

      return prev.map((t) => (t.id === taskId ? { ...t, status: newStatus } : t))
    })
  }, [])

  const resetDemo = useCallback(() => {
    setTasks(INITIAL_TASKS)
    setMetrics(INITIAL_METRICS)
  }, [])

  useEffect(() => {
    setProjects((prev) =>
      prev.map((project) => {
        const projectTasks = tasks.filter((t) => t.project === project.name)
        const completed = projectTasks.filter((t) => t.status === 'done').length
        const total = projectTasks.length

        return {
          ...project,
          completedTasks: completed,
          totalTasks: total,
          progress: total > 0 ? Math.round((completed / total) * 100) : 0,
        }
      })
    )
  }, [tasks])

  return (
    <div className="relative min-h-screen bg-white dark:bg-zinc-950">
      <AnimatedBackground />

      <div className="relative z-10">
        <DemoHero onReset={resetDemo} />

        <section className="px-4 py-16 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-7xl">
            <DemoMetricsCards metrics={metrics} />
          </div>
        </section>

        <section className="px-4 py-16 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-7xl">
            <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
              <div className="lg:col-span-2">
                <DemoKanbanBoard tasks={tasks} onMoveTask={moveTask} />
              </div>

              <div className="space-y-8">
                <DemoProjectsList projects={projects} />
                <DemoActivityChart data={WEEKLY_ACTIVITY} />
              </div>
            </div>
          </div>
        </section>

        <section className="px-4 py-24 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-7xl text-center">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, ease: 'easeOut' }}
              className="text-3xl font-bold text-zinc-900 dark:text-zinc-100 md:text-4xl"
            >
              Gostou da Demonstração?
            </motion.h2>

            <motion.p
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="mx-auto mt-4 max-w-2xl text-lg text-zinc-600 dark:text-zinc-400"
            >
              Comece gratuitamente hoje e transforme a forma como sua equipe
              trabalha. Sem cartão de crédito necessário.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row"
            >
              <motion.button
                onClick={() => session ? window.location.href = '/dashboard' : signIn(undefined, { callbackUrl: '/dashboard' })}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="inline-flex items-center justify-center rounded-lg bg-blue-600 px-8 py-3 text-base font-medium text-white transition-colors hover:bg-blue-700 dark:bg-blue-600 dark:hover:bg-blue-700"
              >
                {session ? 'Ir para Dashboard' : 'Criar Conta Grátis'}
              </motion.button>

              <Link
                href="/pricing"
                className="inline-flex items-center justify-center rounded-lg border border-zinc-300 bg-transparent px-8 py-3 text-base font-medium text-zinc-900 transition-colors hover:bg-zinc-50 dark:border-zinc-700 dark:text-zinc-100 dark:hover:bg-zinc-900"
              >
                Ver Planos e Preços
              </Link>
            </motion.div>
          </div>
        </section>
      </div>
    </div>
  )
}
