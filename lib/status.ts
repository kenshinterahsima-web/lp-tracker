import { ProjectStatus } from '@/types'

export const STATUS_LABELS: Record<ProjectStatus, string> = {
  designing: 'デザイン中',
  coding: 'コーディング中',
  fixing: '修正中',
  reviewing: '先方の確認待ち',
  done: '完了',
}

export const STATUS_COLORS: Record<ProjectStatus, { bg: string; text: string }> = {
  designing: { bg: '#A259FF', text: '#ffffff' },
  coding:    { bg: '#1ABCFE', text: '#ffffff' },
  reviewing: { bg: '#F24E1E', text: '#ffffff' },
  fixing:    { bg: '#FF7262', text: '#ffffff' },
  done:      { bg: '#0ACF83', text: '#ffffff' },
}

export const STATUS_OPTIONS: { value: ProjectStatus; label: string }[] = [
  { value: 'designing', label: 'デザイン中' },
  { value: 'coding', label: 'コーディング中' },
  { value: 'fixing', label: '修正中' },
  { value: 'reviewing', label: '先方の確認待ち' },
  { value: 'done', label: '完了' },
]
