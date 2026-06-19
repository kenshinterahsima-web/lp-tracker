import Link from 'next/link'
import { Project } from '@/types'
import { StatusBadge } from './StatusBadge'

function formatDate(d: string) {
  return new Date(d).toLocaleDateString('ja-JP', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })
}

export function ProjectCard({ project }: { project: Project }) {
  return (
    <Link href={`/projects/${project.id}`}>
      <div className="flex items-center gap-3 px-4 py-3 bg-white border-b hover:bg-gray-50 transition-colors cursor-pointer">
        <div className="shrink-0 w-28">
          <StatusBadge status={project.status} />
        </div>
        <p className="flex-1 font-medium text-gray-900 truncate">{project.name}</p>
        <p className="shrink-0 w-28 text-sm text-gray-500 truncate">{project.client}</p>
        <p className="shrink-0 w-32 text-xs text-gray-400 text-right">{formatDate(project.updated_at)}</p>
      </div>
    </Link>
  )
}
