'use client'

import { useEffect } from 'react'
import { useChatStore } from '@/store/useChatStore'
import Sidebar from '@/components/sidebar/Sidebar'
import ChatContainer from '@/components/chat/ChatContainer'
import { ChevronRight } from 'lucide-react'

export default function HomePage() {
  const { isSidebarOpen, toggleSidebar, theme } = useChatStore()

  // Sync theme on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem('theme') as 'light' | 'dark' | null
      if (saved && saved !== theme) {
        useChatStore.setState({ theme: saved })
        document.documentElement.classList.toggle('dark', saved === 'dark')
      }
    } catch {}
  }, [])

  // Handle suggestion card clicks
  useEffect(() => {
    const handler = (e: Event) => {
      const text = (e as CustomEvent<string>).detail
      const syntheticSend = new CustomEvent('rag:send', { detail: text })
      window.dispatchEvent(syntheticSend)
    }
    window.addEventListener('rag:suggest', handler)
    return () => window.removeEventListener('rag:suggest', handler)
  }, [])

  return (
    <div
      style={{
        height: '100dvh',
        display: 'flex',
        overflow: 'hidden',
        background: 'var(--bg)',
      }}
    >
      {/* Sidebar */}
      <Sidebar />

      {/* Collapsed sidebar toggle */}
      {!isSidebarOpen && (
        <button
          onClick={toggleSidebar}
          title="Open sidebar"
          style={{
            position: 'absolute',
            top: 16,
            left: 12,
            zIndex: 10,
            width: 28,
            height: 28,
            borderRadius: 7,
            border: '0.5px solid var(--border)',
            background: 'var(--surface)',
            color: 'var(--text-tertiary)',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <ChevronRight size={14} />
        </button>
      )}

      {/* Chat */}
      <main
        style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
          minWidth: 0,
        }}
      >
        {/* Top bar */}
        <div
          style={{
            height: 52,
            display: 'flex',
            alignItems: 'center',
            padding: '0 20px',
            borderBottom: '0.5px solid var(--border)',
            background: 'var(--surface)',
            gap: 12,
            flexShrink: 0,
          }}
        >
          {!isSidebarOpen && <div style={{ width: 28 }} />}
          <span style={{ fontSize: 13, color: 'var(--text-secondary)' }}>
            Ask questions about your documents
          </span>
          <StatusDot />
        </div>

        <ChatContainer />
      </main>
    </div>
  )
}

function StatusDot() {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 5,
        marginLeft: 'auto',
        fontSize: 11,
        color: 'var(--text-tertiary)',
      }}
    >
      <span
        style={{
          width: 6,
          height: 6,
          borderRadius: '50%',
          background: 'var(--success)',
          display: 'inline-block',
        }}
      />
      Ready
    </div>
  )
}
