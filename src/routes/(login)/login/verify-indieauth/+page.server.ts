import { dev } from '$app/environment';
import { RegisterUser } from '$lib/db/prisma';
import { ResolveGithubAppConfig, ResolveHostname } from '$lib/github.js';
import { CheckIndieAuthLoginOTP, InvalidateIndieAuthLoginOTP } from '$lib/otp';
import { RegisterLoginSession, SESSION_USER_CODE_KEY, SESSION_USER_HANDLE_KEY } from '$lib/session';
import { error, redirect } from '@sveltejs/kit';

export async function load(e) {
    let state = e.url.searchParams.get('state')||'';
    if (!await CheckIndieAuthLoginOTP(state)) {
        throw redirect(302, '/login');
    }
    let code = e.url.searchParams.get('code')||'';
    let hostname = await ResolveHostname();
    
    let r = await fetch(
        `https://indielogin.com/auth`,
        {
            method: 'POST',
            body: `code=${encodeURIComponent(code)}&client_id=${hostname}&redirect_uri=${hostname}`
        }
    );
    let rsp = await r.json();
    if (r.status !== 200) {
        throw error(500, {
            message: `${rsp.error}: ${rsp.error_description}`
        });
    }
    await InvalidateIndieAuthLoginOTP(state);
    let me = rsp.me;
    await RegisterUser(me);
    let session = await RegisterLoginSession(me);
    
    e.cookies.set(
        SESSION_USER_HANDLE_KEY, me,
        {
            path: '/',
            secure: !dev,
        }
    );
    e.cookies.set(
        SESSION_USER_CODE_KEY, session,
        {
            path: '/',
            secure: !dev,
        }
    );
    throw redirect(302, '/');

}
