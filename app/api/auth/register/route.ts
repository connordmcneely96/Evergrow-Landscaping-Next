import { NextResponse } from 'next/server'

export const dynamic = 'force-static'

export async function POST(request: Request) {
    try {
        const body = await request.json() as any

        // Simulate successful registration
        // In a real app, we would validate and save to DB

        const user = {
            id: 'new_user_123',
            name: body.name || 'New User',
            email: body.email
        }

        const payload = btoa(JSON.stringify({ user }))
        const token = `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.${payload}.fake_signature`

        return NextResponse.json({
            success: true,
            token,
            user
        })
    } catch (error) {
        return NextResponse.json(
            { success: false, error: 'Internal server error' },
            { status: 500 }
        )
    }
}
