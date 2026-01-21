interface Env {
    DB: D1Database;
}

export const onRequestPost: PagesFunction<Env> = async (context) => {
    const { request, env } = context;

    try {
        const body: any = await request.json();
        const { name, email, phone, message, service_type } = body;

        // Validate required fields
        if (!name || !email || !message) {
            return new Response(JSON.stringify({
                success: false,
                error: 'Name, email, and message are required'
            }), { status: 400, headers: { 'Content-Type': 'application/json' } });
        }

        // Validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return new Response(JSON.stringify({
                success: false,
                error: 'Invalid email format'
            }), { status: 400, headers: { 'Content-Type': 'application/json' } });
        }

        // Insert into database
        const result = await env.DB.prepare(`
      INSERT INTO contact_requests (name, email, phone, message, service_type, status)
      VALUES (?, ?, ?, ?, ?, 'new')
    `).bind(
            name.trim(),
            email.trim(),
            phone?.trim() || null,
            message.trim(),
            service_type?.trim() || null
        ).run();

        if (!result.success) {
            throw new Error('Failed to save contact request');
        }

        return new Response(JSON.stringify({
            success: true,
            message: 'Thank you for contacting us! We will get back to you within 24 hours.',
        }), { headers: { 'Content-Type': 'application/json' } });

    } catch (error) {
        console.error('Contact form error:', error);
        return new Response(JSON.stringify({
            success: false,
            error: 'Failed to submit form'
        }), { status: 500, headers: { 'Content-Type': 'application/json' } });
    }
}
