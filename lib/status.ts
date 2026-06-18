import { ProjectStatus } from '@/types'

export const STATUS_LABELS: Record<ProjectStatus, string> = {
  designing: 'デザイン中',
  coding: 'コーディング中',
  reviewing: '確認待ち',
  fixing: '修正中',
  done: '完了',
}

export const STATUS_COLORS: Record<ProjectStatus, { bg: string; text: string }> = {
  designing: { bg: '#A259FF22', text: '#A259FF' },
  coding:    { bg: '#1ABCFE22', text: '#1ABCFE' },
  reviewing: { bg: '#F24E1E22', text: '#F24E1E' },
  fixing:    { bg: '#FF726222', text: '#FF7262' },
  done:      { bg: '#0ACF8322', text: '#0ACF83' },
}

export const STATUS_OPTIONS: { value: ProjectStatus; label: string }[] = [
  { value: 'designing', label: 'デザイン中' },
  { value: 'coding', label: 'コーディング中' },
  { value: 'reviewing', label: '確認待ち' },
  { value: 'fixing', label: '修正中' },
  { value: 'done', label: '完了' },
]
