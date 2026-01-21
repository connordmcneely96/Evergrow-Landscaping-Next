import Link from 'next/link'
import { Button } from '@/components/ui/Button'

interface Breadcrumb {
  label: string
  href?: string
}

interface Highlight {
  title: string
  description: string
}

interface ServiceHeroProps {
  title: string
  subtitle: string
  image: {
    src: string
    alt: string
  }
  breadcrumbs: Breadcrumb[]
  ctaHref?: string
  ctaLabel?: string
  highlights?: Highlight[]
}

const defaultHighlights: Highlight[] = [
  {
    title: 'On-time crews',
    description: 'We show up when promised and keep you informed.',
  },
  {
    title: 'Transparent pricing',
    description: 'Clear quotes with no hidden costs or surprises.',
  },
  {
    title: 'Licensed & insured',
    description: 'Professional, background-checked team members.',
  },
]

export function ServiceHero({
  title,
  subtitle,
  image,
  breadcrumbs,
  ctaHref = '/quote-request',
  ctaLabel = 'Get Your Free Quote',
  highlights = defaultHighlights,
}: ServiceHeroProps) {
  return (
    <section className="relative overflow-hidden bg-forest-green">
      <div className="absolute inset-0">
        <img
          src={image.src}
          alt={image.alt}
          className="h-full w-full object-cover"
          loading="eager"
        />
        <div
          className="absolute inset-0 bg-gradient-to-r from-forest-green/90 to-forest-green/70"
          aria-hidden="true"
        />
      </div>

      <div className="container relative z-10 py-20 lg:py-28">
        <nav aria-label="Breadcrumb" className="text-sm text-white/80 mb-6">
          <ol className="flex flex-wrap items-center gap-2">
            {breadcrumbs.map((crumb, index) => (
              <li key={`${crumb.label}-${index}`} className="flex items-center gap-2">
                {crumb.href ? (
                  <Link href={crumb.href} className="text-white/80 hover:text-white">
                    {crumb.label}
                  </Link>
                ) : (
                  <span className="text-white">{crumb.label}</span>
                )}
                {index < breadcrumbs.length - 1 && (
                  <span className="text-white/50">/</span>
                )}
              </li>
            ))}
          </ol>
        </nav>

        <div className="max-w-3xl">
          <h1 className="text-white font-heading font-bold text-4xl md:text-5xl lg:text-6xl mb-6">
            {title}
          </h1>
          <p className="text-white/90 text-lg md:text-xl mb-8">{subtitle}</p>

          <div className="flex flex-col sm:flex-row gap-4 mb-10">
            <Link href={ctaHref}>
              <Button variant="primary" size="lg" className="w-full sm:w-auto">
                {ctaLabel}
              </Button>
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {highlights.map((highlight) => (
              <div key={highlight.title} className="bg-white/10 rounded-xl p-4">
                <h3 className="text-white font-semibold mb-2">{highlight.title}</h3>
                <p className="text-sm text-white/80">{highlight.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
