'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'

export function LogForm({ projectId, defaultAuthor }: { projectId: string; defaultAuthor: string }) {
  const [content, setContent] = useState('')
  const [author, setAuthor] = useState(defaultAuthor)
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!content.trim()) return
    setLoading(true)
    const supabase = createClient()
    await supabase.from('logs').insert({ project_id: projectId, content: content.trim(), author: author.trim() || '匿名' })
    setContent('')
    setLoading(false)
    router.refresh()
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="author" className="text-sm font-medium text-[#515154]">投稿者名</Label>
        <Input
          id="author"
          value={author}
          onChange={(e) => setAuthor(e.target.value)}
          className="h-9 max-w-xs rounded-[6px] border-black/10 bg-white/70 text-sm"
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="content" className="text-sm font-medium text-[#515154]">作業ログ</Label>
        <Textarea
          id="content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="例: トップビジュアルのデザイン修正完了。スマホ対応も調整済み。"
          rows={3}
          className="resize-none rounded-[6px] border-black/10 bg-white/70 text-sm"
        />
      </div>
      <Button type="submit" size="sm" className="rounded-[6px]" disabled={loading || !content.trim()}>
        {loading ? '投稿中...' : '投稿する'}
      </Button>
    </form>
  )
}
