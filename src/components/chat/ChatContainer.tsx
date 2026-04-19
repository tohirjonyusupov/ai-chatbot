'use client'

import { useEffect, useRef } from 'react'
import { useChatStore } from '@/store/useChatStore'
import { sendMessage } from '@/lib/api'
import { generateId } from '@/lib/utils'
import { Message } from '@/types/chat'
import MessageBubble from './MessageBubble'
import TypingIndicator from './TypingIndicator'
import ChatInput from './ChatInput'
import { MessageSquare } from 'lucide-react'

export default function ChatContainer() {
  const {
    messages,
    isLoading,
    conversationId,
    error,
    addMessage,
    setLoading,
    setConversationId,
    setError,
    addConversation,
  } = useChatStore()

  const bottomRef = useRef<HTMLDivElement>(null)
  const abortRef = useRef<AbortController | null>(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, isLoading])

  const handleSend = async (text: string) => {
    setError(null)

    const userMsg: Message = {
      id: generateId(),
      role: 'user',
      content: text,
      createdAt: new Date().toISOString(),
    }
    addMessage(userMsg)
    setLoading(true)

    try {
      abortRef.current = new AbortController()
      const res = await sendMessage({
        message: text,
        conversation_id: conversationId || undefined,
      })

      const assistantMsg: Message = {
        id: generateId(),
        role: 'assistant',
        content: res.answer,
        createdAt: res.createdAt || new Date().toISOString(),
        sources: res.sources,
      }
      addMessage(assistantMsg)

      if (!conversationId) {
        setConversationId(res.conversation_id)
        addConversation({
          id: res.conversation_id,
          title: text.slice(0, 60),
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        })
      }
    } catch (err: unknown) {
      if (err instanceof Error && err.name === 'AbortError') return
      setError('Failed to get a response. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleStop = () => {
    abortRef.current?.abort()
    setLoading(false)
  }

  return (
    <div
      style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
        background: 'var(--bg)',
      }}
    >
      {/* Messages area */}
      <div
        style={{
          flex: 1,
          overflowY: 'auto',
          padding: '24px 0',
        }}
      >
        <div
          style={{
            maxWidth: 720,
            margin: '0 auto',
            padding: '0 20px',
            display: 'flex',
            flexDirection: 'column',
            gap: 20,
          }}
        >
          {messages.length === 0 && (
            <EmptyState />
          )}

          {messages.map((msg) => (
            <MessageBubble key={msg.id} message={msg} />
          ))}

          {isLoading && <TypingIndicator />}

          {error && (
            <div
              style={{
                background: 'rgba(226, 75, 74, 0.08)',
                border: '0.5px solid rgba(226, 75, 74, 0.3)',
                borderRadius: 10,
                padding: '10px 14px',
                fontSize: 13,
                color: 'var(--danger)',
              }}
            >
              {error}
            </div>
          )}

          <div ref={bottomRef} />
        </div>
      </div>

      {/* Input */}
      <div style={{ maxWidth: 720, margin: '0 auto', width: '100%' }}>
        <ChatInput
          onSend={handleSend}
          isLoading={isLoading}
          onStop={handleStop}
        />
      </div>
    </div>
  )
}

function EmptyState() {
  const suggestions = [
    'What are the main topics in my documents?',
    'Summarize the key points from the uploaded files.',
    'What does the documentation say about setup?',
    'Find all mentions of pricing information.',
  ]
  const { } = useChatStore()

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 32,
        paddingTop: 60,
        paddingBottom: 20,
      }}
    >
      <div style={{ textAlign: 'center' }}>
        <div
          style={{
            width: 52,
            height: 52,
            borderRadius: '50%',
            background: 'var(--surface)',
            border: '0.5px solid var(--border)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 22,
            margin: '0 auto 16px',
          }}
        >
          ✦
        </div>
        <h2
          style={{
            fontSize: 20,
            fontWeight: 500,
            color: 'var(--text-primary)',
            marginBottom: 8,
          }}
        >
          Smart FAQ Assistant
        </h2>
        <p style={{ fontSize: 14, color: 'var(--text-secondary)', maxWidth: 360 }}>
          Upload documents in the sidebar, then ask questions — I&apos;ll find answers from your files.
        </p>
      </div>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: 10,
          width: '100%',
          maxWidth: 520,
        }}
      >
        {suggestions.map((s, i) => (
          <SuggestionCard key={i} text={s} />
        ))}
      </div>
    </div>
  )
}

function SuggestionCard({ text }: { text: string }) {
  const { addMessage, setLoading, setError, setConversationId, addConversation } = useChatStore()

  const handleClick = () => {
    // Re-use the same logic as handleSend through a small trick:
    // fire a synthetic "send" via the store
    const event = new CustomEvent('rag:suggest', { detail: text })
    window.dispatchEvent(event)
  }

  return (
    <button
      onClick={handleClick}
      style={{
        background: 'var(--surface)',
        border: '0.5px solid var(--border)',
        borderRadius: 10,
        padding: '12px 14px',
        textAlign: 'left',
        cursor: 'pointer',
        fontSize: 13,
        color: 'var(--text-secondary)',
        lineHeight: 1.5,
        transition: 'all 0.15s',
      }}
      onMouseEnter={(e) => {
        ;(e.currentTarget as HTMLButtonElement).style.borderColor = 'var(--border-strong)'
        ;(e.currentTarget as HTMLButtonElement).style.color = 'var(--text-primary)'
      }}
      onMouseLeave={(e) => {
        ;(e.currentTarget as HTMLButtonElement).style.borderColor = 'var(--border)'
        ;(e.currentTarget as HTMLButtonElement).style.color = 'var(--text-secondary)'
      }}
    >
      <MessageSquare size={13} style={{ marginBottom: 6, opacity: 0.5 }} />
      <br />
      {text}
    </button>
  )
}
