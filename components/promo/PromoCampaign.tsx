'use client'

import { Fragment, useEffect, useState } from 'react'
import { Dialog, Transition } from '@headlessui/react'
import Image from 'next/image'
import { X, CheckCircle } from 'lucide-react'
import { Modal } from '@/components/ui/Modal'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { usePromo } from '@/contexts/PromoContext'
import SignaturePad from '@/components/promo/SignaturePad'
import {
    TITLE,
    SERVICE_PROVIDER,
    AUTHORIZE_SENTENCE,
    TERMS,
    CHECKBOX_LABEL,
} from '@/functions/lib/contract'

const PROMO_IMAGE = '/api/assets/promo-lawn-maintenance.png'
const SESSION_KEY = 'evergrow_promo_seen'
const AUTO_OPEN_DELAY_MS = 1200

type Step = 'lead' | 'contract' | 'done'

function todayIso() {
    return new Date().toISOString().slice(0, 10)
}

export default function PromoCampaign() {
    const { isLeadFormOpen, openLeadForm, closeLeadForm } = usePromo()

    const [isPopupOpen, setIsPopupOpen] = useState(false)
    const [step, setStep] = useState<Step>('lead')

    // Shared / lead state
    const [email, setEmail] = useState('')
    const [phone, setPhone] = useState('')
    const [website, setWebsite] = useState('') // honeypot
    const [promoLeadId, setPromoLeadId] = useState<number | null>(null)

    // Contract state
    const [customerName, setCustomerName] = useState('')
    const [serviceAddress, setServiceAddress] = useState('')
    const [agreedToTerms, setAgreedToTerms] = useState(false)
    const [signatureDataUrl, setSignatureDataUrl] = useState<string | null>(null)
    const [printedName, setPrintedName] = useState('')
    const [signedDate, setSignedDate] = useState(todayIso())

    const [isSubmitting, setIsSubmitting] = useState(false)
    const [error, setError] = useState<string | null>(null)

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

    function handleClose() {
        closeLeadForm()
        // Reset transient state after the close transition.
        setTimeout(() => {
            setStep('lead')
            setError(null)
        }, 250)
    }

    async function handleLeadSubmit(e: React.FormEvent) {
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
                | { success?: boolean; error?: string; promoLeadId?: number | null }
                | null

            if (!res.ok || !data?.success) {
                setError(
                    (data && data.error) ||
                    'Something went wrong. Please try again.'
                )
                return
            }

            setPromoLeadId(data.promoLeadId ?? null)
            setStep('contract')
        } catch {
            setError('Network error. Please check your connection and try again.')
        } finally {
            setIsSubmitting(false)
        }
    }

    const canSubmitContract =
        customerName.trim().length > 0 &&
        serviceAddress.trim().length > 0 &&
        printedName.trim().length > 0 &&
        agreedToTerms &&
        !!signatureDataUrl

    async function handleAgreementSubmit(e: React.FormEvent) {
        e.preventDefault()
        if (!canSubmitContract) return
        setError(null)
        setIsSubmitting(true)

        try {
            const res = await fetch('/api/promo/agreement', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    customerName,
                    serviceAddress,
                    phone,
                    email,
                    agreedToTerms,
                    printedName,
                    signedDate,
                    signatureDataUrl,
                    promoLeadId,
                    website,
                }),
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

            setStep('done')
        } catch {
            setError('Network error. Please check your connection and try again.')
        } finally {
            setIsSubmitting(false)
        }
    }

    // Hidden honeypot field, reused across steps.
    const honeypot = (
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
    )

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

            {/* Steps 'lead' and 'done' use the shared (narrow) Modal */}
            <Modal
                isOpen={isLeadFormOpen && step !== 'contract'}
                onClose={handleClose}
                title={step === 'lead' ? 'Claim Your Lawn Maintenance Offer' : ''}
            >
                {step === 'done' ? (
                    <div className="py-4 text-center">
                        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-vibrant-gold-50">
                            <CheckCircle className="h-10 w-10 text-forest-green" />
                        </div>
                        <h3 className="mb-2 font-heading text-2xl font-bold text-forest-green">
                            You&apos;re all set!
                        </h3>
                        <p className="mb-6 text-gray-600">
                            A copy of your signed agreement has been emailed to you.
                            Evergrow will be in contact within 72 hours.
                        </p>
                        <Button type="button" variant="secondary" onClick={handleClose}>
                            Done
                        </Button>
                    </div>
                ) : (
                    <form onSubmit={handleLeadSubmit} className="space-y-4">
                        <p className="text-sm text-gray-600">
                            Drop your email and phone number to get started — next
                            you&apos;ll review and sign your service authorization.
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

                        {honeypot}

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
                            {isSubmitting ? 'Submitting…' : 'Continue'}
                        </Button>

                        <p className="text-center text-xs text-gray-400">
                            We respect your privacy. No spam, ever.
                        </p>
                    </form>
                )}
            </Modal>

            {/* Step 'contract' uses a wider, near-full-height dialog */}
            <Transition appear show={isLeadFormOpen && step === 'contract'} as={Fragment}>
                <Dialog as="div" className="relative z-50" onClose={handleClose}>
                    <Transition.Child
                        as={Fragment}
                        enter="ease-out duration-300"
                        enterFrom="opacity-0"
                        enterTo="opacity-100"
                        leave="ease-in duration-200"
                        leaveFrom="opacity-100"
                        leaveTo="opacity-0"
                    >
                        <div className="fixed inset-0 bg-black/25 backdrop-blur-sm" />
                    </Transition.Child>

                    <div className="fixed inset-0 overflow-y-auto">
                        <div className="flex min-h-full items-center justify-center p-2 sm:p-4">
                            <Transition.Child
                                as={Fragment}
                                enter="ease-out duration-300"
                                enterFrom="opacity-0 scale-95"
                                enterTo="opacity-100 scale-100"
                                leave="ease-in duration-200"
                                leaveFrom="opacity-100 scale-100"
                                leaveTo="opacity-0 scale-95"
                            >
                                <Dialog.Panel className="relative flex max-h-[95vh] w-full max-w-2xl transform flex-col overflow-hidden rounded-2xl bg-white text-left shadow-xl transition-all sm:max-h-[90vh]">
                                    <div className="flex items-start justify-between border-b border-gray-100 p-5">
                                        <Dialog.Title
                                            as="h3"
                                            className="pr-6 font-heading text-lg font-bold leading-6 text-forest-green"
                                        >
                                            {TITLE}
                                        </Dialog.Title>
                                        <button
                                            type="button"
                                            onClick={handleClose}
                                            aria-label="Close"
                                            className="text-gray-400 transition-colors hover:text-gray-500"
                                        >
                                            <X className="h-5 w-5" />
                                        </button>
                                    </div>

                                    <form
                                        onSubmit={handleAgreementSubmit}
                                        className="flex-1 space-y-4 overflow-y-auto p-5"
                                    >
                                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                            <Input
                                                label="Full Name"
                                                placeholder="Jane Doe"
                                                value={customerName}
                                                onChange={(e) => setCustomerName(e.target.value)}
                                                autoComplete="name"
                                                required
                                            />
                                            <Input
                                                label="Service Address"
                                                placeholder="123 Main St, City, ST"
                                                value={serviceAddress}
                                                onChange={(e) => setServiceAddress(e.target.value)}
                                                autoComplete="street-address"
                                                required
                                            />
                                            <Input
                                                type="tel"
                                                label="Phone"
                                                value={phone}
                                                onChange={(e) => setPhone(e.target.value)}
                                                autoComplete="tel"
                                                required
                                            />
                                            <Input
                                                type="email"
                                                label="Email"
                                                value={email}
                                                onChange={(e) => setEmail(e.target.value)}
                                                autoComplete="email"
                                                required
                                            />
                                        </div>

                                        <p className="text-sm text-gray-600">
                                            {AUTHORIZE_SENTENCE.replace(
                                                'Evergrow Landscaping',
                                                SERVICE_PROVIDER
                                            )}
                                        </p>

                                        <div>
                                            <p className="mb-2 text-sm font-semibold text-deep-charcoal">
                                                I understand and agree to the following:
                                            </p>
                                            <div className="max-h-48 overflow-y-auto rounded-lg border border-gray-200 bg-gray-50 p-4">
                                                <ol className="list-decimal space-y-2 pl-5 text-sm text-gray-600">
                                                    {TERMS.map((term, i) => (
                                                        <li key={i}>{term}</li>
                                                    ))}
                                                </ol>
                                            </div>
                                        </div>

                                        <label className="flex cursor-pointer items-start gap-3">
                                            <input
                                                type="checkbox"
                                                checked={agreedToTerms}
                                                onChange={(e) => setAgreedToTerms(e.target.checked)}
                                                className="mt-1 h-4 w-4 flex-shrink-0 accent-forest-green"
                                            />
                                            <span className="text-sm text-deep-charcoal">
                                                {CHECKBOX_LABEL}
                                            </span>
                                        </label>

                                        <SignaturePad onChange={setSignatureDataUrl} />

                                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                            <Input
                                                label="Printed Name"
                                                placeholder="Jane Doe"
                                                value={printedName}
                                                onChange={(e) => setPrintedName(e.target.value)}
                                                autoComplete="name"
                                                required
                                            />
                                            <Input
                                                type="date"
                                                label="Date"
                                                value={signedDate}
                                                onChange={(e) => setSignedDate(e.target.value)}
                                                required
                                            />
                                        </div>

                                        {honeypot}

                                        {error && (
                                            <p
                                                className="text-sm font-medium text-red-600"
                                                role="alert"
                                            >
                                                {error}
                                            </p>
                                        )}

                                        <Button
                                            type="submit"
                                            size="lg"
                                            isLoading={isSubmitting}
                                            disabled={!canSubmitContract}
                                            className="w-full"
                                        >
                                            {isSubmitting
                                                ? 'Submitting…'
                                                : 'Agree & Sign'}
                                        </Button>
                                    </form>
                                </Dialog.Panel>
                            </Transition.Child>
                        </div>
                    </div>
                </Dialog>
            </Transition>
        </>
    )
}
