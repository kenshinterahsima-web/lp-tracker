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
    <div className="space-y-12">
      <section className="space-y-5">
        <div className="flex items-end justify-between gap-4">
          <div className="space-y-1">
            <p className="text-[11px] font-medium uppercase tracking-[0.18em] text-[#8a8a8f]">Active Projects</p>
            <h2 className="text-xl font-semibold tracking-[-0.02em] text-[#1d1d1f] sm:text-2xl">進行中</h2>
            <p className="text-sm leading-6 text-[#6e6e73]">{active.length}件の案件を進行中です</p>
          </div>
          {active.length > 1 && (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="rounded-[6px] border border-black/10 bg-white/60 px-3 text-[#515154] shadow-sm backdrop-blur hover:bg-white hover:text-[#1d1d1f]"
              onClick={handleResetOrder}
            >
              <RotateCcw aria-hidden="true" />
              更新順に戻す
            </Button>
          )}
        </div>
        {active.length === 0 ? (
          <div className="rounded-[6px] border border-black/5 bg-white/65 px-6 py-10 text-sm text-[#8a8a8f] shadow-[0_18px_60px_rgba(0,0,0,0.04)]">
            進行中の案件はありません
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {active.map((project) => (
              <div
                key={project.id}
                data-project-id={project.id}
                className={cn(
                  'h-full transition-transform duration-150 ease-out',
                  dragState?.id === project.id && 'rounded-[6px] border border-dashed border-black/10 bg-white/45'
                )}
                style={dragState?.id === project.id ? { height: dragState.height } : undefined}
              >
                <div
                  className={cn(
                    dragState?.id !== project.id && 'h-full',
                    dragState?.id === project.id && 'pointer-events-none fixed z-50 opacity-100 shadow-xl transition-none'
                  )}
                  style={
                    dragState?.id === project.id
                      ? {
                          left: dragState.pointerX - dragState.offsetX,
                          top: dragState.pointerY - dragState.offsetY,
                          width: dragState.width,
                          height: dragState.height,
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
                          'absolute right-4 top-4 z-10 flex size-9 touch-none cursor-grab items-center justify-center rounded-[6px] border border-black/5 bg-white/80 text-[#8a8a8f] shadow-[0_8px_24px_rgba(0,0,0,0.08)] backdrop-blur transition hover:bg-white hover:text-[#1d1d1f] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black/10 active:cursor-grabbing',
                          dragState?.id === project.id && 'cursor-grabbing bg-white text-[#1d1d1f]'
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
        <section className="space-y-5">
          <div className="space-y-1">
            <p className="text-[11px] font-medium uppercase tracking-[0.18em] text-[#8a8a8f]">Completed</p>
            <h2 className="text-xl font-semibold tracking-[-0.02em] text-[#1d1d1f] sm:text-2xl">完了</h2>
            <p className="text-sm leading-6 text-[#6e6e73]">{done.length}件の案件が完了しています</p>
          </div>
          <div className="grid grid-cols-1 gap-4 opacity-55 sm:grid-cols-2 lg:grid-cols-3">
            {done.map((project) => <ProjectCard key={project.id} project={project} />)}
          </div>
        </section>
      )}
    </div>
  )
}
