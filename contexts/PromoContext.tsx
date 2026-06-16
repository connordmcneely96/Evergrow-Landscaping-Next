'use client'

import React, { createContext, useCallback, useContext, useState } from 'react'

interface PromoContextValue {
    isLeadFormOpen: boolean
    openLeadForm: () => void
    closeLeadForm: () => void
}

const PromoContext = createContext<PromoContextValue | undefined>(undefined)

export function PromoProvider({ children }: { children: React.ReactNode }) {
    const [isLeadFormOpen, setIsLeadFormOpen] = useState(false)

    const openLeadForm = useCallback(() => setIsLeadFormOpen(true), [])
    const closeLeadForm = useCallback(() => setIsLeadFormOpen(false), [])

    return (
        <PromoContext.Provider value={{ isLeadFormOpen, openLeadForm, closeLeadForm }}>
            {children}
        </PromoContext.Provider>
    )
}

export function usePromo() {
    const context = useContext(PromoContext)
    if (context === undefined) {
        throw new Error('usePromo must be used within a PromoProvider')
    }
    return context
}
