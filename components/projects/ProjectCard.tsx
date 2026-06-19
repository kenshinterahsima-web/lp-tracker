import Link from 'next/link'
import { ReactNode } from 'react'
import { Project } from '@/types'
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
        'relative hover:shadow-md transition-all cursor-pointer h-full',
        isDragging && 'scale-[0.98] opacity-70 shadow-md ring-2 ring-gray-300'
      )}
    >
      <Link href={`/projects/${project.id}`} className="block h-full">
        <CardHeader className="pb-2">
          <StatusBadge status={project.status} />
          <h3 className="font-semibold text-gray-900 leading-tight mt-2 pr-8">{project.name}</h3>
          <p className="text-sm text-gray-500 mt-0.5">{project.client}</p>
        </CardHeader>
        <CardContent>
          <p className="text-xs text-gray-400">更新: {formatDate(project.updated_at)}</p>
          <div className="flex gap-2 mt-2 flex-wrap">
            {project.figma_url && <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded">Figma</span>}
            {project.staging_url && <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded">Staging</span>}
            {project.production_url && <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded">本番</span>}
          </div>
        </CardContent>
      </Link>
      {dragHandle}
    </Card>
  )
}
