import Link from 'next/link'
import { ServiceCTA } from '@/components/services/ServiceCTA'
import { ServiceFAQ } from '@/components/services/ServiceFAQ'
import { ServiceHero } from '@/components/services/ServiceHero'
import { ServiceProcess } from '@/components/services/ServiceProcess'

interface ProcessStep {
  title: string
  description: string
}

interface FAQItem {
  question: string
  answer: string
}

interface BenefitItem {
  title: string
  description: string
}

interface RelatedService {
  title: string
  description: string
  href: string
}

interface TestimonialHighlight {
  quote: string
  name: string
  location: string
}

interface ServiceSchema {
  serviceType?: string
  description?: string
  areaServed?: string[]
}

export interface ServicePageContent {
  slug: string
  title: string
  subtitle: string
  metaDescription: string
  breadcrumbLabel?: string
  heroImage: {
    src: string
    alt: string
  }
  problem: string
  solution: string
  included: string[]
  processHeading?: string
  processLead?: string
  processSteps: ProcessStep[]
  benefitsHeading: string
  benefitsLead: string
  benefits: BenefitItem[]
  faqs: FAQItem[]
  ctaHeading: string
  ctaDescription: string
  relatedServices: RelatedService[]
  testimonial?: TestimonialHighlight
  schema?: ServiceSchema
  phoneDisplay?: string
  phoneHref?: string
}

const DEFAULT_PHONE_DISPLAY = '(405) 479-5794'
const DEFAULT_PHONE_HREF = '+14054795794'
const DEFAULT_AREAS = ['El Dorado, OK', 'Oklahoma City, OK']

export function ServiceLayout({ service }: { service: ServicePageContent }) {
  const phoneDisplay = service.phoneDisplay ?? DEFAULT_PHONE_DISPLAY
  const phoneHref = service.phoneHref ?? DEFAULT_PHONE_HREF
  const breadcrumbs = [
    { label: 'Home', href: '/' },
    { label: 'Services', href: '/#services' },
    { label: service.breadcrumbLabel ?? service.title },
  ]

  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Service',
    serviceType: service.schema?.serviceType ?? service.title,
    description: service.schema?.description ?? service.metaDescription,
    areaServed: service.schema?.areaServed ?? DEFAULT_AREAS,
    provider: {
      '@type': 'LocalBusiness',
      name: 'Evergreen Landscaping',
      telephone: phoneHref,
      areaServed: service.schema?.areaServed ?? DEFAULT_AREAS,
    },
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'USD',
      description: 'Free quotes available for every service.',
    },
  }

  return (
    <main>
      <ServiceHero
        title={service.title}
        subtitle={service.subtitle}
        image={service.heroImage}
        breadcrumbs={breadcrumbs}
      />

      <section className="section section-alt">
        <div className="container">
          <div className="max-w-3xl">
            <h2 className="text-h2 font-heading text-forest-green mb-4">
              The Problem
            </h2>
            <p className="text-lg text-gray-700">{service.problem}</p>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="max-w-3xl">
            <h2 className="text-h2 font-heading text-forest-green mb-4">
              Our Solution
            </h2>
            <p className="text-lg text-gray-700">{service.solution}</p>
          </div>
        </div>
      </section>

      <section className="section section-alt" id="included">
        <div className="container">
          <div className="max-w-3xl mb-10">
            <h2 className="text-h2 font-heading text-forest-green mb-4">
              What Is Included
            </h2>
            <p className="text-lg text-gray-600">
              Every visit includes the details that keep your property looking
              sharp and cared for.
            </p>
          </div>
          <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {service.included.map((item) => (
              <li key={item} className="flex items-start gap-3">
                <span className="mt-1 text-vibrant-gold">
                  <svg
                    className="w-5 h-5"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                    aria-hidden="true"
                  >
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 00-1.414 0L8 12.586 4.707 9.293a1 1 0 00-1.414 1.414l4 4a1 1 0 001.414 0l8-8a1 1 0 000-1.414z"
                      clipRule="evenodd"
                    />
                  </svg>
                </span>
                <span className="text-gray-700">{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <ServiceProcess
        heading={service.processHeading}
        lead={service.processLead}
        steps={service.processSteps}
      />

      <section className="section section-alt">
        <div className="container">
          <div className="max-w-3xl mb-12">
            <h2 className="text-h2 font-heading text-forest-green mb-4">
              {service.benefitsHeading}
            </h2>
            <p className="text-lg text-gray-600">{service.benefitsLead}</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {service.benefits.map((benefit) => (
              <div key={benefit.title} className="card h-full">
                <h3 className="text-lg font-semibold text-forest-green mb-2">
                  {benefit.title}
                </h3>
                <p className="text-gray-600 mb-0">{benefit.description}</p>
              </div>
            ))}
          </div>

          {service.testimonial && (
            <figure className="mt-10 rounded-xl bg-white p-6 shadow-soft">
              <blockquote className="text-gray-700 italic">
                “{service.testimonial.quote}”
              </blockquote>
              <figcaption className="mt-4 text-sm font-semibold text-forest-green">
                {service.testimonial.name} · {service.testimonial.location}
              </figcaption>
            </figure>
          )}
        </div>
      </section>

      <ServiceFAQ items={service.faqs} />

      <section className="section section-alt">
        <div className="container">
          <div className="max-w-3xl mb-10">
            <h2 className="text-h2 font-heading text-forest-green mb-4">
              Related Services
            </h2>
            <p className="text-lg text-gray-600">
              Complete your outdoor plan with services that pair well together.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {service.relatedServices.map((related) => (
              <Link key={related.href} href={related.href} className="group">
                <div className="card h-full">
                  <h3 className="text-lg font-semibold text-forest-green mb-2 group-hover:text-vibrant-gold transition-colors">
                    {related.title}
                  </h3>
                  <p className="text-gray-600 mb-4">{related.description}</p>
                  <span className="text-vibrant-gold font-semibold inline-flex items-center">
                    Learn more
                    <svg
                      className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      aria-hidden="true"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <ServiceCTA
        heading={service.ctaHeading}
        description={service.ctaDescription}
        phoneDisplay={phoneDisplay}
        phoneHref={phoneHref}
      />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />
    </main>
  )
}
