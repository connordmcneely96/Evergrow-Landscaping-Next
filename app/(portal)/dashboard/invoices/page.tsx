'use client'

import { useState, useEffect } from 'react'
import { fetchWithAuth } from '@/lib/auth'
import { InvoiceCard } from '@/components/portal/InvoiceCard'
import { PaymentModal } from '@/components/portal/PaymentModal'
import { toast } from 'react-hot-toast'
import Link from 'next/link'
import { Button } from '@/components/ui/Button'

export default function InvoicesPage() {
    const [invoices, setInvoices] = useState<any[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [selectedInvoice, setSelectedInvoice] = useState<any>(null)
    const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false)

    useEffect(() => {
        loadInvoices()
    }, [])

    const loadInvoices = async () => {
        try {
            const response = await fetchWithAuth('/api/customer/invoices')
            const data = await response.json() as any
            if (data.success) {
                setInvoices(data.data)
            }
        } catch (error) {
            console.error('Failed to load invoices:', error)
            toast.error('Failed to load invoices')
        } finally {
            setIsLoading(false)
        }
    }

    const handlePayClick = (id: string) => {
        const invoice = invoices.find(inv => inv.id === id)
        if (invoice) {
            setSelectedInvoice(invoice)
            setIsPaymentModalOpen(true)
        }
    }

    const handlePaymentSuccess = () => {
        toast.success('Payment processed successfully!')
        // Ideally, refresh invoices here or update local state
        loadInvoices()
        setSelectedInvoice(null)
    }

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-vibrant-gold border-t-transparent"></div>
            </div>
        )
    }

    return (
        <div className="max-w-4xl mx-auto">
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-3xl font-heading font-bold text-forest-green mb-2">
                        My Invoices
                    </h1>
                    <p className="text-gray-600">
                        View and pay your outstanding invoices
                    </p>
                </div>
            </div>

            {invoices.length === 0 ? (
                <div className="text-center py-12 bg-gray-50 rounded-lg border-2 border-dashed border-gray-200">
                    <div className="text-4xl mb-4">💰</div>
                    <h3 className="text-lg font-bold text-gray-900 mb-2">No invoices found</h3>
                    <p className="text-gray-600 mb-6">
                        You don&apos;t have any invoices to display right now.
                    </p>
                    <Link href="/quote-request">
                        <Button>Request Service</Button>
                    </Link>
                </div>
            ) : (
                <div className="grid gap-6">
                    {invoices.map((invoice) => (
                        <InvoiceCard
                            key={invoice.id}
                            id={invoice.id}
                            invoiceNumber={invoice.invoice_number}
                            amount={invoice.amount}
                            status={invoice.status}
                            dueDate={invoice.due_date}
                            onPay={handlePayClick}
                        />
                    ))}
                </div>
            )}

            {selectedInvoice && (
                <PaymentModal
                    isOpen={isPaymentModalOpen}
                    onClose={() => setIsPaymentModalOpen(false)}
                    amount={selectedInvoice.amount}
                    invoiceNumber={selectedInvoice.invoice_number}
                    onSuccess={handlePaymentSuccess}
                />
            )}
        </div>
    )
}
