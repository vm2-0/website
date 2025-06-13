import type { Handle } from '@sveltejs/kit';

export const handle: Handle = async ({ event, resolve }) => {
    // Pass through socket.io requests
    if (event.url.pathname.startsWith('/socket.io')) {
        return new Response(null, { status: 404 });
    }

    const response = await resolve(event);
    return response;
};
