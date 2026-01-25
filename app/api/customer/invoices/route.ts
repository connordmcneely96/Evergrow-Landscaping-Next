import { NextResponse } from 'next/server'

export const dynamic = 'force-static'

export async function GET() {
    // Mock invoices data
    const invoices = [
        {
            id: 'inv_1',
            invoice_number: 'INV-2025-001',
            amount: 450.00,
            status: 'paid',
            due_date: '2025-04-11T00:00:00Z',
            project_id: 'p2'
        },
        {
            id: 'inv_2',
            invoice_number: 'INV-2025-002',
            amount: 150.00,
            status: 'pending',
            due_date: '2025-05-16T00:00:00Z',
            project_id: 'p1'
        }
    ]

    return NextResponse.json({
        success: true,
        data: invoices
    })
}
