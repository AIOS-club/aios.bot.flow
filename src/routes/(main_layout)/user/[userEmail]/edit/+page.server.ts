import { GetUser, UpdateUser } from '$lib/db/prisma';
import { CheckLoginSession } from '$lib/session.js';
import { redirect } from '@sveltejs/kit';
import * as crypto from 'crypto';

function md5hex(str: string) {
    const md5 = crypto.createHash('md5')
    return md5.update(str, 'binary').digest('hex')
}

export async function load({ params, cookies }) {
    let userEmail = cookies.get('session_userEmail')||'';
    let user = await GetUser(userEmail);
    if (!user) {
        throw redirect(302, '/');
    }
    let sessionCode = cookies.get('session_code')||'';
    let checkRes = await CheckLoginSession(userEmail, sessionCode);
    if (!checkRes || (user.email !== params.userEmail && user.role !== 'ADMIN')) {
        throw redirect(302, `/user/${params.userEmail}`);
    }
    return {
        canSetAdmin: user.role === 'ADMIN',
        user: user,
        gravatarIcon: `https://www.gravatar.com/avatar/${md5hex(user.email)}`,
    };
}

export const actions = {
    default: async (e) => {
        const data = await e.request.formData();
        let icon = data.get('icon')?.toString()||'';
        let role = data.get('role')?.toString()||'';
        await UpdateUser(e.params.userEmail, {
            icon: icon,
            role: role
        });
        throw redirect(302, `/user/${e.params.userEmail}`);
    }
};
