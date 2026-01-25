import { ServiceLayout, ServicePageContent } from '@/components/services/ServiceLayout'

export const metadata = {
  title: 'Pressure Washing El Dorado & OKC | Driveway & Siding Cleaning',
  description:
    'Professional pressure washing in El Dorado & Oklahoma City. Driveways, siding, decks, patios. Safe, effective cleaning. Free estimates available.',
}

const service: ServicePageContent = {
  slug: 'pressure-washing',
  title: 'Professional Pressure Washing Services',
  subtitle:
    'Restore your driveway, siding, and outdoor surfaces to like-new condition',
  metaDescription: metadata.description,
  breadcrumbLabel: 'Pressure Washing',
  heroImage: {
    src: '/images/services/hero-pattern.svg',
    alt: 'Pressure washing in El Dorado & OKC',
  },
  problem:
    "Your driveway is covered in oil stains, tire marks, and years of built-up grime. Every time someone pulls up to your house, that's the first thing they see. Your siding has green streaks and dirt that makes your whole house look dingy. Your deck or patio is stained and slippery from algae buildup. You've thought about pressure washing it yourself, but you've heard horror stories about people damaging their siding or leaving weird streaks everywhere. Plus, it would take you an entire weekend—if you even had the right equipment. Meanwhile, you're embarrassed every time guests come over. You know a good cleaning would make a huge difference, but you just don't want to risk doing it wrong.",
  solution:
    "That's why professional pressure washing exists. We have the experience and equipment to safely remove years of dirt, grime, mold, and stains without damaging your surfaces. We adjust the pressure for each material—gentle on siding, more aggressive on concrete. We use eco-friendly cleaning solutions that actually break down the buildup instead of just pushing it around. In just a few hours, we can transform your driveway from embarrassing to impressive. Your siding looks fresh and clean. Your deck is safe to walk on again. It's one of the most affordable ways to dramatically boost your home's curb appeal, and the results are immediate.",
  included: [
    'Pre-treatment surface assessment to identify the right approach for each area',
    'Appropriate pressure settings adjusted for vinyl, brick, wood, concrete, and other materials',
    'Eco-friendly cleaning solutions that are safe for plants, pets, and the environment',
    'Driveway and sidewalk cleaning to remove oil, tire marks, and stains',
    'Patio and walkway restoration for safe, clean outdoor living spaces',
    'Home siding cleaning (vinyl, brick, wood) to restore original appearance',
    'Deck and fence washing to remove mold, mildew, and weathering',
    'Concrete surface cleaning including garage floors and retaining walls',
    'Window exterior cleaning (optional add-on for complete home refresh)',
    "Post-service inspection to ensure you're thrilled with the results",
    '50% deposit required to schedule, balance due upon completion',
  ],
  processHeading: 'Pressure Washing Without the Stress',
  processLead:
    'We keep scheduling simple, pricing clear, and results impressive.',
  processSteps: [
    {
      title: 'Free Estimate',
      description:
        "We'll visit your property, assess the surfaces you want cleaned, and provide a clear, upfront quote. No hidden fees or surprise charges.",
    },
    {
      title: '50% Deposit & Scheduling',
      description:
        'Once you approve the quote, we collect a 50% deposit to secure your service date and purchase any specialized cleaning solutions needed for your project.',
    },
    {
      title: 'Professional Service',
      description:
        'Our crew arrives with commercial-grade equipment and cleans your surfaces methodically. We protect landscaping, adjust pressure as needed, and ensure even, streak-free results.',
    },
    {
      title: 'Final Inspection & Payment',
      description:
        "We walk the property with you to make sure you're completely satisfied. Once you're happy, the remaining 50% balance is due. Most customers pay by check or card on the spot.",
    },
  ],
  benefitsHeading: 'Restore Curb Appeal Fast',
  benefitsLead:
    'The transformation is dramatic and immediate.',
  benefits: [
    {
      title: 'Dramatic, immediate transformation',
      description:
        'Your driveway looks new again. Your siding is bright and clean. Your deck is safe and inviting. Neighbors will notice.',
    },
    {
      title: 'Increased property value',
      description:
        'Your property value increases with professional cleaning that extends the life of your surfaces.',
    },
    {
      title: 'Pride in your home',
      description:
        "You'll feel proud of your home again instead of embarrassed when guests arrive.",
    },
    {
      title: 'Extended surface life',
      description:
        'Regular pressure washing actually extends the life of your surfaces by removing damaging buildup.',
    },
  ],
  faqs: [
    {
      question: 'How much does pressure washing cost?',
      answer:
        "Pricing depends on the size of the area and the type of surface. Most driveways run $150-$300. Whole-house siding typically ranges from $250-$600. We'll give you an exact quote after seeing your property.",
    },
    {
      question: 'Why do you require a deposit?',
      answer:
        "The deposit secures your spot on our schedule and covers the cost of specialized cleaning solutions for your specific surfaces. It's standard practice for pressure washing services and protects both of us.",
    },
    {
      question: 'Will pressure washing damage my surfaces?',
      answer:
        "Not when done correctly! That's why we adjust pressure settings for each material. Too much pressure can damage soft wood or strip paint. Too little won't clean properly. We've been doing this for years and know exactly what each surface needs.",
    },
    {
      question: 'How long does it take?',
      answer:
        "Most residential driveways take 1-2 hours. Whole-house siding can take 3-5 hours depending on size. We'll give you a time estimate when we provide your quote.",
    },
    {
      question: 'Do I need to be home?',
      answer:
        "It's helpful if you're available at the beginning and end for the walkthrough, but you don't need to be there the whole time. We'll coordinate a schedule that works for you.",
    },
    {
      question: 'What surfaces can you clean?',
      answer:
        "We clean driveways, sidewalks, patios, decks, fences, home siding (vinyl, brick, wood, stucco), garage floors, retaining walls, and more. If you're not sure about a specific surface, just ask—we'll let you know if it's safe to pressure wash.",
    },
    {
      question: 'How often should I have surfaces pressure washed?',
      answer:
        "For most homes, once a year is perfect. High-traffic areas like driveways might benefit from twice-yearly cleaning. We'll recommend a schedule based on your specific situation and how quickly buildup returns.",
    },
  ],
  ctaHeading: 'Ready to Restore Your Surfaces?',
  ctaDescription:
    'See the dramatic difference professional pressure washing makes. Book your free estimate today and get your home looking like new again.',
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
