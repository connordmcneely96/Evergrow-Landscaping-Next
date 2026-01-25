'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/components/portal/AuthContext'
import { PortalSidebar } from '@/components/portal/PortalSidebar'

export default function AuthenticatedLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const { user, loading } = useAuth()
    const router = useRouter()

    useEffect(() => {
        if (!loading && !user) {
            router.push('/portal/login')
        }
    }, [user, loading, router])

    if (loading) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-gray-50">
                <div className="text-center">
                    <div className="h-8 w-8 animate-spin rounded-full border-4 border-ocean-blue border-t-transparent mx-auto mb-4"></div>
                    <p className="text-gray-500">Loading your portal...</p>
                </div>
            </div>
        )
    }

    if (!user) {
        return null // Will redirect
    }

    return (
        <div className="flex h-screen overflow-hidden bg-gray-50">
            <PortalSidebar />
            <div className="flex-1 flex flex-col overflow-hidden">
                {/* Could add a top header here for mobile menu trigger */}
                <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
                    {children}
                </main>
            </div>
        </div>
    )
}
