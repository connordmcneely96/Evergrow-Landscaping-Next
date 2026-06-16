'use client'

import Image from 'next/image'
import { usePromo } from '@/contexts/PromoContext'

const PROMO_IMAGE = '/api/assets/promo-lawn-maintenance.png'

export default function PromoBannerCard() {
    const { openLeadForm } = usePromo()

    function handleKeyDown(e: React.KeyboardEvent<HTMLDivElement>) {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault()
            openLeadForm()
        }
    }

    return (
        <div
            role="button"
            tabIndex={0}
            aria-label="View our lawn maintenance offer and sign up"
            onClick={openLeadForm}
            onKeyDown={handleKeyDown}
            className="group mt-8 w-full max-w-2xl mx-auto lg:mx-0 cursor-pointer overflow-hidden rounded-2xl border-2 border-vibrant-gold/40 shadow-lg transition-all duration-300 hover:-translate-y-1 hover:border-vibrant-gold hover:shadow-2xl focus:outline-none focus-visible:ring-2 focus-visible:ring-vibrant-gold focus-visible:ring-offset-2"
        >
            <Image
                src={PROMO_IMAGE}
                alt="Evergrow Landscaping lawn maintenance promotion — click to sign up"
                width={1640}
                height={1000}
                className="h-auto w-full"
            />
        </div>
    )
}
