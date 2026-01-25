import { NextResponse } from 'next/server'

export const dynamic = 'force-static'

export async function GET() {
    // Mock projects data
    const projects = [
        {
            id: 'p1',
            service_type: 'Lawn Care & Maintenance',
            status: 'scheduled',
            scheduled_date: '2025-05-15T09:00:00Z',
            created_at: '2025-05-01T10:00:00Z',
            total_amount: 150.00,
            description: 'Regular lawn mowing and edging.'
        },
        {
            id: 'p2',
            service_type: 'Mulch Installation',
            status: 'completed',
            scheduled_date: '2025-04-10T08:00:00Z',
            created_at: '2025-03-25T14:30:00Z',
            total_amount: 450.00,
            description: 'Premium dark mulch installation in front flower beds.'
        },
        {
            id: 'p3',
            service_type: 'Spring Cleanup',
            status: 'in_progress',
            scheduled_date: '2025-04-20T08:00:00Z',
            created_at: '2025-04-15T09:15:00Z',
            total_amount: 300.00,
            description: 'Leaf removal and debris clearing.'
        }
    ]

    return NextResponse.json({
        success: true,
        data: projects
    })
}
