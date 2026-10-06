'use client'

import Link from 'next/link'
import { Menu, X } from 'lucide-react'
import { useState } from 'react'

const links = [['Home', '/#top'], ['Buy Flats', '/#properties'], ['Properties', '/#properties'], ['Locations', '/#locations'], ['About Us', '/#about'], ['Contact', '/#contact']]

export function SiteMobileNav() {
  const [open, setOpen] = useState(false)
  return <>
    <button type="button" aria-label={open ? 'Close menu' : 'Open menu'} aria-expanded={open} onClick={() => setOpen(!open)} className="inline-flex size-9 shrink-0 items-center justify-center rounded-lg border border-[#dce5eb] text-[#111111] lg:hidden">{open ? <X aria-hidden="true" /> : <Menu aria-hidden="true" />}</button>
    <nav aria-label="Mobile navigation" className={`absolute inset-x-0 top-full z-50 border-b border-[#e5e5e5] bg-white px-4 py-3 shadow-lg lg:hidden ${open ? 'block' : 'hidden'}`}>
      <div className="flex flex-col gap-1">{links.map(([label, href]) => <Link key={label} href={href} onClick={() => setOpen(false)} className="rounded-lg px-3 py-3 text-sm text-[#5f6368] hover:bg-[#f5faff] hover:text-[#0874d1]">{label}</Link>)}</div>
    </nav>
  </>
}
