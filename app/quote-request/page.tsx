export const metadata = {
    title: 'Request a Quote | Evergrow Landscaping',
    description: 'Get a free quote for professional landscaping services in El Dorado and Oklahoma City. Fast response within 24 hours.',
};

import QuoteForm from '@/components/forms/QuoteForm';

export default function QuoteRequestPage() {
    return (
        <main className="min-h-screen bg-clean-white">
            <div className="container py-16">
                <div className="max-w-2xl mx-auto">
                    <h1 className="text-h1 font-heading text-forest-green mb-4">
                        Request Your Free Quote
                    </h1>
                    <p className="text-lg text-gray-600 mb-8">
                        Tell us about your project and we'll get back to you within 24 hours with a transparent, detailed quote.
                    </p>

                    <div className="card">
                        <QuoteForm />
                    </div>

                    <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="text-center">
                            <div className="w-12 h-12 bg-vibrant-gold rounded-full flex items-center justify-center mx-auto mb-3">
                                <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>
                            <h3 className="font-semibold text-forest-green mb-1">Fast Response</h3>
                            <p className="text-sm text-gray-600">Quote within 24 hours</p>
                        </div>

                        <div className="text-center">
                            <div className="w-12 h-12 bg-vibrant-gold rounded-full flex items-center justify-center mx-auto mb-3">
                                <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>
                            <h3 className="font-semibold text-forest-green mb-1">Transparent Pricing</h3>
                            <p className="text-sm text-gray-600">No hidden fees</p>
                        </div>

                        <div className="text-center">
                            <div className="w-12 h-12 bg-vibrant-gold rounded-full flex items-center justify-center mx-auto mb-3">
                                <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                                </svg>
                            </div>
                            <h3 className="font-semibold text-forest-green mb-1">Licensed & Insured</h3>
                            <p className="text-sm text-gray-600">Professional team</p>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
}
