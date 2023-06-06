import { GetPersistentConfigByKey, GetUser, UpdateConfig } from '$lib/db/prisma';
import { SESSION_USER_HANDLE_KEY } from '$lib/session.js';
import { error, redirect } from '@sveltejs/kit';

export async function load({ params, cookies }) {
    let userHandle = cookies.get(SESSION_USER_HANDLE_KEY)||'';
    let user = await GetUser(userHandle);
    if (!user) {
        throw redirect(302, '/');
    }
    if (user && user.role !== 'ADMIN') {
        throw redirect(302, `/user/${userHandle}`);
    }
    let x = await GetPersistentConfigByKey(params.key);
    if (!x) {
        throw error(404, { message: 'No such config key. Please create a new config item under this key first. ' });
    }
    return {
        config: x
    };
}

export const actions = {
    default: async (e) => {
        let key = e.params.key;
        let formData = await e.request.formData();
        let value = formData.get('__raw')?.toString()||'';
        await UpdateConfig(key, JSON.parse(value));
        throw redirect(302, `/admin/config`);
    }
};
