import { GetRedisClient } from "./db/redis";

export function GenerateRandomDigitalCode(n: number) {
    let res: string[] = [];
    for (let i = 0; i < n; i++) {
        res.push(Math.floor(Math.random()*10)+'');
    }
    return res.join('');
}

export async function RegisterLoginOTP(id: string) {
    let key = `otp_${id}`;
    let code = GenerateRandomDigitalCode(6);
    let client = await GetRedisClient();
    await client.set(key, code, 'EX', 600);
    return code;
}

export async function InvalidateLoginOTP(id: string) {
    let key = `otp_${id}`;
    let client = await GetRedisClient();
    await client.del(key);
    return;
}

export async function CheckLoginOTP(id: string, otp: string) {
    let key = `otp_${id}`;
    let client = await GetRedisClient();
    let res = await client.get(key);
    return res && res === otp;
}

export async function RegisterGithubLoginOTP(otp: string) {
    let key = `otp_github_${otp}`;
    let value = `ok`;
    let client = await GetRedisClient();
    await client.set(key, value, 'EX', 600);
    return;
}

export async function CheckGithubLoginOTP(otp: string) {
    let key = `otp_github_${otp}`;
    let client = await GetRedisClient();
    let r = await client.get(key);
    return r && r === 'ok';
}

export async function InvalidateGithubLoginOTP(otp: string) {
    let key = `otp_github_${otp}`;
    let client = await GetRedisClient();
    await client.del(key);
}

export async function RegisterIndieAuthLoginOTP(otp: string) {
    let key = `otp_indieauth_${otp}`;
    let value = `ok`;
    let client = await GetRedisClient();
    await client.set(key, value, 'EX', 600);
    return;
}

export async function CheckIndieAuthLoginOTP(otp: string) {
    let key = `otp_indieauth_${otp}`;
    let client = await GetRedisClient();
    let r = await client.get(key);
    return r && r === 'ok';
}

export async function InvalidateIndieAuthLoginOTP(otp: string) {
    let key = `otp_indieauth_${otp}`;
    let client = await GetRedisClient();
    await client.del(key);
}
