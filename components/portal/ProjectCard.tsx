import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import Link from 'next/link'

interface ProjectCardProps {
    id: string
    serviceType: string
    status: 'pending' | 'scheduled' | 'in_progress' | 'completed' | 'cancelled'
    date: string
    description?: string
    totalAmount?: number
}

export function ProjectCard({ id, serviceType, status, date, description, totalAmount }: ProjectCardProps) {
    const getStatusVariant = (status: string) => {
        switch (status) {
            case 'completed': return 'success'
            case 'in_progress': return 'warning'
            case 'scheduled': return 'info'
            case 'cancelled': return 'destructive'
            default: return 'default'
        }
    }

    const formatStatus = (status: string) => {
        return status.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')
    }

    return (
        <div className="bg-white rounded-lg border border-gray-200 shadow-sm hover:border-vibrant-gold transition-colors p-6">
            <div className="flex justify-between items-start mb-4">
                <div>
                    <h3 className="font-heading font-bold text-lg text-forest-green mb-1">
                        {serviceType}
                    </h3>
                    <p className="text-sm text-gray-500">
                        {new Date(date).toLocaleDateString(undefined, {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                        })}
                    </p>
                </div>
                <Badge variant={getStatusVariant(status)}>
                    {formatStatus(status)}
                </Badge>
            </div>

            {description && (
                <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                    {description}
                </p>
            )}

            <div className="flex items-center justify-between mt-4">
                {totalAmount ? (
                    <span className="font-bold text-gray-900">
                        ${totalAmount.toFixed(2)}
                    </span>
                ) : (
                    <span className="text-sm text-gray-400">Quote Pending</span>
                )}

                <Link href={`/dashboard/projects/${id}`}>
                    <Button variant="outline" size="sm">
                        View Details
                    </Button>
                </Link>
            </div>
        </div>
    )
}
