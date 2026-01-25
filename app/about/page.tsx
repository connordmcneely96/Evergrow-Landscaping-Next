import { Metadata } from 'next'
import Link from 'next/link'
import { CheckCircle2 } from 'lucide-react'

export const metadata: Metadata = {
    title: 'About Evergrow Landscaping | Family-Owned in El Dorado & OKC',
    description:
        'Meet the team behind Evergrow Landscaping. Founded in 2023, serving El Dorado and Oklahoma City with reliable, quality landscaping services.',
}

export default function AboutPage() {
    return (
        <div className="min-h-screen">
            {/* Hero Section */}
            <section className="bg-gradient-to-br from-green-50 to-green-100 py-20">
                <div className="container mx-auto px-4">
                    <div className="max-w-4xl mx-auto text-center">
                        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
                            More Than Just Landscaping — It&apos;s Personal
                        </h1>
                        <p className="text-xl text-gray-700 leading-relaxed">
                            We started Evergrow Landscaping in 2023 because we were tired of seeing
                            homeowners get burned by unreliable contractors who didn&apos;t show
                            up, didn&apos;t communicate, and didn&apos;t care. We&apos;ve built our business on a simple promise: do what we say
                            we&apos;ll do, treat your property with respect, and be there when you
                            need us. That&apos;s not just good business—it&apos;s how we&apos;d want to
                            be treated, and it&apos;s what keeps our customers coming back season
                            after season.
                        </p>
                    </div>
                </div>
            </section>

            {/* Why We Started Section */}
            <section className="py-20 bg-white">
                <div className="container mx-auto px-4">
                    <div className="max-w-4xl mx-auto">
                        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-8">
                            Why We Started Evergrow
                        </h2>
                        <div className="prose prose-lg max-w-none text-gray-700">
                            <p>
                                When Karson started Evergrow in 2023, he kept hearing
                                the same frustrations from homeowners: landscapers who didn&apos;t
                                show up when promised, crews who left properties messy, companies
                                that added surprise charges, and worst of all—contractors who
                                simply stopped answering the phone after getting paid.
                            </p>
                            <p>
                                Homeowners were spending their weekends trying to keep up with
                                yard work because they couldn&apos;t find someone reliable. When they
                                did hire help, they&apos;d get burned by poor communication,
                                inconsistent quality, or flat-out no-shows. It was an industry
                                where &quot;good enough&quot; seemed to be the standard, and customers had
                                learned to expect disappointment.
                            </p>
                            <p>
                                Karson saw an opportunity to build something different—a
                                landscaping company where reliability wasn&apos;t a bonus, it was the
                                foundation. Where clear communication wasn&apos;t an afterthought, it
                                was part of the service. Where quality work wasn&apos;t luck, it was
                                guaranteed. That vision became Evergrow Landscaping, and it&apos;s
                                guided every decision we&apos;ve made since.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* How We're Different Section */}
            <section className="py-20 bg-gray-50">
                <div className="container mx-auto px-4">
                    <div className="max-w-4xl mx-auto">
                        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-8">
                            How We&apos;re Different
                        </h2>
                        <div className="prose prose-lg max-w-none text-gray-700">
                            <p>
                                We built Evergrow on four principles that still guide us today:
                                craftsmanship, putting customers first, genuine passion for the
                                work, and unwavering professionalism.
                            </p>
                            <p>
                                Here&apos;s what that actually means in practice: When we say we&apos;ll
                                be there Tuesday at 9am, we&apos;re there Tuesday at 9am. When we give
                                you a quote, that&apos;s the price—no hidden fees, no surprise
                                add-ons. When we finish a job, your property looks better than
                                when we arrived, and we&apos;ve cleaned up completely. And when you
                                call or text with a question or concern, we respond within 24
                                hours. Every time.
                            </p>
                            <p>
                                We&apos;re not trying to be the biggest landscaping company in
                                Oklahoma. We&apos;re trying to be the one you trust, the one you
                                recommend to your neighbors, the one you call year after year
                                because you know exactly what you&apos;re going to get. Quality over
                                volume. Relationships over transactions. That&apos;s the Evergreen
                                difference, and it&apos;s why we&apos;re committed to this mission.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Our Values Section */}
            <section className="py-20 bg-white">
                <div className="container mx-auto px-4">
                    <div className="max-w-6xl mx-auto">
                        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-12 text-center">
                            Our Commitment to You
                        </h2>
                        <div className="grid md:grid-cols-2 gap-8">
                            {/* Craftsmanship */}
                            <div className="bg-green-50 p-8 rounded-lg">
                                <h3 className="text-2xl font-bold text-gray-900 mb-4">
                                    Craftsmanship
                                </h3>
                                <p className="text-gray-700 leading-relaxed">
                                    We don&apos;t cut corners. Every lawn, every flower bed, every
                                    project receives the same attention to detail we&apos;d want for our
                                    own homes. Whether it&apos;s a weekly mowing or a complete landscape
                                    installation, we approach each job with the same commitment to
                                    quality. Your property deserves our best work, and that&apos;s
                                    exactly what you&apos;ll get.
                                </p>
                            </div>

                            {/* Customer-Centric */}
                            <div className="bg-green-50 p-8 rounded-lg">
                                <h3 className="text-2xl font-bold text-gray-900 mb-4">
                                    Customer-Centric
                                </h3>
                                <p className="text-gray-700 leading-relaxed">
                                    Your satisfaction isn&apos;t just important—it&apos;s everything. We
                                    listen to your needs, communicate every step of the way, and
                                    make adjustments until you&apos;re completely happy. Have a concern?
                                    We want to hear it. Not satisfied with something? We&apos;ll make it
                                    right. Your peace of mind is part of the service we provide.
                                </p>
                            </div>

                            {/* Passion */}
                            <div className="bg-green-50 p-8 rounded-lg">
                                <h3 className="text-2xl font-bold text-gray-900 mb-4">
                                    Passion
                                </h3>
                                <p className="text-gray-700 leading-relaxed">
                                    We genuinely love what we do. There&apos;s something deeply
                                    satisfying about transforming an overgrown yard into a beautiful
                                    outdoor space, about seeing the pride on a homeowner&apos;s face when
                                    they pull into their driveway. That passion drives us to keep
                                    improving, keep learning, and keep delivering results that make
                                    our customers smile.
                                </p>
                            </div>

                            {/* Professionalism */}
                            <div className="bg-green-50 p-8 rounded-lg">
                                <h3 className="text-2xl font-bold text-gray-900 mb-4">
                                    Professionalism
                                </h3>
                                <p className="text-gray-700 leading-relaxed">
                                    Licensed, insured, and accountable—those aren&apos;t just checkboxes
                                    for us, they&apos;re commitments to you. We show up on time, do the
                                    job right the first time, and respect your property like it&apos;s
                                    our own. When we say we&apos;ll be there, we&apos;re there. When we give
                                    you a price, that&apos;s the price. When we make a promise, we keep
                                    it. That&apos;s professionalism, and it&apos;s non-negotiable.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Why Choose Us Section */}
            <section className="py-20 bg-gray-50">
                <div className="container mx-auto px-4">
                    <div className="max-w-4xl mx-auto">
                        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-12 text-center">
                            Why Homeowners Choose Evergrow
                        </h2>
                        <div className="grid md:grid-cols-2 gap-6">
                            <div className="flex items-start gap-3">
                                <CheckCircle2 className="w-6 h-6 text-green-600 flex-shrink-0 mt-1" />
                                <div>
                                    <h3 className="font-semibold text-gray-900 mb-1">
                                        Family-owned and operated
                                    </h3>
                                    <p className="text-gray-600">
                                        We&apos;re not a franchise or a national chain. You&apos;re working
                                        with real people who live in your community and care about
                                        their reputation.
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-start gap-3">
                                <CheckCircle2 className="w-6 h-6 text-green-600 flex-shrink-0 mt-1" />
                                <div>
                                    <h3 className="font-semibold text-gray-900 mb-1">
                                        Serving Oklahoma Since 2023
                                    </h3>
                                    <p className="text-gray-600">
                                        We know this climate. We know what plants thrive here, when to
                                        fertilize, how to handle Oklahoma&apos;s unpredictable weather.
                                        That experience matters.
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-start gap-3">
                                <CheckCircle2 className="w-6 h-6 text-green-600 flex-shrink-0 mt-1" />
                                <div>
                                    <h3 className="font-semibold text-gray-900 mb-1">
                                        Licensed and insured
                                    </h3>
                                    <p className="text-gray-600">
                                        Your property is protected. If something goes wrong (it rarely
                                        does), you&apos;re covered. No exceptions.
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-start gap-3">
                                <CheckCircle2 className="w-6 h-6 text-green-600 flex-shrink-0 mt-1" />
                                <div>
                                    <h3 className="font-semibold text-gray-900 mb-1">
                                        Background-checked crew
                                    </h3>
                                    <p className="text-gray-600">
                                        Every person who comes to your property has been thoroughly
                                        vetted. Your safety and security matter to us.
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-start gap-3">
                                <CheckCircle2 className="w-6 h-6 text-green-600 flex-shrink-0 mt-1" />
                                <div>
                                    <h3 className="font-semibold text-gray-900 mb-1">
                                        Transparent pricing
                                    </h3>
                                    <p className="text-gray-600">
                                        The quote we give you is the price you pay. No hidden fees, no
                                        surprise charges, no &quot;oh, we forgot to mention&quot; add-ons. Ever.
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-start gap-3">
                                <CheckCircle2 className="w-6 h-6 text-green-600 flex-shrink-0 mt-1" />
                                <div>
                                    <h3 className="font-semibold text-gray-900 mb-1">
                                        24-hour response time
                                    </h3>
                                    <p className="text-gray-600">
                                        Call, text, or email us with a question or concern, and we&apos;ll
                                        respond within 24 hours. Usually much faster. We&apos;re here when
                                        you need us.
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-start gap-3 md:col-span-2">
                                <CheckCircle2 className="w-6 h-6 text-green-600 flex-shrink-0 mt-1" />
                                <div>
                                    <h3 className="font-semibold text-gray-900 mb-1">
                                        Quality guarantee
                                    </h3>
                                    <p className="text-gray-600">
                                        If you&apos;re not happy with our work, we&apos;ll make it right. No
                                        arguments, no excuses. Your satisfaction is our success.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-20 bg-gradient-to-br from-green-600 to-green-700 text-white">
                <div className="container mx-auto px-4">
                    <div className="max-w-3xl mx-auto text-center">
                        <h2 className="text-3xl md:text-4xl font-bold mb-6">
                            Let&apos;s Work Together
                        </h2>
                        <p className="text-xl mb-8 text-green-50">
                            Ready to experience landscaping done right? We&apos;d love to hear
                            about your project and show you what sets Evergrow apart. Whether
                            you need weekly lawn care, a seasonal cleanup, or a complete
                            landscape transformation, we&apos;re here to help.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                            <Link
                                href="/quote-request"
                                className="bg-white text-green-700 px-8 py-4 rounded-lg font-semibold hover:bg-green-50 transition-colors inline-block"
                            >
                                Get Your Free Quote
                            </Link>
                            <a
                                href="tel:+14054795794"
                                className="border-2 border-white text-white px-8 py-4 rounded-lg font-semibold hover:bg-white hover:text-green-700 transition-colors inline-block"
                            >
                                Call Us: 405-479-5794
                            </a>
                        </div>
                        <p className="mt-8 text-green-100">
                            Join the homeowners in El Dorado and Oklahoma City who trust
                            Evergrow for their landscaping needs. We&apos;ve been keeping our
                            promises since day one—let us prove it to you.
                        </p>
                    </div>
                </div>
            </section>
        </div>
    )
}
