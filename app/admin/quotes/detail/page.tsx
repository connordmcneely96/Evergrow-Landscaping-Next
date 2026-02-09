'use client'

import { Suspense, useEffect, useState } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { useToast } from '@/components/ui/Toast'
import { fetchWithAuth } from '@/lib/auth'
import { formatCurrency, formatDate } from '@/lib/utils'

interface Quote {
    id: number
    customerId: number | null
    customerName: string | null
    customerEmail: string | null
    customerPhone: string | null
    customerAddress: string | null
    serviceType: string
    serviceName: string
    propertySize: string | null
    description: string | null
    photoUrls: string[]
    quotedAmount: number | null
    status: string
    statusDisplay: string
    createdAt: string
    acceptedAt: string | null
    daysWaiting: number
    needsResponse: boolean
}

const STATUS_BADGE: Record<string, 'warning' | 'info' | 'success' | 'destructive' | 'secondary'> = {
    pending: 'warning',
    quoted: 'info',
    accepted: 'success',
    declined: 'destructive',
    expired: 'secondary',
    converted: 'success',
}

const PROPERTY_SIZE_LABELS: Record<string, string> = {
    small: 'Small (under 5,000 sq ft)',
    medium: 'Medium (5,000 - 10,000 sq ft)',
    large: 'Large (10,000+ sq ft)',
    commercial: 'Commercial',
}

function QuoteDetailContent() {
    const searchParams = useSearchParams()
    const router = useRouter()
    const { addToast } = useToast()
    const quoteId = searchParams.get('id')

    const [quote, setQuote] = useState<Quote | null>(null)
    const [loading, setLoading] = useState(true)
    const [submitting, setSubmitting] = useState(false)
    const [lightboxImg, setLightboxImg] = useState<string | null>(null)

    // Form state
    const [quotedAmount, setQuotedAmount] = useState('')
    const [notes, setNotes] = useState('')
    const [timeline, setTimeline] = useState('')
    const [terms, setTerms] = useState('')
    const [formErrors, setFormErrors] = useState<Record<string, string>>({})

    useEffect(() => {
        if (!quoteId) {
            setLoading(false)
            return
        }

        async function loadQuote() {
            try {
                const res = await fetchWithAuth(`/api/admin/quotes?limit=100`)
                if (res.ok) {
                    const data = await res.json() as any
                    if (data.success) {
                        const found = data.quotes.find((q: Quote) => q.id === Number(quoteId))
                        if (found) {
                            setQuote(found)
                        }
                    }
                }
            } catch (err) {
                console.error('Failed to load quote:', err)
            } finally {
                setLoading(false)
            }
        }

        loadQuote()
    }, [quoteId])

    const validateForm = (): boolean => {
        const errors: Record<string, string> = {}
        const amount = parseFloat(quotedAmount)
        if (!quotedAmount || isNaN(amount)) {
            errors.quotedAmount = 'Please enter a valid amount'
        } else if (amount < 50) {
            errors.quotedAmount = 'Minimum quote amount is $50'
        } else if (amount > 10000) {
            errors.quotedAmount = 'Maximum quote amount is $10,000'
        }
        setFormErrors(errors)
        return Object.keys(errors).length === 0
    }

    const handleSendQuote = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!validateForm()) return

        setSubmitting(true)
        try {
            const res = await fetchWithAuth(`/api/admin/quotes/${quoteId}`, {
                method: 'PUT',
                body: JSON.stringify({
                    quotedAmount: parseFloat(quotedAmount),
                    notes: notes || undefined,
                    timeline: timeline || undefined,
                    terms: terms || undefined,
                }),
            })

            const data = await res.json() as any

            if (!res.ok || !data.success) {
                throw new Error(data.error || 'Failed to send quote')
            }

            addToast({ type: 'success', message: data.emailSent ? 'Quote sent to customer via email!' : 'Quote saved (email could not be sent)' })
            router.push('/admin/quotes')
        } catch (err) {
            addToast({ type: 'error', message: err instanceof Error ? err.message : 'Failed to send quote' })
        } finally {
            setSubmitting(false)
        }
    }

    if (loading) {
        return (
            <div className="space-y-6">
                <div className="h-6 bg-gray-800 rounded w-32 animate-pulse" />
                <div className="h-64 bg-gray-900 rounded-xl border border-gray-800 animate-pulse" />
            </div>
        )
    }

    if (!quoteId || !quote) {
        return (
            <div className="text-center py-16">
                <p className="text-gray-500 mb-4">Quote not found</p>
                <Link href="/admin/quotes">
                    <Button variant="outline">Back to Quotes</Button>
                </Link>
            </div>
        )
    }

    return (
        <div className="space-y-6 max-w-4xl">
            {/* Breadcrumb */}
            <nav className="flex items-center gap-2 text-sm text-gray-500">
                <Link href="/admin" className="hover:text-white">Dashboard</Link>
                <span>/</span>
                <Link href="/admin/quotes" className="hover:text-white">Quotes</Link>
                <span>/</span>
                <span className="text-white">#{quote.id}</span>
            </nav>

            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                    <div className="flex items-center gap-3">
                        <h1 className="text-2xl font-bold text-white">Quote #{quote.id}</h1>
                        <Badge variant={STATUS_BADGE[quote.status] || 'secondary'} className="text-sm">
                            {quote.statusDisplay}
                        </Badge>
                    </div>
                    <p className="text-sm text-gray-500 mt-1">
                        Received {formatDate(quote.createdAt)}
                        {quote.daysWaiting > 0 && ` (${quote.daysWaiting} day${quote.daysWaiting !== 1 ? 's' : ''} ago)`}
                    </p>
                </div>
            </div>

            {/* Urgency banner */}
            {quote.needsResponse && (
                <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-3 flex items-center gap-2 text-sm text-red-400">
                    <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse flex-shrink-0" />
                    This quote has been waiting {quote.daysWaiting} day{quote.daysWaiting !== 1 ? 's' : ''} for a response
                </div>
            )}

            <div className="grid lg:grid-cols-5 gap-6">
                {/* Left column - Quote details */}
                <div className="lg:col-span-3 space-y-6">
                    {/* Customer info */}
                    <section className="bg-gray-900 rounded-xl border border-gray-800 overflow-hidden">
                        <div className="px-5 py-3 bg-gray-800 border-b border-gray-700">
                            <h2 className="font-semibold text-white text-sm">Customer Information</h2>
                        </div>
                        <div className="p-5 grid sm:grid-cols-2 gap-4">
                            <div>
                                <p className="text-xs text-gray-500 mb-0.5">Name</p>
                                <p className="text-sm font-medium text-white">{quote.customerName || '—'}</p>
                            </div>
                            <div>
                                <p className="text-xs text-gray-500 mb-0.5">Email</p>
                                {quote.customerEmail ? (
                                    <a href={`mailto:${quote.customerEmail}`} className="text-sm font-medium text-ocean-blue hover:underline">{quote.customerEmail}</a>
                                ) : <p className="text-sm text-gray-400">—</p>}
                            </div>
                            <div>
                                <p className="text-xs text-gray-500 mb-0.5">Phone</p>
                                {quote.customerPhone ? (
                                    <a href={`tel:${quote.customerPhone}`} className="text-sm font-medium text-ocean-blue hover:underline">{quote.customerPhone}</a>
                                ) : <p className="text-sm text-gray-400">—</p>}
                            </div>
                            <div>
                                <p className="text-xs text-gray-500 mb-0.5">Address</p>
                                <p className="text-sm text-white">{quote.customerAddress || '—'}</p>
                            </div>
                        </div>
                    </section>

                    {/* Service details */}
                    <section className="bg-gray-900 rounded-xl border border-gray-800 overflow-hidden">
                        <div className="px-5 py-3 bg-gray-800 border-b border-gray-700">
                            <h2 className="font-semibold text-white text-sm">Service Details</h2>
                        </div>
                        <div className="p-5 space-y-4">
                            <div className="grid sm:grid-cols-2 gap-4">
                                <div>
                                    <p className="text-xs text-gray-500 mb-0.5">Service Type</p>
                                    <p className="text-sm font-medium text-white">{quote.serviceName}</p>
                                </div>
                                <div>
                                    <p className="text-xs text-gray-500 mb-0.5">Property Size</p>
                                    <p className="text-sm text-white">{PROPERTY_SIZE_LABELS[quote.propertySize || ''] || '—'}</p>
                                </div>
                            </div>
                            {quote.description && (
                                <div>
                                    <p className="text-xs text-gray-500 mb-1">Description</p>
                                    <p className="text-sm text-gray-300 bg-gray-800 rounded-lg p-3 whitespace-pre-wrap">{quote.description}</p>
                                </div>
                            )}
                        </div>
                    </section>

                    {/* Photos */}
                    {quote.photoUrls.length > 0 && (
                        <section className="bg-gray-900 rounded-xl border border-gray-800 overflow-hidden">
                            <div className="px-5 py-3 bg-gray-800 border-b border-gray-700">
                                <h2 className="font-semibold text-white text-sm">Photos ({quote.photoUrls.length})</h2>
                            </div>
                            <div className="p-5 grid grid-cols-2 sm:grid-cols-3 gap-3">
                                {quote.photoUrls.map((url, idx) => (
                                    <button
                                        key={idx}
                                        onClick={() => setLightboxImg(url)}
                                        className="relative aspect-square rounded-lg overflow-hidden border border-gray-700 hover:border-ocean-blue transition-colors"
                                    >
                                        <Image src={url} alt={`Quote photo ${idx + 1}`} fill className="object-cover" sizes="200px" />
                                    </button>
                                ))}
                            </div>
                        </section>
                    )}

                    {/* Lightbox */}
                    {lightboxImg && (
                        <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4" onClick={() => setLightboxImg(null)}>
                            <div className="relative max-w-3xl max-h-[80vh] w-full">
                                <Image src={lightboxImg} alt="Quote photo" fill className="object-contain" sizes="100vw" />
                            </div>
                            <button className="absolute top-4 right-4 text-white bg-black/50 rounded-full w-10 h-10 flex items-center justify-center text-xl hover:bg-black/70" onClick={() => setLightboxImg(null)}>
                                &times;
                            </button>
                        </div>
                    )}
                </div>

                {/* Right column - Actions */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Already quoted */}
                    {quote.status !== 'pending' && (
                        <div className="bg-gray-900 rounded-xl border border-gray-800 p-5">
                            <h2 className="font-semibold text-white mb-3">Quote Status</h2>
                            <div className="space-y-3 text-sm">
                                <div className="flex justify-between">
                                    <span className="text-gray-500">Status</span>
                                    <Badge variant={STATUS_BADGE[quote.status] || 'secondary'}>{quote.statusDisplay}</Badge>
                                </div>
                                {quote.quotedAmount !== null && (
                                    <div className="flex justify-between">
                                        <span className="text-gray-500">Quoted Amount</span>
                                        <span className="font-semibold text-white">{formatCurrency(quote.quotedAmount)}</span>
                                    </div>
                                )}
                                {quote.acceptedAt && (
                                    <div className="flex justify-between">
                                        <span className="text-gray-500">Accepted</span>
                                        <span className="text-white">{formatDate(quote.acceptedAt)}</span>
                                    </div>
                                )}
                                {quote.status === 'accepted' && (
                                    <div className="pt-2 border-t border-gray-800">
                                        <p className="text-xs text-gray-500 mb-2">Ready to schedule this project?</p>
                                        <Link href="/admin/projects">
                                            <Button variant="primary" size="sm" className="w-full">Create Project</Button>
                                        </Link>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    {/* Send Quote form */}
                    {quote.status === 'pending' && (
                        <form onSubmit={handleSendQuote} className="bg-gray-900 rounded-xl border border-gray-800 overflow-hidden">
                            <div className="px-5 py-3 bg-forest-green border-b">
                                <h2 className="font-semibold text-white text-sm">Send Quote to Customer</h2>
                            </div>
                            <div className="p-5 space-y-4">
                                {/* Amount */}
                                <div>
                                    <label htmlFor="amount" className="block text-sm font-medium text-gray-300 mb-1">
                                        Quoted Amount <span className="text-red-500">*</span>
                                    </label>
                                    <div className="relative">
                                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">$</span>
                                        <input
                                            id="amount"
                                            type="number"
                                            step="0.01"
                                            min="50"
                                            max="10000"
                                            placeholder="0.00"
                                            value={quotedAmount}
                                            onChange={(e) => { setQuotedAmount(e.target.value); setFormErrors({}) }}
                                            className={`w-full pl-8 pr-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-ocean-blue focus:border-transparent bg-gray-800 text-white placeholder-gray-500 ${
                                                formErrors.quotedAmount ? 'border-red-300 bg-red-50' : 'border-gray-700'
                                            }`}
                                        />
                                    </div>
                                    {formErrors.quotedAmount && (
                                        <p className="text-xs text-red-600 mt-1">{formErrors.quotedAmount}</p>
                                    )}
                                </div>

                                {/* Notes */}
                                <div>
                                    <label htmlFor="notes" className="block text-sm font-medium text-gray-300 mb-1">
                                        Notes for Customer
                                    </label>
                                    <textarea
                                        id="notes"
                                        rows={3}
                                        placeholder="Describe what's included, any conditions..."
                                        value={notes}
                                        onChange={(e) => setNotes(e.target.value)}
                                        className="w-full px-3 py-2 border border-gray-700 bg-gray-800 text-white placeholder-gray-500 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-ocean-blue focus:border-transparent resize-none"
                                    />
                                </div>

                                {/* Timeline */}
                                <div>
                                    <label htmlFor="timeline" className="block text-sm font-medium text-gray-300 mb-1">
                                        Estimated Timeline
                                    </label>
                                    <input
                                        id="timeline"
                                        type="text"
                                        placeholder='e.g., "2-3 hours" or "1 full day"'
                                        value={timeline}
                                        onChange={(e) => setTimeline(e.target.value)}
                                        className="w-full px-3 py-2 border border-gray-700 bg-gray-800 text-white placeholder-gray-500 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-ocean-blue focus:border-transparent"
                                    />
                                </div>

                                {/* Terms */}
                                <div>
                                    <label htmlFor="terms" className="block text-sm font-medium text-gray-300 mb-1">
                                        Special Terms
                                    </label>
                                    <input
                                        id="terms"
                                        type="text"
                                        placeholder="e.g., 50% deposit required"
                                        value={terms}
                                        onChange={(e) => setTerms(e.target.value)}
                                        className="w-full px-3 py-2 border border-gray-700 bg-gray-800 text-white placeholder-gray-500 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-ocean-blue focus:border-transparent"
                                    />
                                </div>

                                {/* Info */}
                                <div className="bg-ocean-blue/10 border border-ocean-blue/30 rounded-lg p-3 text-xs text-ocean-blue">
                                    <p className="font-medium mb-1">What happens when you send:</p>
                                    <ul className="list-disc list-inside space-y-0.5">
                                        <li>Customer receives an email with pricing details</li>
                                        <li>They get a link to accept the quote online</li>
                                        <li>Quote is valid for 30 days</li>
                                    </ul>
                                </div>

                                {/* Submit */}
                                <Button
                                    type="submit"
                                    variant="primary"
                                    size="md"
                                    isLoading={submitting}
                                    className="w-full bg-forest-green hover:bg-forest-green-400 text-white"
                                >
                                    Send Quote to {quote.customerName || 'Customer'}
                                </Button>
                            </div>
                        </form>
                    )}

                    {/* Quick contact */}
                    <div className="bg-gray-900 rounded-xl border border-gray-800 p-5">
                        <h3 className="font-semibold text-white text-sm mb-3">Quick Contact</h3>
                        <div className="space-y-2">
                            {quote.customerPhone && (
                                <a href={`tel:${quote.customerPhone}`} className="flex items-center gap-2 text-sm text-ocean-blue hover:underline">
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" />
                                    </svg>
                                    {quote.customerPhone}
                                </a>
                            )}
                            {quote.customerEmail && (
                                <a href={`mailto:${quote.customerEmail}`} className="flex items-center gap-2 text-sm text-ocean-blue hover:underline">
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
                                    </svg>
                                    {quote.customerEmail}
                                </a>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default function AdminQuoteDetailPage() {
    return (
        <Suspense fallback={
            <div className="space-y-6">
                <div className="h-6 bg-gray-800 rounded w-32 animate-pulse" />
                <div className="h-64 bg-gray-900 rounded-xl border border-gray-800 animate-pulse" />
            </div>
        }>
            <QuoteDetailContent />
        </Suspense>
    )
}
