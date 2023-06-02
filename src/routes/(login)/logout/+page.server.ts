import { dev } from '$app/environment';
import { InvalidateLoginSession } from '$lib/session.js';
import { redirect } from '@sveltejs/kit';
export async function load({cookies}) {
    let userEmail = cookies.get('session_userEmail')||'';
    await InvalidateLoginSession(userEmail);
    cookies.delete(
        'session_userEmail',
        {
            path: '/',
            secure: !dev
        }
    );
    cookies.delete(
        'session_code',
        {
            path: '/',
            secure: !dev
        }
    );
    throw redirect(302, '/');
}
