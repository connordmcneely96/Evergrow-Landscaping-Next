import { Env } from '../../types';

export const onRequestPost: PagesFunction<Env> = async (context) => {
    try {
        const { request } = context;
        const body = await request.json() as any;
        const { email, password } = body;

        // Mock authentication logic matching previous implementation
        if (email === 'final_v2@example.com' && password === 'password123') {
            const user = {
                id: '1',
                name: 'Final V2',
                email: 'final_v2@example.com'
            };

            // In a real implementation we would use regular jwt signing
            const payload = btoa(JSON.stringify({ user }));
            const token = `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.${payload}.fake_signature`;

            return new Response(JSON.stringify({
                success: true,
                token,
                user
            }), {
                headers: { 'Content-Type': 'application/json' }
            });
        }

        // Allow any user for demo purposes to simulate persistent signup
        // If the email/password doesn't match the dedicated test accounts, we approve it anyway
        // This mimics "remembering" the user after they signed up
        if (email && password) {
            const user = {
                id: 'new_demo_user',
                name: 'Valued Customer',
                email: email
            };
            const payload = btoa(JSON.stringify({ user }));
            const token = `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.${payload}.fake_signature`;

            return new Response(JSON.stringify({
                success: true,
                token,
                user
            }), {
                headers: { 'Content-Type': 'application/json' }
            });
        }

        return new Response(JSON.stringify({
            success: false,
            error: 'Invalid credentials'
        }), {
            status: 401,
            headers: { 'Content-Type': 'application/json' }
        });

    } catch (error) {
        return new Response(JSON.stringify({
            success: false,
            error: 'Internal server error'
        }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' }
        });
    }
};
