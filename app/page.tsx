import Link from 'next/link';
import { ArrowRight, CheckCircle, Star, Phone, Calendar, MapPin, Shield, Clock, BadgeDollarSign } from 'lucide-react';
import Image from 'next/image';
import { MotionDiv } from '@/components/ui/MotionDiv';
import Testimonials from '@/components/sections/Testimonials';
import { ServiceAreaMap } from '@/components/ServiceAreaMap';

export default function HomePage() {
  return (
    <main className="flex-col">
      {/* Hero Section */}
      {/* Hero Section */}
      <section className="relative min-h-screen flex flex-col justify-start pt-0 md:pt-0 overflow-hidden">
        {/* Background Image Placeholder */}
        <div className="absolute inset-0 bg-forest-green-900">
          <div className="absolute inset-0 bg-gradient-to-r from-forest-green-900/95 to-forest-green-800/80 z-10" />
          <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] z-0"></div>
        </div>

        <div className="container relative z-20 px-4 h-full flex flex-col justify-center pt-32 pb-20">
          <MotionDiv
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-4xl mx-auto md:mx-0 md:max-w-3xl text-center md:text-left"
          >
            <div className="inline-block bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-4 py-1 mb-6">
              <span className="text-white font-bold text-sm tracking-wider uppercase">Arkansas • Oklahoma • Texas</span>
            </div>
            <h1 className="text-white font-heading font-extrabold text-5xl md:text-6xl lg:text-7xl mb-6 leading-tight drop-shadow-lg">
              Professional Multi-Location <br />
              <span className="text-white">Landscaping Services</span>
            </h1>
            <p className="text-gray-100 text-lg md:text-2xl mb-10 max-w-2xl mx-auto md:mx-0 leading-relaxed">
              Managing 40+ properties with consistent quality across all locations. Licensed and insured in AR, OK, and TX. Family-owned, owner-managed.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start items-center">
              <Link
                href="/commercial"
                className="w-full sm:w-auto inline-flex items-center justify-center px-8 py-4 rounded-lg bg-vibrant-gold text-white font-bold text-lg hover:bg-forest-green-400 hover:scale-105 transition-all shadow-xl"
              >
                Commercial Inquiries
                <ArrowRight className="w-5 h-5 ml-2" />
              </Link>
              <Link
                href="/quote-request"
                className="w-full sm:w-auto inline-flex items-center justify-center px-8 py-4 rounded-lg bg-white/10 border-2 border-white text-white font-bold text-lg hover:bg-white hover:text-forest-green transition-all shadow-lg"
              >
                Residential Quote
              </Link>
            </div>

            <div className="mt-12 flex flex-wrap justify-center md:justify-start gap-6 md:gap-8 text-white/90 text-sm md:text-base font-medium">
              <div className="flex items-center"><Shield className="w-5 h-5 text-white mr-2" /> Licensed & Insured in AR, OK, TX</div>
              <div className="flex items-center"><MapPin className="w-5 h-5 text-white mr-2" /> 40+ Properties Managed</div>
              <div className="flex items-center"><CheckCircle className="w-5 h-5 text-white mr-2" /> Family-Owned & Operated</div>
              <div className="flex items-center"><Clock className="w-5 h-5 text-white mr-2" /> 20+ Years Experience</div>
            </div>
          </MotionDiv>
        </div>
      </section>

      {/* Intro / About Section (Restored) */}
      <section className="section bg-white">
        <div className="container">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="relative">
              <div className="rounded-2xl overflow-hidden shadow-2xl border-4 border-gray-100 transform rotate-1 hover:rotate-0 transition-transform duration-500">
                <Image
                  src="/api/assets/LawnCareAndMaintenance_image1.png"
                  alt="Professional lawn care services"
                  width={600}
                  height={400}
                  className="w-full h-[400px] object-cover"
                />
              </div>
              <div className="absolute -bottom-6 -right-6 bg-forest-green text-white p-6 rounded-xl shadow-xl hidden md:block">
                <p className="text-3xl font-bold font-heading">Since</p>
                <p className="text-sm opacity-80 uppercase tracking-wider">2023</p>
              </div>
            </div>
            <div>
              <span className="text-forest-green font-bold uppercase tracking-wider text-sm mb-2 block">About Our Company</span>
              <h2 className="text-4xl font-heading font-bold text-deep-charcoal mb-6">Creating Outdoor Spaces That Stand Out Year-Round</h2>
              <p className="text-lg text-gray-600 mb-6 leading-relaxed">
                With consistent maintenance and attention to detail, we take the stress out of lawn care so you can simply enjoy a beautiful, polished yard that stands out in your neighborhood. Our team brings expertise and passion to every project.
              </p>
              <ul className="space-y-4 mb-8">
                <li className="flex items-start">
                  <div className="mt-1 mr-3 flex-shrink-0 w-6 h-6 rounded-full bg-forest-green/10 flex items-center justify-center">
                    <CheckCircle className="w-4 h-4 text-forest-green" />
                  </div>
                  <span className="text-gray-700">Professional grade equipment and materials</span>
                </li>
                <li className="flex items-start">
                  <div className="mt-1 mr-3 flex-shrink-0 w-6 h-6 rounded-full bg-forest-green/10 flex items-center justify-center">
                    <CheckCircle className="w-4 h-4 text-forest-green" />
                  </div>
                  <span className="text-gray-700">Customized solutions for every property</span>
                </li>
                <li className="flex items-start">
                  <div className="mt-1 mr-3 flex-shrink-0 w-6 h-6 rounded-full bg-forest-green/10 flex items-center justify-center">
                    <CheckCircle className="w-4 h-4 text-forest-green" />
                  </div>
                  <span className="text-gray-700">Reliable, on-time service you can count on</span>
                </li>
              </ul>
              <Link href="/quote-request" className="text-forest-green font-bold text-lg hover:text-forest-green-400 transition-colors inline-flex items-center">
                Schedule Consultation <ArrowRight className="ml-2 w-5 h-5" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Services Grid */}
      <section className="section bg-gray-50" id="services">
        <div className="container">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-forest-green font-bold uppercase tracking-wider text-sm mb-2 block">What We Offer</span>
            <h2 className="text-h2 font-heading font-bold text-4xl text-deep-charcoal mb-4">
              Our Professional Services
            </h2>
            <div className="w-24 h-1 bg-forest-green-300 mx-auto mb-6"></div>
            <p className="text-lg text-gray-600">
              Comprehensive landscaping solutions tailored to transform and maintain your outdoor spaces throughout every season.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Service 1 */}
            <Link href="/services/lawn-care" className="group h-full">
              <MotionDiv whileHover={{ y: -5 }} className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 hover:border-forest-green-300 h-full flex flex-col">
                <div className="h-48 relative">
                  <Image
                    src="/api/assets/LawnCareAndMaintenance_image2.png"
                    alt="Lawn Care & Maintenance"
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="p-6 flex-grow flex flex-col">
                  <h3 className="text-xl font-bold text-forest-green mb-3 group-hover:text-forest-green-400 transition-colors">
                    Lawn Care & Maintenance
                  </h3>
                  <p className="text-gray-600 mb-6 flex-grow text-sm">
                    Weekly mowing, trimming, edging, fertilization, and weed control to keep your grass strong and vibrant.
                  </p>
                  <span className="text-forest-green font-bold text-sm uppercase tracking-wide flex items-center group-hover:underline mt-auto">
                    Learn More <ArrowRight className="w-4 h-4 ml-1 transform group-hover:translate-x-1 transition-transform" />
                  </span>
                </div>
              </MotionDiv>
            </Link>

            {/* Service 2 */}
            <Link href="/services/flower-beds" className="group h-full">
              <MotionDiv whileHover={{ y: -5 }} className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 hover:border-forest-green-300 h-full flex flex-col">
                <div className="h-48 relative">
                  <Image
                    src="/api/assets/FlowerBedInstall_image1.png"
                    alt="Flower Bed Installation"
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="p-6 flex-grow flex flex-col">
                  <h3 className="text-xl font-bold text-forest-green mb-3 group-hover:text-forest-green-400 transition-colors">
                    Landscaping & Design
                  </h3>
                  <p className="text-gray-600 mb-6 flex-grow text-sm">
                    Custom installation, plant selection, flower beds, mulch, and rock layouts to enhance beauty.
                  </p>
                  <span className="text-forest-green font-bold text-sm uppercase tracking-wide flex items-center group-hover:underline mt-auto">
                    Learn More <ArrowRight className="w-4 h-4 ml-1 transform group-hover:translate-x-1 transition-transform" />
                  </span>
                </div>
              </MotionDiv>
            </Link>

            {/* Service 3 */}
            <Link href="/services/seasonal-cleanup" className="group h-full">
              <MotionDiv whileHover={{ y: -5 }} className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 hover:border-forest-green-300 h-full flex flex-col">
                <div className="h-48 relative">
                  <Image
                    src="/api/assets/SpringAndFallCleanup_image1.png"
                    alt="Seasonal Cleanup"
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="p-6 flex-grow flex flex-col">
                  <h3 className="text-xl font-bold text-forest-green mb-3 group-hover:text-forest-green-400 transition-colors">
                    Seasonal Services
                  </h3>
                  <p className="text-gray-600 mb-6 flex-grow text-sm">
                    Spring and fall cleanups, leaf removal, debris clearing, and bed preparation.
                  </p>
                  <span className="text-forest-green font-bold text-sm uppercase tracking-wide flex items-center group-hover:underline mt-auto">
                    Learn More <ArrowRight className="w-4 h-4 ml-1 transform group-hover:translate-x-1 transition-transform" />
                  </span>
                </div>
              </MotionDiv>
            </Link>

            {/* Service 4 */}
            <Link href="/services/pressure-washing" className="group h-full">
              <MotionDiv whileHover={{ y: -5 }} className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 hover:border-forest-green-300 h-full flex flex-col">
                <div className="h-48 relative">
                  <Image
                    src="/api/assets/PressureWashing_image1.png"
                    alt="Pressure Washing Services"
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="p-6 flex-grow flex flex-col">
                  <h3 className="text-xl font-bold text-forest-green mb-3 group-hover:text-forest-green-400 transition-colors">
                    Pressure Washing
                  </h3>
                  <p className="text-gray-600 mb-6 flex-grow text-sm">
                    Restore driveways, patios, siding, decks, and walkways by removing dirt and grime.
                  </p>
                  <span className="text-forest-green font-bold text-sm uppercase tracking-wide flex items-center group-hover:underline mt-auto">
                    Learn More <ArrowRight className="w-4 h-4 ml-1 transform group-hover:translate-x-1 transition-transform" />
                  </span>
                </div>
              </MotionDiv>
            </Link>
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="section bg-white" id="why-us">
        <div className="container">
          <div className="text-center mb-12">
            <span className="text-forest-green font-bold uppercase tracking-wider text-sm mb-2 block">Why Choose Us</span>
            <h2 className="text-h2 font-heading font-bold text-4xl text-deep-charcoal">
              Quality You Can Trust
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Card 1 */}
            <div className="group p-8 rounded-2xl bg-gray-50 hover:bg-forest-green hover:text-white transition-all duration-300 text-center">
              <div className="w-16 h-16 mx-auto mb-6 bg-forest-green group-hover:bg-white rounded-2xl flex items-center justify-center transition-colors">
                <Star className="w-8 h-8 text-white group-hover:text-forest-green" />
              </div>
              <h3 className="text-xl font-bold text-deep-charcoal group-hover:text-white mb-3">Quality Work</h3>
              <p className="text-gray-600 group-hover:text-forest-green-100">We take pride in every project, ensuring exceptional results that exceed your expectations.</p>
            </div>

            {/* Card 2 */}
            <div className="group p-8 rounded-2xl bg-gray-50 hover:bg-forest-green hover:text-white transition-all duration-300 text-center">
              <div className="w-16 h-16 mx-auto mb-6 bg-forest-green group-hover:bg-white rounded-2xl flex items-center justify-center transition-colors">
                <Clock className="w-8 h-8 text-white group-hover:text-forest-green" />
              </div>
              <h3 className="text-xl font-bold text-deep-charcoal group-hover:text-white mb-3">Reliable Service</h3>
              <p className="text-gray-600 group-hover:text-forest-green-100">Count on us to show up on time, every time, with consistent and dependable service.</p>
            </div>

            {/* Card 3 */}
            <div className="group p-8 rounded-2xl bg-gray-50 hover:bg-forest-green hover:text-white transition-all duration-300 text-center">
              <div className="w-16 h-16 mx-auto mb-6 bg-forest-green group-hover:bg-white rounded-2xl flex items-center justify-center transition-colors">
                <Shield className="w-8 h-8 text-white group-hover:text-forest-green" />
              </div>
              <h3 className="text-xl font-bold text-deep-charcoal group-hover:text-white mb-3">Expert Team</h3>
              <p className="text-gray-600 group-hover:text-forest-green-100">Our experienced professionals bring skill, care, and attention to detail to every project.</p>
            </div>

            {/* Card 4 */}
            <div className="group p-8 rounded-2xl bg-gray-50 hover:bg-forest-green hover:text-white transition-all duration-300 text-center">
              <div className="w-16 h-16 mx-auto mb-6 bg-forest-green group-hover:bg-white rounded-2xl flex items-center justify-center transition-colors">
                <CheckCircle className="w-8 h-8 text-white group-hover:text-forest-green" />
              </div>
              <h3 className="text-xl font-bold text-deep-charcoal group-hover:text-white mb-3">Customer Care</h3>
              <p className="text-gray-600 group-hover:text-forest-green-100">Your satisfaction is our priority. We treat every property like our own.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <Testimonials />

      {/* Service Area Section */}
      <section className="section bg-gray-50 border-t border-gray-200">
        <div className="container">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <span className="text-forest-green font-bold uppercase tracking-wider text-sm mb-2 block">Service Area</span>
              <h2 className="text-4xl font-heading font-bold text-deep-charcoal mb-6">Proudly Serving El Dorado & OKC</h2>
              <p className="text-lg text-gray-600 mb-8">
                We focus on consistent, reliable service across El Dorado and the greater Oklahoma City metro area.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {[
                  { city: 'El Dorado', desc: 'Primary service area.' },
                  { city: 'Oklahoma City', desc: 'Metro coverage.' },
                  { city: 'Edmond', desc: 'North OKC neighborhoods.' },
                  { city: 'Moore', desc: 'South OKC service.' },
                  { city: 'Yukon', desc: 'West OKC suburbs.' },
                  { city: 'Midwest City', desc: 'East OKC communities.' },
                ].map((area) => (
                  <div key={area.city} className="flex items-start">
                    <MapPin className="w-5 h-5 text-forest-green mt-1 mr-3 flex-shrink-0" />
                    <div>
                      <h4 className="font-bold text-deep-charcoal">{area.city}</h4>
                      <p className="text-sm text-gray-500">{area.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-8">
                <Link href="/quote-request" className="btn bg-forest-green text-white hover:bg-forest-green-800 transition-colors px-6 py-3 rounded-lg font-bold">
                  Check Your Zip Code
                </Link>
              </div>
            </div>
            <ServiceAreaMap height={400} showBadge />
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="py-24 bg-forest-green relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-forest-green-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-forest-green-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>

        <div className="container relative z-10 text-center">
          <span className="inline-block py-1 px-3 rounded-full bg-white/20 text-white text-sm font-bold tracking-wider uppercase mb-6 backdrop-blur-sm border border-white/20">Get Started</span>
          <h2 className="text-h2 font-heading font-bold text-4xl md:text-5xl text-white mb-6">
            Ready for a Yard You Love Coming Home To?
          </h2>
          <p className="text-xl text-forest-green-100 mb-10 max-w-2xl mx-auto">
            From weekly maintenance to full landscape upgrades, Evergrow Landscaping makes it easy to keep your outdoor space beautiful.
          </p>

          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link
              href="/quote-request"
              className="inline-flex items-center justify-center px-10 py-5 rounded-lg bg-vibrant-gold text-white font-bold text-xl hover:bg-forest-green-400 transform hover:-translate-y-1 transition-all shadow-lg"
            >
              Get Your Free Quote
            </Link>
            <Link
              href="/services"
              className="inline-flex items-center justify-center px-10 py-5 rounded-lg border-2 border-white text-white font-bold text-xl hover:bg-white hover:text-forest-green transform hover:-translate-y-1 transition-all"
            >
              Explore All Services
            </Link>
          </div>
          <p className="mt-6 text-white/60 text-sm">
            Fast, free estimates • No credit card required
          </p>
        </div>
      </section>
    </main>
  );
}
