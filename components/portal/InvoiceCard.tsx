import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'

interface InvoiceCardProps {
    id: string
    invoiceNumber: string
    amount: number
    status: 'paid' | 'pending' | 'overdue'
    dueDate: string
    onPay?: (id: string) => void
}

export function InvoiceCard({ id, invoiceNumber, amount, status, dueDate, onPay }: InvoiceCardProps) {
    const getStatusVariant = (status: string) => {
        switch (status) {
            case 'paid': return 'success'
            case 'pending': return 'warning'
            case 'overdue': return 'destructive'
            default: return 'default'
        }
    }

    const isPayable = status === 'pending' || status === 'overdue'

    return (
        <div className="bg-white rounded-lg border border-gray-200 shadow-sm hover:border-vibrant-gold transition-colors p-6">
            <div className="flex justify-between items-start mb-4">
                <div>
                    <h3 className="font-heading font-bold text-lg text-gray-900 mb-1">
                        #{invoiceNumber}
                    </h3>
                    <p className="text-sm text-gray-500">
                        Due: {new Date(dueDate).toLocaleDateString()}
                    </p>
                </div>
                <Badge variant={getStatusVariant(status)}>
                    {status.charAt(0).toUpperCase() + status.slice(1)}
                </Badge>
            </div>

            <div className="flex items-center justify-between mt-6">
                <div>
                    <span className="text-xs text-gray-500 uppercase tracking-wide">Amount Due</span>
                    <p className="text-2xl font-bold text-forest-green">
                        ${amount.toFixed(2)}
                    </p>
                </div>

                {isPayable && onPay && (
                    <Button
                        variant="primary"
                        size="sm"
                        onClick={() => onPay(id)}
                    >
                        Pay Now
                    </Button>
                )}

                {!isPayable && (
                    <Button variant="ghost" size="sm" disabled>
                        {status === 'paid' ? 'Paid in Full' : 'Unavailable'}
                    </Button>
                )}
            </div>
        </div>
    )
}
