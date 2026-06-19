'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function deleteLog(id: string, projectId: string) {
  const supabase = await createClient()
  await supabase.from('logs').delete().eq('id', id)
  revalidatePath(`/projects/${projectId}`)
}

export async function toggleLogDone(id: string, done: boolean, projectId: string) {
  const supabase = await createClient()
  await supabase.from('logs').update({ done }).eq('id', id)
  revalidatePath(`/projects/${projectId}`)
}
