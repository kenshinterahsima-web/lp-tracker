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
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-4 py-4 flex items-center justify-between">
          <Image src="/logo.svg" alt="What NOW?" width={148} height={19} priority />
          <div className="flex items-center gap-3">
            <NewProjectDialog />
            <LogoutButton />
          </div>
        </div>
      </header>
      <main className="max-w-5xl mx-auto px-4 py-8">
        <ProjectBoard activeProjects={active} doneProjects={done} />
      </main>
    </div>
  )
}
