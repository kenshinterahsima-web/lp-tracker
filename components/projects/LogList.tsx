'use client'

import { useState, useEffect } from 'react'
import { Log } from '@/types'
import { deleteLog, toggleLogDone } from '@/app/actions/logs'

function fmt(d: string) {
  return new Date(d).toLocaleDateString('ja-JP', { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })
}

export function LogList({ logs: initialLogs, projectId }: { logs: Log[]; projectId: string }) {
  const [logs, setLogs] = useState(initialLogs)

  useEffect(() => {
    setLogs(initialLogs)
  }, [initialLogs])

  async function handleToggle(id: string, current: boolean) {
    setLogs(logs.map(l => l.id === id ? { ...l, done: !current } : l))
    await toggleLogDone(id, !current, projectId)
  }

  async function handleDelete(id: string) {
    setLogs(logs.filter(l => l.id !== id))
    await deleteLog(id, projectId)
  }

  if (logs.length === 0) {
    return <p className="text-sm text-gray-400">まだログがありません</p>
  }

  return (
    <div className="space-y-3">
      {logs.map((log) => (
        <div
          key={log.id}
          className="relative bg-white rounded-lg border border-gray-200 overflow-hidden"
          style={{ borderLeft: '4px solid #A259FF' }}
        >
          {log.done && (
            <div className="absolute inset-0 bg-gray-100/80 rounded-lg pointer-events-none z-10" />
          )}
          <div className="p-4 flex items-start gap-3">
            {/* チェックボタン */}
            <button
              onClick={() => handleToggle(log.id, log.done)}
              className="mt-0.5 shrink-0 w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors"
              style={{
                borderColor: log.done ? '#0ACF83' : '#d1d5db',
                backgroundColor: log.done ? '#0ACF83' : 'white',
              }}
            >
              {log.done && (
                <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
                  <path d="M1 4L3.5 6.5L9 1" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              )}
            </button>

            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between gap-2 mb-1">
                <span className="text-sm font-semibold text-gray-800">{log.author}</span>
                <div className="flex items-center gap-2 shrink-0">
                  <span className="text-xs text-gray-400">{fmt(log.created_at)}</span>
                  {/* 削除ボタン */}
                  <button
                    onClick={() => handleDelete(log.id)}
                    className="text-gray-300 hover:text-red-400 transition-colors"
                    title="削除"
                  >
                    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                      <path d="M1.75 3.5H12.25M5.25 3.5V2.625C5.25 2.141 5.641 1.75 6.125 1.75H7.875C8.359 1.75 8.75 2.141 8.75 2.625V3.5M10.5 3.5L10.0625 10.7327C10.0272 11.2173 9.62382 11.5833 9.1381 11.5833H4.8619C4.37618 11.5833 3.97278 11.2173 3.9375 10.7327L3.5 3.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </button>
                </div>
              </div>
              <p
                className="text-sm whitespace-pre-wrap leading-relaxed"
                style={{
                  color: log.done ? '#9ca3af' : '#374151',
                  textDecoration: log.done ? 'line-through' : 'none',
                }}
              >
                {log.content}
              </p>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
