import { notFound } from 'next/navigation'
import { AppointmentBooking } from '@/components/appointment-booking'
import { properties } from '@/lib/properties'

export function generateStaticParams() {
  return properties.map((_, id) => ({ id: String(id) }))
}

export default async function AppointmentPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const property = properties[Number(id)]
  if (!property || !Number.isInteger(Number(id))) notFound()
  return <AppointmentBooking property={property} />
}
