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

        // Allow feature test user
        if (email === 'feature_test@example.com') {
            const user = {
                id: '2',
                name: 'Feature Test',
                email: 'feature_test@example.com'
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
