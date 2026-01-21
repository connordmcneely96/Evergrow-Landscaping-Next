import { ServiceLayout, ServicePageContent } from '@/components/services/ServiceLayout'

export const metadata = {
  title: 'Flower Bed Design in El Dorado & OKC | Evergreen Landscaping',
  description:
    'Custom flower bed design in El Dorado and OKC. We handle soil prep, plant selection, installation, and mulching with clear pricing.',
}

const service: ServicePageContent = {
  slug: 'flower-beds',
  title: 'Custom Flower Bed Design & Installation in El Dorado & OKC',
  subtitle:
    "We design vibrant flower beds that thrive in Oklahoma's climate and make your entryway stand out.",
  metaDescription: metadata.description,
  breadcrumbLabel: 'Flower Beds',
  heroImage: {
    src: '/images/services/hero-pattern.svg',
    alt: 'Flower bed installation in El Dorado & OKC',
  },
  problem:
    'Want a vibrant, colorful landscape but do not know where to start? Maybe you buy plants that look great at the store, then fade in Oklahoma heat, and the bed turns into a patchy mess. It is hard to know the right soil, sun exposure, and spacing, and the wrong choice means wasted money and time. When installers rush the job, you are left with uneven edges, weeds, and mulch everywhere. You want a beautiful entryway without the guesswork, hidden costs, or cleanup headaches, and a clear plan for success.',
  solution:
    "Evergreen designs and installs flower beds that bloom beautifully in Oklahoma's climate. We start with a free consultation, learn your style, and map a plan that balances color, texture, and seasonal interest. Our team preps the soil, selects hardy plants, installs clean edging, and applies fresh mulch so everything looks polished. You get clear pricing upfront, a tidy worksite, and simple maintenance tips to keep plants healthy. We handle the hard work so you can enjoy your weekends and show off your home.",
  included: [
    'Design consultation and on-site walkthrough',
    'Soil preparation and bed shaping',
    'Plant selection for sun, shade, and seasonality',
    'Precise installation and spacing for healthy growth',
    'Fresh mulch and clean edging lines',
    'Cleanup and care guidance after installation',
  ],
  processHeading: 'From Vision to Blooming Results',
  processLead:
    'We guide you through a simple, collaborative process that makes design decisions easy.',
  processSteps: [
    {
      title: 'Free consultation',
      description:
        'We listen to your goals, measure the space, and discuss your style and budget.',
    },
    {
      title: 'Custom design plan',
      description:
        'You receive a tailored layout with plant recommendations and transparent pricing.',
    },
    {
      title: 'Installation day',
      description:
        'We prep the soil, install plants, edge the beds, and leave everything tidy.',
    },
    {
      title: 'Walkthrough and care tips',
      description:
        'We review the final look and share watering and maintenance guidance.',
    },
    {
      title: 'Ongoing support',
      description:
        'Reach out anytime for refreshes, seasonal color, or maintenance help.',
    },
  ],
  benefitsHeading: 'Make Your Home Stand Out',
  benefitsLead:
    'Enjoy a landscape you love without the stress of planning and upkeep.',
  benefits: [
    {
      title: 'A stunning entrance that makes your home stand out',
      description:
        'Thoughtful color and texture create a welcoming, polished first impression.',
    },
    {
      title: 'Plants that thrive in Oklahoma',
      description:
        'We select hardy varieties that handle heat, sun, and seasonal shifts.',
    },
    {
      title: 'Less guesswork, more confidence',
      description:
        'You get a clear plan, a professional install, and maintenance tips that work.',
    },
    {
      title: 'No surprises or hidden costs',
      description:
        'Transparent pricing means you know exactly what is included from day one.',
    },
  ],
  faqs: [
    {
      question: 'How much does flower bed installation cost?',
      answer:
        'Pricing depends on bed size, plant selection, and scope. We provide a free, detailed quote after your consultation.',
    },
    {
      question: 'How long does installation take?',
      answer:
        'Most flower bed installations are completed in one day, with larger projects scheduled over multiple visits.',
    },
    {
      question: 'Do you use native or low-maintenance plants?',
      answer:
        'Yes. We recommend hardy, climate-friendly plants that perform well in Oklahoma.',
    },
    {
      question: 'Can you refresh existing beds?',
      answer:
        'Absolutely. We can clean up, re-edge, replant, and add fresh mulch to update older beds.',
    },
    {
      question: 'Do you offer ongoing maintenance?',
      answer:
        'Yes. We can set up seasonal refreshes, weed control, and mulch touch-ups.',
    },
    {
      question: 'Are you licensed and insured?',
      answer:
        'Yes. Our team is fully licensed and insured for your peace of mind.',
    },
  ],
  ctaHeading: 'Ready for a Flower Bed That Pops?',
  ctaDescription:
    'Schedule a free design consultation and get a clear plan with pricing you can trust.',
  relatedServices: [
    {
      title: 'Lawn Care & Maintenance',
      description:
        'Pair new beds with weekly mowing and edging for a complete look.',
      href: '/services/lawn-care',
    },
    {
      title: 'Seasonal Cleanup',
      description:
        'Keep beds fresh with leaf removal and seasonal refreshes.',
      href: '/services/seasonal-cleanup',
    },
    {
      title: 'Pressure Washing',
      description:
        'Brighten walkways and patios to match your new landscape.',
      href: '/services/pressure-washing',
    },
  ],
  testimonial: {
    quote:
      'Our new flower beds look amazing and Evergreen helped us pick plants that actually thrive.',
    name: 'Jordan L.',
    location: 'Oklahoma City, OK',
  },
  schema: {
    serviceType: 'Flower bed design and installation',
    description: metadata.description,
  },
}

export default function FlowerBedsPage() {
  return <ServiceLayout service={service} />
}
