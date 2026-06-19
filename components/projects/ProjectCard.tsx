import Link from 'next/link'
import { Project } from '@/types'
import { StatusBadge } from './StatusBadge'
import { Card, CardContent, CardHeader } from '@/components/ui/card'

function formatDate(d: string) {
  return new Date(d).toLocaleDateString('ja-JP', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })
}

export function ProjectCard({ project }: { project: Project }) {
  return (
    <Link href={`/projects/${project.id}`}>
      <Card className="hover:shadow-md transition-shadow cursor-pointer h-full">
        <CardHeader className="pb-2">
          <div className="flex items-start justify-between gap-2">
            <div>
              <h3 className="font-semibold text-gray-900 leading-tight">{project.name}</h3>
              <p className="text-sm text-gray-500 mt-0.5">{project.client}</p>
            </div>
            <StatusBadge status={project.status} />
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-xs text-gray-400">更新: {formatDate(project.updated_at)}</p>
          <div className="flex gap-2 mt-2 flex-wrap">
            {project.figma_url && <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded">Figma</span>}
            {project.staging_url && <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded">Staging</span>}
            {project.production_url && <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded">本番</span>}
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}
