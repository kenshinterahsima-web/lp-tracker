'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Select, SelectContent, SelectItem, SelectTrigger } from '@/components/ui/select'
import { STATUS_OPTIONS, STATUS_LABELS } from '@/lib/status'
import { ProjectStatus } from '@/types'

export function NewProjectDialog() {
  const [open, setOpen] = useState(false)
  const [name, setName] = useState('')
  const [client, setClient] = useState('')
  const [status, setStatus] = useState<ProjectStatus>('designing')
  const [figmaUrl, setFigmaUrl] = useState('')
  const [stagingUrl, setStagingUrl] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  function resetForm() {
    setName(''); setClient(''); setStatus('designing'); setFigmaUrl(''); setStagingUrl('')
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    const supabase = createClient()
    await supabase.from('projects').insert({
      name, client, status,
      figma_url: figmaUrl || null,
      staging_url: stagingUrl || null,
    })
    setLoading(false)
    setOpen(false)
    resetForm()
    router.refresh()
  }

  return (
    <Dialog open={open} onOpenChange={(o) => { setOpen(o); if (!o) resetForm() }}>
      <DialogTrigger render={<Button />}>＋ 新規案件</DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>新規案件を作成</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 mt-2">
          <div className="space-y-2">
            <Label htmlFor="name">案件名 *</Label>
            <Input id="name" value={name} onChange={(e) => setName(e.target.value)} required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="client">クライアント名 *</Label>
            <Input id="client" value={client} onChange={(e) => setClient(e.target.value)} required />
          </div>
          <div className="space-y-2">
            <Label>ステータス</Label>
            <Select value={status} onValueChange={(v) => v && setStatus(v as ProjectStatus)}>
              <SelectTrigger><span>{STATUS_LABELS[status]}</span></SelectTrigger>
              <SelectContent>
                {STATUS_OPTIONS.map((opt) => (
                  <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="figma">Figma URL</Label>
            <Input id="figma" type="url" value={figmaUrl} onChange={(e) => setFigmaUrl(e.target.value)} placeholder="https://figma.com/..." />
          </div>
          <div className="space-y-2">
            <Label htmlFor="staging">Staging URL</Label>
            <Input id="staging" type="url" value={stagingUrl} onChange={(e) => setStagingUrl(e.target.value)} placeholder="https://..." />
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>キャンセル</Button>
            <Button type="submit" disabled={loading}>{loading ? '作成中...' : '作成'}</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
