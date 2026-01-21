'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function QuoteForm() {
    const router = useRouter();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
    const [errorMessage, setErrorMessage] = useState('');
    const [outsideArea, setOutsideArea] = useState(false);

    const checkServiceArea = async (zipCode: string) => {
        if (zipCode.length === 5) {
            try {
                const res = await fetch(`/api/service-area/check/${zipCode}`);
                const data: any = await res.json();
                if (data.success && !data.serviced) {
                    setOutsideArea(true);
                } else {
                    setOutsideArea(false);
                }
            } catch (error) {
                console.error('Failed to check service area', error);
            }
        }
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsSubmitting(true);
        setErrorMessage('');
        setSubmitStatus('idle');

        const formData = new FormData(e.currentTarget);
        const data = Object.fromEntries(formData.entries());

        try {
            const res = await fetch('/api/quotes/request', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
            });

            const result: any = await res.json();

            if (!res.ok) {
                throw new Error(result.error || 'Failed to submit quote request');
            }

            setSubmitStatus('success');
            // Optional: Reset form or redirect
            // e.currentTarget.reset();
        } catch (error: any) {
            setSubmitStatus('error');
            setErrorMessage(error.message || 'Something went wrong. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    if (submitStatus === 'success') {
        return (
            <div className="text-center py-12">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8 text-forest-green" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                </div>
                <h3 className="text-2xl font-bold text-forest-green mb-2">Quote Request Received!</h3>
                <p className="text-gray-600 mb-6">
                    Thank you for contacting Evergrow Landscaping. We have received your request and will get back to you with a detailed quote within 24 hours.
                </p>
                <button
                    onClick={() => window.location.reload()}
                    className="inline-flex items-center justify-center px-6 py-3 rounded-lg bg-vibrant-gold text-deep-charcoal font-semibold hover:bg-yellow-400 transition-colors"
                >
                    Submit Another Request
                </button>
            </div>
        );
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <label htmlFor="name" className="block text-sm font-semibold text-deep-charcoal mb-2">
                        Name *
                    </label>
                    <input
                        type="text"
                        id="name"
                        name="name"
                        required
                        className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-vibrant-gold focus:ring-2 focus:ring-vibrant-gold/20 outline-none transition-colors"
                    />
                </div>

                <div>
                    <label htmlFor="email" className="block text-sm font-semibold text-deep-charcoal mb-2">
                        Email *
                    </label>
                    <input
                        type="email"
                        id="email"
                        name="email"
                        required
                        className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-vibrant-gold focus:ring-2 focus:ring-vibrant-gold/20 outline-none transition-colors"
                    />
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <label htmlFor="phone" className="block text-sm font-semibold text-deep-charcoal mb-2">
                        Phone
                    </label>
                    <input
                        type="tel"
                        id="phone"
                        name="phone"
                        className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-vibrant-gold focus:ring-2 focus:ring-vibrant-gold/20 outline-none transition-colors"
                    />
                </div>

                <div>
                    <label htmlFor="service_type" className="block text-sm font-semibold text-deep-charcoal mb-2">
                        Service Type *
                    </label>
                    <select
                        id="service_type"
                        name="service_type"
                        required
                        className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-vibrant-gold focus:ring-2 focus:ring-vibrant-gold/20 outline-none transition-colors"
                    >
                        <option value="">Select a service</option>
                        <option value="lawn-care">Lawn Care & Maintenance</option>
                        <option value="flower-beds">Flower Bed Design</option>
                        <option value="seasonal-cleanup">Seasonal Cleanup</option>
                        <option value="pressure-washing">Pressure Washing</option>
                        <option value="other">Other</option>
                    </select>
                </div>
            </div>

            <div>
                <label htmlFor="address" className="block text-sm font-semibold text-deep-charcoal mb-2">
                    Property Address
                </label>
                <input
                    type="text"
                    id="address"
                    name="address"
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-vibrant-gold focus:ring-2 focus:ring-vibrant-gold/20 outline-none transition-colors"
                />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <label htmlFor="city" className="block text-sm font-semibold text-deep-charcoal mb-2">
                        City
                    </label>
                    <input
                        type="text"
                        id="city"
                        name="city"
                        className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-vibrant-gold focus:ring-2 focus:ring-vibrant-gold/20 outline-none transition-colors"
                    />
                </div>

                <div>
                    <label htmlFor="zip_code" className="block text-sm font-semibold text-deep-charcoal mb-2">
                        Zip Code
                    </label>
                    <input
                        type="text"
                        id="zip_code"
                        name="zip_code"
                        onBlur={(e) => checkServiceArea(e.target.value)}
                        className={`w-full px-4 py-3 rounded-lg border ${outsideArea ? 'border-red-500 ring-2 ring-red-200' : 'border-gray-300 focus:border-vibrant-gold focus:ring-2 focus:ring-vibrant-gold/20'} outline-none transition-colors`}
                    />
                    {outsideArea && (
                        <p className="mt-1 text-sm text-red-600">
                            Note: We may not service this area. Please submit anyway or call us to confirm.
                        </p>
                    )}
                </div>
            </div>

            <div>
                <label htmlFor="description" className="block text-sm font-semibold text-deep-charcoal mb-2">
                    Project Description *
                </label>
                <textarea
                    id="description"
                    name="description"
                    required
                    rows={6}
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-vibrant-gold focus:ring-2 focus:ring-vibrant-gold/20 outline-none transition-colors resize-none"
                    placeholder="Tell us about your project, property size, and any specific requirements..."
                ></textarea>
            </div>

            {submitStatus === 'error' && (
                <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
                    {errorMessage}
                </div>
            )}

            <div className="flex flex-col sm:flex-row gap-4">
                <button
                    type="submit"
                    disabled={isSubmitting}
                    className="inline-flex items-center justify-center px-8 py-4 rounded-lg bg-vibrant-gold text-deep-charcoal font-semibold hover:bg-yellow-400 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {isSubmitting ? (
                        <span className="flex items-center">
                            <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-deep-charcoal" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            Processing...
                        </span>
                    ) : (
                        'Submit Quote Request'
                    )}
                </button>
                <a
                    href="tel:+14054795794"
                    className="inline-flex items-center justify-center px-8 py-4 rounded-lg border-2 border-forest-green text-forest-green font-semibold hover:bg-forest-green hover:text-white transition-colors"
                >
                    Or Call: (405) 479-5794
                </a>
            </div>

            <p className="text-sm text-gray-600">
                * Required fields. We'll respond within 24 hours with a detailed quote.
            </p>
        </form>
    );
}
