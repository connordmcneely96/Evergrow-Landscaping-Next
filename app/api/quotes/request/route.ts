import { NextResponse } from 'next/server'

export async function POST(request: Request) {
    try {
        const body = await request.json()
        // In a real app, save to database or send email
        console.log('Quote Request Received:', body)

        // Simulate delay
        await new Promise(resolve => setTimeout(resolve, 1000))

        return NextResponse.json({ success: true, message: 'Quote request received' })
    } catch (error) {
        return NextResponse.json({ success: false, error: 'Invalid request' }, { status: 400 })
    }
}
