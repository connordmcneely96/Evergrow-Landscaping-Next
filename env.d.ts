/// <reference types="@cloudflare/workers-types" />

interface CloudflareEnv {
    // Cloudflare Bindings
    DB: D1Database;
    R2_BUCKET: R2Bucket;
    SESSIONS: KVNamespace;
    CACHE: KVNamespace;

    // Secrets
    STRIPE_SECRET_KEY: string;
    STRIPE_WEBHOOK_SECRET: string;
    RESEND_API_KEY: string;
    SESSION_SECRET: string;
    JWT_SECRET: string;
    NOTIFICATION_EMAIL?: string;

    // Environment
    ENVIRONMENT: string;
}
