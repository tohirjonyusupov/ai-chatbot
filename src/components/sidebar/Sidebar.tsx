'use client'

import { useEffect } from 'react'
import { useChatStore } from '@/store/useChatStore'
// import { getHistory } from '@/lib/api'
import { Sun, Moon, PenSquare, ChevronLeft } from 'lucide-react'
import FileUpload from './FileUpload'
import HistoryList from './HistoryList'

export default function Sidebar() {
  const { theme, toggleTheme, clearChat, isSidebarOpen, toggleSidebar, setConversations } =
    useChatStore()

  // useEffect(() => {
  //   getHistory()
  //     .then((res) => setConversations(res.conversations))
  //     .catch(() => {})
  // }, [setConversations])

  if (!isSidebarOpen) return null

  return (
    <aside
      style={{
        width: 256,
        minWidth: 256,
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        background: 'var(--surface)',
        borderRight: '0.5px solid var(--border)',
        overflow: 'hidden',
      }}
    >
      {/* Header */}
      <div
        style={{
          padding: '16px 12px 12px',
          borderBottom: '0.5px solid var(--border)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 8,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ fontSize: 17 }}>✦</span>
          <span
            style={{
              fontSize: 14,
              fontWeight: 500,
              color: 'var(--text-primary)',
              letterSpacing: '-0.01em',
            }}
          >
            Smart FAQ
          </span>
        </div>

        <div style={{ display: 'flex', gap: 4 }}>
          <IconButton onClick={toggleTheme} title="Toggle theme">
            {theme === 'light' ? <Moon size={14} /> : <Sun size={14} />}
          </IconButton>
          <IconButton onClick={clearChat} title="New chat">
            <PenSquare size={14} />
          </IconButton>
          <IconButton onClick={toggleSidebar} title="Collapse">
            <ChevronLeft size={14} />
          </IconButton>
        </div>
      </div>

      {/* File upload */}
      <div
        style={{
          borderBottom: '0.5px solid var(--border)',
          paddingTop: 14,
        }}
      >
        <FileUpload />
      </div>

      {/* History */}
      {/* <div style={{ flex: 1, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
        <p
          style={{
            fontSize: 11,
            fontWeight: 500,
            color: 'var(--text-tertiary)',
            textTransform: 'uppercase',
            letterSpacing: '0.06em',
            padding: '14px 16px 8px',
          }}
        >
          History
        </p>
        <div style={{ flex: 1, overflowY: 'auto', padding: '0 4px 12px' }}>
          <HistoryList />
        </div>
      </div> */}

      {/* Footer */}
      <div
        style={{
          padding: '10px 16px',
          borderTop: '0.5px solid var(--border)',
          position: 'fixed',
          bottom: '0'
        }}
      >
        <p style={{ fontSize: 10, color: 'var(--text-tertiary)' }}>
          RAG-powered · Documents stay private
        </p>
      </div>
    </aside>
  )
}

function IconButton({
  onClick,
  title,
  children,
}: {
  onClick: () => void
  title: string
  children: React.ReactNode
}) {
  return (
    <button
      onClick={onClick}
      title={title}
      style={{
        width: 28,
        height: 28,
        borderRadius: 7,
        border: '0.5px solid transparent',
        background: 'transparent',
        color: 'var(--text-tertiary)',
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        transition: 'all 0.12s',
      }}
      onMouseEnter={(e) => {
        ;(e.currentTarget as HTMLButtonElement).style.background = 'var(--surface-secondary)'
        ;(e.currentTarget as HTMLButtonElement).style.color = 'var(--text-primary)'
      }}
      onMouseLeave={(e) => {
        ;(e.currentTarget as HTMLButtonElement).style.background = 'transparent'
        ;(e.currentTarget as HTMLButtonElement).style.color = 'var(--text-tertiary)'
      }}
    >
      {children}
    </button>
  )
}
