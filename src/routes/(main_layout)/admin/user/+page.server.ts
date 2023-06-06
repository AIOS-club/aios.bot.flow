import { GetUser } from '$lib/db/prisma';
import { redirect } from '@sveltejs/kit';

export async function load({ params, cookies }) {
    let userEmail = cookies.get('session_userEmail')||'';
    let user = await GetUser(userEmail);
    if (!user) {
        throw redirect(302, '/');
    }
    if (user && user.role !== 'ADMIN') {
        throw redirect(302, `/user/${userEmail}`);
    }
    return {
        success: true
    };
}
