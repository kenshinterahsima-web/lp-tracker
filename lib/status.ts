import { ProjectStatus } from '@/types'

export const STATUS_LABELS: Record<ProjectStatus, string> = {
  designing: 'デザイン中',
  coding: 'コーディング中',
  reviewing: '確認待ち',
  fixing: '修正中',
  done: '完了',
}

export const STATUS_COLORS: Record<ProjectStatus, string> = {
  designing: 'bg-blue-100 text-blue-800',
  coding: 'bg-purple-100 text-purple-800',
  reviewing: 'bg-yellow-100 text-yellow-800',
  fixing: 'bg-orange-100 text-orange-800',
  done: 'bg-green-100 text-green-800',
}

export const STATUS_OPTIONS: { value: ProjectStatus; label: string }[] = [
  { value: 'designing', label: 'デザイン中' },
  { value: 'coding', label: 'コーディング中' },
  { value: 'reviewing', label: '確認待ち' },
  { value: 'fixing', label: '修正中' },
  { value: 'done', label: '完了' },
]
