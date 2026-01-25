import { ServiceLayout, ServicePageContent } from '@/components/services/ServiceLayout'

export const metadata = {
  title: 'Lawn Care El Dorado & OKC | Weekly Mowing Service',
  description:
    'Professional lawn care in El Dorado & Oklahoma City. Weekly mowing, edging, and maintenance. Free quotes. Reliable service you can trust.',
}

const service: ServicePageContent = {
  slug: 'lawn-care',
  title: 'Professional Lawn Care in El Dorado & Oklahoma City',
  subtitle:
    'Enjoy a perfectly manicured lawn every week — without lifting a finger',
  metaDescription: metadata.description,
  breadcrumbLabel: 'Lawn Care',
  heroImage: {
    src: '/images/services/hero-pattern.svg',
    alt: 'Lawn care in El Dorado & OKC',
  },
  problem:
    "You know the feeling. It's Saturday morning, and while your neighbors are heading to the lake, you're stuck pushing a mower around your yard. Again. You try to keep up with it, but between work, family, and everything else, your lawn always seems to be the thing that gets neglected. Brown patches start appearing. Weeds creep in faster than you can pull them. Your mower breaks down at the worst possible time. And every time you drive up to your house, you can't help but notice how much better the neighbor's yard looks. It's exhausting, frustrating, and honestly, it's stealing your weekends.",
  solution:
    "That's exactly why we created our weekly lawn care service. Our experienced crew handles everything—mowing, edging, trimming, and cleanup—so you never have to think about it again. We show up on the same day every week, rain or shine, and take care of your lawn like it's our own. We know Oklahoma's climate inside and out, so we adjust our care throughout the year to keep your grass healthy and green. You get consistent, professional results every single week, and you get your weekends back to actually enjoy. No equipment to store, no schedules to juggle, no worrying about whether it'll get done.",
  included: [
    'Weekly mowing with professional-grade equipment for a clean, even cut',
    'Precision edging along all sidewalks, driveways, and flower beds',
    'String trimming around trees, fences, mailboxes, and other obstacles',
    'Complete debris cleanup and removal after every visit',
    'Seasonal aeration in spring and fall to promote healthy root growth',
    'Overseeding to fill in thin spots and maintain thick, lush grass',
    'Weed control treatments to keep your lawn looking its best',
    'Custom fertilization schedule tailored to Oklahoma soil and climate',
    'Free lawn health consultations whenever you have questions',
    'Flexible scheduling that works around your life',
  ],
  processHeading: 'Your Lawn Care Plan, Step by Step',
  processLead:
    'We keep things simple: clear expectations, reliable scheduling, and friendly communication.',
  processSteps: [
    {
      title: 'Free Quote & Consultation',
      description:
        "We'll visit your property, measure your lawn, and discuss your goals. You'll get a clear, upfront price with no hidden fees or surprises.",
    },
    {
      title: 'Custom Service Plan',
      description:
        "We create a maintenance schedule that fits your lawn's specific needs and your budget. You'll know exactly what to expect and when.",
    },
    {
      title: 'Weekly Service',
      description:
        "Our crew arrives on your scheduled day, completes the work efficiently, and leaves your property looking pristine. We text you when we're done.",
    },
    {
      title: 'Ongoing Communication',
      description:
        "Have a concern? Want to adjust something? Just call or text. We're always available to make sure you're completely happy with your lawn.",
    },
  ],
  benefitsHeading: 'Results You Can Count On',
  benefitsLead:
    "With Evergrow handling your lawn care, you'll enjoy benefits that go beyond just a nice-looking yard.",
  benefits: [
    {
      title: "A yard you're proud of",
      description:
        'A consistently beautiful yard that makes you proud to pull into your driveway every single day.',
    },
    {
      title: 'More time for what matters',
      description:
        "You'll have more time for the things that actually matter—family dinners, weekend trips, or just relaxing on your patio.",
    },
    {
      title: 'Increased property value',
      description:
        'Your curb appeal and property value increase with professional, consistent care.',
    },
    {
      title: 'Complete peace of mind',
      description:
        "You'll have complete peace of mind knowing it's handled by professionals who actually care.",
    },
  ],
  faqs: [
    {
      question: 'How much does weekly lawn care cost?',
      answer:
        "Our pricing is straightforward and based on your lawn size and specific needs. Most residential lawns in El Dorado and OKC range from $35-$75 per visit. We'll give you an exact quote after seeing your property—no guessing, no surprises. The price includes everything: mowing, edging, trimming, and cleanup.",
    },
    {
      question: 'Do you offer one-time mowing or just contracts?',
      answer:
        "We offer both! While most of our customers love the convenience of weekly service, we're happy to help with one-time cuts if you're going on vacation or just need a quick cleanup. Just give us a call and we'll fit you in.",
    },
    {
      question: "What if I'm not happy with a service visit?",
      answer:
        "If something's not right, we want to know immediately. Call or text us, and we'll come back out the same day or next day to make it right—no charge, no questions asked. Your satisfaction is our reputation.",
    },
    {
      question: 'How do I schedule or reschedule service?',
      answer:
        "Super easy. Just call or text us. Need to skip a week because you're out of town? No problem. Want us to come a day earlier? We'll do our best to accommodate. We're flexible because life happens.",
    },
    {
      question: 'Do you work in bad weather?',
      answer:
        "We monitor the weather closely and adjust our schedule as needed. If it's pouring rain, we'll reschedule for the next available day. We'll always communicate with you if there's a change so you're never left wondering.",
    },
    {
      question: 'What makes you different from other lawn care companies?',
      answer:
        "Honestly? We show up when we say we will, we communicate clearly, and we treat your property with respect. We're not a huge national company—we're local, and your neighbors are our neighbors. We care about doing quality work because our reputation depends on it.",
    },
    {
      question: 'Are you licensed and insured?',
      answer:
        "Absolutely. We carry full liability insurance and workers' compensation coverage. You're completely protected, and so are we.",
    },
  ],
  ctaHeading: 'Ready for a Beautiful Lawn?',
  ctaDescription:
    'Join hundreds of homeowners in El Dorado and Oklahoma City who trust Evergrow for reliable, professional lawn care every week.',
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
