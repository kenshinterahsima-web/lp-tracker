import { ProjectStatus } from '@/types'
import { STATUS_LABELS, STATUS_COLORS } from '@/lib/status'

export function StatusBadge({ status }: { status: ProjectStatus }) {
  const { bg, text } = STATUS_COLORS[status]
  return (
    <span
      className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold"
      style={{ backgroundColor: bg, color: text }}
    >
      {STATUS_LABELS[status]}
    </span>
  )
}
