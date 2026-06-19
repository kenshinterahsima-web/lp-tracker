'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import type { PointerEvent } from 'react'
import { GripVertical, RotateCcw } from 'lucide-react'
import type { Project } from '@/types'
import { ProjectCard } from '@/components/projects/ProjectCard'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

const STORAGE_KEY = 'lp-tracker:project-order:v1'

function readStoredOrder() {
  if (typeof window === 'undefined') return []

  try {
    const value = window.localStorage.getItem(STORAGE_KEY)
    const parsed = value ? JSON.parse(value) : []
    return Array.isArray(parsed) ? parsed.filter((id): id is string => typeof id === 'string') : []
  } catch {
    return []
  }
}

function sortProjects(projects: Project[], order: string[]) {
  if (order.length === 0) return projects

  const orderMap = new Map(order.map((id, index) => [id, index]))
  return [...projects].sort((a, b) => {
    const aIndex = orderMap.get(a.id) ?? Number.MAX_SAFE_INTEGER
    const bIndex = orderMap.get(b.id) ?? Number.MAX_SAFE_INTEGER

    if (aIndex !== bIndex) return aIndex - bIndex
    return new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime()
  })
}

function moveProject(projects: Project[], fromId: string, toId: string) {
  const fromIndex = projects.findIndex((project) => project.id === fromId)
  const toIndex = projects.findIndex((project) => project.id === toId)

  if (fromIndex < 0 || toIndex < 0 || fromIndex === toIndex) return projects

  const next = [...projects]
  const [moved] = next.splice(fromIndex, 1)
  next.splice(toIndex, 0, moved)
  return next
}

interface ProjectBoardProps {
  activeProjects: Project[]
  doneProjects: Project[]
}

interface DragState {
  id: string
  pointerX: number
  pointerY: number
  offsetX: number
  offsetY: number
  width: number
  height: number
}

export function ProjectBoard({ activeProjects, doneProjects }: ProjectBoardProps) {
  const [storedOrder, setStoredOrder] = useState<string[]>([])
  const [active, setActive] = useState(activeProjects)
  const [dragState, setDragState] = useState<DragState | null>(null)
  const activeRef = useRef(active)
  const draggingIdRef = useRef<string | null>(null)

  useEffect(() => {
    const order = readStoredOrder()
    setStoredOrder(order)
    setActive(sortProjects(activeProjects, order))
  }, [activeProjects])

  useEffect(() => {
    activeRef.current = active
  }, [active])

  useEffect(() => {
    draggingIdRef.current = dragState?.id ?? null
  }, [dragState?.id])

  useEffect(() => {
    if (!dragState) return

    function handlePointerMove(event: globalThis.PointerEvent) {
      setDragState((current) => current ? { ...current, pointerX: event.clientX, pointerY: event.clientY } : current)

      const target = document.elementFromPoint(event.clientX, event.clientY)
      const projectElement = target?.closest<HTMLElement>('[data-project-id]')
      const targetId = projectElement?.dataset.projectId

      if (!targetId || targetId === draggingIdRef.current) return

      setActive((current) => {
        const next = moveProject(current, draggingIdRef.current ?? '', targetId)
        activeRef.current = next
        return next
      })
    }

    function handlePointerUp() {
      setDragState(null)
      persistOrder(activeRef.current)
    }

    document.body.classList.add('select-none')
    document.body.classList.add('cursor-grabbing')
    window.addEventListener('pointermove', handlePointerMove)
    window.addEventListener('pointerup', handlePointerUp, { once: true })
    window.addEventListener('pointercancel', handlePointerUp, { once: true })

    return () => {
      document.body.classList.remove('select-none')
      document.body.classList.remove('cursor-grabbing')
      window.removeEventListener('pointermove', handlePointerMove)
      window.removeEventListener('pointerup', handlePointerUp)
      window.removeEventListener('pointercancel', handlePointerUp)
    }
  }, [dragState?.id])

  const done = useMemo(() => sortProjects(doneProjects, storedOrder), [doneProjects, storedOrder])

  function persistOrder(projects: Project[]) {
    const nextOrder = projects.map((project) => project.id)
    setStoredOrder(nextOrder)
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(nextOrder))
  }

  function handleDragStart(projectId: string, event: PointerEvent<HTMLButtonElement>) {
    event.preventDefault()
    event.currentTarget.setPointerCapture(event.pointerId)
    const projectElement = event.currentTarget.closest<HTMLElement>('[data-project-id]')
    const rect = projectElement?.getBoundingClientRect()

    if (!rect) return

    setDragState({
      id: projectId,
      pointerX: event.clientX,
      pointerY: event.clientY,
      offsetX: event.clientX - rect.left,
      offsetY: event.clientY - rect.top,
      width: rect.width,
      height: rect.height,
    })
  }

  function handleResetOrder() {
    window.localStorage.removeItem(STORAGE_KEY)
    setStoredOrder([])
    setActive(activeProjects)
  }

  return (
    <div className="space-y-10">
      <section>
        <div className="mb-4 flex items-center justify-between gap-3">
          <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide">進行中 ({active.length})</h2>
          {active.length > 1 && (
            <Button type="button" variant="ghost" size="sm" onClick={handleResetOrder}>
              <RotateCcw aria-hidden="true" />
              更新順に戻す
            </Button>
          )}
        </div>
        {active.length === 0 ? (
          <p className="text-gray-400 text-sm">進行中の案件はありません</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {active.map((project) => (
              <div
                key={project.id}
                data-project-id={project.id}
                className={cn(
                  'transition-transform duration-150 ease-out',
                  dragState?.id === project.id && 'rounded-lg border border-dashed border-gray-200 bg-gray-100/70'
                )}
                style={dragState?.id === project.id ? { height: dragState.height } : undefined}
              >
                <div
                  className={cn(
                    dragState?.id === project.id && 'pointer-events-none fixed z-50 opacity-100 shadow-xl transition-none'
                  )}
                  style={
                    dragState?.id === project.id
                      ? {
                          left: dragState.pointerX - dragState.offsetX,
                          top: dragState.pointerY - dragState.offsetY,
                          width: dragState.width,
                        }
                      : undefined
                  }
                >
                  <ProjectCard
                    project={project}
                    isDragging={dragState?.id === project.id}
                    dragHandle={
                      <button
                        type="button"
                        aria-label={`${project.name}を並び替え`}
                        title="押したままドラッグして並び替え"
                        className={cn(
                          'absolute right-3 top-3 z-10 flex size-8 touch-none cursor-grab items-center justify-center rounded-md border border-gray-200 bg-white text-gray-400 shadow-sm transition hover:border-gray-300 hover:text-gray-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-300 active:cursor-grabbing',
                          dragState?.id === project.id && 'cursor-grabbing text-gray-700'
                        )}
                        onPointerDown={(event) => handleDragStart(project.id, event)}
                      >
                        <GripVertical className="size-4" aria-hidden="true" />
                      </button>
                    }
                  />
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
      {done.length > 0 && (
        <section>
          <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-4">完了 ({done.length})</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 opacity-60">
            {done.map((project) => <ProjectCard key={project.id} project={project} />)}
          </div>
        </section>
      )}
    </div>
  )
}
