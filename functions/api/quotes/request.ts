interface Env {
    DB: D1Database;
}

export const onRequestPost: PagesFunction<Env> = async (context) => {
    const { request, env } = context;

    try {
        const body: any = await request.json();
        const {
            name,
            email,
            phone,
            address,
            city,
            zip_code,
            service_type,
            property_size,
            description,
        } = body;

        // Validate required fields
        if (!name || !email || !service_type) {
            return new Response(JSON.stringify({
                success: false,
                error: 'Name, email, and service type are required',
            }), { status: 400, headers: { 'Content-Type': 'application/json' } });
        }

        // Validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return new Response(JSON.stringify({
                success: false,
                error: 'Invalid email format',
            }), { status: 400, headers: { 'Content-Type': 'application/json' } });
        }

        // Validate service area if zip code provided
        if (zip_code) {
            const serviceArea = await env.DB.prepare(`
        SELECT * FROM service_areas WHERE zip_code = ? AND is_active = 1
      `).bind(zip_code).first();

            if (!serviceArea) {
                return new Response(JSON.stringify({
                    success: false,
                    error: 'Sorry, we do not currently service your area. Please call us to discuss options.',
                    outsideServiceArea: true,
                }), { status: 400, headers: { 'Content-Type': 'application/json' } });
            }
        }

        // Insert quote request
        const result = await env.DB.prepare(`
      INSERT INTO quotes (
        contact_name, contact_email, contact_phone, contact_address,
        contact_city, contact_zip, service_type, property_size, description, status
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 'pending')
    `).bind(
            name.trim(),
            email.trim(),
            phone?.trim() || null,
            address?.trim() || null,
            city?.trim() || null,
            zip_code?.trim() || null,
            service_type,
            property_size || null,
            description?.trim() || null
        ).run();

        if (!result.success) {
            throw new Error('Failed to save quote request');
        }

        return new Response(JSON.stringify({
            success: true,
            message: 'Quote request submitted! We will contact you within 24 hours.',
            quoteId: result.meta.last_row_id,
        }), { headers: { 'Content-Type': 'application/json' } });

    } catch (error) {
        console.error('Quote request error:', error);
        return new Response(JSON.stringify({
            success: false,
            error: 'Failed to submit quote request',
        }), { status: 500, headers: { 'Content-Type': 'application/json' } });
    }
}
