
import type { RequestEvent } from '@sveltejs/kit';
import { CheckLoginSession } from '$lib/session';

export async function load(e: RequestEvent) {
    let loggedIn = false;
    let data: {userEmail: string} = {};
    if (e.cookies.get('session_userEmail')) {
        let userEmail = e.cookies.get('session_userEmail')!;
        let session = e.cookies.get('session_code')||'';
        let res = await CheckLoginSession(userEmail, session);
        if (res) {
            loggedIn = true;
            data.userEmail = userEmail;
        }
    }
    return {
        success: true,
        loggedIn: loggedIn,
        user: data
    };
}
