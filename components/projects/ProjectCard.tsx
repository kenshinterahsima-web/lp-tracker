import Link from 'next/link'
import type { ReactNode } from 'react'
import type { Project } from '@/types'
import { StatusBadge } from './StatusBadge'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { cn } from '@/lib/utils'

function formatDate(d: string) {
  return new Date(d).toLocaleDateString('ja-JP', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })
}

interface ProjectCardProps {
  project: Project
  dragHandle?: ReactNode
  isDragging?: boolean
}

export function ProjectCard({ project, dragHandle, isDragging = false }: ProjectCardProps) {
  return (
    <Card
      className={cn(
        'group relative h-full cursor-pointer overflow-hidden rounded-[6px] border border-black/5 bg-white/72 shadow-[0_18px_60px_rgba(0,0,0,0.045)] backdrop-blur transition-all duration-200 hover:-translate-y-0.5 hover:bg-white hover:shadow-[0_24px_70px_rgba(0,0,0,0.08)]',
        isDragging && 'scale-[1.02] bg-white opacity-95 shadow-[0_28px_90px_rgba(0,0,0,0.16)] ring-1 ring-black/10'
      )}
    >
      <Link href={`/projects/${project.id}`} className="flex h-[220px] flex-col">
        <CardHeader className="px-5 pb-3 pt-5">
          <StatusBadge status={project.status} />
          <h3 className="mt-5 line-clamp-2 pr-9 text-xl font-semibold leading-tight tracking-[-0.02em] text-[#1d1d1f]" title={project.name}>{project.name}</h3>
          <p className="mt-2 line-clamp-1 text-sm leading-6 text-[#6e6e73]" title={project.client}>{project.client}</p>
        </CardHeader>
        <CardContent className="mt-auto px-5 pb-5">
          <div className="mt-3 h-px bg-black/[0.06]" />
          <p className="mt-4 text-xs font-medium text-[#8a8a8f]">更新: {formatDate(project.updated_at)}</p>
          <div className="mt-4 flex flex-wrap gap-2">
            {project.figma_url && <span className="rounded-[6px] border border-black/5 bg-[#f5f5f7] px-2.5 py-1 text-xs font-medium text-[#515154]">Figma</span>}
            {project.staging_url && <span className="rounded-[6px] border border-black/5 bg-[#f5f5f7] px-2.5 py-1 text-xs font-medium text-[#515154]">Staging</span>}
            {project.production_url && <span className="rounded-[6px] border border-black/5 bg-[#f5f5f7] px-2.5 py-1 text-xs font-medium text-[#515154]">本番</span>}
          </div>
        </CardContent>
      </Link>
      {dragHandle}
    </Card>
  )
}
