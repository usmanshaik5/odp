'use client'

import Link from 'next/link'
import { useMemo, useState } from 'react'
import { Bot, CalendarDays, MessageCircle, Send, X } from 'lucide-react'
import { properties } from '@/lib/properties'

function answerFor(input: string) {
  const query = input.toLowerCase()
  const match = properties.find((property) => query.includes(property.title.toLowerCase().split(' ')[0]) || query.includes(property.location.split(',')[0].toLowerCase()))
  if (query.includes('agent') || query.includes('help') || query.includes('talk')) return 'I can connect you with a property specialist. Tell us which home you are interested in, or choose a property below to book a visit.'
  if (query.includes('appointment') || query.includes('visit') || query.includes('book')) return 'You can choose a date and time on the appointment page for any property. I have added the booking links below.'
  if (match) return `${match.title} is in ${match.location}, priced at ${match.price}, with ${match.details}. Nearby access and more property information are available on its details page.`
  if (query.includes('bhk') || query.includes('bed') || query.includes('bath') || query.includes('price') || query.includes('location')) return `We currently have ${properties.length} homes across Bengaluru, including 2, 3 and 4 BHK options from ₹76 Lakh to ₹2.4 Cr. Ask about Whitefield, Koramangala, HSR Layout or Indiranagar.`
  return 'I can help you find a home by location, price, BHK, bathrooms or nearby places. Try asking about Whitefield, 3 BHK homes, prices, or appointments.'
}

export function PropertyAssistant() {
  const [open, setOpen] = useState(false)
  const [input, setInput] = useState('')
  const [messages, setMessages] = useState<string[]>([])
  const latest = useMemo(() => messages[messages.length - 1], [messages])

  const ask = (question: string) => {
    const trimmed = question.trim()
    if (!trimmed) return
    setMessages((current) => [...current, `You: ${trimmed}`, `ODP Assistant: ${answerFor(trimmed)}`])
    setInput('')
  }

  return <div className="fixed bottom-20 left-3 z-[74] sm:bottom-6 sm:left-auto sm:right-[380px]">
    {open && <section role="dialog" aria-label="Property assistant and agent help" className="mb-3 flex w-[min(360px,calc(100vw-1.5rem))] flex-col overflow-hidden rounded-2xl border border-[#d9e7f3] bg-white text-[#111111] shadow-[0_20px_60px_rgba(7,40,75,0.22)]">
      <div className="flex items-center justify-between bg-[#0874d1] px-4 py-3 text-white"><div className="flex items-center gap-2"><Bot className="size-5" /><div><p className="text-sm font-semibold">Property help</p><p className="text-[10px] text-white/75">Homes, details and appointments</p></div></div><button type="button" aria-label="Close property help" onClick={() => setOpen(false)}><X className="size-4" /></button></div>
      <div className="max-h-80 space-y-3 overflow-y-auto bg-[#f8fbfe] p-4 text-xs leading-5"><div className="rounded-2xl rounded-tl-sm border border-[#e2edf5] bg-white px-3 py-2.5 text-[#4f5d68]">Ask me about prices, locations, BHK, bathrooms, nearby places or booking a visit.</div>{messages.map((message, index) => <div key={`${message}-${index}`} className={message.startsWith('You:') ? 'ml-8 rounded-2xl rounded-tr-sm bg-[#0874d1] px-3 py-2.5 text-white' : 'mr-4 rounded-2xl rounded-tl-sm border border-[#e2edf5] bg-white px-3 py-2.5 text-[#4f5d68]'}>{message.replace(/^(You|ODP Assistant): /, '')}</div>)}{latest?.startsWith('ODP Assistant') && <div className="flex flex-wrap gap-2">{properties.slice(0, 4).map((property, index) => <Link key={property.title} href={`/properties/${index}`} className="rounded-lg border border-[#cfe0ef] bg-white px-2.5 py-2 text-[10px] font-medium text-[#0874d1] hover:border-[#0874d1]">{property.title}</Link>)}</div>}</div>
      <div className="border-t border-[#e2edf5] p-3"><div className="mb-2 flex gap-2"><button type="button" onClick={() => ask('I want to talk to an agent')} className="flex flex-1 items-center justify-center gap-1 rounded-lg border border-[#0874d1] px-2 py-2 text-[11px] font-semibold text-[#0874d1]"><MessageCircle className="size-3.5" /> Talk to an agent</button><Link href="/properties/0/appointment" className="flex flex-1 items-center justify-center gap-1 rounded-lg bg-[#0874d1] px-2 py-2 text-[11px] font-semibold text-white"><CalendarDays className="size-3.5" /> Book a visit</Link></div><form onSubmit={(event) => { event.preventDefault(); ask(input) }} className="flex gap-2"><input aria-label="Ask about properties" value={input} onChange={(event) => setInput(event.target.value)} placeholder="Ask about a property..." className="min-w-0 flex-1 rounded-lg border border-[#cfe0ef] px-3 py-2 text-xs outline-none focus:border-[#0874d1]" /><button type="submit" aria-label="Send question" className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-[#0874d1] text-white"><Send className="size-4" /></button></form></div>
    </section>}
    <button type="button" onClick={() => setOpen((value) => !value)} aria-expanded={open} className="flex items-center gap-2 rounded-full bg-[#0874d1] px-4 py-3 text-xs font-semibold text-white shadow-[0_10px_25px_rgba(8,116,209,.25)]"><Bot className="size-4" /> Property help</button>
  </div>
}

export { answerFor }
