import { cn } from '@/lib/utils'

interface StatsCardProps {
    label: string
    value: string | number
    icon?: string
    trend?: string
    variant?: 'default' | 'warning' | 'success' | 'info'
    onClick?: () => void
}

const VARIANT_STYLES = {
    default: 'border-gray-200',
    warning: 'border-vibrant-gold bg-yellow-50',
    success: 'border-green-300 bg-green-50',
    info: 'border-ocean-blue bg-blue-50',
}

const ICON_BG = {
    default: 'bg-gray-100 text-gray-600',
    warning: 'bg-vibrant-gold/20 text-yellow-700',
    success: 'bg-green-100 text-green-700',
    info: 'bg-ocean-blue/10 text-ocean-blue',
}

export function StatsCard({ label, value, icon, trend, variant = 'default', onClick }: StatsCardProps) {
    const Wrapper = onClick ? 'button' : 'div'
    return (
        <Wrapper
            onClick={onClick}
            className={cn(
                'bg-white rounded-xl border p-5 text-left transition-shadow',
                VARIANT_STYLES[variant],
                onClick && 'hover:shadow-md cursor-pointer'
            )}
        >
            <div className="flex items-start justify-between">
                <div>
                    <p className="text-sm text-gray-500 font-medium">{label}</p>
                    <p className="text-2xl font-bold text-gray-900 mt-1">{value}</p>
                    {trend && <p className="text-xs text-gray-500 mt-1">{trend}</p>}
                </div>
                {icon && (
                    <div className={cn('w-10 h-10 rounded-lg flex items-center justify-center', ICON_BG[variant])}>
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d={icon} />
                        </svg>
                    </div>
                )}
            </div>
        </Wrapper>
    )
}
