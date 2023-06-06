import { DeleteBotById, GetBotById, GetUser, GlobalPrismaClient } from "$lib/db/prisma.js";
import { CheckLoginSession, SESSION_USER_CODE_KEY, SESSION_USER_HANDLE_KEY } from "$lib/session";
import { error, redirect } from "@sveltejs/kit";

export async function load({params, cookies}) {
    let userHandle = cookies.get(SESSION_USER_HANDLE_KEY);
    if (!userHandle) { throw redirect(302, '/'); }
    let session = cookies.get(SESSION_USER_CODE_KEY)||'';
    if (!await CheckLoginSession(userHandle, session)) {
        throw redirect(302, `/bot/${params.botId}`);
    }
    let bot = await GetBotById(parseInt(params.botId, 10));
    if (!bot) {
        throw error(404, {
            message: 'No such bot.'
        });
    }
    return {
        success: true,
        bot: {
            id: bot.id,
            botName: bot.botName,
            icon: bot.icon,
            token: bot.token,
            userHandle: bot.userHandle,
        }
    };
}

export const actions = {
    default: async (e) => {
        let bot = await GetBotById(parseInt(e.params.botId, 10));
        if (!bot) {
            throw error(404, {
                message: 'No such bot.'
            });
        }
        
        let userHandle = e.cookies.get(SESSION_USER_HANDLE_KEY);
        if (!userHandle) { throw error(403, {message: 'Forbidden'}); }
        let user = await GetUser(userHandle);
        if (!user || (user.handle !== bot.userHandle && user.role !== 'ADMIN')) {
            throw error(403, {message: 'Forbidden'});
        }
        
        await DeleteBotById(parseInt(e.params.botId, 10));
        throw redirect(302, `/user/${userHandle}`);
    }
};
