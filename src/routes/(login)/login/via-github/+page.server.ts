import { ResolveGithubAppConfig, ResolveHostname } from '$lib/github';
import { RegisterGithubLoginOTP } from '$lib/otp.js';
import { GenerateRandomString } from '$lib/session.js';
import { redirect } from '@sveltejs/kit';


export async function load(e) {
    let returnUrl = new URL('/login/verify-github', (await ResolveHostname())||'').toString();
    let githubClientId = (await ResolveGithubAppConfig()).clientId;
    let state = GenerateRandomString(64);
    await RegisterGithubLoginOTP(state);
    throw redirect(302, `https://github.com/login/oauth/authorize?scope=user:email&client_id${encodeURIComponent(githubClientId)}&state=${state}&redirect_uri=${encodeURIComponent(returnUrl)}`);
}
