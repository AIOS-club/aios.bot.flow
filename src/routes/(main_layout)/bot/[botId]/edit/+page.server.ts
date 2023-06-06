import * as yaml from 'yaml';
import { GetBotById, GetUser, GlobalPrismaClient, UpdateBot } from "$lib/db/prisma.js";
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
            api: JSON.stringify(bot.api),
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

        const data = await e.request.formData();
        let botName = data.get('botName')?.toString()||'';
        let botFlow = JSON.parse(data.get('__raw')?.toString()||'[]');
        let token = data.get('token')?.toString()||'';
        let icon = data.get('icon')?.toString()||'';
        await UpdateBot(parseInt(e.params.botId, 10), {
            api: botFlow,
            botName: botName,
            icon: icon,
            token: token
        });
        
        throw redirect(302, `/bot/${bot.id}`);
    }
};
