import { GetAllConfig, GetUser, RegisterConfig } from '$lib/db/prisma';
import { SESSION_USER_HANDLE_KEY } from '$lib/session.js';
import { redirect } from '@sveltejs/kit';

export async function load({ params, cookies }) {
    let userHandle = cookies.get(SESSION_USER_HANDLE_KEY)||'';
    let user = await GetUser(userHandle);
    if (!user) {
        throw redirect(302, '/');
    }
    if (user && user.role !== 'ADMIN') {
        throw redirect(302, `/user/${userHandle}`);
    }
    let x = await GetAllConfig();
    return {
        configList: x
    };
}

export const actions = {
    new: async (e) => {
        let x = await e.request.formData();
        let key = x.get('key')?.toString();
        await RegisterConfig(key!);
        throw redirect(302, `/admin/config/${key}/`);
    }
}
