import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Smart FAQ — AI Assistant',
  description: 'Intelligent document Q&A powered by RAG',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,600;1,9..40,400&family=DM+Mono:wght@400;500&display=swap"
          rel="stylesheet"
        />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              try {
                const t = localStorage.getItem('theme') || 'light';
                if (t === 'dark') document.documentElement.classList.add('dark');
              } catch {}
            `,
          }}
        />
      </head>
      <body>{children}</body>
    </html>
  )
}
