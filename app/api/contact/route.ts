import { NextResponse } from 'next/server'

export async function POST(request: Request) {
    try {
        const body = await request.json()
        console.log('Contact Form Received:', body)
        await new Promise(resolve => setTimeout(resolve, 1000))
        return NextResponse.json({ success: true, message: 'Message sent' })
    } catch (error) {
        return NextResponse.json({ success: false, error: 'Invalid request' }, { status: 400 })
    }
}
