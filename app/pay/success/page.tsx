'use client'

import { useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { CheckCircle } from 'lucide-react'

export default function GuestPaymentSuccessPage() {
    const searchParams = useSearchParams()
    const sessionId = searchParams.get('session_id')
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        // Give some time for webhook to process
        const timer = setTimeout(() => {
            setLoading(false)
        }, 2000)
        return () => clearTimeout(timer)
    }, [])

    if (loading) {
        return (
            <main>
                <section className="relative bg-gradient-to-r from-forest-green to-forest-green-600 py-16">
                    <div className="container">
                        <div className="max-w-3xl mx-auto text-center text-white">
                            <h1 className="text-h1 font-heading font-bold mb-4">Processing Payment</h1>
                        </div>
                    </div>
                </section>
                <section className="section">
                    <div className="container">
                        <div className="max-w-md mx-auto text-center py-12">
                            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-hopeful-teal"></div>
                            <p className="mt-4 text-gray-600">Processing your payment...</p>
                        </div>
                    </div>
                </section>
            </main>
        )
    }

    return (
        <main>
            <section className="relative bg-gradient-to-r from-forest-green to-forest-green-600 py-16">
                <div className="container">
                    <div className="max-w-3xl mx-auto text-center text-white">
                        <h1 className="text-h1 font-heading font-bold mb-4">Payment Successful</h1>
                    </div>
                </div>
            </section>

            <section className="section">
                <div className="container">
                    <div className="max-w-md mx-auto bg-white shadow-lg rounded-lg p-8 text-center">
                        <div className="flex justify-center mb-4">
                            <CheckCircle className="h-16 w-16 text-green-500" />
                        </div>
                        <h2 className="text-2xl font-bold text-gray-900 mb-2">Thank You!</h2>
                        <p className="text-gray-600 mb-6">
                            Your payment has been processed successfully. A receipt has been sent to your email address.
                        </p>
                        {sessionId && (
                            <p className="text-xs text-gray-400 mb-6">
                                Transaction ID: {sessionId}
                            </p>
                        )}
                        <div className="space-y-3">
                            <Link
                                href="/pay"
                                className="block w-full bg-hopeful-teal text-white py-2.5 px-4 rounded-md font-semibold hover:bg-hopeful-teal/90 transition-colors"
                            >
                                Pay Another Invoice
                            </Link>
                            <Link
                                href="/"
                                className="block w-full bg-gray-100 text-gray-700 py-2.5 px-4 rounded-md font-semibold hover:bg-gray-200 transition-colors"
                            >
                                Return to Home
                            </Link>
                        </div>
                    </div>
                </div>
            </section>
        </main>
    )
}
