export type ProjectStatus = 'designing' | 'coding' | 'waiting_assets' | 'reviewing' | 'fixing' | 'done'

export interface Project {
  id: string
  name: string
  client: string
  status: ProjectStatus
  figma_url: string | null
  staging_url: string | null
  production_url: string | null
  created_at: string
  updated_at: string
}

export interface Log {
  id: string
  project_id: string
  content: string
  author: string
  created_at: string
}
