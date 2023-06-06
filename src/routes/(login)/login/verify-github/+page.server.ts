import { ResolveGithubAppConfig } from '$lib/github.js';
import { CheckGithubLoginOTP } from '$lib/otp.js';
import { redirect } from '@sveltejs/kit';

export async function load(e) {
    let state = e.url.searchParams.get('state')||'';
    if (!await CheckGithubLoginOTP(state)) {
        throw redirect(302, '/login');
    }
    let code = e.url.searchParams.get('code');
    let githubClient = await ResolveGithubAppConfig();
    let r = await fetch(
        `https://github.com/login/oauth/access_token`,
        {
            method: 'POST',
            body: JSON.stringify({
                client_id: githubClient.clientId,
                client_secret: githubClient.clientSecret,
                code: code,
            }),
            headers: {
                'Content-Type': 'application/json'
            }
        }
    );
    return {
        data: await r.text()
    };

}