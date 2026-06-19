import { notFound } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import type { Project, Log } from '@/types'
import { StatusSelector } from '@/components/projects/StatusSelector'
import { LogForm } from '@/components/projects/LogForm'
import { LogList } from '@/components/projects/LogList'

export default async function ProjectDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createClient()
  const [{ data: project }, { data: logs }, { data: { user } }] = await Promise.all([
    supabase.from('projects').select('*').eq('id', id).single(),
    supabase.from('logs').select('*').eq('project_id', id).order('created_at', { ascending: false }),
    supabase.auth.getUser(),
  ])

  if (!project) notFound()
  const p = project as Project
  const logList = (logs as Log[] | null) ?? []
  const defaultAuthor = user?.email?.split('@')[0] ?? ''

  return (
    <div className="min-h-screen bg-[#F9FAFB] text-[#1d1d1f] md:grid md:grid-cols-[248px_minmax(0,1fr)]">
      <aside className="border-b border-black/5 bg-[#F9FAFB]/90 px-5 py-6 backdrop-blur-xl md:sticky md:top-0 md:h-screen md:border-b-0 md:border-r md:px-6 md:py-14">
        <div className="flex items-center gap-3 md:h-full md:flex-col md:items-start">
          <Link href="/" className="rounded-[6px] text-sm font-medium text-[#6e6e73] transition hover:text-[#1d1d1f] md:w-full md:px-3 md:py-2 md:hover:bg-white">← 一覧</Link>
          <div className="hidden h-px w-full bg-black/[0.06] md:block" />
          <span className="min-w-0 truncate text-sm font-medium text-[#1d1d1f] md:max-w-full md:px-3">{p.name}</span>
        </div>
      </aside>
      <main className="mx-auto w-full max-w-6xl px-5 py-10 sm:px-6 sm:py-14">
        <div className="grid gap-6 lg:grid-cols-[minmax(280px,0.9fr)_minmax(0,2fr)] lg:items-start">

          {/* 左: プロジェクト情報 */}
          <aside className="sticky top-24 space-y-6 rounded-[6px] border border-black/5 bg-white/72 p-6 shadow-[0_18px_60px_rgba(0,0,0,0.045)] backdrop-blur">
            <div className="space-y-2">
              <p className="text-[11px] font-medium uppercase tracking-[0.18em] text-[#8a8a8f]">Project</p>
              <h1 className="text-2xl font-semibold leading-tight tracking-[-0.02em] text-[#1d1d1f]">{p.name}</h1>
              <p className="text-sm leading-6 text-[#6e6e73]">{p.client}</p>
            </div>
            <StatusSelector projectId={p.id} currentStatus={p.status} />
            {(p.figma_url || p.staging_url || p.production_url) && (
              <div className="flex flex-col gap-2 border-t border-black/[0.06] pt-5">
                {p.figma_url && <a href={p.figma_url} target="_blank" rel="noopener noreferrer" className="rounded-[6px] border border-black/5 bg-[#f5f5f7] px-3 py-2 text-sm font-medium text-[#515154] transition hover:bg-white hover:text-[#1d1d1f]">Figma ↗</a>}
                {p.staging_url && <a href={p.staging_url} target="_blank" rel="noopener noreferrer" className="rounded-[6px] border border-black/5 bg-[#f5f5f7] px-3 py-2 text-sm font-medium text-[#515154] transition hover:bg-white hover:text-[#1d1d1f]">Staging ↗</a>}
                {p.production_url && <a href={p.production_url} target="_blank" rel="noopener noreferrer" className="rounded-[6px] border border-black/5 bg-[#f5f5f7] px-3 py-2 text-sm font-medium text-[#515154] transition hover:bg-white hover:text-[#1d1d1f]">本番 ↗</a>}
              </div>
            )}
          </aside>

          {/* 右: 作業ログ */}
          <div className="space-y-8">
            <section className="space-y-5">
              <div className="space-y-1">
                <p className="text-[11px] font-medium uppercase tracking-[0.18em] text-[#8a8a8f]">Work History</p>
                <h2 className="text-2xl font-semibold tracking-[-0.02em] text-[#1d1d1f] sm:text-3xl">作業履歴</h2>
                <p className="text-sm leading-6 text-[#6e6e73]">{logList.length}件のログがあります</p>
              </div>
              <LogList logs={logList} projectId={p.id} />
            </section>
            <section className="rounded-[6px] border border-black/5 bg-white/72 p-6 shadow-[0_18px_60px_rgba(0,0,0,0.045)] backdrop-blur">
              <div className="mb-5 space-y-1">
                <p className="text-[11px] font-medium uppercase tracking-[0.18em] text-[#8a8a8f]">New Log</p>
                <h2 className="text-xl font-semibold tracking-[-0.02em] text-[#1d1d1f]">作業ログを追加</h2>
              </div>
              <LogForm projectId={p.id} defaultAuthor={defaultAuthor} />
            </section>
          </div>

        </div>
      </main>
    </div>
  )
}
