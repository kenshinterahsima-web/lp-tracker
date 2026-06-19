import type { ProjectStatus } from '@/types'
import { STATUS_LABELS, STATUS_COLORS } from '@/lib/status'

export function StatusBadge({ status }: { status: ProjectStatus }) {
  const { bg, text } = STATUS_COLORS[status]
  return (
    <span
      className="inline-flex items-center rounded-[6px] px-2.5 py-0.5 text-xs font-semibold"
      style={{ backgroundColor: bg, color: text, width: 'fit-content' }}
    >
      {STATUS_LABELS[status]}
    </span>
  )
}
