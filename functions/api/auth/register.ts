import { Env } from '../../types';

export const onRequestPost: PagesFunction<Env> = async (context) => {
    try {
        const { request } = context;
        const body = await request.json() as any;

        const user = {
            id: 'new_user_123',
            name: body.name || 'New User',
            email: body.email
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
