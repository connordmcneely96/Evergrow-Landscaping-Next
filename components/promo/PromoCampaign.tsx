'use client'

import { Fragment, useEffect, useState } from 'react'
import { Dialog, Transition } from '@headlessui/react'
import Image from 'next/image'
import { X, CheckCircle } from 'lucide-react'
import { Modal } from '@/components/ui/Modal'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { usePromo } from '@/contexts/PromoContext'

const PROMO_IMAGE = '/api/assets/promo-lawn-maintenance.png'
const SESSION_KEY = 'evergrow_promo_seen'
const AUTO_OPEN_DELAY_MS = 1200

export default function PromoCampaign() {
    const { isLeadFormOpen, openLeadForm, closeLeadForm } = usePromo()

    const [isPopupOpen, setIsPopupOpen] = useState(false)

    // Lead form state
    const [email, setEmail] = useState('')
    const [phone, setPhone] = useState('')
    const [website, setWebsite] = useState('') // honeypot
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [isSubmitted, setIsSubmitted] = useState(false)

    // Auto-open the entry popup once per session.
    useEffect(() => {
        if (typeof window === 'undefined') return
        let timer: ReturnType<typeof setTimeout> | undefined

        try {
            if (!sessionStorage.getItem(SESSION_KEY)) {
                timer = setTimeout(() => {
                    setIsPopupOpen(true)
                    sessionStorage.setItem(SESSION_KEY, '1')
                }, AUTO_OPEN_DELAY_MS)
            }
        } catch {
            // sessionStorage may be unavailable (private mode); skip auto-open.
        }

        return () => {
            if (timer) clearTimeout(timer)
        }
    }, [])

    function handleOpenLeadForm() {
        setIsPopupOpen(false)
        openLeadForm()
    }

    function handleCloseLeadForm() {
        closeLeadForm()
        // Reset transient state after the close transition.
        setTimeout(() => {
            setIsSubmitted(false)
            setError(null)
        }, 250)
    }

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault()
        setError(null)
        setIsSubmitting(true)

        try {
            const res = await fetch('/api/promo/lead', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, phone, website }),
            })

            const data = (await res.json().catch(() => null)) as
                | { success?: boolean; error?: string }
                | null

            if (!res.ok || !data?.success) {
                setError(
                    (data && data.error) ||
                    'Something went wrong. Please try again.'
                )
                return
            }

            setIsSubmitted(true)
            setEmail('')
            setPhone('')
        } catch {
            setError('Network error. Please check your connection and try again.')
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <>
            {/* Entry popup — wide modal showing the promo banner */}
            <Transition appear show={isPopupOpen} as={Fragment}>
                <Dialog as="div" className="relative z-50" onClose={() => setIsPopupOpen(false)}>
                    <Transition.Child
                        as={Fragment}
                        enter="ease-out duration-300"
                        enterFrom="opacity-0"
                        enterTo="opacity-100"
                        leave="ease-in duration-200"
                        leaveFrom="opacity-100"
                        leaveTo="opacity-0"
                    >
                        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" />
                    </Transition.Child>

                    <div className="fixed inset-0 overflow-y-auto">
                        <div className="flex min-h-full items-center justify-center p-4 text-center">
                            <Transition.Child
                                as={Fragment}
                                enter="ease-out duration-300"
                                enterFrom="opacity-0 scale-95"
                                enterTo="opacity-100 scale-100"
                                leave="ease-in duration-200"
                                leaveFrom="opacity-100 scale-100"
                                leaveTo="opacity-0 scale-95"
                            >
                                <Dialog.Panel className="relative w-full max-w-3xl transform overflow-hidden rounded-2xl bg-white text-left align-middle shadow-xl transition-all">
                                    <button
                                        type="button"
                                        onClick={() => setIsPopupOpen(false)}
                                        aria-label="Close promotion"
                                        className="absolute right-3 top-3 z-10 rounded-full bg-white/90 p-1.5 text-deep-charcoal shadow hover:bg-white transition-colors"
                                    >
                                        <X className="h-5 w-5" />
                                    </button>

                                    <button
                                        type="button"
                                        onClick={handleOpenLeadForm}
                                        aria-label="View lawn maintenance offer details and sign up"
                                        className="block w-full cursor-pointer"
                                    >
                                        <Image
                                            src={PROMO_IMAGE}
                                            alt="Evergrow Landscaping lawn maintenance promotion"
                                            width={1640}
                                            height={1000}
                                            priority
                                            className="h-auto w-full"
                                        />
                                    </button>

                                    <div className="p-6 text-center">
                                        <Button
                                            type="button"
                                            size="lg"
                                            onClick={handleOpenLeadForm}
                                            className="w-full sm:w-auto"
                                        >
                                            View Details &amp; Sign Up
                                        </Button>
                                    </div>
                                </Dialog.Panel>
                            </Transition.Child>
                        </div>
                    </div>
                </Dialog>
            </Transition>

            {/* Lead-capture form modal */}
            <Modal
                isOpen={isLeadFormOpen}
                onClose={handleCloseLeadForm}
                title={isSubmitted ? '' : 'Claim Your Lawn Maintenance Offer'}
            >
                {isSubmitted ? (
                    <div className="py-4 text-center">
                        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-vibrant-gold-50">
                            <CheckCircle className="h-10 w-10 text-forest-green" />
                        </div>
                        <h3 className="mb-2 font-heading text-2xl font-bold text-forest-green">
                            You&apos;re all set!
                        </h3>
                        <p className="mb-6 text-gray-600">
                            Evergrow will be in contact with you within 72 hours.
                        </p>
                        <Button type="button" variant="secondary" onClick={handleCloseLeadForm}>
                            Done
                        </Button>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <p className="text-sm text-gray-600">
                            Drop your email and phone number and our team will reach out
                            with your personalized lawn maintenance offer.
                        </p>

                        <Input
                            type="email"
                            label="Email"
                            placeholder="you@example.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            autoComplete="email"
                            required
                        />

                        <Input
                            type="tel"
                            label="Phone"
                            placeholder="(405) 479-5794"
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                            autoComplete="tel"
                            required
                        />

                        {/* Honeypot — hidden from real users */}
                        <div
                            aria-hidden="true"
                            className="absolute h-0 w-0 overflow-hidden opacity-0"
                            style={{ position: 'absolute', left: '-9999px' }}
                        >
                            <label htmlFor="promo-website">Leave this field empty</label>
                            <input
                                id="promo-website"
                                name="website"
                                type="text"
                                tabIndex={-1}
                                autoComplete="off"
                                value={website}
                                onChange={(e) => setWebsite(e.target.value)}
                            />
                        </div>

                        {error && (
                            <p className="text-sm font-medium text-red-600" role="alert">
                                {error}
                            </p>
                        )}

                        <Button
                            type="submit"
                            size="lg"
                            isLoading={isSubmitting}
                            className="w-full"
                        >
                            {isSubmitting ? 'Submitting…' : 'Claim My Offer'}
                        </Button>

                        <p className="text-center text-xs text-gray-400">
                            We respect your privacy. No spam, ever.
                        </p>
                    </form>
                )}
            </Modal>
        </>
    )
}
