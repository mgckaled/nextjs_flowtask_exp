'use client'

import { useEffect, useState } from 'react'
import { motion } from 'motion/react'
import {
  FolderIcon,
  CheckCircleIcon,
  UsersIcon,
  ClockIcon,
} from '@heroicons/react/24/outline'

function useCountUp(end: number, duration: number = 2) {
  const [count, setCount] = useState(0)

  useEffect(() => {
    let start = 0
    const increment = end / (duration * 60)

    const timer = setInterval(() => {
      start += increment
      if (start >= end) {
        setCount(end)
        clearInterval(timer)
      } else {
        setCount(Math.floor(start))
      }
    }, 1000 / 60)

    return () => clearInterval(timer)
  }, [end, duration])

  return count
}

interface MetricConfig {
  key: string
  label: string
  icon: React.ComponentType<{ className?: string }>
  suffix: string
}

const METRICS_CONFIG: MetricConfig[] = [
  { key: 'activeProjects', label: 'Projetos Ativos', icon: FolderIcon, suffix: '' },
  { key: 'completedTasks', label: 'Tarefas Concluídas', icon: CheckCircleIcon, suffix: '' },
  { key: 'teamMembers', label: 'Membros da Equipe', icon: UsersIcon, suffix: '' },
  { key: 'timeSaved', label: 'Tempo Economizado', icon: ClockIcon, suffix: 'h' },
]

function MetricCard({
  value,
  label,
  icon: Icon,
  suffix,
}: {
  value: number
  label: string
  icon: React.ComponentType<{ className?: string }>
  suffix: string
}) {
  const animatedValue = useCountUp(value, 2)

  return (
    <motion.div
      variants={{
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0 },
      }}
      whileHover={{ y: -4, transition: { duration: 0.2 } }}
      className="rounded-lg border border-border bg-card p-6 shadow-sm transition-shadow hover:shadow-lg"
    >
      <Icon className="mb-3 h-10 w-10 text-blue-600 dark:text-blue-500" />
      <motion.div
        key={value}
        animate={{
          scale: [1, 1.05, 1],
          opacity: [1, 0.8, 1],
        }}
        transition={{ duration: 0.3 }}
        className="mb-2 text-4xl font-bold text-card-foreground"
      >
        {animatedValue}
        {suffix}
      </motion.div>
      <div className="text-sm text-muted-foreground">{label}</div>
    </motion.div>
  )
}

export default function DemoMetricsCards({
  metrics,
}: {
  metrics: {
    activeProjects: number
    completedTasks: number
    teamMembers: number
    timeSaved: number
  }
}) {
  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={{
        visible: { transition: { staggerChildren: 0.1 } },
      }}
      className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4"
    >
      {METRICS_CONFIG.map((config) => (
        <MetricCard
          key={config.key}
          value={metrics[config.key as keyof typeof metrics]}
          label={config.label}
          icon={config.icon}
          suffix={config.suffix}
        />
      ))}
    </motion.div>
  )
}
