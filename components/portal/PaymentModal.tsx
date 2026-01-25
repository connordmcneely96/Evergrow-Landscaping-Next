'use client'

import { useState } from 'react'
import { Modal } from '@/components/ui/Modal'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { useToast } from '@/components/ui/Toast'
import { fetchWithAuth } from '@/lib/auth'

interface Invoice {
    id: number
    project_id: number
    amount: number
    invoice_type: 'deposit' | 'balance'
}

interface PaymentModalProps {
    invoice: Invoice
    onClose: () => void
    onSuccess: () => void
}

export function PaymentModal({ invoice, onClose, onSuccess }: PaymentModalProps) {
    const [isProcessing, setIsProcessing] = useState(false)
    const [savePaymentMethod, setSavePaymentMethod] = useState(false)
    const { addToast } = useToast()

    // Mock card details (in production, use Stripe Elements)
    const [cardDetails, setCardDetails] = useState({
        number: '',
        expiry: '',
        cvc: '',
        name: '',
    })

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsProcessing(true)

        try {
            // Create payment intent
            const endpoint = invoice.invoice_type === 'deposit'
                ? '/api/payment/create-deposit'
                : '/api/payment/create-balance'

            const response = await fetchWithAuth(endpoint, {
                method: 'POST',
                body: JSON.stringify({
                    projectId: invoice.project_id,
                    savePaymentMethod,
                }),
            })

            const data = await response.json() as any

            if (!data.success) {
                throw new Error(data.error || 'Payment failed')
            }

            // In production, use Stripe.js to confirm payment
            // For now, simulate success
            addToast({
                type: 'success',
                message: 'Payment successful! Thank you.',
            })

            onSuccess()
        } catch (error) {
            addToast({
                type: 'error',
                message: error instanceof Error ? error.message : 'Payment failed',
            })
        } finally {
            setIsProcessing(false)
        }
    }

    const transactionFee = (invoice.amount * 0.029 + 0.30).toFixed(2)
    const totalWithFee = (invoice.amount + parseFloat(transactionFee)).toFixed(2)

    return (
        <Modal isOpen onClose={onClose} title="Complete Payment">
            <form onSubmit={handleSubmit} className="space-y-6">
                {/* Invoice Summary */}
                <div className="bg-warm-cream p-4 rounded-lg">
                    <div className="flex justify-between mb-2">
                        <span className="text-gray-700">Invoice Amount:</span>
                        <span className="font-semibold">${invoice.amount.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between mb-2">
                        <span className="text-gray-700">Transaction Fee:</span>
                        <span className="text-sm text-gray-600">${transactionFee}</span>
                    </div>
                    <div className="flex justify-between pt-2 border-t border-gray-300">
                        <span className="font-semibold text-gray-900">Total:</span>
                        <span className="font-bold text-ocean-blue text-lg">${totalWithFee}</span>
                    </div>
                </div>

                {/* Card Details (Mock - use Stripe Elements in production) */}
                <div className="space-y-4">
                    <Input
                        label="Card Number"
                        value={cardDetails.number}
                        onChange={(e) => setCardDetails(prev => ({ ...prev, number: e.target.value }))}
                        placeholder="1234 5678 9012 3456"
                        required
                    />

                    <div className="grid grid-cols-2 gap-4">
                        <Input
                            label="Expiry Date"
                            value={cardDetails.expiry}
                            onChange={(e) => setCardDetails(prev => ({ ...prev, expiry: e.target.value }))}
                            placeholder="MM/YY"
                            required
                        />
                        <Input
                            label="CVC"
                            value={cardDetails.cvc}
                            onChange={(e) => setCardDetails(prev => ({ ...prev, cvc: e.target.value }))}
                            placeholder="123"
                            required
                        />
                    </div>

                    <Input
                        label="Cardholder Name"
                        value={cardDetails.name}
                        onChange={(e) => setCardDetails(prev => ({ ...prev, name: e.target.value }))}
                        placeholder="John Smith"
                        required
                    />
                </div>

                {/* Save Payment Method */}
                <label className="flex items-start gap-3 cursor-pointer">
                    <input
                        type="checkbox"
                        checked={savePaymentMethod}
                        onChange={(e) => setSavePaymentMethod(e.target.checked)}
                        className="mt-1 w-4 h-4 text-hopeful-teal rounded"
                    />
                    <div>
                        <p className="font-semibold text-gray-900">Save payment method</p>
                        <p className="text-sm text-gray-600">
                            Use this card for future invoices
                        </p>
                    </div>
                </label>

                {/* Security Note */}
                <div className="flex items-start gap-2 text-sm text-gray-600 bg-gray-50 p-3 rounded-lg">
                    <span>🔒</span>
                    <p>
                        Your payment information is encrypted and secure. We use Stripe for payment processing.
                    </p>
                </div>

                {/* Actions */}
                <div className="flex gap-4">
                    <Button
                        type="button"
                        variant="outline"
                        onClick={onClose}
                        className="flex-1"
                        disabled={isProcessing}
                    >
                        Cancel
                    </Button>
                    <Button
                        type="submit"
                        variant="primary"
                        className="flex-1"
                        disabled={isProcessing}
                    >
                        {isProcessing ? 'Processing...' : `Pay $${totalWithFee}`}
                    </Button>
                </div>
            </form>
        </Modal>
    )
}
