import { NextResponse } from 'next/server'

export const dynamic = 'force-static'

export async function POST(request: Request) {
    try {
        const body = await request.json()
        console.log('Feedback received:', body)

        // Simulate generic success
        return NextResponse.json({
            success: true,
            message: 'Feedback received'
        })
    } catch (error) {
        return NextResponse.json(
            { success: false, error: 'Internal server error' },
            { status: 500 }
        )
    }
}
