import { ServiceLayout, ServicePageContent } from '@/components/services/ServiceLayout'

export const metadata = {
  title: 'Seasonal Cleanup in El Dorado & OKC | Evergreen Landscaping',
  description:
    'Spring and fall cleanup in El Dorado and OKC. Leaf removal, debris hauling, bed prep, and optional gutter cleaning with clear pricing.',
}

const service: ServicePageContent = {
  slug: 'seasonal-cleanup',
  title: 'Spring & Fall Cleanup in El Dorado & OKC',
  subtitle:
    'Clear debris, refresh beds, and prep your yard for the next season with dependable service.',
  metaDescription: metadata.description,
  breadcrumbLabel: 'Seasonal Cleanup',
  heroImage: {
    src: '/images/services/hero-pattern.svg',
    alt: 'Seasonal cleanup in El Dorado & OKC',
  },
  problem:
    'Leaves pile up fast, storm debris collects in corners, and suddenly the yard looks neglected. You plan to handle it on a weekend, but the bags stack up and the work keeps growing. When you call for help, you worry they will not show up, or they will leave behind piles, dirty gutters, and surprise charges. It is frustrating to pay for cleanup and still feel embarrassed by the mess. You want a professional team that respects your property, cleans thoroughly, and tells you the price before they start, every time.',
  solution:
    'Our seasonal cleanup removes every leaf, branch, and winter mess so your yard feels fresh. We arrive on schedule, walk the property with you, and outline exactly what is included. Our crew clears beds, trims back dead growth, cleans hard surfaces, and hauls away debris, leaving no bags behind. Optional gutter cleaning and bed prep are available for a full reset. You get transparent pricing upfront and a final inspection to make sure everything looks tidy. Expect quick communication, respectful crews, and a yard ready for new growth.',
  included: [
    'Leaf removal from lawns, beds, and corners',
    'Storm debris cleanup and haul-away',
    'Bed preparation and light pruning',
    'Final blow-off of driveways, patios, and walkways',
    'Optional gutter cleaning and downspout clearing',
    'Disposal included with no bags left behind',
  ],
  processHeading: 'A Simple Cleanup You Can Trust',
  processLead:
    'We handle the heavy lifting while keeping you informed at every step.',
  processSteps: [
    {
      title: 'Schedule your cleanup',
      description:
        'Pick a convenient time and tell us what areas need attention.',
    },
    {
      title: 'On-site walkthrough',
      description:
        'We confirm the scope, share pricing, and answer your questions up front.',
    },
    {
      title: 'Thorough cleanup service',
      description:
        'Our crew removes leaves, debris, and buildup with care for your landscape.',
    },
    {
      title: 'Haul away and reset',
      description:
        'We load and dispose of debris so your property looks clean and open.',
    },
    {
      title: 'Final inspection',
      description:
        'We review the results with you and make sure everything looks right.',
    },
  ],
  benefitsHeading: 'Start the Season with a Fresh Yard',
  benefitsLead:
    'Enjoy a clean, welcoming outdoor space without the stress or mess.',
  benefits: [
    {
      title: 'A fresh, clean yard ready for the season ahead',
      description:
        'Your lawn and beds look tidy, healthy, and ready for new growth.',
    },
    {
      title: 'More time for weekends',
      description:
        'Let us handle the bags, hauling, and heavy lifting so you can relax.',
    },
    {
      title: 'No surprises or hidden costs',
      description:
        'Transparent quotes mean the price is clear before we start.',
    },
    {
      title: 'Respectful, professional crews',
      description:
        'We treat your property like our own and leave it cleaner than we found it.',
    },
  ],
  faqs: [
    {
      question: 'How much does seasonal cleanup cost?',
      answer:
        'Pricing depends on yard size and debris volume. We provide a free, detailed quote before scheduling.',
    },
    {
      question: 'How quickly can you complete the cleanup?',
      answer:
        'Most cleanups are completed in a single visit. Larger properties may require additional time.',
    },
    {
      question: 'Do you haul away all the debris?',
      answer:
        'Yes. We remove and dispose of all debris so your property is clear and tidy.',
    },
    {
      question: 'Can you add gutter cleaning?',
      answer:
        'Absolutely. We can add gutter and downspout cleaning to your cleanup plan.',
    },
    {
      question: 'Is this a one-time service?',
      answer:
        'Seasonal cleanup is often one-time, but we can schedule spring and fall visits each year.',
    },
    {
      question: 'What if the weather changes?',
      answer:
        'We stay in touch and reschedule promptly if weather impacts the planned visit.',
    },
  ],
  ctaHeading: 'Need a Fresh Start for Your Yard?',
  ctaDescription:
    'Book your spring or fall cleanup today and get a clear quote with no surprises.',
  relatedServices: [
    {
      title: 'Lawn Care & Maintenance',
      description:
        'Keep your yard looking sharp after your cleanup with weekly care.',
      href: '/services/lawn-care',
    },
    {
      title: 'Flower Bed Installation',
      description:
        'Refresh beds with new color after a thorough cleanup.',
      href: '/services/flower-beds',
    },
    {
      title: 'Pressure Washing',
      description:
        'Pair cleanup with a fresh wash for driveways and patios.',
      href: '/services/pressure-washing',
    },
  ],
  testimonial: {
    quote:
      'They cleared every leaf and branch, and the yard looked brand new by the time they left.',
    name: 'Chris M.',
    location: 'Edmond, OK',
  },
  schema: {
    serviceType: 'Seasonal cleanup services',
    description: metadata.description,
  },
}

export default function SeasonalCleanupPage() {
  return <ServiceLayout service={service} />
}
