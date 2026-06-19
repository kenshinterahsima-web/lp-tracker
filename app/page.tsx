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
    <div className="min-h-screen bg-[#f6f5f2] text-[#1d1d1f]">
      <header className="sticky top-0 z-10 border-b border-black/5 bg-[#f6f5f2]/80 backdrop-blur-xl">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-5 sm:px-6">
          <Image src="/logo.svg" alt="What NOW?" width={148} height={19} priority />
          <div className="flex items-center gap-3">
            <NewProjectDialog />
            <LogoutButton />
          </div>
        </div>
      </header>
      <main className="mx-auto max-w-6xl px-5 py-10 sm:px-6 sm:py-14">
        <ProjectBoard activeProjects={active} doneProjects={done} />
      </main>
    </div>
  )
}
