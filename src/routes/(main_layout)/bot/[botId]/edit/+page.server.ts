import * as yaml from 'yaml';
import { GetBotById, GetUser, GlobalPrismaClient, UpdateBot } from "$lib/db/prisma.js";
import { CheckLoginSession } from "$lib/session";
import { error, redirect } from "@sveltejs/kit";

export async function load({params, cookies}) {
    let userEmail = cookies.get('session_userEmail');
    if (!userEmail) { throw redirect(302, '/'); }
    let session = cookies.get('session_code')||'';
    if (!await CheckLoginSession(userEmail, session)) {
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
            userEmail: bot.userEmail,
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
        
        let userEmail = e.cookies.get('session_userEmail');
        if (!userEmail) { throw error(403, {message: 'Forbidden'}); }
        let user = await GetUser(userEmail);
        if (!user || (user.email !== bot.userEmail && user.role !== 'ADMIN')) {
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
