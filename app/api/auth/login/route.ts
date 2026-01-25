import { NextResponse } from 'next/server'

export const dynamic = 'force-static'

export async function POST(request: Request) {
    try {
        const body = await request.json()
        const { email, password } = body

        // Mock authentication logic
        if (email === 'final_v2@example.com' && password === 'password123') {
            // Create a fake JWT token
            // Header: {"alg":"HS256","typ":"JWT"} -> eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9
            // Payload: {"user":{"id":"1","name":"Final V2","email":"final_v2@example.com"}}
            // Signature: fake
            const user = {
                id: '1',
                name: 'Final V2',
                email: 'final_v2@example.com'
            }

            const payload = btoa(JSON.stringify({ user }))
            const token = `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.${payload}.fake_signature`

            return NextResponse.json({
                success: true,
                token,
                user
            })
        }

        // Allow feature test user as well
        if (email === 'feature_test@example.com') {
            const user = {
                id: '2',
                name: 'Feature Test',
                email: 'feature_test@example.com'
            }
            const payload = btoa(JSON.stringify({ user }))
            const token = `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.${payload}.fake_signature`

            return NextResponse.json({
                success: true,
                token,
                user
            })
        }

        return NextResponse.json(
            { success: false, error: 'Invalid credentials' },
            { status: 401 }
        )
    } catch (error) {
        return NextResponse.json(
            { success: false, error: 'Internal server error' },
            { status: 500 }
        )
    }
}
