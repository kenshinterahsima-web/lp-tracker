'use client'

import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

export function LogoutButton({ className }: { className?: string }) {
  const router = useRouter()
  async function handleLogout() {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/login')
    router.refresh()
  }
  return (
    <Button variant="ghost" size="sm" onClick={handleLogout} className={cn('text-gray-500', className)}>
      ログアウト
    </Button>
  )
}
