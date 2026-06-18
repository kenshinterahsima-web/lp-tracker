'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { ProjectStatus } from '@/types'
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
    <div className="flex items-center gap-3">
      <StatusBadge status={status} />
      <Select value={status} onValueChange={handleChange} disabled={saving}>
        <SelectTrigger className="w-40 h-8 text-sm">
          <span>{STATUS_LABELS[status]}</span>
        </SelectTrigger>
        <SelectContent>
          {STATUS_OPTIONS.map((opt) => (
            <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
          ))}
        </SelectContent>
      </Select>
      {saving && <span className="text-xs text-gray-400">保存中...</span>}
    </div>
  )
}
