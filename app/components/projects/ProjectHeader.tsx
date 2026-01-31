'use client'

import { type Project } from "@/db/schema"
import Link from "next/link"
import { ArrowLeftIcon, Cog6ToothIcon, PlusIcon } from "@heroicons/react/24/outline"
import KeyboardShortcut from "@/app/components/shared/KeyboardShortcut"

type ProjectHeaderProps = {
  project: Project
  onOpenTaskModal?: () => void
}

export default function ProjectHeader({ project, onOpenTaskModal }: ProjectHeaderProps) {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-4">
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeftIcon className="h-4 w-4" />
          Projetos
        </Link>
        <div className="h-6 w-px bg-border" />
        <div className="flex items-center gap-3">
          <div
            className="h-3 w-3 rounded-full"
            style={{ backgroundColor: project.color || '#9333ea' }}
          />
          <h1 className="text-xl font-bold text-foreground">
            {project.name}
          </h1>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <button
          type="button"
          className="inline-flex items-center gap-2 rounded-lg border border-border bg-background px-3 py-2 text-sm font-medium text-foreground transition-colors hover:bg-muted"
        >
          <Cog6ToothIcon className="h-4 w-4" />
          <span className="hidden sm:inline">Configurações</span>
        </button>
        <button
          type="button"
          onClick={onOpenTaskModal}
          className="inline-flex items-center gap-2 rounded-lg bg-gradient-to-r from-purple-600 to-pink-600 px-3 py-2 text-sm font-medium text-white transition-opacity hover:opacity-90"
        >
          <PlusIcon className="h-4 w-4" />
          <span className="hidden sm:inline">Nova Tarefa</span>
          <KeyboardShortcut shortcut="mod+K" className="hidden sm:inline-flex" />
        </button>
      </div>
    </div>
  )
}
