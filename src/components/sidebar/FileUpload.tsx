'use client'

import { useCallback, useRef, useState } from 'react'
import { Upload, X, CheckCircle, AlertCircle, FileText } from 'lucide-react'
import { useChatStore } from '@/store/useChatStore'
import { uploadFile } from '@/lib/api'
import { formatBytes, generateId } from '@/lib/utils'

const ACCEPTED = ['application/pdf', 'text/plain']
const ACCEPTED_EXT = ['.pdf', '.txt']

export default function FileUpload() {
  const [isDragging, setIsDragging] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  const { uploadedFiles, addUploadedFile, updateFileProgress, removeFile } = useChatStore()

  const processFile = useCallback(
    async (file: File) => {
      if (!ACCEPTED.includes(file.type) && !ACCEPTED_EXT.some((ext) => file.name.endsWith(ext))) {
        return
      }

      const id = generateId()
      addUploadedFile({ id, name: file.name, size: file.size, status: 'uploading', progress: 0 })

      try {
        await uploadFile(file, (pct) => updateFileProgress(id, pct, 'uploading'))
        updateFileProgress(id, 100, 'done')
      } catch {
        updateFileProgress(id, 0, 'error')
      }
    },
    [addUploadedFile, updateFileProgress]
  )

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault()
      setIsDragging(false)
      Array.from(e.dataTransfer.files).forEach(processFile)
    },
    [processFile]
  )

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    Array.from(e.target.files || []).forEach(processFile)
    e.target.value = ''
  }

  return (
    <div style={{ padding: '0 12px 16px' }}>
      <p
        style={{
          fontSize: 11,
          fontWeight: 500,
          color: 'var(--text-tertiary)',
          textTransform: 'uppercase',
          letterSpacing: '0.06em',
          marginBottom: 10,
          paddingLeft: 4,
        }}
      >
        Documents
      </p>

      {/* Drop zone */}
      <div
        onDragOver={(e) => { e.preventDefault(); setIsDragging(true) }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
        onClick={() => inputRef.current?.click()}
        style={{
          border: `1.5px dashed ${isDragging ? 'var(--text-secondary)' : 'var(--border-strong)'}`,
          borderRadius: 10,
          padding: '18px 12px',
          textAlign: 'center',
          cursor: 'pointer',
          background: isDragging ? 'var(--surface-secondary)' : 'transparent',
          transition: 'all 0.15s',
          marginBottom: 10,
        }}
      >
        <Upload
          size={18}
          style={{ margin: '0 auto 6px', color: 'var(--text-tertiary)', display: 'block' }}
        />
        <p style={{ fontSize: 12, color: 'var(--text-secondary)', marginBottom: 2 }}>
          Drop files or click to upload
        </p>
        <p style={{ fontSize: 10, color: 'var(--text-tertiary)' }}>PDF, TXT supported</p>
        <input
          ref={inputRef}
          type="file"
          accept=".pdf,.txt"
          multiple
          onChange={handleChange}
          style={{ display: 'none' }}
        />
      </div>

      {/* File list */}
      {uploadedFiles.length > 0 && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          {uploadedFiles.map((file) => (
            <FileItem key={file.id} file={file} onRemove={removeFile} />
          ))}
        </div>
      )}
    </div>
  )
}

function FileItem({
  file,
  onRemove,
}: {
  file: ReturnType<typeof useChatStore.getState>['uploadedFiles'][0]
  onRemove: (id: string) => void
}) {
  const isDone = file.status === 'done'
  const isError = file.status === 'error'
  const isUploading = file.status === 'uploading'

  return (
    <div
      style={{
        background: 'var(--surface)',
        border: '0.5px solid var(--border)',
        borderRadius: 8,
        padding: '8px 10px',
        display: 'flex',
        flexDirection: 'column',
        gap: 5,
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <FileText size={13} style={{ color: 'var(--text-tertiary)', flexShrink: 0 }} />
        <span
          style={{
            fontSize: 12,
            color: 'var(--text-primary)',
            flex: 1,
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
          }}
          title={file.name}
        >
          {file.name}
        </span>

        {isDone && <CheckCircle size={13} style={{ color: 'var(--success)', flexShrink: 0 }} />}
        {isError && <AlertCircle size={13} style={{ color: 'var(--danger)', flexShrink: 0 }} />}

        <button
          onClick={() => onRemove(file.id)}
          style={{
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            color: 'var(--text-tertiary)',
            padding: 0,
            display: 'flex',
            alignItems: 'center',
            flexShrink: 0,
          }}
          title="Remove"
        >
          <X size={12} />
        </button>
      </div>

      {isUploading && (
        <div
          style={{
            height: 3,
            borderRadius: 2,
            background: 'var(--surface-secondary)',
            overflow: 'hidden',
          }}
        >
          <div
            style={{
              height: '100%',
              width: `${file.progress}%`,
              background: 'var(--text-secondary)',
              borderRadius: 2,
              transition: 'width 0.3s ease',
            }}
          />
        </div>
      )}

      <span style={{ fontSize: 10, color: 'var(--text-tertiary)' }}>
        {formatBytes(file.size)} ·{' '}
        {isDone ? 'Indexed' : isError ? 'Failed' : `${file.progress}%`}
      </span>
    </div>
  )
}
