import { GetRedisClient } from "./db/redis";

export function GenerateRandomString(n: number, characterSet: string = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789=_') {
    let res: string[] = [];
    for (let i = 0; i < n; i++) {
        res.push(characterSet[Math.floor(Math.random()*characterSet.length-1)]);
    }
    return res.join('');
}

export async function RegisterLoginSession(id: string) {
    let key = `session_${id}`;
    let session = GenerateRandomString(64);
    let client = await GetRedisClient();
    await client.set(key, session);
    return session;
}

export async function CheckLoginSession(id: string, session: string) {
    let key = `session_${id}`;
    let client = await GetRedisClient();
    let res = await client.get(key);
    return res && res === session;
}

export async function InvalidateLoginSession(id: string) {
    let key = `session_${id}`;
    let client = await GetRedisClient();
    await client.del(key);
    return;
}
