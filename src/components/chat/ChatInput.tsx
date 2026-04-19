'use client'

import { useState, useRef, KeyboardEvent } from 'react'
import { Send, Square } from 'lucide-react'

interface Props {
  onSend: (text: string) => void
  isLoading: boolean
  onStop?: () => void
  disabled?: boolean
}

export default function ChatInput({ onSend, isLoading, onStop, disabled }: Props) {
  const [value, setValue] = useState('')
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  const handleSend = () => {
    const trimmed = value.trim()
    if (!trimmed || isLoading || disabled) return
    onSend(trimmed)
    setValue('')
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto'
    }
  }

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  const handleInput = () => {
    const el = textareaRef.current
    if (!el) return
    el.style.height = 'auto'
    el.style.height = `${Math.min(el.scrollHeight, 180)}px`
  }

  return (
    <div
      style={{
        padding: '12px 16px 16px',
        background: 'var(--bg)',
        borderTop: '0.5px solid var(--border)',
      }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'flex-end',
          gap: 10,
          background: 'var(--surface)',
          border: '0.5px solid var(--border-strong)',
          borderRadius: 14,
          padding: '10px 12px 10px 16px',
          transition: 'border-color 0.15s',
        }}
        onFocus={() => {}}
      >
        <textarea
          ref={textareaRef}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={handleKeyDown}
          onInput={handleInput}
          placeholder="Ask anything about your documents…"
          rows={1}
          disabled={disabled}
          style={{
            flex: 1,
            resize: 'none',
            border: 'none',
            outline: 'none',
            background: 'transparent',
            color: 'var(--text-primary)',
            fontSize: 14,
            lineHeight: 1.6,
            fontFamily: 'inherit',
            minHeight: 24,
            maxHeight: 180,
            overflowY: 'auto',
          }}
        />

        <button
          onClick={isLoading ? onStop : handleSend}
          disabled={!isLoading && (!value.trim() || disabled)}
          style={{
            width: 34,
            height: 34,
            borderRadius: 10,
            border: 'none',
            background: isLoading
              ? 'var(--danger)'
              : value.trim()
              ? 'var(--user-bubble)'
              : 'var(--surface-secondary)',
            color: isLoading
              ? '#fff'
              : value.trim()
              ? 'var(--user-text)'
              : 'var(--text-tertiary)',
            cursor: isLoading || value.trim() ? 'pointer' : 'default',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
            transition: 'all 0.15s',
          }}
          title={isLoading ? 'Stop' : 'Send (Enter)'}
        >
          {isLoading ? <Square size={14} fill="currentColor" /> : <Send size={14} />}
        </button>
      </div>

      <p
        style={{
          fontSize: 10,
          color: 'var(--text-tertiary)',
          textAlign: 'center',
          marginTop: 8,
        }}
      >
        Press Enter to send · Shift+Enter for new line
      </p>
    </div>
  )
}
