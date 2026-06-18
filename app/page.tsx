import { createClient } from '@/lib/supabase/server'
import { ProjectCard } from '@/components/projects/ProjectCard'
import { NewProjectDialog } from '@/components/projects/NewProjectDialog'
import { LogoutButton } from '@/components/LogoutButton'
import { Project } from '@/types'

export default async function HomePage() {
  const supabase = await createClient()
  const { data: projects } = await supabase.from('projects').select('*').order('updated_at', { ascending: false })
  const all = (projects as Project[] | null) ?? []
  const active = all.filter((p) => p.status !== 'done')
  const done = all.filter((p) => p.status === 'done')

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-4 py-4 flex items-center justify-between">
          <h1 className="text-xl font-bold text-gray-900">LP Tracker</h1>
          <div className="flex items-center gap-3">
            <NewProjectDialog />
            <LogoutButton />
          </div>
        </div>
      </header>
      <main className="max-w-5xl mx-auto px-4 py-8 space-y-10">
        <section>
          <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-4">進行中 ({active.length})</h2>
          {active.length === 0 ? (
            <p className="text-gray-400 text-sm">進行中の案件はありません</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {active.map((p) => <ProjectCard key={p.id} project={p} />)}
            </div>
          )}
        </section>
        {done.length > 0 && (
          <section>
            <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-4">完了 ({done.length})</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 opacity-60">
              {done.map((p) => <ProjectCard key={p.id} project={p} />)}
            </div>
          </section>
        )}
      </main>
    </div>
  )
}
