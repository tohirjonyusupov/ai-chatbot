'use client'

import { useChatStore } from '@/store/useChatStore'
import { formatDate, truncate } from '@/lib/utils'
import { MessageSquare, Clock } from 'lucide-react'

export default function HistoryList() {
  const { conversations, conversationId, setMessages, setConversationId } = useChatStore()

  if (conversations.length === 0) {
    return (
      <div
        style={{
          padding: '12px 16px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 8,
          color: 'var(--text-tertiary)',
        }}
      >
        <Clock size={18} style={{ opacity: 0.5 }} />
        <p style={{ fontSize: 12, textAlign: 'center' }}>No conversations yet</p>
      </div>
    )
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
      {conversations.map((conv) => {
        const isActive = conv.id === conversationId
        return (
          <button
            key={conv.id}
            onClick={() => {
              setConversationId(conv.id)
              if (conv.messages) setMessages(conv.messages)
            }}
            style={{
              display: 'flex',
              alignItems: 'flex-start',
              gap: 9,
              padding: '9px 12px',
              borderRadius: 8,
              border: 'none',
              background: isActive ? 'var(--surface-secondary)' : 'transparent',
              cursor: 'pointer',
              textAlign: 'left',
              width: '100%',
              transition: 'background 0.12s',
            }}
            onMouseEnter={(e) => {
              if (!isActive)
                (e.currentTarget as HTMLButtonElement).style.background = 'var(--surface-tertiary)'
            }}
            onMouseLeave={(e) => {
              if (!isActive)
                (e.currentTarget as HTMLButtonElement).style.background = 'transparent'
            }}
          >
            <MessageSquare
              size={13}
              style={{ color: 'var(--text-tertiary)', marginTop: 1, flexShrink: 0 }}
            />
            <div style={{ flex: 1, overflow: 'hidden' }}>
              <p
                style={{
                  fontSize: 12,
                  color: isActive ? 'var(--text-primary)' : 'var(--text-secondary)',
                  fontWeight: isActive ? 500 : 400,
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                  marginBottom: 2,
                }}
              >
                {truncate(conv.title, 44)}
              </p>
              <p style={{ fontSize: 10, color: 'var(--text-tertiary)' }}>
                {formatDate(conv.updatedAt)}
              </p>
            </div>
          </button>
        )
      })}
    </div>
  )
}
