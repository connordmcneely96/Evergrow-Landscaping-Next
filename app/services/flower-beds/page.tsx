import { ServiceLayout, ServicePageContent } from '@/components/services/ServiceLayout'

export const metadata = {
  title: 'Flower Bed Installation El Dorado & OKC | Custom Landscaping',
  description:
    'Custom flower bed design and installation in El Dorado & Oklahoma City. Professional landscaping with plants that thrive. Free consultations.',
}

const service: ServicePageContent = {
  slug: 'flower-beds',
  title: 'Custom Flower Bed Design & Installation',
  subtitle:
    'Transform your landscape with vibrant, expertly designed flower beds',
  metaDescription: metadata.description,
  breadcrumbLabel: 'Flower Beds',
  heroImage: {
    src: '/images/services/hero-pattern.svg',
    alt: 'Flower bed installation in El Dorado & OKC',
  },
  problem:
    "You drive past homes with gorgeous flower beds and wonder how they do it. You've tried planting flowers yourself, but they either died within weeks or never looked quite right. The choices at the garden center are overwhelming—which plants actually survive Oklahoma summers? Which ones need full sun versus shade? How do you even design a bed that looks intentional instead of random? Your yard has so much potential, but right now it's just...bland. No color, no personality, nothing that makes people slow down and admire it. You want beautiful flower beds, but you don't want to waste money on another DIY disaster.",
  solution:
    "That's where we come in. We design custom flower beds that fit your home's style and your property's unique conditions. We select plants that thrive in Oklahoma's climate—not just survive, but actually flourish. Our team handles everything from soil preparation to professional installation, and we place every plant exactly where it'll grow best. You'll get a detailed care guide so you know how to keep things looking great, and we can even handle seasonal refreshes if you want year-round color. The result? A stunning landscape that looks professionally designed because it is.",
  included: [
    'Free design consultation to understand your vision and preferences',
    'Complete site assessment including soil analysis and sun exposure mapping',
    'Custom design plan with detailed plant selection and placement',
    'Professional soil preparation and amendment for optimal plant health',
    'Expert installation by experienced landscapers',
    'Premium mulching to retain moisture and prevent weeds',
    'Strategic plant placement for color, height, and seasonal interest',
    'Drainage considerations to prevent water pooling and root rot',
    'Initial watering schedule to establish healthy root systems',
    'Detailed care and maintenance guide for long-term success',
    'Seasonal refresh options to keep your beds looking fresh year-round',
  ],
  processHeading: 'From Vision to Blooming Results',
  processLead:
    'We guide you through a simple, collaborative process that makes design decisions easy.',
  processSteps: [
    {
      title: 'Free Design Consultation',
      description:
        "We meet at your property to discuss your style preferences, budget, and vision. We'll look at sun exposure, existing landscape features, and your home's architecture to create a cohesive design.",
    },
    {
      title: 'Custom Design Plan',
      description:
        "Within a few days, we'll present a detailed plan showing exactly what we'll plant and where. You'll see plant photos, mature sizes, and seasonal color expectations. We'll adjust anything until you love it.",
    },
    {
      title: 'Plant Selection & Approval',
      description:
        "We source high-quality plants from trusted nurseries and confirm everything with you before installation. You'll know exactly what's going in your beds.",
    },
    {
      title: 'Professional Installation',
      description:
        'Our crew prepares the soil, installs your plants with proper spacing and depth, adds premium mulch, and cleans up completely. Most installations are finished in one day.',
    },
    {
      title: 'Care Instructions & Follow-up',
      description:
        "We provide a detailed care guide and check in after a few weeks to make sure everything's thriving. Have questions? We're always available.",
    },
  ],
  benefitsHeading: 'Make Your Home Stand Out',
  benefitsLead:
    "Your home's curb appeal transforms overnight. Neighbors will stop to compliment your landscape.",
  benefits: [
    {
      title: 'Instant curb appeal transformation',
      description:
        "Your home's curb appeal transforms overnight. Neighbors will stop to compliment your landscape.",
    },
    {
      title: 'Vibrant color that changes with seasons',
      description:
        "You'll have vibrant color that changes with the seasons, and because we choose low-maintenance plants suited to Oklahoma, you won't spend hours every week trying to keep things alive.",
    },
    {
      title: 'Increased property value',
      description:
        "Your property value increases, and you'll actually enjoy spending time in your yard.",
    },
    {
      title: 'Low-maintenance beauty',
      description:
        'We select plants that thrive with minimal care, so you can enjoy the beauty without constant upkeep.',
    },
  ],
  faqs: [
    {
      question: 'How much does flower bed installation cost?',
      answer:
        "It varies based on bed size, plant selection, and site preparation needs. Most residential projects range from $800-$3,500. We'll give you a detailed quote after the consultation so you know exactly what to expect.",
    },
    {
      question: 'Can you work with my existing landscape?',
      answer:
        "Absolutely! We can enhance existing beds, add new ones, or completely redesign your landscape. We'll work around mature trees, hardscaping, and anything else you want to keep.",
    },
    {
      question: 'What plants grow best in Oklahoma?',
      answer:
        "We love native and adapted plants that handle our hot summers and unpredictable weather. Think Black-Eyed Susans, Purple Coneflowers, Knockout Roses, Daylilies, and ornamental grasses. We'll recommend specific varieties based on your property's conditions.",
    },
    {
      question: 'Do I need to pay a deposit?',
      answer:
        'Yes, we require a 50% deposit to secure your installation date and order your plants. The remaining balance is due upon completion.',
    },
    {
      question: 'How long does installation take?',
      answer:
        "Most residential flower bed installations are completed in one day. Larger or more complex projects might take two days. We'll give you a timeline upfront.",
    },
    {
      question: 'Do you offer maintenance after installation?',
      answer:
        'Yes! We offer seasonal refresh services where we replace annuals, add new mulch, and keep your beds looking fresh. Many customers have us come out twice a year—spring and fall.',
    },
    {
      question: "What's your design process like?",
      answer:
        "We start by listening to what you want, then we create a plan that balances aesthetics, budget, and practicality. You'll see everything before we plant a single thing. We don't move forward until you're excited about the design.",
    },
  ],
  ctaHeading: "Let's Create Your Dream Flower Beds",
  ctaDescription:
    'Schedule your free design consultation today and see how beautiful your landscape can be.',
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
