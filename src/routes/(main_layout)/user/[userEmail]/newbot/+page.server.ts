import { RegisterBot } from '$lib/db/prisma.js';
import { CheckLoginSession } from '$lib/session.js';
import { redirect } from '@sveltejs/kit';
import type { RequestEvent } from './$types.js';

export async function load({ cookies }: RequestEvent) {
    let userEmail = cookies.get('session_userEmail')||'';
    let session = cookies.get('session_code')||'';
    if (!await CheckLoginSession(userEmail, session)) {
        throw redirect(302, '/');
    }
    return { success: true };
}

export const actions = {
    default: async (e) => {
        const data = await e.request.formData();
        let userEmail = e.cookies.get('session_userEmail')||'';
        let botName = data.get('botName')?.toString()||'';
        let token = data.get('token')?.toString()||'';
        let icon = data.get('icon')?.toString()||'';
        let bot = await RegisterBot(userEmail, botName, icon, token);
        throw redirect(302, `/bot/${bot.id}`);
    }
};
