'use client'

import { motion } from 'motion/react'

const DAYS_LABELS = ['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb', 'Dom']

export default function DemoActivityChart({ data }: { data: number[] }) {
  const maxValue = Math.max(...data)

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay: 0.2 }}
      className="rounded-lg border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900"
    >
      <h3 className="mb-6 text-xl font-semibold text-zinc-900 dark:text-zinc-100">
        Atividade da Semana
      </h3>

      <div className="flex items-end justify-between gap-2" style={{ height: '200px' }}>
        {data.map((value, index) => (
          <div key={index} className="flex flex-1 flex-col items-center gap-2">
            <div className="relative w-full flex-1">
              <motion.div
                className="absolute bottom-0 w-full rounded-t bg-blue-600 dark:bg-blue-500"
                initial={{ height: 0 }}
                animate={{ height: `${(value / maxValue) * 100}%` }}
                transition={{
                  duration: 0.6,
                  delay: index * 0.1,
                  ease: 'easeOut',
                }}
              />
            </div>
            <div className="text-xs text-zinc-500 dark:text-zinc-500">
              {DAYS_LABELS[index]}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-4 text-center text-xs text-zinc-500 dark:text-zinc-500">
        Tarefas concluídas por dia
      </div>
    </motion.div>
  )
}
