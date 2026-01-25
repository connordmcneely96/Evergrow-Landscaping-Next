'use client'

import { useState, Fragment } from 'react'
import { Dialog, Transition } from '@headlessui/react'
import { X } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'

interface PaymentModalProps {
    isOpen: boolean
    onClose: () => void
    amount: number
    invoiceNumber: string
    onSuccess: () => void
}

export function PaymentModal({ isOpen, onClose, amount, invoiceNumber, onSuccess }: PaymentModalProps) {
    const [isProcessing, setIsProcessing] = useState(false)
    const [formData, setFormData] = useState({
        cardName: '',
        cardNumber: '',
        expiry: '',
        cvc: ''
    })

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsProcessing(true)

        // Simulate API call
        setTimeout(() => {
            setIsProcessing(false)
            onSuccess()
            onClose()
        }, 2000)
    }

    return (
        <Transition appear show={isOpen} as={Fragment}>
            <Dialog as="div" className="relative z-50" onClose={onClose}>
                <Transition.Child
                    as={Fragment}
                    enter="ease-out duration-300"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leave="ease-in duration-200"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                >
                    <div className="fixed inset-0 bg-black/25" />
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
                            <Dialog.Panel className="w-full max-w-md transforms overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                                <div className="flex justify-between items-center mb-4">
                                    <Dialog.Title as="h3" className="text-lg font-bold text-gray-900">
                                        Pay Invoice #{invoiceNumber}
                                    </Dialog.Title>
                                    <button
                                        onClick={onClose}
                                        className="text-gray-400 hover:text-gray-500 transition-colors"
                                    >
                                        <X className="w-5 h-5" />
                                    </button>
                                </div>

                                <div className="mb-6">
                                    <p className="text-sm text-gray-500">Total Amount</p>
                                    <p className="text-3xl font-bold text-forest-green">${amount.toFixed(2)}</p>
                                </div>

                                <form onSubmit={handleSubmit} className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Cardholder Name
                                        </label>
                                        <Input
                                            type="text"
                                            required
                                            placeholder="John Doe"
                                            value={formData.cardName}
                                            onChange={(e) => setFormData({ ...formData, cardName: e.target.value })}
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Card Number
                                        </label>
                                        <Input
                                            type="text"
                                            required
                                            placeholder="0000 0000 0000 0000"
                                            value={formData.cardNumber}
                                            onChange={(e) => setFormData({ ...formData, cardNumber: e.target.value })}
                                        />
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                Expiry Date
                                            </label>
                                            <Input
                                                type="text"
                                                required
                                                placeholder="MM/YY"
                                                value={formData.expiry}
                                                onChange={(e) => setFormData({ ...formData, expiry: e.target.value })}
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                CVC
                                            </label>
                                            <Input
                                                type="text"
                                                required
                                                placeholder="123"
                                                value={formData.cvc}
                                                onChange={(e) => setFormData({ ...formData, cvc: e.target.value })}
                                            />
                                        </div>
                                    </div>

                                    <div className="mt-6">
                                        <Button
                                            type="submit"
                                            className="w-full"
                                            disabled={isProcessing}
                                        >
                                            {isProcessing ? 'Processing...' : `Pay $${amount.toFixed(2)}`}
                                        </Button>
                                    </div>
                                    <p className="text-xs text-center text-gray-500 mt-4">
                                        This is a secure 256-bit SSL encrypted payment.
                                    </p>
                                </form>
                            </Dialog.Panel>
                        </Transition.Child>
                    </div>
                </div>
            </Dialog>
        </Transition>
    )
}
