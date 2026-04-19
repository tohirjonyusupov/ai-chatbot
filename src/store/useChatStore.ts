import { create } from 'zustand'
import { Message, Conversation, UploadedFile } from '@/types/chat'

interface ChatStore {
  // Chat state
  messages: Message[]
  isLoading: boolean
  conversationId: string | null
  error: string | null

  // Sidebar state
  conversations: Conversation[]
  uploadedFiles: UploadedFile[]
  isSidebarOpen: boolean

  // Theme
  theme: 'light' | 'dark'

  // Chat actions
  addMessage: (msg: Message) => void
  setMessages: (msgs: Message[]) => void
  setLoading: (v: boolean) => void
  setConversationId: (id: string | null) => void
  setError: (err: string | null) => void
  clearChat: () => void

  // Sidebar actions
  setConversations: (convs: Conversation[]) => void
  addConversation: (conv: Conversation) => void
  addUploadedFile: (file: UploadedFile) => void
  updateFileProgress: (id: string, progress: number, status: UploadedFile['status']) => void
  removeFile: (id: string) => void
  toggleSidebar: () => void

  // Theme actions
  toggleTheme: () => void
}

export const useChatStore = create<ChatStore>((set) => ({
  messages: [],
  isLoading: false,
  conversationId: null,
  error: null,
  conversations: [],
  uploadedFiles: [],
  isSidebarOpen: true,
  theme: 'light',

  addMessage: (msg) => set((s) => ({ messages: [...s.messages, msg] })),
  setMessages: (msgs) => set({ messages: msgs }),
  setLoading: (v) => set({ isLoading: v }),
  setConversationId: (id) => set({ conversationId: id }),
  setError: (err) => set({ error: err }),
  clearChat: () => set({ messages: [], conversationId: null, error: null }),

  setConversations: (convs) => set({ conversations: convs }),
  addConversation: (conv) =>
    set((s) => ({ conversations: [conv, ...s.conversations] })),
  addUploadedFile: (file) =>
    set((s) => ({ uploadedFiles: [...s.uploadedFiles, file] })),
  updateFileProgress: (id, progress, status) =>
    set((s) => ({
      uploadedFiles: s.uploadedFiles.map((f) =>
        f.id === id ? { ...f, progress, status } : f
      ),
    })),
  removeFile: (id) =>
    set((s) => ({ uploadedFiles: s.uploadedFiles.filter((f) => f.id !== id) })),
  toggleSidebar: () => set((s) => ({ isSidebarOpen: !s.isSidebarOpen })),

  toggleTheme: () =>
    set((s) => {
      const next = s.theme === 'light' ? 'dark' : 'light'
      if (typeof document !== 'undefined') {
        document.documentElement.classList.toggle('dark', next === 'dark')
        localStorage.setItem('theme', next)
      }
      return { theme: next }
    }),
}))
