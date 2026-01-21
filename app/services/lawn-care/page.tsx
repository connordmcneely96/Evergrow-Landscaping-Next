import { ServiceLayout, ServicePageContent } from '@/components/services/ServiceLayout'

export const metadata = {
  title: 'Lawn Care in El Dorado & OKC | Evergreen Landscaping',
  description:
    'Reliable lawn care in El Dorado and OKC. Weekly mowing, edging, weed control, and seasonal treatments with transparent pricing.',
}

const service: ServicePageContent = {
  slug: 'lawn-care',
  title: 'Professional Lawn Care in El Dorado & OKC',
  subtitle:
    'Weekly mowing, edging, and seasonal treatments so you come home to a perfectly manicured lawn.',
  metaDescription: metadata.description,
  breadcrumbLabel: 'Lawn Care',
  heroImage: {
    src: '/images/services/hero-pattern.svg',
    alt: 'Lawn care in El Dorado & OKC',
  },
  problem:
    "Weekends disappear behind a mower, and the lawn still looks patchy. You never know if the crew will show up, and when they do, they leave grass clippings on the driveway and surprise add-ons on the invoice. It is frustrating to spend money and still feel embarrassed about the yard. The weeds creep in, the edges look ragged, and you are stuck juggling calls to get answers. Our neighbors in El Dorado and OKC want reliable weekly care without chasing updates or hidden fees.",
  solution:
    "Evergreen's weekly maintenance program keeps your lawn healthy and beautiful year-round. We start with a free walkthrough, build a customized schedule, and show up on time with a professional, background-checked crew. You receive clear pricing up front and a simple service plan so there are no surprises. We mow, edge, trim, and clean up each visit, plus we handle seasonal aeration, seeding, and weed control to keep grass thick and green. Expect consistent communication and a yard you are proud to come home to.",
  included: [
    'Weekly mowing and precise edging',
    'String trimming around trees, fences, and beds',
    'Blowing and debris cleanup after every visit',
    'Seasonal aeration and overseeding options',
    'Weed control treatments and spot care',
    'Fertilization support to keep turf healthy',
  ],
  processHeading: 'Your Lawn Care Plan, Step by Step',
  processLead:
    'We keep things simple: clear expectations, reliable scheduling, and friendly communication.',
  processSteps: [
    {
      title: 'Free quote and walkthrough',
      description:
        'Tell us about your lawn, your goals, and your schedule so we can quote accurately.',
    },
    {
      title: 'Customized service plan',
      description:
        'We build a weekly or bi-weekly plan with transparent pricing and clear expectations.',
    },
    {
      title: 'Scheduled service visits',
      description:
        'Our crew arrives on time, handles mowing and edging, and cleans up before leaving.',
    },
    {
      title: 'Quality inspection',
      description:
        'We check the details, review the property, and make sure everything looks sharp.',
    },
    {
      title: 'Ongoing communication',
      description:
        'You get proactive updates, seasonal recommendations, and quick responses to questions.',
    },
  ],
  benefitsHeading: 'Results You Can Count On',
  benefitsLead:
    'We focus on the outcomes that matter most to busy homeowners.',
  benefits: [
    {
      title: "A yard you're proud of",
      description:
        'Crisp lines, thick turf, and clean edges make your home stand out every week.',
    },
    {
      title: 'More time for weekends',
      description:
        'Skip the mower and enjoy your time while we handle the routine work.',
    },
    {
      title: 'No surprises or hidden costs',
      description:
        'Upfront pricing means you always know what to expect before work begins.',
    },
    {
      title: 'Reliable, on-time visits',
      description:
        'You can plan confidently knowing our team shows up when promised.',
    },
  ],
  faqs: [
    {
      question: 'How much does lawn care cost?',
      answer:
        'Pricing is based on your lawn size and service frequency. We provide a free, transparent quote before any work begins.',
    },
    {
      question: 'Do you offer one-time services or just contracts?',
      answer:
        'We offer both. Many clients choose ongoing maintenance, but we also provide one-time cleanups or seasonal treatments.',
    },
    {
      question: 'What if I am not happy with the service?',
      answer:
        'Let us know within 24 hours and we will make it right. Your satisfaction is part of our quality checks.',
    },
    {
      question: 'How often will you communicate with me?',
      answer:
        'You will receive updates about scheduling, seasonal recommendations, and any issues we notice along the way.',
    },
    {
      question: 'Are you licensed and insured?',
      answer:
        'Yes. Our team is licensed and insured for your peace of mind.',
    },
    {
      question: 'Can you help with seasonal aeration or overseeding?',
      answer:
        'Absolutely. We can add aeration, overseeding, and weed control treatments to keep your lawn healthy.',
    },
  ],
  ctaHeading: 'Ready for Weekly Lawn Care You Can Count On?',
  ctaDescription:
    'Tell us about your property and we will put together a clear, honest quote within 24 hours.',
  relatedServices: [
    {
      title: 'Flower Bed Installation',
      description:
        'Add vibrant color with custom beds designed for Oklahoma weather.',
      href: '/services/flower-beds',
    },
    {
      title: 'Seasonal Cleanup',
      description:
        'Clear leaves and debris to keep your lawn healthy year-round.',
      href: '/services/seasonal-cleanup',
    },
    {
      title: 'Pressure Washing',
      description:
        'Pair lawn care with a clean driveway and refreshed patio.',
      href: '/services/pressure-washing',
    },
  ],
  testimonial: {
    quote:
      'Evergreen keeps our yard looking perfect every week and they always show up when they say they will.',
    name: 'Megan T.',
    location: 'El Dorado, OK',
  },
  schema: {
    serviceType: 'Lawn care and maintenance',
    description: metadata.description,
  },
}

export default function LawnCarePage() {
  return <ServiceLayout service={service} />
}
