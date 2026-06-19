import { notFound } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { Project, Log } from '@/types'
import { StatusSelector } from '@/components/projects/StatusSelector'
import { LogForm } from '@/components/projects/LogForm'

function fmt(d: string) {
  return new Date(d).toLocaleDateString('ja-JP', { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })
}

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
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center gap-3">
          <Link href="/" className="text-sm text-gray-500 hover:text-gray-900">← 一覧</Link>
          <span className="text-gray-300">/</span>
          <span className="text-sm font-medium text-gray-900 truncate">{p.name}</span>
        </div>
      </header>
      <main className="max-w-6xl mx-auto px-4 py-8">
        <div className="grid grid-cols-[1fr_2fr] gap-8 items-start">

          {/* 左: プロジェクト情報 */}
          <div className="bg-white rounded-lg border p-6 space-y-4 sticky top-20">
            <div>
              <h1 className="text-xl font-bold text-gray-900">{p.name}</h1>
              <p className="text-gray-500 mt-1">{p.client}</p>
            </div>
            <StatusSelector projectId={p.id} currentStatus={p.status} />
            {(p.figma_url || p.staging_url || p.production_url) && (
              <div className="flex flex-col gap-2 pt-3 border-t">
                {p.figma_url && <a href={p.figma_url} target="_blank" rel="noopener noreferrer" className="text-sm text-blue-600 hover:underline">Figma ↗</a>}
                {p.staging_url && <a href={p.staging_url} target="_blank" rel="noopener noreferrer" className="text-sm text-blue-600 hover:underline">Staging ↗</a>}
                {p.production_url && <a href={p.production_url} target="_blank" rel="noopener noreferrer" className="text-sm text-blue-600 hover:underline">本番 ↗</a>}
              </div>
            )}
          </div>

          {/* 右: 作業ログ */}
          <div className="space-y-6">
            <div className="bg-white rounded-lg border p-6">
              <h2 className="font-semibold text-gray-900 mb-4">作業ログを追加</h2>
              <LogForm projectId={p.id} defaultAuthor={defaultAuthor} />
            </div>
            <div>
              <h2 className="font-semibold text-gray-900 mb-4">作業履歴 ({logList.length}件)</h2>
              {logList.length === 0 ? (
                <p className="text-sm text-gray-400">まだログがありません</p>
              ) : (
                <div className="space-y-3">
                  {logList.map((log) => (
                    <div key={log.id} className="bg-white rounded-lg border p-4">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-gray-700">{log.author}</span>
                        <span className="text-xs text-gray-400">{fmt(log.created_at)}</span>
                      </div>
                      <p className="text-sm text-gray-700 whitespace-pre-wrap">{log.content}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

        </div>
      </main>
    </div>
  )
}
