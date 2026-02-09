'use client'

import { useEffect, useState } from 'react'
import { Badge } from '@/components/ui/Badge'
import { fetchWithAuth } from '@/lib/auth'
import { formatCurrency, formatDate } from '@/lib/utils'

interface Project {
    id: number
    customerName: string | null
    serviceName: string
    totalAmount: number
    depositAmount: number | null
    depositPaid: boolean
    balanceDue: number
    scheduledDate: string | null
    status: string
    statusDisplay: string
    createdAt: string
}

const STATUS_BADGE: Record<string, 'warning' | 'info' | 'success' | 'destructive' | 'secondary'> = {
    scheduled: 'info',
    in_progress: 'warning',
    completed: 'success',
    cancelled: 'destructive',
}

export default function AdminProjectsPage() {
    const [projects, setProjects] = useState<Project[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        async function load() {
            try {
                const res = await fetchWithAuth('/api/admin/projects?limit=50')
                if (res.ok) {
                    const data = await res.json() as any
                    if (data.success) setProjects(data.projects)
                }
            } catch (err) {
                console.error('Failed to load projects:', err)
            } finally {
                setLoading(false)
            }
        }
        load()
    }, [])

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold text-white">Projects</h1>
                <p className="text-sm text-gray-500 mt-1">Track active and completed projects</p>
            </div>

            <div className="bg-gray-900 rounded-xl border border-gray-800 overflow-hidden">
                {loading ? (
                    <div className="p-8 flex justify-center">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-forest-green" />
                    </div>
                ) : projects.length === 0 ? (
                    <div className="p-8 text-center text-gray-500">No projects yet. Projects are created from accepted quotes.</div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="border-b border-gray-700 bg-gray-800">
                                    <th className="text-left px-4 py-3 font-medium text-gray-400">Customer</th>
                                    <th className="text-left px-4 py-3 font-medium text-gray-400">Service</th>
                                    <th className="text-left px-4 py-3 font-medium text-gray-400">Amount</th>
                                    <th className="text-left px-4 py-3 font-medium text-gray-400">Scheduled</th>
                                    <th className="text-left px-4 py-3 font-medium text-gray-400">Status</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-800">
                                {projects.map((p) => (
                                    <tr key={p.id} className="hover:bg-gray-800/50">
                                        <td className="px-4 py-3 font-medium text-white">{p.customerName || '—'}</td>
                                        <td className="px-4 py-3 text-gray-300">{p.serviceName}</td>
                                        <td className="px-4 py-3 text-white font-medium">{formatCurrency(p.totalAmount)}</td>
                                        <td className="px-4 py-3 text-gray-300">{p.scheduledDate ? formatDate(p.scheduledDate) : '—'}</td>
                                        <td className="px-4 py-3"><Badge variant={STATUS_BADGE[p.status] || 'secondary'}>{p.statusDisplay}</Badge></td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    )
}
