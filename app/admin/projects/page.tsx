'use client'

import { useEffect, useState } from 'react'
import { Badge } from '@/components/ui/Badge'
import { fetchWithAuth } from '@/lib/auth'
import { formatCurrency, formatDate } from '@/lib/utils'

interface Project {
    id: number
    customerName: string | null
    customerEmail: string | null
    serviceName: string
    totalAmount: number
    depositAmount: number | null
    depositPaid: boolean
    balanceDue: number
    scheduledDate: string | null
    status: string
    statusDisplay: string
    createdAt: string
    description: string | null
}

const STATUS_BADGE: Record<string, 'warning' | 'info' | 'success' | 'destructive' | 'secondary'> = {
    scheduled: 'info',
    in_progress: 'warning',
    completed: 'success',
    cancelled: 'destructive',
}

const CANCELLABLE = new Set(['scheduled', 'in_progress'])

interface ProjectsResponse {
    success: boolean
    projects?: Project[]
    error?: string
}

export default function AdminProjectsPage() {
    const [projects, setProjects] = useState<Project[]>([])
    const [loading, setLoading] = useState(true)
    const [cancellingId, setCancellingId] = useState<number | null>(null)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        async function load() {
            try {
                const res = await fetchWithAuth('/api/admin/projects?limit=50')
                if (res.ok) {
                    const data = await res.json() as ProjectsResponse
                    if (data.success) setProjects(data.projects ?? [])
                }
            } catch (err) {
                console.error('Failed to load projects:', err)
            } finally {
                setLoading(false)
            }
        }
        load()
    }, [])

    const handleCancel = async (project: Project) => {
        if (!confirm(`Cancel project #${project.id} for ${project.customerName || 'customer'}? This will also cancel any pending invoices.`)) return

        setCancellingId(project.id)
        setError(null)
        try {
            const res = await fetchWithAuth(`/api/admin/projects/${project.id}`, {
                method: 'PUT',
                body: JSON.stringify({ status: 'cancelled' }),
            })
            const data = await res.json() as ProjectsResponse
            if (!res.ok || !data.success) throw new Error(data.error || 'Failed to cancel project')

            setProjects(prev =>
                prev.map(p => p.id === project.id
                    ? { ...p, status: 'cancelled', statusDisplay: 'Cancelled' }
                    : p
                )
            )
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to cancel project')
        } finally {
            setCancellingId(null)
        }
    }

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold text-white">Projects</h1>
                <p className="text-sm text-gray-500 mt-1">Track active and completed projects</p>
            </div>

            {error && (
                <div className="bg-red-500/10 border border-red-500/30 rounded-lg px-4 py-3 text-sm text-red-400">
                    {error}
                </div>
            )}

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
                                    <th className="text-left px-4 py-3 font-medium text-gray-400">Deposit</th>
                                    <th className="text-left px-4 py-3 font-medium text-gray-400">Balance</th>
                                    <th className="text-left px-4 py-3 font-medium text-gray-400">Scheduled</th>
                                    <th className="text-left px-4 py-3 font-medium text-gray-400">Status</th>
                                    <th className="text-left px-4 py-3 font-medium text-gray-400">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-800">
                                {projects.map((p) => (
                                    <tr key={p.id} className="hover:bg-gray-800/50">
                                        <td className="px-4 py-3">
                                            <div className="font-medium text-white">{p.customerName || '—'}</div>
                                            <div className="text-xs text-gray-500">{p.customerEmail || 'No email on file'}</div>
                                        </td>
                                        <td className="px-4 py-3 text-gray-300">{p.serviceName}</td>
                                        <td className="px-4 py-3 text-white font-medium">
                                            {formatCurrency(p.totalAmount)}
                                            <div className="text-xs text-gray-500">Created {formatDate(p.createdAt)}</div>
                                        </td>
                                        <td className="px-4 py-3 text-gray-300">
                                            {p.depositAmount ? formatCurrency(p.depositAmount) : '—'}
                                            <div className={`text-xs ${p.depositPaid ? 'text-forest-green' : 'text-yellow-400'}`}>
                                                {p.depositPaid ? 'Paid' : 'Pending'}
                                            </div>
                                        </td>
                                        <td className="px-4 py-3 text-gray-300">{formatCurrency(p.balanceDue)}</td>
                                        <td className="px-4 py-3 text-gray-300">
                                            {p.scheduledDate ? formatDate(p.scheduledDate) : <span className="text-gray-600 italic">Not set</span>}
                                        </td>
                                        <td className="px-4 py-3">
                                            <Badge variant={STATUS_BADGE[p.status] || 'secondary'}>{p.statusDisplay}</Badge>
                                            {p.description && (
                                                <p className="text-xs text-gray-500 mt-2 max-w-xs line-clamp-2">{p.description}</p>
                                            )}
                                        </td>
                                        <td className="px-4 py-3">
                                            {CANCELLABLE.has(p.status) && (
                                                <button
                                                    onClick={() => handleCancel(p)}
                                                    disabled={cancellingId === p.id}
                                                    className="text-xs text-red-400 hover:text-red-300 border border-red-900 hover:border-red-600 rounded px-2 py-1 transition-colors disabled:opacity-50 whitespace-nowrap"
                                                >
                                                    {cancellingId === p.id ? 'Cancelling…' : 'Cancel'}
                                                </button>
                                            )}
                                        </td>
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
