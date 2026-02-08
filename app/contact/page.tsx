import { ContactForm } from '@/components/contact/ContactForm'
import { ContactInfo } from '@/components/contact/ContactInfo'

export default function ContactPage() {
    return (
        <main>
            {/* Hero Section */}
            <section className="relative bg-gradient-to-r from-forest-green to-forest-green-600 py-16">
                <div className="container">
                    <div className="max-w-3xl mx-auto text-center text-white">
                        <h1 className="text-h1 font-heading font-bold mb-4">
                            Get in Touch
                        </h1>
                        <p className="text-xl">
                            Have a question? Need a quote? We're here to help.
                        </p>
                    </div>
                </div>
            </section>

            {/* Contact Section */}
            <section className="section">
                <div className="container">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                        {/* Contact Form */}
                        <div>
                            <h2 className="text-h2 font-heading text-forest-green mb-4">
                                Send Us a Message
                            </h2>
                            <p className="text-gray-600 mb-6">
                                Fill out the form below and we'll get back to you within 24 hours.
                            </p>
                            <ContactForm />
                        </div>

                        {/* Contact Info */}
                        <div>
                            <ContactInfo />
                        </div>
                    </div>
                </div>
            </section>

            {/* Map Section (Optional) */}
            <section className="section section-alt">
                <div className="container">
                    <h2 className="text-h2 font-heading text-forest-green mb-8 text-center">
                        Our Service Areas
                    </h2>
                    <div className="max-w-4xl mx-auto">
                        {/* Placeholder for Google Maps embed or service area visualization */}
                        <div className="bg-gray-200 rounded-lg h-96 flex items-center justify-center">
                            <p className="text-gray-500">Service Area Map Placeholder</p>
                        </div>
                    </div>
                </div>
            </section>
        </main>
    )
}

export const metadata = {
    title: 'Contact Us | Evergrow Landscaping',
    description: 'Contact Evergrow Landscaping for a free quote. Serving El Dorado, AR and Oklahoma City, OK. Phone, email, or contact form available.',
}
