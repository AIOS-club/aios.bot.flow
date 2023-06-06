import { env } from "$env/dynamic/private";
import { GetPersistentConfigByKey } from "./db/prisma";

export async function ResolveHostname() {
    let x: string = (await GetPersistentConfigByKey('hostname'))?.value as any;
    if (!x) { x = env.HOSTNAME; }
    return x;
}

export async function ResolveGithubAppConfig() {
    let x = (await GetPersistentConfigByKey('github'))?.value;
    if (!x) {
        x = {
            clientId: env.GITHUB_CLIENT_ID,
            clientSecret: env.GITHUB_CLIENT_SECRET,
        };
    }
    return x;
}
