export type Role = 'user' | 'assistant'

export interface Message {
  id: string
  role: Role
  content: string
  createdAt: string
}

export interface Source {
  filename: string
  page?: number
  excerpt?: string
}

export interface Conversation {
  id: string
  title: string
  createdAt: string
  updatedAt: string
  messages?: Message[]
}

export interface UploadedFile {
  id: string
  name: string
  size: number
  status: 'uploading' | 'done' | 'error'
  progress: number
}

export interface ChatRequest {
  question: string
}

export interface ChatResponse {
  question: string
  answer: string
  lang: string
}

export interface HistoryResponse {
  conversations: Conversation[]
}

export interface UploadResponse {
  file_id: string
  filename: string
  message: string
}
