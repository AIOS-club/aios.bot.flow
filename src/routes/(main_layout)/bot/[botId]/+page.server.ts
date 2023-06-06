import { GetBotById, GetUser } from '$lib/db/prisma.js';
import { CheckLoginSession, SESSION_USER_CODE_KEY, SESSION_USER_HANDLE_KEY } from '$lib/session';
import { error } from '@sveltejs/kit';

export async function load({ params, cookies }) {
    let bot = await GetBotById(parseInt(params.botId, 10));
    if (!bot) {
        throw error(404, {
            message: 'No such bot.'
        });
    }
    
    let userHandle = cookies.get(SESSION_USER_HANDLE_KEY)||'';
    let user = await GetUser(userHandle);
    let session = cookies.get(SESSION_USER_CODE_KEY)||'';
    let allowEdit =
        user && (
            (userHandle === bot.userHandle
            && await CheckLoginSession(userHandle, session))
            || (user!.role === 'ADMIN'))
    return {
        params: params,
        allowEdit,
        bot: {
            id: bot.id,
            api: bot.api,
            botName: bot.botName,
            icon: bot.icon,
            userHandle: bot.userHandle,
        }
    };
}
