
import type { RequestEvent } from '@sveltejs/kit';
import { CheckLoginSession } from '$lib/session';
import { GetUser } from '$lib/db/prisma';

export async function load(e: RequestEvent) {
    let loggedIn = false;
    let data: {[key: string]: any} = {};
    if (e.cookies.get('session_userEmail')) {
        let userEmail = e.cookies.get('session_userEmail')!;
        let session = e.cookies.get('session_code')||'';
        let res = await CheckLoginSession(userEmail, session);
        if (res) {
            let user = await GetUser(userEmail)
            return {
                success: true,
                loggedIn: true,
                user: user
            };
        }
    }
    return {
        success: true,
        loggedIn: false
    };
}
