# Smart FAQ — RAG Frontend

Next.js 14 App Router frontend for a Retrieval-Augmented Generation (RAG) chatbot.

## Tech Stack

- **Next.js 14** (App Router)
- **TypeScript**
- **Zustand** — state management
- **Tailwind CSS** — utility styling
- **react-markdown + remark-gfm** — markdown rendering
- **lucide-react** — icons

## Setup

```bash
npm install
```

Create `.env.local`:
```
BACKEND_URL=http://localhost:8000
```

Run dev server:
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## Backend API Expected

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/chat` | Send a message, get AI answer |
| GET | `/history` | List all conversations |
| POST | `/upload` | Upload PDF/TXT for indexing |

### POST `/chat` — Request
```json
{
  "message": "What is the refund policy?",
  "conversation_id": "optional-string"
}
```

### POST `/chat` — Response
```json
{
  "id": "msg_123",
  "answer": "The refund policy states...",
  "conversation_id": "conv_abc",
  "createdAt": "2024-01-01T12:00:00Z",
  "sources": [
    { "filename": "policy.pdf", "page": 3, "excerpt": "..." }
  ]
}
```

### GET `/history` — Response
```json
{
  "conversations": [
    {
      "id": "conv_abc",
      "title": "What is the refund policy?",
      "createdAt": "2024-01-01T12:00:00Z",
      "updatedAt": "2024-01-01T12:05:00Z"
    }
  ]
}
```

### POST `/upload` — FormData `file` field
```json
{
  "file_id": "file_xyz",
  "filename": "policy.pdf",
  "message": "File indexed successfully"
}
```

## Project Structure

```
src/
├── app/
│   ├── page.tsx              ← Main chat page
│   ├── layout.tsx
│   ├── globals.css           ← Theme variables (light/dark)
│   └── api/
│       ├── chat/route.ts     ← Proxy → backend /chat
│       ├── history/route.ts  ← Proxy → backend /history
│       └── upload/route.ts   ← Proxy → backend /upload
├── components/
│   ├── chat/
│   │   ├── ChatContainer.tsx ← Messages + scroll logic
│   │   ├── MessageBubble.tsx ← User/assistant bubbles + sources
│   │   ├── ChatInput.tsx     ← Textarea + send/stop button
│   │   └── TypingIndicator.tsx
│   └── sidebar/
│       ├── Sidebar.tsx       ← Full sidebar with theme toggle
│       ├── FileUpload.tsx    ← Drag & drop uploader
│       └── HistoryList.tsx   ← Conversation history
├── lib/
│   ├── api.ts                ← fetch helpers (chat/history/upload)
│   └── utils.ts              ← cn, generateId, formatBytes, etc.
├── store/
│   └── useChatStore.ts       ← Zustand store (all app state)
└── types/
    └── chat.ts               ← TypeScript types
```

## Features

- **Light / Dark theme** toggle (persisted to localStorage)
- **Collapsible sidebar**
- **Drag & drop** file upload (PDF, TXT) with progress bar
- **Markdown rendering** for assistant messages
- **Source citations** shown below assistant messages
- **Conversation history** in sidebar
- **Suggestion cards** on empty state
- **Stop generation** button
- **Scroll-to-bottom** on new messages
- **API proxy** routes (hides backend URL from client)
