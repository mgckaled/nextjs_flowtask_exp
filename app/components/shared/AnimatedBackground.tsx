'use client'

import { useRef, useEffect, useState } from 'react'
import { useAnimationFrame } from 'motion/react'

interface Particle {
  x: number
  y: number
  size: number
  opacity: number
  baseOpacity: number
  targetX: number
  targetY: number
  velocityX: number
  velocityY: number
  staggerDelay: number
  delayTimer: number
}

type GeometricPattern = 'chaos' | 'grid' | 'circle' | 'spiral' | 'wave'

function createInitialParticles() {
  if (typeof window === 'undefined') return []

  const width = window.innerWidth
  const height = window.innerHeight
  const count = width < 768 ? 16 : 24

  return Array.from({ length: count }, (_, index) => {
    const x = Math.random() * width
    const y = Math.random() * height
    const staggerDelay = index * 0.08
    return {
      x,
      y,
      size: Math.random() * 12 + 6,
      opacity: 0,
      baseOpacity: Math.random() * 0.4 + 0.3,
      targetX: x,
      targetY: y,
      velocityX: 0,
      velocityY: 0,
      staggerDelay,
      delayTimer: staggerDelay,
    }
  })
}

function calculateGeometricPosition(
  index: number,
  total: number,
  pattern: GeometricPattern,
  width: number,
  height: number
): { x: number; y: number } {
  const centerX = width / 2
  const centerY = height / 2
  const margin = 100

  switch (pattern) {
    case 'grid': {
      const cols = Math.ceil(Math.sqrt(total))
      const rows = Math.ceil(total / cols)
      const spacing = Math.min((width - margin * 2) / (cols + 1), (height - margin * 2) / (rows + 1))
      const col = index % cols
      const row = Math.floor(index / cols)
      const gridWidth = cols * spacing
      const gridHeight = rows * spacing
      return {
        x: centerX - gridWidth / 2 + col * spacing + spacing,
        y: centerY - gridHeight / 2 + row * spacing + spacing,
      }
    }

    case 'circle': {
      const radius = Math.min(width, height) * 0.3
      const angle = (index / total) * Math.PI * 2
      return {
        x: centerX + Math.cos(angle) * radius,
        y: centerY + Math.sin(angle) * radius,
      }
    }

    case 'spiral': {
      const spiralTightness = 0.3
      const maxRadius = Math.min(width, height) * 0.35
      const angle = (index / total) * Math.PI * 4
      const radius = (index / total) * maxRadius * spiralTightness + maxRadius * (1 - spiralTightness)
      return {
        x: centerX + Math.cos(angle) * radius,
        y: centerY + Math.sin(angle) * radius,
      }
    }

    case 'wave': {
      const spacing = (width - margin * 2) / (total + 1)
      const waveHeight = height * 0.2
      const frequency = 2
      const x = margin + spacing * (index + 1)
      const y = centerY + Math.sin((index / total) * Math.PI * frequency) * waveHeight
      return { x, y }
    }

    case 'chaos':
    default:
      return {
        x: Math.random() * (width - margin * 2) + margin,
        y: Math.random() * (height - margin * 2) + margin,
      }
  }
}

export default function AnimatedBackground() {
  const [particles] = useState(createInitialParticles)
  const [currentPattern, setCurrentPattern] = useState<GeometricPattern>('chaos')
  const particlesRef = useRef<Particle[]>([])
  const elementRefs = useRef<(HTMLDivElement | null)[]>([])
  const dimensionsRef = useRef({ width: 0, height: 0 })

  useEffect(() => {
    dimensionsRef.current = {
      width: window.innerWidth,
      height: window.innerHeight,
    }

    particlesRef.current = particles

    const updateDimensions = () => {
      dimensionsRef.current = {
        width: window.innerWidth,
        height: window.innerHeight,
      }
    }

    window.addEventListener('resize', updateDimensions)
    return () => window.removeEventListener('resize', updateDimensions)
  }, [particles])

  useEffect(() => {
    const patterns: GeometricPattern[] = ['chaos', 'grid', 'circle', 'spiral', 'wave']
    let currentIndex = 0

    const interval = setInterval(() => {
      currentIndex = (currentIndex + 1) % patterns.length
      setCurrentPattern(patterns[currentIndex])
    }, 5000)

    return () => clearInterval(interval)
  }, [])

  useAnimationFrame((_time, delta) => {
    if (particlesRef.current.length === 0) return

    const { width, height } = dimensionsRef.current
    const deltaSeconds = delta / 1000

    // Spring physics parameters - mais suave e fluido
    const stiffness = 0.05
    const damping = 0.85

    particlesRef.current.forEach((particle, index) => {
      // Atualizar delay timer
      particle.delayTimer += deltaSeconds

      // Calcular nova posição target baseada no padrão atual
      const { x: targetX, y: targetY } = calculateGeometricPosition(
        index,
        particlesRef.current.length,
        currentPattern,
        width,
        height
      )

      // Aplicar stagger: só começa a mover após o delay
      const isActive = particle.delayTimer >= particle.staggerDelay

      if (isActive) {
        particle.targetX = targetX
        particle.targetY = targetY
      }

      // Spring physics
      const dx = particle.targetX - particle.x
      const dy = particle.targetY - particle.y

      const forceX = dx * stiffness
      const forceY = dy * stiffness

      particle.velocityX = particle.velocityX * damping + forceX
      particle.velocityY = particle.velocityY * damping + forceY

      particle.x += particle.velocityX
      particle.y += particle.velocityY

      // Fade in com stagger
      const fadeProgress = isActive
        ? Math.min(Math.max((particle.delayTimer - particle.staggerDelay) / 0.4, 0), 1)
        : 0
      particle.opacity = particle.baseOpacity * fadeProgress

      // Atualizar DOM
      const element = elementRefs.current[index]
      if (element) {
        element.style.transform = `translate(${particle.x}px, ${particle.y}px)`
        element.style.opacity = String(particle.opacity)

        // Pulsar levemente em padrões organizados
        const isOrdered = currentPattern !== 'chaos'
        const scale = isOrdered ? 1 + Math.sin(particle.delayTimer * 2) * 0.15 : 1
        element.style.width = `${particle.size * scale}px`
        element.style.height = `${particle.size * scale}px`
      }
    })
  })

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      {particles.map((particle, index) => (
        <div
          key={index}
          ref={el => {
            elementRefs.current[index] = el
          }}
          className="absolute rounded-full bg-zinc-500 dark:bg-zinc-400"
          style={{
            width: `${particle.size}px`,
            height: `${particle.size}px`,
            opacity: 0,
            transform: `translate(${particle.x}px, ${particle.y}px)`,
            willChange: 'transform, opacity, width, height',
            filter: 'blur(1px)',
            boxShadow: currentPattern !== 'chaos'
              ? '0 0 16px rgba(161, 161, 170, 0.6)'
              : '0 0 10px rgba(161, 161, 170, 0.4)',
            transition: 'box-shadow 0.8s ease-in-out, filter 0.8s ease-in-out',
          }}
        />
      ))}
    </div>
  )
}
