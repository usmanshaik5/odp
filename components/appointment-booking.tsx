'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useMemo, useState } from 'react'
import type { ReactNode } from 'react'
import { ArrowLeft, CalendarDays, Check, Clock3, MapPin } from 'lucide-react'
import { properties } from '@/lib/properties'
import { createClient } from '@/lib/supabase/client'
import { PropertyAssistant } from './property-assistant'

type Property = (typeof properties)[number]

const slots = ['10:00 AM', '11:30 AM', '2:00 PM', '4:30 PM']

export function AppointmentBooking({ property }: { property: Property }) {
  const [date, setDate] = useState('')
  const [selectedSlot, setSelectedSlot] = useState('')
  const [confirmed, setConfirmed] = useState(false)
  const [bookingError, setBookingError] = useState('')
  const supabase = useMemo(() => createClient(), [])
  const venue = `${property.location.split(',')[0]} Experience Centre`
  const formattedDate = useMemo(() => {
    if (!date) return 'Choose a date'
    return new Intl.DateTimeFormat('en-IN', { dateStyle: 'full' }).format(new Date(`${date}T12:00:00`))
  }, [date])

  if (confirmed) {
    return <PageShell>
      <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
        <div className="border border-[#dce5eb] bg-white p-7 sm:p-10">
          <div className="flex size-12 items-center justify-center rounded-full bg-[#e8f4fc] text-[#0874d1]"><Check /></div>
          <p className="mt-7 text-xs font-semibold uppercase tracking-[0.18em] text-[#0874d1]">Appointment confirmed</p>
          <h1 className="mt-3 text-4xl font-medium tracking-[-0.05em] sm:text-5xl">We&apos;ll see you there.</h1>
          <p className="mt-5 leading-7 text-[#5f6368]">Your visit for {property.title} has been reserved. We&apos;ve noted the details below.</p>
          <div className="mt-8 divide-y divide-[#e5e5e5] border-y border-[#e5e5e5]">
            <Detail icon={<CalendarDays />} label="Date" value={formattedDate} />
            <Detail icon={<Clock3 />} label="Time" value={selectedSlot} />
            <Detail icon={<MapPin />} label="Venue" value={venue} />
          </div>
          <Link href={`/properties/${properties.indexOf(property)}`} className="mt-8 inline-flex h-12 items-center justify-center rounded-xl bg-[#0874d1] px-5 text-sm font-semibold text-white hover:bg-[#0667bb]">Return to property</Link>
        </div>
      </div>
    </PageShell>
  }

  const canConfirm = Boolean(date && selectedSlot)
  const confirmAppointment = async () => {
    if (!canConfirm) return
    setBookingError('')
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      setBookingError('Please sign in before requesting a visit. Agent conversations and bookings are secured to your account.')
      return
    }
    const { data: enquiry, error: enquiryError } = await supabase.from('enquiries').insert({ property_id: String(properties.indexOf(property)), customer_id: user.id, customer_name: user.user_metadata?.full_name ?? user.email?.split('@')[0] ?? 'Customer', customer_email: user.email ?? '', message: `Appointment request for ${property.title}` }).select('id').single()
    if (enquiryError || !enquiry) { setBookingError('We could not create your request. Please try again.'); return }
    const { error } = await supabase.from('appointments').insert({ enquiry_id: enquiry.id, property_id: String(properties.indexOf(property)), customer_id: user.id, appointment_date: date, appointment_time: selectedSlot, venue })
    if (error) { setBookingError('We could not reserve that slot. Please try again.'); return }
    setConfirmed(true)
  }
  return <PageShell>
    <main className="mx-auto max-w-[1280px] px-4 pb-16 pt-8 sm:px-6 lg:px-8 lg:pt-12">
      <Link href={`/properties/${properties.indexOf(property)}`} className="inline-flex items-center gap-2 text-sm font-medium text-[#5f6368] hover:text-[#0874d1]"><ArrowLeft data-icon="inline-start" /> Back to property</Link>
      <div className="mt-8 grid gap-10 lg:grid-cols-[1fr_0.82fr] lg:gap-16">
        <section>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#0874d1]">Book an appointment</p>
          <h1 className="mt-3 max-w-xl text-4xl font-medium leading-[1.02] tracking-[-0.055em] sm:text-6xl">See your next home in person.</h1>
          <p className="mt-5 max-w-xl text-[15px] leading-7 text-[#5f6368]">Choose a convenient date and time for a private visit. Our property specialist will meet you at the location below.</p>
          <div className="mt-10 grid gap-8 sm:grid-cols-2">
            <label className="flex flex-col gap-3 text-sm font-semibold">Appointment date<input type="date" min={new Date().toISOString().split('T')[0]} value={date} onChange={(event) => { setDate(event.target.value); setConfirmed(false) }} className="h-12 rounded-xl border border-[#cbd8e1] bg-white px-4 font-normal outline-none focus:border-[#0874d1] focus:ring-2 focus:ring-[#0874d1]/15" /></label>
            <div><p className="text-sm font-semibold">Available time</p><div className="mt-3 grid grid-cols-2 gap-2">{slots.map((slot) => <button key={slot} type="button" onClick={() => setSelectedSlot(slot)} className={`h-12 rounded-xl border text-sm transition ${selectedSlot === slot ? 'border-[#0874d1] bg-[#0874d1] font-semibold text-white' : 'border-[#cbd8e1] hover:border-[#0874d1] hover:text-[#0874d1]'}`}>{slot}</button>)}</div></div>
          </div>
          <div className="mt-8 border border-[#dce5eb] bg-[#f7fbfe] p-5"><div className="flex gap-3"><MapPin className="mt-0.5 size-5 shrink-0 text-[#0874d1]" /><div><p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#5f6368]">Appointment venue</p><p className="mt-1 font-semibold">{venue}</p><p className="mt-1 text-sm text-[#5f6368]">{property.location}</p></div></div></div>
          {bookingError && <p role="alert" className="mt-5 max-w-xl text-sm text-[#b42318]">{bookingError}</p>}
          <button type="button" disabled={!canConfirm} onClick={confirmAppointment} className="mt-8 flex h-14 w-full items-center justify-center gap-2 rounded-xl bg-[#0874d1] px-5 text-sm font-semibold text-white shadow-[0_10px_24px_rgba(8,116,209,.2)] transition hover:bg-[#0667bb] disabled:cursor-not-allowed disabled:bg-[#b7cbd9] sm:w-auto sm:min-w-64">{canConfirm ? 'Confirm appointment' : 'Select date and time'}</button>
        </section>
        <aside className="h-fit border border-[#dce5eb] bg-white p-4 sm:p-5"><div className="relative aspect-[1.45/1] overflow-hidden bg-[#edf5fb]"><Image src={property.image} alt={`${property.title} exterior`} fill className="object-cover" sizes="(max-width: 1024px) 100vw, 40vw" /></div><p className="mt-5 text-xs font-semibold uppercase tracking-[0.18em] text-[#0874d1]">Selected property</p><h2 className="mt-2 text-2xl font-medium tracking-[-0.04em]">{property.title}</h2><p className="mt-2 flex items-center gap-2 text-sm text-[#5f6368]"><MapPin className="size-4 text-[#0874d1]" /> {property.location}</p><div className="mt-5 flex items-center justify-between border-t border-[#e5e5e5] pt-4 text-sm"><span className="text-[#5f6368]">Starting price</span><strong className="text-[#0874d1]">{property.price}</strong></div></aside>
      </div>
    </main>
  </PageShell>
}

function Detail({ icon, label, value }: { icon: ReactNode; label: string; value: string }) { return <div className="flex items-center gap-3 py-4"><span className="text-[#0874d1]">{icon}</span><div><p className="text-xs uppercase tracking-[0.12em] text-[#5f6368]">{label}</p><p className="mt-1 text-sm font-semibold">{value}</p></div></div> }

function PageShell({ children }: { children: ReactNode }) { return <div className="min-h-screen bg-white text-[#111111]"><header className="border-b border-[#e5e5e5] bg-white"><div className="mx-auto flex h-[58px] max-w-[1280px] items-center px-4 lg:h-[72px] lg:px-8"><Link href="/#top" className="text-[28px] font-black leading-none tracking-[-0.12em] text-[#0874d1]">odp</Link><nav className="ml-auto hidden items-center gap-8 text-sm text-[#5f6368] lg:flex"><Link href="/#properties">Properties</Link><Link href="/#locations">Locations</Link><Link href="/#about">About Us</Link><Link href="/#contact">Contact</Link></nav><Link href="/#contact" className="ml-5 rounded-xl border border-[#0874d1] px-3 py-2 text-sm">List Property</Link></div></header>{children}<PropertyAssistant /><footer className="border-t border-[#0874d1] bg-[#0874d1] text-white"><div className="mx-auto flex max-w-[1280px] flex-col gap-4 px-5 py-8 text-sm sm:flex-row sm:items-center sm:justify-between lg:px-8"><Link href="/#top" className="text-[28px] font-black leading-none tracking-[-0.12em]">odp</Link><div className="flex gap-5"><Link href="/#properties">Properties</Link><Link href="/#locations">Locations</Link><Link href="/#contact">Contact</Link></div><span className="text-white/75">© 2026 OneStep Dream Property</span></div></footer></div> }

