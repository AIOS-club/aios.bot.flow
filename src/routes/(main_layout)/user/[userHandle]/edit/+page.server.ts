import { GetUser, UpdateUser } from '$lib/db/prisma';
import { CheckLoginSession, SESSION_USER_CODE_KEY, SESSION_USER_HANDLE_KEY } from '$lib/session.js';
import { redirect } from '@sveltejs/kit';
import * as crypto from 'crypto';

function md5hex(str: string) {
    const md5 = crypto.createHash('md5')
    return md5.update(str, 'binary').digest('hex')
}

export async function load({ params, cookies }) {
    let userHandle = cookies.get(SESSION_USER_HANDLE_KEY)||'';
    let user = await GetUser(userHandle);
    if (!user) {
        throw redirect(302, '/');
    }
    let sessionCode = cookies.get(SESSION_USER_CODE_KEY)||'';
    let checkRes = await CheckLoginSession(userHandle, sessionCode);
    if (!checkRes || (user.handle !== params.userHandle && user.role !== 'ADMIN')) {
        throw redirect(302, `/user/${params.userHandle}`);
    }
    return {
        canSetAdmin: user.role === 'ADMIN',
        user: user,
    };
}

export const actions = {
    default: async (e) => {
        const data = await e.request.formData();
        let icon = data.get('icon')?.toString()||'';
        let role = data.get('role')?.toString()||'';
        await UpdateUser(e.params.userHandle, {
            icon: icon,
            role: role
        });
        throw redirect(302, `/user/${e.params.userHandle}`);
    }
};
