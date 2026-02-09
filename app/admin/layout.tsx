'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { AdminSidebar } from '@/components/admin/AdminSidebar'
import { getAuthToken, removeAuthToken } from '@/lib/auth'

interface JwtPayload {
    user: {
        id: number
        email: string
        name: string
    }
    role?: string
}

function decodeToken(token: string): JwtPayload | null {
    try {
        const payload = JSON.parse(atob(token.split('.')[1]))
        return payload
    } catch {
        return null
    }
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    const router = useRouter()
    const [authorized, setAuthorized] = useState(false)
    const [userName, setUserName] = useState<string | undefined>()

    useEffect(() => {
        const token = getAuthToken()
        if (!token) {
            router.replace('/login')
            return
        }

        const decoded = decodeToken(token)
        if (!decoded) {
            removeAuthToken()
            router.replace('/login')
            return
        }

        // Check admin role from JWT payload
        if (decoded.role !== 'admin') {
            router.replace('/dashboard')
            return
        }

        setUserName(decoded.user?.name || decoded.user?.email)
        setAuthorized(true)
    }, [router])

    const handleLogout = () => {
        removeAuthToken()
        router.replace('/login')
    }

    if (!authorized) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-forest-green" />
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <AdminSidebar userName={userName} onLogout={handleLogout} />
            <main className="lg:ml-60 min-h-screen">
                <div className="p-4 sm:p-6 lg:p-8 pt-16 lg:pt-6">
                    {children}
                </div>
            </main>
        </div>
    )
}
