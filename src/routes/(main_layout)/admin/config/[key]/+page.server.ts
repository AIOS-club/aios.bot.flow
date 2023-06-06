import { GetPersistentConfigByKey, GetUser, UpdateConfig } from '$lib/db/prisma';
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
    let x = await GetPersistentConfigByKey(params.key);
    return {
        config: x
    };
}

export const actions = {
    default: async (e) => {
        let key = e.params.key;
        let formData = await e.request.formData();
        let value = formData.get('__raw')?.toString()||'';
        console.log([...formData.entries()]);
        await UpdateConfig(key, JSON.parse(value));
        throw redirect(302, `/admin/config`);
    }
};
