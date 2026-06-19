import Image from 'next/image'
import { createClient } from '@/lib/supabase/server'
import { ProjectBoard } from '@/components/projects/ProjectBoard'
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
    <div className="min-h-screen bg-[#F9FAFB] text-[#1d1d1f] md:grid md:grid-cols-[248px_minmax(0,1fr)]">
      <aside className="border-b border-black/5 bg-[#F9FAFB]/90 px-5 py-6 backdrop-blur-xl md:sticky md:top-0 md:h-screen md:border-b-0 md:border-r md:px-6 md:py-14">
        <div className="flex gap-5 md:h-full md:flex-col md:items-start">
          <Image className="shrink-0" src="/logo.svg" alt="What NOW?" width={148} height={19} priority />
          <div className="flex w-full items-start gap-3 md:mt-8 md:flex-1 md:flex-col">
            <NewProjectDialog triggerClassName="h-12 w-full justify-start rounded-[6px] px-4 text-left text-sm font-semibold shadow-[0_12px_30px_rgba(0,0,0,0.08)]" />
            <LogoutButton className="h-10 w-full justify-start rounded-[6px] px-4 text-left text-sm text-[#6e6e73] hover:text-[#1d1d1f] md:mt-auto" />
          </div>
        </div>
      </aside>
      <main className="mx-auto w-full max-w-6xl px-5 py-10 sm:px-6 sm:py-14">
        <ProjectBoard activeProjects={active} doneProjects={done} />
      </main>
    </div>
  )
}
