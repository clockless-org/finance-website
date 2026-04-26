import { useEffect, useRef, useState } from 'react'
import type { PortalTenantIdentity } from './api'

interface ChatBubbleProps {
  tenant: PortalTenantIdentity | null
  mode?: 'member' | 'guest'
}

interface LocalMsg {
  id: string
  role: 'user' | 'agent'
  text: string
  pending?: boolean
  createdAt: string
}

const SEED_MESSAGES: LocalMsg[] = [
  { id: 's-1', role: 'agent', text: "Hi Daniel, hi Mira — welcome to the portal. Updated ADV brochure is in your Documents tab; sign by Friday. Anything you want to walk through before our Wednesday call?", createdAt: new Date().toISOString() },
]

const CANNED_REPLIES = [
  "Good question — take a look at the Fees tab for the quarterly breakdown. I'll walk you through it live on Wednesday.",
  "Totally normal. The first sell window always feels like this. You're in good shape — 10b5-1 plan loaded, tax projection green.",
  "I'll ping James (tax) to confirm the post-window review time. He's your point of contact on quarterly tax coordination.",
  "Yes — you can log in from any device. For now, this is the shared portal link for both of you.",
]

function formatDraftedAt(d: Date): string {
  const time = d.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })
  return `Drafted ${time} PT`
}

export default function ChatBubble({ tenant }: ChatBubbleProps) {
  const agentName = tenant?.agent_name?.split(',')[0] || 'Maya'
  const [open, setOpen] = useState(false)
  const [messages, setMessages] = useState<LocalMsg[]>(SEED_MESSAGES)
  const [input, setInput] = useState('')
  const [busy, setBusy] = useState(false)
  const scrollRef = useRef<HTMLDivElement | null>(null)
  const replyIdx = useRef(0)
  const draftedAt = useRef(formatDraftedAt(new Date()))

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight
  }, [messages, open])

  async function send() {
    const trimmed = input.trim()
    if (!trimmed || busy) return
    const userMsg: LocalMsg = { id: `u-${Date.now()}`, role: 'user', text: trimmed, createdAt: new Date().toISOString() }
    const placeholderId = `a-${Date.now()}`
    const placeholder: LocalMsg = { id: placeholderId, role: 'agent', text: '…', pending: true, createdAt: new Date().toISOString() }
    setMessages(prev => [...prev, userMsg, placeholder])
    setInput('')
    setBusy(true)
    await new Promise(r => setTimeout(r, 900))
    const reply = CANNED_REPLIES[replyIdx.current % CANNED_REPLIES.length]
    replyIdx.current += 1
    setMessages(prev => prev.map(m => m.id === placeholderId ? { ...m, pending: false, text: reply } : m))
    setBusy(false)
  }

  function onKey(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      void send()
    }
  }

  return (
    <>
      {/* Trigger: 8px-radius black square with mono "MS" glyph (per DESIGN.md). */}
      <button
        className="chat-bubble"
        onClick={() => setOpen(o => !o)}
        aria-label={open ? 'Close note from Maya' : 'Open note from Maya'}
        aria-expanded={open}
      >
        {open ? '✕' : 'MS'}
      </button>

      {open && (
        <div className="chat-panel" role="dialog" aria-label={`Note from ${agentName}`}>
          {/* Header: "Note from Maya · Drafted 2:14 PM PT" — mono caption + serif name */}
          <header className="chat-panel-head">
            <div className="chat-panel-title">Note from {agentName}</div>
            <div className="chat-panel-sub">{draftedAt.current}</div>
          </header>

          <div ref={scrollRef} className="chat-panel-scroll">
            {messages.map(m => (
              <div key={m.id} className={`chat-msg ${m.role === 'user' ? 'chat-msg-user' : 'chat-msg-agent'}`}>
                {m.pending ? <span className="chat-typing"><span /><span /><span /></span> : m.text}
              </div>
            ))}
          </div>

          <footer className="chat-panel-input">
            <textarea
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={onKey}
              rows={1}
              placeholder="Ask Maya — she'll reply or schedule time."
              disabled={busy}
            />
            <button
              onClick={() => void send()}
              disabled={!input.trim() || busy}
              className="chat-send"
              aria-label="Send"
            >
              →
            </button>
          </footer>
        </div>
      )}
    </>
  )
}
