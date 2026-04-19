'use client'

export default function TypingIndicator() {
  return (
    <div className="flex items-start gap-3 animate-fade-in">
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
        }}
      >
        ✦
      </div>
      <div
        style={{
          background: 'var(--assistant-bubble)',
          border: '0.5px solid var(--assistant-border)',
          borderRadius: '0 12px 12px 12px',
          padding: '10px 16px',
          display: 'flex',
          gap: 5,
          alignItems: 'center',
        }}
      >
        {[0, 1, 2].map((i) => (
          <span
            key={i}
            style={{
              width: 6,
              height: 6,
              borderRadius: '50%',
              background: 'var(--text-tertiary)',
              display: 'inline-block',
              animation: `pulseDot 1.4s ease-in-out ${i * 0.16}s infinite`,
            }}
          />
        ))}
      </div>
    </div>
  )
}
