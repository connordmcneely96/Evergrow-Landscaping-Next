import { ServiceLayout, ServicePageContent } from '@/components/services/ServiceLayout'

export const metadata = {
  title: 'Seasonal Cleanup El Dorado & OKC | Leaf Removal Service',
  description:
    'Professional spring and fall cleanup in El Dorado & Oklahoma City. Fast debris removal, all hauled away. Book your seasonal cleanup today.',
}

const service: ServicePageContent = {
  slug: 'seasonal-cleanup',
  title: 'Spring & Fall Cleanup Services',
  subtitle:
    'Remove debris, prepare your yard, and start each season fresh',
  metaDescription: metadata.description,
  breadcrumbLabel: 'Seasonal Cleanup',
  heroImage: {
    src: '/images/services/hero-pattern.svg',
    alt: 'Seasonal cleanup in El Dorado & OKC',
  },
  problem:
    "The leaves are piling up faster than you can rake them. Or it's spring, and your yard is covered in dead branches, matted leaves, and winter debris that makes the whole property look abandoned. You know you need to tackle it, but the thought of spending an entire weekend raking, bagging, and hauling is exhausting. You don't have the right equipment. Your back hurts just thinking about it. And meanwhile, your neighbors' yards already look pristine and ready for the season. Every time you pull into your driveway, you feel a little embarrassed. You want a clean, fresh-looking yard, but you just don't have the time or energy to make it happen.",
  solution:
    "That's exactly what our seasonal cleanup service is for. We bring a full crew with professional equipment and knock out your entire property in just a few hours. We remove every leaf, every stick, every piece of debris—and we haul it all away. Your beds get cleaned out and edged. Your lawn gets dethatched if needed. We even refresh your mulch so everything looks sharp and ready for the new season. You don't lift a finger, and by the time we're done, your yard looks like it's ready for a magazine photoshoot. It's the fastest, easiest way to start spring or fall off right.",
  included: [
    'Complete leaf removal and disposal from all areas',
    'Dead plant material removal to make room for new growth',
    'Bed cleanup and edging for crisp, defined borders',
    'Lawn dethatching to remove dead grass and promote healthy growth',
    'Early weed removal before they take over',
    'Mulch refreshing to give beds a clean, finished look',
    'Storm debris removal from summer weather',
    'Final mowing and edging before winter dormancy',
    'Gutter cleaning (optional add-on)',
    'Full property walkthrough to catch any issues',
  ],
  processHeading: 'A Simple Cleanup You Can Trust',
  processLead:
    'We handle the heavy lifting while keeping you informed at every step.',
  processSteps: [
    {
      title: 'Schedule Your Cleanup',
      description:
        "Call or text us to schedule your spring or fall cleanup. We'll confirm a date and give you an estimated arrival time.",
    },
    {
      title: 'Thorough Property Service',
      description:
        'Our crew arrives with professional equipment and works through your entire property systematically. We clean beds, remove debris, edge borders, and refresh mulch.',
    },
    {
      title: 'Debris Hauled Away',
      description:
        "We load everything into our trucks and haul it away. You don't have to worry about disposal or filling your trash cans for weeks.",
    },
    {
      title: 'Final Walkthrough',
      description:
        "Before we leave, we do a final check to make sure everything looks perfect. If you're home, we'll walk the property with you to confirm you're happy.",
    },
  ],
  benefitsHeading: 'Start the Season with a Fresh Yard',
  benefitsLead:
    "Your yard looks clean, fresh, and ready for the new season. You didn't spend your entire weekend doing backbreaking work.",
  benefits: [
    {
      title: 'Clean, fresh yard ready for the season',
      description:
        'Your yard looks clean, fresh, and ready for the new season. Your property has instant curb appeal again.',
    },
    {
      title: 'No backbreaking weekend work',
      description:
        "You didn't spend your entire weekend doing backbreaking work. Let us handle the bags, hauling, and heavy lifting.",
    },
    {
      title: 'Properly prepared landscape',
      description:
        "You have peace of mind knowing everything's been properly prepared—whether that's removing dead material in spring or protecting your landscape for winter.",
    },
    {
      title: 'Professional results',
      description:
        'Your lawn and beds look tidy, healthy, and ready for new growth with professional attention to detail.',
    },
  ],
  faqs: [
    {
      question: 'When is the best time for spring/fall cleanup?',
      answer:
        "For spring cleanup, we recommend scheduling as soon as the ground thaws and you can see what needs attention—usually late March or early April in Oklahoma. For fall cleanup, wait until most leaves have fallen, typically late October through November. We'll help you time it right.",
    },
    {
      question: 'Do I need to be home during service?',
      answer:
        "Nope! As long as we can access your yard, we're good to go. We'll text you when we arrive and when we're finished. Many customers aren't home, and it works out perfectly.",
    },
    {
      question: 'What do you do with the debris?',
      answer:
        "We haul everything away in our trucks and dispose of it properly. Organic material goes to composting facilities when possible. You don't have to worry about a thing.",
    },
    {
      question: 'Can you clean up storm damage?',
      answer:
        "Absolutely. If you've had storm damage with downed branches or scattered debris, give us a call. We can usually get out within a day or two to clean it up and haul it away.",
    },
    {
      question: 'Do you offer one-time cleanup or only to regular customers?',
      answer:
        "We offer one-time seasonal cleanups to anyone! You don't have to be a regular lawn care customer. Many people just call us twice a year for spring and fall cleanup.",
    },
    {
      question: 'How long does a typical cleanup take?',
      answer:
        "Most residential properties take 2-4 hours depending on size and debris amount. Larger properties or heavy leaf coverage might take longer. We'll give you an estimate when you call.",
    },
  ],
  ctaHeading: 'Book Your Seasonal Cleanup Today',
  ctaDescription:
    'Get your yard ready for the season without spending your weekend doing it. Professional cleanup, fast service, all debris hauled away.',
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
