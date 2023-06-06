import { dev } from '$app/environment';
import { RegisterUser } from '$lib/db/prisma';
import { ResolveGithubAppConfig } from '$lib/github.js';
import { CheckGithubLoginOTP, InvalidateGithubLoginOTP } from '$lib/otp.js';
import { RegisterLoginSession } from '$lib/session';
import { error, redirect } from '@sveltejs/kit';

export async function load(e) {
    let state = e.url.searchParams.get('state')||'';
    if (!await CheckGithubLoginOTP(state)) {
        throw redirect(302, '/login');
    }
    let code = e.url.searchParams.get('code');
    let githubClient = await ResolveGithubAppConfig();
    if (!(githubClient as any).clientId || !(githubClient as any).clientSecret) {
        throw error(500, {
            message: "This instance did not set up GitHub login properly. Please contact site owner."
        });
    }
    let r = await fetch(
        `https://github.com/login/oauth/access_token`,
        {
            method: 'POST',
            body: JSON.stringify({
                client_id: (githubClient as any).clientId,
                client_secret: (githubClient as any).clientSecret,
                code: code,
            }),
            headers: {
                'Content-Type': 'application/json'
            }
        }
    );
    await InvalidateGithubLoginOTP(state);
    let resp = await r.formData();
    let token = resp.get('access_token')?.toString()||'';
    r = await fetch(
        `https://api.github.com/user`,
        {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Authorization': 'Bearer ${token}'
            }
        }
    );
    if (r.status !== 200) {
        throw error(500, {
            message: 'Failed to retrieve GitHub token.'
        });
    }
    let user = await r.json();
    let userEmail = user.email;
    await RegisterUser(userEmail);
    let session = await RegisterLoginSession(userEmail);
    
    e.cookies.set(
        `session_userEmail`, userEmail,
        {
            path: '/',
            secure: !dev,
        }
    );
    e.cookies.set(
        `session_code`, session,
        {
            path: '/',
            secure: !dev,
        }
    );
    throw redirect(302, '/');

}
