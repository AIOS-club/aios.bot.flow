import { GetAllConfig, GetUser, RegisterConfig } from '$lib/db/prisma';
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
