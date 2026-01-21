import Link from 'next/link'
import { Button } from '@/components/ui/Button'

interface ServiceCTAProps {
  heading: string
  description: string
  phoneDisplay: string
  phoneHref: string
  trustSignals?: string[]
}

const defaultTrustSignals = [
  'Licensed & insured professionals',
  'Family-owned, local Oklahoma team',
  '20+ years caring for outdoor spaces',
]

export function ServiceCTA({
  heading,
  description,
  phoneDisplay,
  phoneHref,
  trustSignals = defaultTrustSignals,
}: ServiceCTAProps) {
  return (
    <section className="section relative overflow-hidden">
      <div className="absolute inset-0 bg-forest-green" />
      <div
        className="absolute inset-0 bg-gradient-to-r from-forest-green/90 to-forest-green/70"
        aria-hidden="true"
      />

      <div className="container relative text-white">
        <div className="max-w-3xl">
          <h2 className="text-h2 font-heading text-white mb-4">{heading}</h2>
          <p className="text-lg text-white/90 mb-8">{description}</p>

          <div className="flex flex-col sm:flex-row gap-4 mb-8">
            <Link href="/quote-request">
              <Button variant="primary" size="lg" className="w-full sm:w-auto">
                Get Your Free Quote
              </Button>
            </Link>
            <a
              href={`tel:${phoneHref}`}
              className="inline-flex items-center justify-center px-6 py-3 rounded-lg border-2 border-white text-white font-semibold hover:bg-white hover:text-forest-green transition-colors"
            >
              Call Us: {phoneDisplay}
            </a>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm text-white/90">
            {trustSignals.map((signal) => (
              <div key={signal} className="bg-white/10 rounded-lg p-4">
                {signal}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
