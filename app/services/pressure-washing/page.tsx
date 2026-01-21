import { ServiceLayout, ServicePageContent } from '@/components/services/ServiceLayout'

export const metadata = {
  title: 'Pressure Washing in El Dorado & OKC | Evergreen Landscaping',
  description:
    'Professional pressure washing in El Dorado and OKC. Driveways, siding, decks, and patios cleaned safely with transparent pricing.',
}

const service: ServicePageContent = {
  slug: 'pressure-washing',
  title: 'Professional Pressure Washing in El Dorado & OKC',
  subtitle:
    "Safely remove years of grime from driveways, siding, decks, and patios in just a few hours.",
  metaDescription: metadata.description,
  breadcrumbLabel: 'Pressure Washing',
  heroImage: {
    src: '/images/services/hero-pattern.svg',
    alt: 'Pressure washing in El Dorado & OKC',
  },
  problem:
    'Dirty driveways, grimy siding, and stained decks make your home look tired even when the yard is neat. You may try to scrub it yourself, but the stains do not budge and you worry about damaging the surface. Renting equipment is expensive, time-consuming, and messy. When you hire someone, you wonder if they will show up, protect your landscaping, or add surprise fees. You want a professional wash that restores curb appeal without harming your property or your budget. You need a crew that communicates clearly.',
  solution:
    'Evergreen provides professional pressure washing that removes years of buildup safely. We inspect surfaces, choose the right pressure and cleaning solutions, and pre-treat stains so concrete, siding, and wood look refreshed without damage. Our team protects nearby plants, keeps the worksite clean, and communicates each step so you always know what is happening. Pricing is transparent and the schedule is reliable. In a few hours, you can have a bright driveway, clean siding, and a patio that feels new again. We handle the hard work so you can enjoy your weekends.',
  included: [
    'Driveway and sidewalk cleaning',
    'Patio and pool deck washing',
    'House siding soft wash treatment',
    'Fence and gate cleaning',
    'Deck and porch stain removal',
    'Surface-safe detergents and post rinse',
  ],
  processHeading: 'Pressure Washing Without the Stress',
  processLead:
    'We keep scheduling simple, pricing clear, and results impressive.',
  processSteps: [
    {
      title: 'Free estimate',
      description:
        'We assess the surfaces, answer questions, and provide a transparent quote.',
    },
    {
      title: 'Secure your spot with a 50% deposit',
      description:
        'A small deposit confirms your appointment and locks in your pricing.',
    },
    {
      title: 'Scheduled service day',
      description:
        'Our crew arrives on time, protects landscaping, and prepares the area.',
    },
    {
      title: 'Professional wash',
      description:
        'We pre-treat stains, wash surfaces safely, and rinse thoroughly.',
    },
    {
      title: 'Final walkthrough and payment',
      description:
        'We review the results together and collect the remaining balance.',
    },
  ],
  benefitsHeading: 'Restore Curb Appeal Fast',
  benefitsLead:
    'Enjoy a clean exterior that makes your home feel fresh and welcoming.',
  benefits: [
    {
      title: "Restore your home's beauty in just a few hours",
      description:
        'Bright, clean surfaces boost curb appeal without a major renovation.',
    },
    {
      title: 'No surprises or hidden costs',
      description:
        'Clear quotes and transparent deposits keep everything predictable.',
    },
    {
      title: 'Safe for your surfaces',
      description:
        'We match pressure and cleaners to the surface so nothing is damaged.',
    },
    {
      title: 'A home you are proud to come home to',
      description:
        'Remove stains and grime so your property looks cared for again.',
    },
  ],
  faqs: [
    {
      question: 'How much does pressure washing cost?',
      answer:
        'Pricing depends on the surfaces and square footage. We provide a free estimate with clear line items.',
    },
    {
      question: 'Do you require a deposit?',
      answer:
        'Yes. We collect a 50% deposit to confirm your service date and lock in pricing.',
    },
    {
      question: 'How long does the service take?',
      answer:
        'Most residential jobs are completed in a few hours. Larger projects may take longer.',
    },
    {
      question: 'Will pressure washing damage my siding or deck?',
      answer:
        'No. We use the appropriate pressure and detergents for each surface to prevent damage.',
    },
    {
      question: 'What surfaces can you clean?',
      answer:
        'We clean driveways, sidewalks, patios, siding, decks, and fences.',
    },
    {
      question: 'Are you licensed and insured?',
      answer:
        'Yes. Evergreen is fully licensed and insured for your peace of mind.',
    },
  ],
  ctaHeading: "Ready to Refresh Your Home's Exterior?",
  ctaDescription:
    'Get a free estimate and see how quickly pressure washing can boost curb appeal.',
  relatedServices: [
    {
      title: 'Lawn Care & Maintenance',
      description:
        'Pair a clean driveway with weekly lawn care for a polished look.',
      href: '/services/lawn-care',
    },
    {
      title: 'Seasonal Cleanup',
      description:
        'Remove debris and refresh beds before washing surfaces.',
      href: '/services/seasonal-cleanup',
    },
    {
      title: 'Flower Bed Installation',
      description:
        'Add fresh landscaping to match your newly cleaned exterior.',
      href: '/services/flower-beds',
    },
  ],
  testimonial: {
    quote:
      'Our driveway and patio looked brand new after their visit. Fast, friendly, and no mess left behind.',
    name: 'Alicia R.',
    location: 'Oklahoma City, OK',
  },
  schema: {
    serviceType: 'Pressure washing services',
    description: metadata.description,
  },
}

export default function PressureWashingPage() {
  return <ServiceLayout service={service} />
}
