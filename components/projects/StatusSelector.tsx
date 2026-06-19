'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import type { ProjectStatus } from '@/types'
import { STATUS_OPTIONS, STATUS_LABELS } from '@/lib/status'
import { Select, SelectContent, SelectItem, SelectTrigger } from '@/components/ui/select'
import { StatusBadge } from './StatusBadge'

export function StatusSelector({ projectId, currentStatus }: { projectId: string; currentStatus: ProjectStatus }) {
  const [status, setStatus] = useState<ProjectStatus>(currentStatus)
  const [saving, setSaving] = useState(false)
  const router = useRouter()

  async function handleChange(value: string | null) {
    if (!value) return
    const newStatus = value as ProjectStatus
    setSaving(true)
    const supabase = createClient()
    await supabase.from('projects').update({ status: newStatus, updated_at: new Date().toISOString() }).eq('id', projectId)
    setStatus(newStatus)
    setSaving(false)
    router.refresh()
  }

  return (
    <div className="flex flex-wrap items-center gap-3">
      <StatusBadge status={status} />
      <Select value={status} onValueChange={handleChange} disabled={saving}>
        <SelectTrigger className="h-9 w-40 rounded-[6px] border-black/10 bg-white/70 text-sm text-[#515154]">
          <span>{STATUS_LABELS[status]}</span>
        </SelectTrigger>
        <SelectContent>
          {STATUS_OPTIONS.map((opt) => (
            <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
          ))}
        </SelectContent>
      </Select>
      {saving && <span className="text-xs text-[#8a8a8f]">保存中...</span>}
    </div>
  )
}
