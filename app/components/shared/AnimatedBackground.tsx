'use client'

import { useRef, useEffect, useCallback, useSyncExternalStore } from 'react'
import { useAnimationFrame } from 'motion/react'

interface TaskElement {
  id: number
  type: 'checkbox' | 'card' | 'progress'
  x: number
  y: number
  size: number
  opacity: number
  rotation: number
  progress: number
  targetX: number
  targetY: number
  delay: number
  timer: number
  isCompleted: boolean
  completionTimer: number
  color: 'primary' | 'secondary' | 'accent'
  svgGroup?: SVGGElement
}

interface ConnectionLine {
  id: number
  startX: number
  startY: number
  endX: number
  endY: number
  progress: number
  opacity: number
  delay: number
  timer: number
  svgPath?: SVGPathElement
}

function createTaskElements(width: number, height: number): TaskElement[] {
  const count = width < 768 ? 12 : 18
  const types: TaskElement['type'][] = ['checkbox', 'card', 'progress', 'checkbox', 'card']
  const colors: TaskElement['color'][] = ['primary', 'secondary', 'accent']

  return Array.from({ length: count }, (_, index) => {
    const margin = 80
    const x = Math.random() * (width - margin * 2) + margin
    const y = Math.random() * (height - margin * 2) + margin

    return {
      id: index,
      type: types[index % types.length],
      x,
      y,
      size: Math.random() * 20 + 24,
      opacity: 0,
      rotation: Math.random() * 20 - 10,
      progress: 0,
      targetX: x,
      targetY: y,
      delay: index * 0.15,
      timer: 0,
      isCompleted: false,
      completionTimer: Math.random() * 8 + 4,
      color: colors[index % colors.length],
    }
  })
}

function createConnectionLines(elements: TaskElement[], screenWidth: number): ConnectionLine[] {
  const lines: ConnectionLine[] = []
  const maxConnections = screenWidth < 768 ? 4 : 8

  for (let i = 0; i < maxConnections; i++) {
    const startIdx = Math.floor(Math.random() * elements.length)
    let endIdx = Math.floor(Math.random() * elements.length)
    while (endIdx === startIdx) {
      endIdx = Math.floor(Math.random() * elements.length)
    }

    lines.push({
      id: i,
      startX: elements[startIdx].x,
      startY: elements[startIdx].y,
      endX: elements[endIdx].x,
      endY: elements[endIdx].y,
      progress: 0,
      opacity: 0,
      delay: i * 0.3 + 1,
      timer: 0,
    })
  }

  return lines
}

function useIsMounted() {
  return useSyncExternalStore(
    () => () => {},
    () => true,
    () => false
  )
}

const COLOR_VALUES = {
  primary: 'var(--primary)',
  secondary: 'var(--secondary)',
  accent: 'var(--accent-fg)',
}

export default function AnimatedBackground() {
  const isMounted = useIsMounted()
  const elementsRef = useRef<TaskElement[]>([])
  const connectionsRef = useRef<ConnectionLine[]>([])
  const dimensionsRef = useRef({ width: 0, height: 0 })
  const svgRef = useRef<SVGSVGElement>(null)
  const isInitializedRef = useRef(false)

  // Criar elementos SVG uma única vez
  const initializeSVGElements = useCallback(() => {
    if (!svgRef.current) return

    // Limpar SVG
    while (svgRef.current.firstChild) {
      svgRef.current.removeChild(svgRef.current.firstChild)
    }

    // Criar conexões
    connectionsRef.current.forEach(conn => {
      const path = document.createElementNS('http://www.w3.org/2000/svg', 'path')
      path.setAttribute('fill', 'none')
      path.setAttribute('stroke', 'currentColor')
      path.setAttribute('stroke-width', '2')
      path.setAttribute('stroke-linecap', 'round')
      path.setAttribute('class', 'text-border')
      path.style.filter = 'blur(0.5px)'
      conn.svgPath = path
      svgRef.current?.appendChild(path)
    })

    // Criar elementos
    elementsRef.current.forEach(element => {
      const color = COLOR_VALUES[element.color]
      const g = document.createElementNS('http://www.w3.org/2000/svg', 'g')

      if (element.type === 'checkbox') {
        const size = element.size
        const rect = document.createElementNS('http://www.w3.org/2000/svg', 'rect')
        rect.setAttribute('x', '10')
        rect.setAttribute('y', '10')
        rect.setAttribute('width', String(size - 20))
        rect.setAttribute('height', String(size - 20))
        rect.setAttribute('rx', '8')
        rect.setAttribute('fill', 'none')
        rect.setAttribute('stroke', color)
        rect.setAttribute('stroke-width', '3')
        rect.setAttribute('data-type', 'box')
        g.appendChild(rect)

        const checkPath = document.createElementNS('http://www.w3.org/2000/svg', 'path')
        checkPath.setAttribute('d', 'M 25 50 L 40 65 L 75 30')
        checkPath.setAttribute('fill', 'none')
        checkPath.setAttribute('stroke', color)
        checkPath.setAttribute('stroke-width', '4')
        checkPath.setAttribute('stroke-linecap', 'round')
        checkPath.setAttribute('stroke-linejoin', 'round')
        checkPath.setAttribute('stroke-dasharray', '70')
        checkPath.setAttribute('transform', `scale(${(size - 20) / 80})`)
        checkPath.setAttribute('data-type', 'check')
        g.appendChild(checkPath)
      } else if (element.type === 'card') {
        const width = element.size * 1.6
        const height = element.size

        const rect = document.createElementNS('http://www.w3.org/2000/svg', 'rect')
        rect.setAttribute('x', '0')
        rect.setAttribute('y', '0')
        rect.setAttribute('width', String(width))
        rect.setAttribute('height', String(height))
        rect.setAttribute('rx', '6')
        rect.setAttribute('fill', 'none')
        rect.setAttribute('stroke', color)
        rect.setAttribute('stroke-width', '2')
        rect.style.filter = `drop-shadow(0 4px 12px ${color}40)`
        g.appendChild(rect)

        const linePositions = [0.3, 0.5, 0.7]
        const lineWidths = [0.7, 0.5, 0.6]
        const lineOpacities = [0.6, 0.4, 0.3]

        linePositions.forEach((pos, i) => {
          const line = document.createElementNS('http://www.w3.org/2000/svg', 'line')
          line.setAttribute('x1', '8')
          line.setAttribute('y1', String(height * pos))
          line.setAttribute('x2', String(width * lineWidths[i]))
          line.setAttribute('y2', String(height * pos))
          line.setAttribute('stroke', color)
          line.setAttribute('stroke-width', '2')
          line.setAttribute('stroke-linecap', 'round')
          line.style.opacity = String(lineOpacities[i])
          g.appendChild(line)
        })

        const miniBox = document.createElementNS('http://www.w3.org/2000/svg', 'rect')
        miniBox.setAttribute('x', String(width - 16))
        miniBox.setAttribute('y', '6')
        miniBox.setAttribute('width', '10')
        miniBox.setAttribute('height', '10')
        miniBox.setAttribute('rx', '2')
        miniBox.setAttribute('stroke', color)
        miniBox.setAttribute('stroke-width', '1.5')
        miniBox.setAttribute('data-type', 'minibox')
        g.appendChild(miniBox)
      } else if (element.type === 'progress') {
        const width = element.size * 2
        const height = 8

        const bgRect = document.createElementNS('http://www.w3.org/2000/svg', 'rect')
        bgRect.setAttribute('x', '0')
        bgRect.setAttribute('y', '0')
        bgRect.setAttribute('width', String(width))
        bgRect.setAttribute('height', String(height))
        bgRect.setAttribute('rx', '4')
        bgRect.setAttribute('fill', color)
        bgRect.style.opacity = '0.2'
        g.appendChild(bgRect)

        const progressRect = document.createElementNS('http://www.w3.org/2000/svg', 'rect')
        progressRect.setAttribute('x', '0')
        progressRect.setAttribute('y', '0')
        progressRect.setAttribute('height', String(height))
        progressRect.setAttribute('rx', '4')
        progressRect.setAttribute('fill', color)
        progressRect.setAttribute('data-type', 'progress-bar')
        progressRect.style.filter = `drop-shadow(0 0 6px ${color})`
        g.appendChild(progressRect)

        const text = document.createElementNS('http://www.w3.org/2000/svg', 'text')
        text.setAttribute('x', String(width / 2))
        text.setAttribute('y', String(height + 14))
        text.setAttribute('text-anchor', 'middle')
        text.setAttribute('fill', color)
        text.setAttribute('font-size', '10')
        text.setAttribute('font-family', 'var(--font-space-grotesk)')
        text.setAttribute('font-weight', '600')
        text.setAttribute('data-type', 'progress-text')
        g.appendChild(text)
      }

      element.svgGroup = g
      svgRef.current?.appendChild(g)
    })
  }, [])

  // Inicializar
  useEffect(() => {
    if (!isMounted || isInitializedRef.current) return

    const width = window.innerWidth
    const height = window.innerHeight

    dimensionsRef.current = { width, height }

    const newElements = createTaskElements(width, height)
    const newConnections = createConnectionLines(newElements, width)

    elementsRef.current = newElements
    connectionsRef.current = newConnections
    isInitializedRef.current = true

    // Criar elementos SVG após um micro delay para garantir que o ref está pronto
    requestAnimationFrame(() => {
      initializeSVGElements()
    })

    const updateDimensions = () => {
      dimensionsRef.current = {
        width: window.innerWidth,
        height: window.innerHeight,
      }
    }

    window.addEventListener('resize', updateDimensions)
    return () => window.removeEventListener('resize', updateDimensions)
  }, [isMounted, initializeSVGElements])

  useAnimationFrame((_time, delta) => {
    if (elementsRef.current.length === 0) return

    const deltaSeconds = delta / 1000
    const { width, height } = dimensionsRef.current

    // Atualizar conexões
    connectionsRef.current.forEach(connection => {
      connection.timer += deltaSeconds

      if (connection.timer >= connection.delay) {
        if (connection.progress < 1) {
          connection.progress = Math.min(connection.progress + deltaSeconds * 0.5, 1)
        }
        if (connection.opacity < 1) {
          connection.opacity = Math.min(connection.opacity + deltaSeconds * 0.5, 1)
        }
      }

      // Atualizar posições baseado nos elementos
      if (connection.id < elementsRef.current.length - 1) {
        const startEl = elementsRef.current[connection.id]
        const endEl = elementsRef.current[(connection.id + 1) % elementsRef.current.length]
        connection.startX = startEl.x
        connection.startY = startEl.y
        connection.endX = endEl.x
        connection.endY = endEl.y
      }

      // Atualizar SVG da conexão
      if (connection.svgPath) {
        const midX = (connection.startX + connection.endX) / 2
        const midY = (connection.startY + connection.endY) / 2 - 30
        const pathD = `M ${connection.startX} ${connection.startY} Q ${midX} ${midY} ${connection.endX} ${connection.endY}`
        const pathLength = 200

        connection.svgPath.setAttribute('d', pathD)
        connection.svgPath.setAttribute('stroke-dasharray', String(pathLength))
        connection.svgPath.setAttribute('stroke-dashoffset', String(pathLength * (1 - connection.progress)))
        connection.svgPath.style.opacity = String(connection.opacity * 0.4)
      }
    })

    // Atualizar elementos
    elementsRef.current.forEach(element => {
      element.timer += deltaSeconds

      // Fade in com delay
      if (element.timer >= element.delay && element.opacity < 0.7) {
        element.opacity = Math.min(element.opacity + deltaSeconds * 0.8, 0.7)
      }

      // Movimento flutuante suave
      const floatX = Math.sin(element.timer * 0.5 + element.id) * 15
      const floatY = Math.cos(element.timer * 0.3 + element.id * 0.7) * 10

      element.x = element.targetX + floatX
      element.y = element.targetY + floatY

      // Rotação suave
      element.rotation = Math.sin(element.timer * 0.2 + element.id) * 8

      // Completar tarefas periodicamente
      if (!element.isCompleted && element.timer > element.completionTimer) {
        element.isCompleted = true
        element.progress = 0
      }

      // Animar progresso do check
      if (element.isCompleted && element.progress < 1) {
        element.progress = Math.min(element.progress + deltaSeconds * 2, 1)
      }

      // Reset após um tempo
      if (element.isCompleted && element.timer > element.completionTimer + 6) {
        element.isCompleted = false
        element.progress = 0
        element.completionTimer = element.timer + Math.random() * 8 + 4
      }

      // Mover para nova posição ocasionalmente
      if (Math.random() < 0.0005) {
        const margin = 80
        element.targetX = Math.random() * (width - margin * 2) + margin
        element.targetY = Math.random() * (height - margin * 2) + margin
      }

      // Atualizar SVG do elemento
      if (element.svgGroup) {
        const g = element.svgGroup
        g.style.opacity = String(element.opacity)

        if (element.type === 'checkbox') {
          const size = element.size
          g.setAttribute(
            'transform',
            `translate(${element.x - size / 2}, ${element.y - size / 2}) rotate(${element.rotation}, ${size / 2}, ${size / 2})`
          )

          const box = g.querySelector('[data-type="box"]') as SVGRectElement
          const check = g.querySelector('[data-type="check"]') as SVGPathElement

          if (box) {
            box.style.filter = element.isCompleted ? `drop-shadow(0 0 8px ${COLOR_VALUES[element.color]})` : 'none'
          }
          if (check) {
            check.setAttribute('stroke-dashoffset', String(70 * (1 - element.progress)))
            check.style.opacity = element.isCompleted ? '1' : '0'
          }
        } else if (element.type === 'card') {
          const cardWidth = element.size * 1.6
          const cardHeight = element.size
          g.setAttribute(
            'transform',
            `translate(${element.x - cardWidth / 2}, ${element.y - cardHeight / 2}) rotate(${element.rotation}, ${cardWidth / 2}, ${cardHeight / 2})`
          )

          const miniBox = g.querySelector('[data-type="minibox"]') as SVGRectElement
          if (miniBox) {
            miniBox.setAttribute('fill', element.isCompleted ? COLOR_VALUES[element.color] : 'none')
          }
        } else if (element.type === 'progress') {
          const barWidth = element.size * 2
          const barHeight = 8
          const progress = element.isCompleted ? 1 : (element.timer % 5) / 5

          g.setAttribute('transform', `translate(${element.x - barWidth / 2}, ${element.y - barHeight / 2})`)

          const progressBar = g.querySelector('[data-type="progress-bar"]') as SVGRectElement
          const progressText = g.querySelector('[data-type="progress-text"]') as SVGTextElement

          if (progressBar) {
            progressBar.setAttribute('width', String(barWidth * progress))
          }
          if (progressText) {
            progressText.textContent = `${Math.round(progress * 100)}%`
          }
        }
      }
    })
  })

  if (!isMounted) {
    return <div className="pointer-events-none absolute inset-0 overflow-hidden" />
  }

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      <svg ref={svgRef} width="100%" height="100%" className="absolute inset-0" />
    </div>
  )
}
