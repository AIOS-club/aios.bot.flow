import { RegisterBot } from '$lib/db/prisma.js';
import { CheckLoginSession, SESSION_USER_CODE_KEY, SESSION_USER_HANDLE_KEY } from '$lib/session.js';
import { redirect } from '@sveltejs/kit';

export async function load({ cookies }) {
    let userHandle = cookies.get(SESSION_USER_HANDLE_KEY)||'';
    let session = cookies.get(SESSION_USER_CODE_KEY)||'';
    if (!await CheckLoginSession(userHandle, session)) {
        throw redirect(302, '/');
    }
    return { success: true };
}

export const actions = {
    default: async (e) => {
        const data = await e.request.formData();
        let userHandle = e.cookies.get(SESSION_USER_HANDLE_KEY)||'';
        let botName = data.get('botName')?.toString()||'';
        let token = data.get('token')?.toString()||'';
        let icon = data.get('icon')?.toString()||'';
        let bot = await RegisterBot(userHandle, botName, icon, token);
        throw redirect(302, `/bot/${bot.id}`);
    }
};
