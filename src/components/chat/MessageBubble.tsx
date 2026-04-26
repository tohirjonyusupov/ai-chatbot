'use client'

import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { Message } from '@/types/chat'
import { formatTime } from '@/lib/utils'
import { FileText } from 'lucide-react'

interface Props {
  message: Message
}

export default function MessageBubble({ message }: Props) {
  const isUser = message.role === 'user'
  // console.log('Rendering message:', message) // Debug log to check message content

  return (
    <div
      className={`flex items-start gap-3 animate-slide-up ${isUser ? 'flex-row-reverse' : ''}`}
    >
      {/* Avatar */}
      {!isUser && (
        <div
          style={{
            width: 28,
            height: 28,
            borderRadius: '50%',
            background: 'var(--surface-secondary)',
            border: '0.5px solid var(--border)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
            fontSize: 13,
            color: 'var(--text-secondary)',
          }}
        >
          ✦
        </div>
      )}

      <div style={{ maxWidth: '78%', display: 'flex', flexDirection: 'column', gap: 4 }}>
        {/* Bubble */}
        <div
          style={{
            background: isUser ? 'var(--user-bubble)' : 'var(--assistant-bubble)',
            color: isUser ? 'var(--user-text)' : 'var(--text-primary)',
            border: isUser ? 'none' : '0.5px solid var(--assistant-border)',
            borderRadius: isUser ? '12px 12px 0 12px' : '0 12px 12px 12px',
            padding: '10px 14px',
            fontSize: 14,
            lineHeight: 1.65,
          }}
        >
          {isUser ? (
            <p style={{ margin: 0 }}>{message.content}</p>
          ) : (
            <div className="prose-chat">
              <ReactMarkdown remarkPlugins={[remarkGfm]}>
                {message.content}
              </ReactMarkdown>
            </div>
          )}
        </div>

        {/* Sources */}
        {/* {message.sources && message.sources.length > 0 && (
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginTop: 2 }}>
            {message.sources.map((src, i) => (
              <div
                key={i}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 5,
                  background: 'var(--surface-secondary)',
                  border: '0.5px solid var(--border)',
                  borderRadius: 6,
                  padding: '3px 8px',
                  fontSize: 11,
                  color: 'var(--text-secondary)',
                  cursor: 'default',
                }}
                title={src.excerpt || ''}
              >
                <FileText size={10} />
                {src.filename}
                {src.page && (
                  <span style={{ color: 'var(--text-tertiary)' }}>p.{src.page}</span>
                )}
              </div>
            ))}
          </div>
        )} */}

        {/* Timestamp */}
        <span
          style={{
            fontSize: 10,
            color: 'var(--text-tertiary)',
            alignSelf: isUser ? 'flex-end' : 'flex-start',
            paddingInline: 2,
          }}
        >
          {formatTime(message.createdAt)}
        </span>
      </div>
    </div>
  )
}
