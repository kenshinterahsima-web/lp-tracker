import { notFound } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import type { Project, Log } from '@/types'
import { StatusSelector } from '@/components/projects/StatusSelector'
import { LogForm } from '@/components/projects/LogForm'
import { LogList } from '@/components/projects/LogList'
import { NewProjectDialog } from '@/components/projects/NewProjectDialog'
import { LogoutButton } from '@/components/LogoutButton'

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
        <div className="flex gap-5 md:h-full md:flex-col md:items-start">
          <Image className="shrink-0" src="/logo.svg" alt="What NOW?" width={148} height={19} priority />

          <Link href="/" className="w-full rounded-[6px] border border-black/5 bg-white/70 px-4 py-3 text-sm font-medium text-[#515154] transition hover:bg-white hover:text-[#1d1d1f]">
            ← 一覧に戻る
          </Link>

          <div className="flex w-full items-start gap-3 md:mt-auto md:flex-col">
            <NewProjectDialog triggerClassName="h-12 w-full justify-start rounded-[6px] px-4 text-left text-sm font-semibold shadow-[0_12px_30px_rgba(0,0,0,0.08)]" />
            <LogoutButton className="h-10 w-full justify-start rounded-[6px] px-4 text-left text-sm text-[#6e6e73] hover:text-[#1d1d1f]" />
          </div>
        </div>
      </aside>
      <main className="mx-auto w-full max-w-6xl px-5 py-10 sm:px-6 sm:py-14">
        <div className="grid gap-6 lg:grid-cols-[360px_minmax(0,1fr)] lg:items-start">
          <div className="space-y-6">
            <section className="rounded-[6px] border border-black/5 bg-white/72 p-6 shadow-[0_18px_60px_rgba(0,0,0,0.045)] backdrop-blur">
              <div className="space-y-4">
                <div className="space-y-2">
                  <p className="text-[11px] font-medium uppercase tracking-[0.18em] text-[#8a8a8f]">Project</p>
                  <h1 className="text-xl font-semibold leading-tight tracking-[-0.02em] text-[#1d1d1f]">{p.name}</h1>
                  <p className="text-sm leading-6 text-[#6e6e73]">{p.client}</p>
                </div>
                <StatusSelector projectId={p.id} currentStatus={p.status} />
                {(p.figma_url || p.staging_url || p.production_url) && (
                  <div className="space-y-2 border-t border-black/[0.06] pt-4">
                    <p className="text-[11px] font-medium uppercase tracking-[0.18em] text-[#8a8a8f]">Links</p>
                    <div className="flex flex-col gap-2">
                      {p.figma_url && <a href={p.figma_url} target="_blank" rel="noopener noreferrer" className="rounded-[6px] border border-black/5 bg-[#f5f5f7] px-3 py-2 text-sm font-medium text-[#515154] transition hover:bg-white hover:text-[#1d1d1f]">Figma ↗</a>}
                      {p.staging_url && <a href={p.staging_url} target="_blank" rel="noopener noreferrer" className="rounded-[6px] border border-black/5 bg-[#f5f5f7] px-3 py-2 text-sm font-medium text-[#515154] transition hover:bg-white hover:text-[#1d1d1f]">Staging ↗</a>}
                      {p.production_url && <a href={p.production_url} target="_blank" rel="noopener noreferrer" className="rounded-[6px] border border-black/5 bg-[#f5f5f7] px-3 py-2 text-sm font-medium text-[#515154] transition hover:bg-white hover:text-[#1d1d1f]">本番 ↗</a>}
                    </div>
                  </div>
                )}
              </div>
            </section>

            <section className="rounded-[6px] border border-black/5 bg-white/72 p-6 shadow-[0_18px_60px_rgba(0,0,0,0.045)] backdrop-blur">
              <div className="mb-5 space-y-1">
                <p className="text-[11px] font-medium uppercase tracking-[0.18em] text-[#8a8a8f]">New Log</p>
                <h2 className="text-lg font-semibold tracking-[-0.02em] text-[#1d1d1f]">作業ログを追加</h2>
              </div>
              <LogForm projectId={p.id} defaultAuthor={defaultAuthor} />
            </section>
          </div>

          <section className="space-y-5">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
              <div className="space-y-1">
                <p className="text-[11px] font-medium uppercase tracking-[0.18em] text-[#8a8a8f]">Work History</p>
                <h2 className="text-xl font-semibold tracking-[-0.02em] text-[#1d1d1f] sm:text-2xl">作業履歴</h2>
              </div>
              <p className="text-sm leading-6 text-[#6e6e73]">{logList.length}件のログがあります</p>
            </div>
            <LogList logs={logList} projectId={p.id} />
          </section>
        </div>
      </main>
    </div>
  )
}
