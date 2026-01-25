'use client'

import { motion } from 'motion/react'

export default function FeatureCard({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode
  title: string
  description: string
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-100px' }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      whileHover={{ y: -4, transition: { duration: 0.2 } }}
      className="rounded-lg border border-border bg-card p-6 transition-shadow hover:shadow-lg"
    >
      <div className="mb-4 text-4xl">{icon}</div>
      <h3 className="mb-2 text-xl font-semibold text-card-foreground">
        {title}
      </h3>
      <p className="text-base text-muted-foreground">
        {description}
      </p>
    </motion.div>
  )
}
