
import { ResolveHostname } from "$lib/github";
import { RegisterIndieAuthLoginOTP } from "$lib/otp";
import { GenerateRandomString } from "$lib/session";


export async function load() {
    let hostname = await ResolveHostname();
    let state = GenerateRandomString(64);
    await RegisterIndieAuthLoginOTP(state);
    let redirectUri = new URL('/login/verify-indieauth', hostname).toString();
    return {
        hostName: hostname,
        state: state,
        redirectUri: redirectUri,
    };
}
