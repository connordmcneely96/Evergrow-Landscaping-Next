import { Env } from '../../types';
import { getFromCache, setInCache } from '../../lib/cache';

const CACHE_TTL_SECONDS = 31536000; // 1 year (immutable)

function getContentType(path: string): string {
    const extension = path.split('.').pop()?.toLowerCase();

    const contentTypes: Record<string, string> = {
        html: 'text/html; charset=utf-8',
        css: 'text/css',
        js: 'application/javascript',
        json: 'application/json',
        png: 'image/png',
        jpg: 'image/jpeg',
        jpeg: 'image/jpeg',
        gif: 'image/gif',
        webp: 'image/webp',
        svg: 'image/svg+xml',
        ico: 'image/x-icon',
        woff: 'font/woff',
        woff2: 'font/woff2',
        ttf: 'font/ttf',
        eot: 'application/vnd.ms-fontobject',
        pdf: 'application/pdf',
        txt: 'text/plain',
    };

    return contentTypes[extension || ''] || 'application/octet-stream';
}

export const onRequestGet: PagesFunction<Env> = async (context) => {
    const { request, env, params } = context;

    try {
        const path = Array.isArray(params.path) ? params.path.join('/') : params.path;

        if (!path) {
            return new Response('Not found', { status: 404 });
        }

        const object = await env.R2_BUCKET.get(path);

        if (!object) {
            return new Response('Not found', { status: 404 });
        }

        const headers = new Headers();
        object.writeHttpMetadata(headers);
        headers.set('etag', object.httpEtag);
        headers.set('Cache-Control', `public, max-age=${CACHE_TTL_SECONDS}, immutable`);

        if (!headers.get('Content-Type')) {
            headers.set('Content-Type', getContentType(path));
        }

        return new Response(object.body, {
            headers,
        });

    } catch (error) {
        console.error('Asset serving error:', error);
        return new Response('Internal Server Error', { status: 500 });
    }
};
