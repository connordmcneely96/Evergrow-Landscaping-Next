import { Env } from '../../types';
import { createSession } from '../../lib/session';
import { hashPassword } from './login';

export const onRequestPost: PagesFunction<Env> = async (context) => {
    const { request, env } = context;

    try {
        const body = await request.json<{
            name: string;
            email: string;
            password: string;
            phone?: string;
        }>();
        const { name, email, password, phone } = body;

        if (!name || !email || !password) {
            return new Response(JSON.stringify({
                success: false,
                error: 'Name, email, and password are required',
            }), {
                status: 400,
                headers: { 'Content-Type': 'application/json' },
            });
        }

        if (password.length < 6) {
            return new Response(JSON.stringify({
                success: false,
                error: 'Password must be at least 6 characters',
            }), {
                status: 400,
                headers: { 'Content-Type': 'application/json' },
            });
        }

        const normalizedEmail = email.trim().toLowerCase();

        // Check if customer already exists
        const existing = await env.DB.prepare(
            'SELECT id, password_hash FROM customers WHERE LOWER(email) = ?'
        ).bind(normalizedEmail).first<{ id: number; password_hash: string | null }>();

        if (existing && existing.password_hash) {
            return new Response(JSON.stringify({
                success: false,
                error: 'An account with this email already exists. Please log in.',
            }), {
                status: 409,
                headers: { 'Content-Type': 'application/json' },
            });
        }

        const passwordHash = await hashPassword(password);

        let customerId: number;

        if (existing) {
            // Customer record exists (from quote/admin) but no password — set their password
            await env.DB.prepare(
                'UPDATE customers SET password_hash = ?, name = ?, phone = COALESCE(?, phone), updated_at = CURRENT_TIMESTAMP WHERE id = ?'
            ).bind(passwordHash, name.trim(), phone?.trim() || null, existing.id).run();
            customerId = existing.id;
        } else {
            // Create new customer record
            const result = await env.DB.prepare(
                'INSERT INTO customers (email, name, phone, password_hash, created_at, updated_at) VALUES (?, ?, ?, ?, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)'
            ).bind(normalizedEmail, name.trim(), phone?.trim() || null, passwordHash).run();

            if (!result.success) {
                return new Response(JSON.stringify({
                    success: false,
                    error: 'Failed to create account',
                }), {
                    status: 500,
                    headers: { 'Content-Type': 'application/json' },
                });
            }

            customerId = Number(result.meta.last_row_id);
        }

        // Fetch the full customer record
        const customer = await env.DB.prepare(
            'SELECT id, name, email FROM customers WHERE id = ?'
        ).bind(customerId).first<{ id: number; name: string; email: string }>();

        if (!customer) {
            return new Response(JSON.stringify({
                success: false,
                error: 'Failed to retrieve account',
            }), {
                status: 500,
                headers: { 'Content-Type': 'application/json' },
            });
        }

        // Create a real JWT session
        const token = await createSession(env, {
            userId: customer.id,
            email: customer.email,
            name: customer.name,
            role: 'customer',
        });

        return new Response(JSON.stringify({
            success: true,
            token,
            user: {
                id: customer.id.toString(),
                name: customer.name,
                email: customer.email,
            },
        }), {
            headers: { 'Content-Type': 'application/json' },
        });

    } catch (error) {
        console.error('Register error:', error);
        return new Response(JSON.stringify({
            success: false,
            error: 'Internal server error',
        }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' },
        });
    }
};
