
import type { RequestEvent } from '@sveltejs/kit';
import { CheckLoginSession, SESSION_USER_CODE_KEY, SESSION_USER_HANDLE_KEY } from '$lib/session';
import { GetUser } from '$lib/db/prisma';

export async function load(e: RequestEvent) {
    let loggedIn = false;
    let data: {[key: string]: any} = {};
    if (e.cookies.get(SESSION_USER_HANDLE_KEY)) {
        let userHandle = e.cookies.get(SESSION_USER_HANDLE_KEY)!;
        let session = e.cookies.get(SESSION_USER_CODE_KEY)||'';
        let res = await CheckLoginSession(userHandle, session);
        if (res) {
            let user = await GetUser(userHandle)
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
