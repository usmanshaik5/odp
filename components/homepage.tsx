'use client'

import { useEffect, useRef, useState, type ReactNode } from 'react'
import Image from 'next/image'
import { properties } from '@/lib/properties'
import { HeroScene } from './hero-scene'
import Link from 'next/link'
import {
  ArrowRight,
  BedDouble,
  Bot,
  Building2,
  Check,
  ChevronDown,
  Cookie,
  Headphones,
  Heart,
  MapPin,
  Menu,
  Search,
  SlidersHorizontal,
  Smartphone,
  X,
} from 'lucide-react'

const locations = [
  { name: 'Bengaluru', count: '128 properties' },
  { name: 'Koramangala', count: '86 properties' },
  { name: 'HSR Layout', count: '74 properties' },
  { name: 'Indiranagar', count: '52 properties' },
]

function Reveal({ children, className = '', delay = 0 }: { children: ReactNode; className?: string; delay?: number }) {
  const ref = useRef<HTMLDivElement>(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const element = ref.current
    if (!element) return
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setVisible(true)
        observer.disconnect()
      }
    }, { threshold: 0.12 })
    observer.observe(element)
    return () => observer.disconnect()
  }, [])

  return <div ref={ref} className={`reveal ${visible ? 'reveal-visible' : ''} ${className}`} style={{ '--reveal-delay': `${delay}ms` } as React.CSSProperties}>{children}</div>
}

export function HomePage() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const [locationOpen, setLocationOpen] = useState(false)
  const [saved, setSaved] = useState<number[]>([])
  const [cookieConsent, setCookieConsent] = useState<boolean | null>(null)
  const [chatOpen, setChatOpen] = useState(false)
  const [typedBrand, setTypedBrand] = useState('')

  useEffect(() => {
    setCookieConsent(document.cookie.includes('odp_cookie_consent=accepted'))
  }, [])

  const saveCookieConsent = (value: 'accepted' | 'essential') => {
    document.cookie = `odp_cookie_consent=${value}; max-age=31536000; path=/; SameSite=Lax`
    setCookieConsent(true)
  }

  useEffect(() => {
    const brand = 'OneStep\nDream\nProperty'
    let index = 0
    let deleting = false
    let timer: number

    const tick = () => {
      if (!deleting) {
        index += 1
        setTypedBrand(brand.slice(0, index))
        if (index === brand.length) {
          deleting = true
          timer = window.setTimeout(tick, 1800)
          return
        }
      } else {
        index -= 1
        setTypedBrand(brand.slice(0, index))
        if (index === 0) {
          deleting = false
          timer = window.setTimeout(tick, 450)
          return
        }
      }
      timer = window.setTimeout(tick, deleting ? 55 : 85)
    }

    timer = window.setTimeout(tick, 300)
    return () => window.clearTimeout(timer)
  }, [])

  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : ''
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setMenuOpen(false)
    }
    if (menuOpen) document.addEventListener('keydown', closeOnEscape)
    return () => {
      document.body.style.overflow = ''
      document.removeEventListener('keydown', closeOnEscape)
    }
  }, [menuOpen])

  const toggleSaved = (index: number) => {
    setSaved((current) => current.includes(index) ? current.filter((item) => item !== index) : [...current, index])
  }

  return (
    <div className="min-h-screen bg-white text-[#111111]">
      <header className="sticky top-0 z-40 border-b border-[#e5e5e5] bg-white text-[#111111]">
        <div className="mx-auto flex h-[58px] max-w-[1280px] items-center gap-3 px-3 lg:h-[72px] lg:gap-6 lg:px-8">
          <button className="inline-flex size-7 shrink-0 items-center justify-center text-[#111111] transition-transform duration-200 hover:scale-105 lg:hidden" aria-label={menuOpen ? 'Close menu' : 'Open menu'} aria-expanded={menuOpen} aria-controls="mobile-navigation" onClick={() => setMenuOpen(!menuOpen)}>{menuOpen ? <X aria-hidden="true" /> : <Menu aria-hidden="true" />}</button>
          <Link href="#top" className="flex shrink-0 items-center text-[#0874d1]" aria-label="OneStep Dream Property home"><span className="text-[25px] font-black leading-none tracking-[-0.12em] lg:text-[32px]">odp</span></Link>
          <nav className="hidden flex-1 items-center justify-center gap-8 text-[13px] text-[#5f6368] lg:flex lg:text-[15px]" aria-label="Main navigation">
            {['Home', 'Buy Flats', 'Properties', 'Locations', 'About Us', 'Contact'].map((item) => <Link key={item} href={`#${item.toLowerCase().replace(' ', '-')}`} className="transition-colors hover:text-[#111111]">{item}</Link>)}
          </nav>
          <div className="order-4 hidden shrink-0 items-center gap-5 text-[13px] lg:flex lg:text-[15px]">
                      <Link href="#contact" className="text-[#5f6368] transition-colors hover:text-[#111111]">Login / Register</Link>
            <Link href="#contact" className="rounded-xl border border-[#0874d1] bg-white px-4 py-2.5 text-[#111111] transition-all duration-300 hover:scale-[1.04] hover:border-[#0874d1] hover:bg-[#f7fbff]">List Property</Link>
          </div>
          <div className="order-3 ml-0 flex min-w-0 shrink-0 items-center justify-end gap-2 lg:order-2 lg:ml-auto lg:max-w-[230px]">
            <button aria-label="Choose location" onClick={() => { setLocationOpen(true); setMenuOpen(false); setSearchOpen(false) }} className="flex min-w-0 flex-1 items-center justify-end gap-1 truncate text-[11px] font-semibold"><MapPin aria-hidden="true" className="size-4 shrink-0" /><span className="truncate">Koramangala, Bengaluru</span><ChevronDown aria-hidden="true" className="size-3 shrink-0 text-[#496b73]" /></button>
          </div>
        </div>
        <div className="flex items-center justify-center gap-2 border-t border-[#e5e5e5] px-3 py-2">
          <button aria-label="Search properties" onClick={() => setSearchOpen(true)} className="flex h-8 min-w-0 max-w-[290px] flex-1 items-center gap-2 rounded-lg border-2 border-[#111111] px-2 text-left text-[11px] text-[#858585] transition-colors hover:bg-[#f7f7f7]"><Search aria-hidden="true" className="size-[18px] shrink-0 text-[#111111]" /><span>Search &quot;Properties&quot;</span></button><button aria-label="Wishlist" className="inline-flex size-8 shrink-0 items-center justify-center text-[#111111] transition-transform duration-200 hover:scale-105 lg:hidden"><Heart aria-hidden="true" className="size-6" /></button>
          {searchOpen && <button type="button" aria-label="Close search filters" onClick={() => setSearchOpen(false)} className="inline-flex size-8 shrink-0 items-center justify-center rounded-lg border-2 border-[#111111] bg-white text-[#111111] transition-colors hover:bg-[#f1f1f1]"><X aria-hidden="true" className="size-5" /></button>}
         
        </div>
        {searchOpen && <div className="border-t border-[#e5e5e5] bg-white px-5 py-5 shadow-[0_8px_20px_rgba(0,0,0,0.1)]"><div className="grid gap-4"><label className="grid gap-1"><span className="text-[9px] font-semibold uppercase tracking-[0.14em] text-[#5f6368]">Location</span><span className="flex items-center justify-between text-sm">Where do you want to live?<ChevronDown className="size-3.5 text-[#888888]" /></span></label><label className="grid gap-1"><span className="text-[9px] font-semibold uppercase tracking-[0.14em] text-[#5f6368]">Property type</span><span className="flex items-center justify-between text-sm">Apartment, villa or plot<ChevronDown className="size-3.5 text-[#888888]" /></span></label><label className="grid gap-1"><span className="text-[9px] font-semibold uppercase tracking-[0.14em] text-[#5f6368]">Budget</span><span className="flex items-center justify-between text-sm">Select your budget<ChevronDown className="size-3.5 text-[#888888]" /></span></label><button onClick={() => setSearchOpen(false)} className="flex h-10 items-center justify-center gap-2 border-2 border-[#111111] bg-white text-sm font-semibold text-[#111111] transition-colors hover:bg-[#f5f5f5]"><Search size={17} /> Search</button></div></div>}
        <nav id="mobile-navigation" aria-hidden={!menuOpen} inert={!menuOpen ? true : undefined} className={`fixed inset-x-0 top-[112px] z-50 flex max-h-[calc(100dvh-112px)] origin-top flex-col overflow-y-auto border-t border-[#e5e5e5] bg-white text-sm text-[#111111] shadow-[0_8px_20px_rgba(0,0,0,0.12)] transition-[opacity,transform,visibility] duration-300 ease-out lg:hidden ${menuOpen ? 'visible translate-y-0 scale-y-100 opacity-100' : 'pointer-events-none invisible -translate-y-4 scale-y-95 opacity-0'}`} aria-label="Mobile navigation"><div className="divide-y divide-[#e5e5e5]">{(['Home', 'Buy Flats', 'Properties', 'Locations', 'About Us', 'Contact'] as const).map((item) => { const icons = { Home: Building2, 'Buy Flats': BedDouble, Properties: Building2, Locations: MapPin, 'About Us': Smartphone, Contact: Headphones }; const Icon = icons[item]; return <Link className="flex min-h-14 items-center gap-4 px-5 font-medium transition-colors hover:bg-[#f7f7f7] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-[#111111]" onClick={() => setMenuOpen(false)} key={item} href={`#${item.toLowerCase().replace(' ', '-')}`}><span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-[#f1f4f5] text-[#111111]"><Icon aria-hidden="true" className="size-[18px]" /></span><span>{item}</span></Link> })}</div><div className="mt-3 flex items-center border-t border-[#e5e5e5] px-5 pb-6 pt-4"><Link onClick={() => setMenuOpen(false)} href="#contact" className="flex-1 px-3 py-3 text-center font-medium text-[#111111] transition-colors hover:text-[#0874d1]">List Property</Link><span className="h-6 w-px bg-[#d9e7f3]" aria-hidden="true" /><Link onClick={() => setMenuOpen(false)} href="#contact" className="flex-1 px-3 py-3 text-center font-medium text-[#111111] transition-colors hover:text-[#0874d1]">Login / Register</Link></div></nav>
      </header>

      {locationOpen && <section className="fixed inset-0 z-[60] overflow-y-auto bg-white text-[#111111]" aria-label="Location picker"><div className="flex h-[58px] items-center gap-2 border-b border-[#e5e5e5] px-4"><button type="button" aria-label="Back to home" onClick={() => setLocationOpen(false)} className="inline-flex size-8 items-center justify-center"><ArrowRight aria-hidden="true" className="size-5 rotate-180" /></button><h1 className="text-lg font-semibold">LOCATION</h1></div><div className="px-4 py-4"><label className="flex h-10 items-center gap-3 rounded-[3px] border border-[#111111] px-2.5"><Search aria-hidden="true" className="size-5" /><input aria-label="Search city, area or locality" placeholder="Search city, area or locality" className="min-w-0 flex-1 bg-transparent text-sm outline-none placeholder:text-[#5f6368]" /></label><button type="button" className="mt-6 flex items-start gap-3 text-left"><MapPin aria-hidden="true" className="mt-0.5 size-5 text-[#3478ff]" /><span><strong className="block text-sm text-[#3478ff]">Use current location</strong><span className="mt-0.5 block text-xs text-[#3478ff]">Koramangala, Bengaluru, Karnataka, India</span></span></button><div className="mt-5 border-t border-[#d8d8d8] pt-4"><p className="mb-3 px-4 text-[10px] uppercase tracking-[0.12em] text-[#777777]">Popular locations</p><div className="grid">{['Whitefield', 'Indiranagar', 'Koramangala', 'Electronic City'].map((place) => <button type="button" key={place} onClick={() => setLocationOpen(false)} className="flex items-center gap-3 px-4 py-3.5 text-left text-sm transition-colors hover:bg-[#f7f7f7]"><MapPin aria-hidden="true" className="size-5 text-[#92979c]" /><span>{place}</span></button>)}</div></div></div></section>}

      <main id="top" className="overflow-clip">
        <section className="mx-auto grid max-w-[1280px] items-center px-4 pb-10 pt-10 min-[360px]:px-5 sm:pb-16 sm:pt-16 md:pb-20 md:pt-12 md:grid-cols-[0.95fr_1.05fr] md:gap-8 md:px-8 lg:gap-12 lg:pt-16"><Reveal className="hero-copy">
          <div className="max-w-[520px]">
            <p className="mb-6 text-[11px] font-semibold uppercase tracking-[0.2em] text-[#5f6368]">Your next home starts here</p>
            <h1 className="max-w-[720px] text-[clamp(2.7rem,12vw,5.8rem)] font-medium leading-[0.98] tracking-[-0.065em] sm:text-[clamp(3.2rem,6vw,5.8rem)] lg:text-[clamp(3.8rem,5vw,4.8rem)]"><span className="block min-h-[2.94em] whitespace-pre-wrap text-[#0874d1]" aria-live="polite">{typedBrand}<span className="ml-1 inline-block h-[0.85em] w-[3px] translate-y-[0.08em] bg-[#111111] align-baseline motion-safe:animate-pulse" aria-hidden="true" /></span><span className="mt-4 block text-[#111111]">Find the right property.<br />Make your next move.</span></h1>
            <p className="mt-7 max-w-[520px] text-[16px] leading-7 text-[#5f6368] lg:text-[19px] lg:leading-8">Discover thoughtfully selected flats and residential properties across India&apos;s most promising locations. Explore your options and take the next step with confidence.</p>
            <div className="mt-9 flex w-full flex-row items-center gap-2"><Link href="#properties" className="cta-wave inline-flex h-12 min-w-0 flex-1 items-center justify-center gap-1 rounded-xl px-1.5 py-3 text-[10px] lg:h-14 lg:px-5 lg:text-sm font-semibold whitespace-nowrap text-white shadow-[0_10px_24px_rgba(8,116,209,0.18)] transition-transform duration-300 hover:scale-[1.04] hover:shadow-[0_14px_28px_rgba(8,116,209,0.26)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0874d1]"><span className="cta-wave-color cta-wave-green" aria-hidden="true" /><span className="cta-wave-color cta-wave-orange" aria-hidden="true" /><span className="cta-wave-color cta-wave-pink" aria-hidden="true" /><span className="cta-wave-color cta-wave-red" aria-hidden="true" /><span className="cta-wave-color cta-wave-yellow" aria-hidden="true" /><span className="relative z-10">Explore Properties</span></Link><Link href="#contact" className="inline-flex h-12 min-w-0 flex-1 items-center justify-center rounded-xl border border-[#0874d1] bg-[#f7fbff] px-3 py-3 text-xs font-semibold text-[#111111] shadow-sm transition-all duration-300 hover:scale-[1.04] hover:border-[#0874d1] hover:bg-[#f7fbff] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0874d1]">Contact Us</Link></div>
          </div></Reveal><div className="hero-illustration hero-illustration-raised hidden md:block" aria-label="Animated 3D property illustration"><HeroScene /></div>
        </section>

        <section id="properties" className="mx-auto max-w-[1280px] px-4 pb-14 pt-14 min-[360px]:px-5 min-[360px]:pb-16 min-[360px]:pt-16 sm:pb-20 sm:pt-20 lg:px-8 lg:pb-24 lg:pt-32"><div className="mb-8 flex flex-col items-start justify-between gap-5 sm:mb-10 sm:flex-row sm:items-end sm:gap-6"><div><p className="mb-3 text-[11px] font-semibold uppercase tracking-[0.2em] text-[#5f6368]">A considered selection</p><h2 className="text-3xl font-medium tracking-[-0.04em] md:text-4xl lg:text-5xl">Explore featured properties</h2><p className="mt-3 text-sm text-[#5f6368]">Find thoughtfully selected homes in locations that matter to you.</p></div><Link href="#properties" className="hidden items-center gap-2 text-sm font-medium md:flex">View all properties <ArrowRight size={16} /></Link></div>
          <Reveal className="grid grid-cols-2 gap-x-3 gap-y-8 min-[480px]:gap-x-5 min-[480px]:gap-y-10 lg:grid-cols-4">{properties.map((property, index) => <article key={property.title} className="group"><Link href={`/properties/${index}`} className="relative block aspect-[1.1/1] overflow-hidden bg-[#f2f2f2]" aria-label={`View ${property.title}`}><Image src={property.image} alt={property.title} fill className="object-cover transition-transform duration-500 group-hover:scale-[1.03]" sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw" /><span className="absolute left-3 top-3 bg-white px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.12em]">{property.status}</span></Link><button onClick={() => toggleSaved(index)} aria-label={`${saved.includes(index) ? 'Remove' : 'Save'} ${property.title}`} className="absolute right-3 top-3 flex size-8 items-center justify-center bg-white transition-colors hover:bg-[#f2f2f2]"><Heart size={16} fill={saved.includes(index) ? '#111111' : 'none'} /></button><div className="pt-3 min-[480px]:pt-4"><div className="flex flex-col gap-1"><h3 className="text-[13px] font-medium leading-4 min-[480px]:text-[15px] min-[480px]:leading-5">{property.title}</h3><span className="whitespace-nowrap text-[13px] font-medium min-[480px]:text-[15px]">{property.price}</span></div><p className="mt-1.5 text-[11px] text-[#5f6368] min-[480px]:text-[13px]">{property.location}</p><div className="mt-4 grid gap-2 border-t border-[#e5e5e5] pt-3 text-[12px] leading-5 text-[#5f6368]"><span className="block break-words">{property.details}</span><Link href={`/properties/${index}`} className="block w-fit font-medium text-[#111111] underline underline-offset-4">Details</Link></div></div></article>)}</Reveal><Link href="#properties" className="mt-10 flex items-center gap-2 text-sm font-medium md:hidden">View all properties <ArrowRight size={16} /></Link></section>

        <section id="locations" className="border-y border-[#e5e5e5] bg-[#f7f7f7]"><div className="mx-auto max-w-[1280px] px-4 py-14 min-[360px]:px-5 min-[360px]:py-16 sm:py-20 lg:px-8 lg:py-24"><div className="max-w-xl"><p className="mb-3 text-[11px] font-semibold uppercase tracking-[0.2em] text-[#5f6368]">Find your place</p><h2 className="text-3xl font-medium tracking-[-0.04em] md:text-4xl lg:text-5xl">Explore properties by location</h2></div><div className="mt-9 grid border-t border-[#dcdcdc] sm:mt-12 sm:grid-cols-2 lg:grid-cols-4">{locations.map((location, index) => <Link href="#properties" key={location.name} className="group flex items-center justify-between border-b border-[#dcdcdc] py-5 pr-5 transition-colors hover:bg-white sm:nth-[odd]:border-r sm:nth-[odd]:pr-6 lg:border-b-0 lg:border-r lg:px-6 lg:first:pl-0 lg:last:border-r-0"><span><span className="block text-lg font-medium">{location.name}</span><span className="mt-1 block text-xs text-[#5f6368]">{location.count}</span></span><ArrowRight size={17} className="text-[#999999] transition-transform group-hover:translate-x-1" /></Link>)}</div></div></section>

        <section id="about" className="mx-auto grid max-w-[1280px] gap-8 px-4 py-14 min-[360px]:gap-10 min-[360px]:px-5 min-[360px]:py-16 sm:gap-12 sm:py-20 lg:grid-cols-2 lg:gap-24 lg:px-8 lg:py-32"><div><p className="mb-3 text-[11px] font-semibold uppercase tracking-[0.2em] text-[#5f6368]">Why OneStep</p><h2 className="max-w-lg text-3xl font-medium leading-tight tracking-[-0.04em] md:text-4xl">Property discovery, made simpler.</h2><p className="mt-6 max-w-lg text-[15px] leading-7 text-[#5f6368]">A more considered way to browse the market, compare what matters, and move forward with clarity.</p></div><div className="grid gap-0 sm:grid-cols-2">{['Curated property choices', 'Convenient property discovery', 'Location-focused listings', 'Dedicated enquiry assistance'].map((item, index) => <div key={item} className="border-t border-[#e5e5e5] py-5 text-[15px] font-medium"><span className="mr-4 text-xs text-[#999999]">0{index + 1}</span>{item}</div>)}</div></section>

      </main>

      <section className="border-t border-[#e5e5e5] bg-[#f5f6f7] text-[#111111]" aria-label="More ways to connect">
        <div className="mx-auto max-w-[1280px] px-0 lg:px-8">
          <div className="px-4 pb-5 pt-8 sm:px-5 lg:px-0 lg:pb-2 lg:pt-10"><div className="mb-5"><p className="text-lg font-semibold tracking-[-0.02em] lg:text-2xl">Use property research tools</p><p className="mt-1 text-sm text-[#5f6368] lg:text-base">Calculate your borrowing power and understand your financial options</p></div><div className="-mx-4 flex snap-x gap-3 overflow-x-auto px-4 pb-2 sm:-mx-5 sm:px-5 lg:mx-0 lg:grid lg:grid-cols-6 lg:gap-4 lg:overflow-visible lg:px-0">{[{title:'EMI',label:'Calculator',description:'Find your monthly EMI',icon:'₹'},{title:'Eligibility',label:'Calculator',description:'Find your home loan limit',icon:'✓'},{title:'Affordability',label:'Calculator',description:'Find the best budget for your home search',icon:'$'},{title:'Area',label:'Calculator',description:'Calculator for land area conversion',icon:'▦'},{title:'Valuation',label:'Calculator',description:'Calculate the value of your property',icon:'₹'},{title:'Rent Value',label:'Calculator',description:'Calculate the right rental value of your property',icon:'⌂'}].map((tool) => <Link href="#contact" key={tool.title} className="group relative flex min-h-[184px] min-w-[164px] snap-start flex-col justify-between overflow-hidden rounded-xl border border-[#e6edf3] bg-white p-3 shadow-[0_8px_24px_rgba(8,50,90,0.07)] transition-all duration-300 hover:-translate-y-1 hover:border-[#0874d1] hover:shadow-[0_14px_30px_rgba(8,116,209,0.14)] lg:min-h-[210px] lg:min-w-0 lg:p-4"><div><p className="text-lg font-semibold text-[#8d4d12]">{tool.title}</p><p className="text-base leading-5 text-[#8d4d12]">{tool.label}</p><p className="mt-2 max-w-[138px] text-[11px] leading-4 tracking-[0.02em] text-[#5f6368]">{tool.description}</p></div><div className="mt-2 flex items-end justify-between"><span className="flex size-[68px] items-center justify-center rounded-[48%_52%_45%_55%] bg-[#fff0d2] text-3xl font-semibold text-[#d99a25] transition-transform duration-300 group-hover:scale-105">{tool.icon}</span><span className="mb-4 flex size-8 items-center justify-center rounded-full bg-[#d99a25] text-xl text-white transition-transform duration-300 group-hover:translate-x-1">→</span></div></Link>)}</div></div>
          <div className="flex justify-center gap-3 bg-white py-3 lg:bg-transparent lg:py-8"><Link href="#properties" className="inline-flex items-center gap-1 rounded-full border-4 border-[#26aaa4] bg-white px-5 py-1.5 text-sm font-semibold text-[#111111] shadow-[3px_3px_0_#f5c62d,6px_0_0_#2078e8] transition-transform hover:scale-[1.04]"><span className="text-xl leading-none">+</span> BUY</Link><Link href="#contact" className="inline-flex items-center gap-1 rounded-full border-4 border-[#26aaa4] bg-white px-5 py-1.5 text-sm font-semibold text-[#111111] shadow-[3px_3px_0_#f5c62d,6px_0_0_#2078e8] transition-transform hover:scale-[1.04]"><span className="text-xl leading-none">+</span> SELL</Link></div>
          <div className="bg-[#f1f2f3] px-5 py-5 text-center lg:rounded-sm lg:px-8"><p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[#5f6368]">Why people choose us</p><div className="mx-auto mt-3 grid max-w-md grid-cols-2 gap-2"><div className="rounded-md border border-[#d7dde2] bg-white px-3 py-3"><p className="text-xl font-semibold tracking-[-0.04em] text-[#0874d1]">2,500+</p><p className="mt-0.5 text-[10px] font-medium text-[#5f6368]">Happy clients</p></div><div className="rounded-md border border-[#d7dde2] bg-white px-3 py-3"><p className="text-xl font-semibold tracking-[-0.04em] text-[#22a447]">100%</p><p className="mt-0.5 text-[10px] font-medium text-[#5f6368]">Registered company</p></div></div></div>
          <div className="lg:grid lg:grid-cols-5">{['Categories', 'Popular Locations', 'Trending Locations', 'About Us', 'ODP'].map((label) => <details key={label} className="group border-b border-[#d8dadd] bg-white px-5 py-4 lg:border-0 lg:bg-transparent lg:px-4 lg:py-6"><summary className="flex cursor-pointer list-none items-center justify-between text-sm font-medium [&::-webkit-details-marker]:hidden">{label}<ChevronDown aria-hidden="true" /></summary><div className="mt-4 flex flex-col gap-2 text-sm text-[#111111] lg:mt-5"><Link href="#properties">Buy Flats</Link><Link href="#locations">Bengaluru</Link><Link href="#locations">Koramangala</Link></div></details>)}</div>
          <div className="bg-[#f5f6f7] px-5 py-4 text-center lg:border-t lg:border-[#d8dadd]"><p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[#5f6368]">Follow us</p><div className="mt-2 flex justify-center items-center gap-2"><Link aria-label="Facebook" href="#contact" className="flex size-6 items-center justify-center"><img src="https://cdn.jsdelivr.net/gh/glincker/thesvg@main/public/icons/facebook/default.svg" alt="" className="size-6" /></Link><Link aria-label="Instagram" href="#contact" className="flex size-6 items-center justify-center"><img src="https://cdn.jsdelivr.net/gh/glincker/thesvg@main/public/icons/instagram/default.svg" alt="" className="size-6" /></Link><Link aria-label="YouTube" href="#contact" className="flex size-6 items-center justify-center"><img src="https://cdn.jsdelivr.net/gh/glincker/thesvg@main/public/icons/youtube/default.svg" alt="" className="size-6" /></Link><Link aria-label="X" href="#contact" className="flex size-6 items-center justify-center"><img src="https://cdn.jsdelivr.net/gh/glincker/thesvg@main/public/icons/x/default.svg" alt="" className="size-6" /></Link><Link aria-label="WhatsApp" href="#contact" className="flex size-6 items-center justify-center"><img src="https://cdn.jsdelivr.net/gh/glincker/thesvg@main/public/icons/whatsapp/default.svg" alt="" className="size-6" /></Link><Link aria-label="LinkedIn" href="#contact" className="flex size-6 items-center justify-center"><img src="https://cdn.jsdelivr.net/gh/glincker/thesvg@main/public/icons/linkedin/default.svg" alt="" className="size-6" /></Link></div></div>
        </div>
      </section>

      <footer id="contact" className="border-t border-[#0874d1] bg-[#0874d1] text-white"><div className="mx-auto grid max-w-[1280px] gap-9 px-5 py-12 sm:grid-cols-2 sm:gap-10 sm:py-14 lg:grid-cols-[1.5fr_1fr_1fr_1fr] lg:px-8"><div><Link href="#top" className="inline-flex items-center text-[#0874d1]" aria-label="ODP home"><span className="text-[32px] font-black leading-none tracking-[-0.12em]">odp</span></Link><p className="mt-5 max-w-xs text-sm leading-6 text-[#5f6368]">Thoughtfully selected homes for the way you want to live.</p></div><div><h3 className="text-xs font-semibold uppercase tracking-[0.12em]">Discover</h3><div className="mt-5 flex flex-col gap-3 text-sm text-[#5f6368]"><Link href="#properties">Buy Flats</Link><Link href="#properties">Properties</Link><Link href="#locations">Locations</Link></div></div><div><h3 className="text-xs font-semibold uppercase tracking-[0.12em]">Company</h3><div className="mt-5 flex flex-col gap-3 text-sm text-[#5f6368]"><Link href="#about">About Us</Link><Link href="#contact">Contact</Link><Link href="#contact">List Property</Link></div></div><div><h3 className="text-xs font-semibold uppercase tracking-[0.12em]">Get in touch</h3><p className="mt-5 text-sm leading-6 text-[#5f6368]"><a href="mailto:help.onestepdreamproperty@gmail.com" className="transition-colors hover:text-[#0874d1]">help.onestepdreamproperty@gmail.com</a><br /><a href="tel:+91 7411535782" className="transition-colors hover:text-[#0874d1]">+91 7411535782</a></p></div></div><div className="mx-auto flex max-w-[1280px] flex-col gap-3 border-t border-white/30 px-5 py-6 text-xs text-white lg:text-sm sm:flex-row sm:items-center sm:justify-between lg:px-8"><span>© 2026 OneStep Dream Property. All rights reserved.</span><span>Privacy · Terms</span></div>      </footer>

      <div className="fixed inset-x-3 bottom-3 z-[75] flex flex-col items-end gap-3 sm:inset-x-auto sm:bottom-6 sm:right-6">{chatOpen && <section role="dialog" aria-label="ODP property assistant" className="flex max-h-[min(540px,calc(100svh-6rem))] w-full flex-col overflow-hidden rounded-2xl border border-[#d9e7f3] bg-white text-[#111111] shadow-[0_20px_60px_rgba(7,40,75,0.22)] sm:w-[min(350px,calc(100vw-3rem))]"><div className="flex shrink-0 items-center justify-between bg-[#0874d1] px-4 py-3 text-white"><div className="flex min-w-0 items-center gap-2"><span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-white/15"><Bot className="size-4" /></span><div className="min-w-0"><p className="truncate text-sm font-semibold">ODP Assistant</p><p className="truncate text-[10px] text-white/75">Here to help with Bengaluru homes</p></div></div><button type="button" aria-label="Close chatbot" onClick={() => setChatOpen(false)} className="rounded-full p-1 text-white/80 transition hover:bg-white/15 hover:text-white"><X className="size-4" /></button></div><div className="min-h-0 space-y-3 overflow-y-auto bg-[#f8fbfe] p-4"><div className="max-w-[280px] rounded-2xl rounded-tl-sm border border-[#e2edf5] bg-white px-3 py-2.5 text-xs leading-5 text-[#4f5d68] shadow-sm">Hi, I&apos;m the ODP property assistant. How can I help you find your next home?</div><div className="grid grid-cols-1 gap-2 min-[380px]:grid-cols-2"><button type="button" onClick={() => { document.getElementById('properties')?.scrollIntoView({ behavior: 'smooth' }); setChatOpen(false) }} className="rounded-lg border border-[#cfe0ef] bg-white px-3 py-2.5 text-[11px] font-medium text-[#0874d1] transition hover:border-[#0874d1]">Browse homes</button><button type="button" onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })} className="rounded-lg border border-[#cfe0ef] bg-white px-3 py-2.5 text-[11px] font-medium text-[#0874d1] transition hover:border-[#0874d1]">Talk to our team</button></div></div></section>}<button type="button" aria-label="Open ODP chatbot" aria-expanded={chatOpen} onClick={() => setChatOpen((open) => !open)} className="group flex size-11 shrink-0 items-center justify-center self-end rounded-full border-3 border-white bg-[#0874d1] sm:size-14 sm:border-4 text-white shadow-[0_10px_28px_rgba(8,116,209,0.35)] transition-all duration-300 hover:scale-105 hover:bg-[#0667bb]"><Bot className="size-5 transition-transform duration-300 group-hover:scale-110 sm:size-6" /></button></div>

      {cookieConsent === false && <aside role="dialog" aria-label="Cookie preferences" className="fixed inset-x-3 bottom-3 z-[80] rounded-2xl border border-[#d9e7f3] bg-white p-4 text-[#111111] shadow-[0_20px_60px_rgba(7,40,75,0.22)] sm:inset-x-auto sm:right-6 sm:bottom-6 sm:w-[520px] sm:p-5"><div className="flex items-start gap-4"><span className="flex size-11 shrink-0 items-center justify-center rounded-2xl bg-[#eaf5ff] text-[#0874d1]"><Cookie aria-hidden="true" className="size-6" /></span><div className="min-w-0 flex-1 pr-5"><h2 className="text-base font-semibold tracking-[-0.02em]">Your privacy matters</h2><p className="mt-2 text-sm leading-6 text-[#68737d]">We use cookies to keep ODP secure, remember preferences, and improve your property search experience.</p></div><button type="button" aria-label="Close cookie preferences" onClick={() => saveCookieConsent('essential')} className="absolute right-4 top-4 flex size-7 items-center justify-center rounded-full text-xl leading-none text-[#82909c] transition-colors hover:bg-[#f1f6fa] hover:text-[#111111]">×</button></div><div className="mt-5 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end"><button type="button" onClick={() => saveCookieConsent('essential')} className="rounded-xl border border-[#0874d1] bg-white px-4 py-2.5 text-sm font-semibold text-[#111111] transition-all hover:bg-[#f4f9fd]">Essential only</button><button type="button" onClick={() => saveCookieConsent('accepted')} className="rounded-xl bg-[#0874d1] px-4 py-2.5 text-sm font-semibold text-white shadow-[0_6px_14px_rgba(8,116,209,0.2)] transition-all hover:bg-[#0667bb]">Accept all</button></div></aside>}
    </div>
  )
}

export function SearchIcon() { return <SlidersHorizontal size={15} /> }
export function CheckIcon() { return <Check size={15} /> }
export function BedIcon() { return <BedDouble size={15} /> }
