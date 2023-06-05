import { GetBotById, GetUser } from '$lib/db/prisma.js';
import { CheckLoginSession } from '$lib/session';
import { error } from '@sveltejs/kit';

export async function load({ params, cookies }) {
    let bot = await GetBotById(parseInt(params.botId, 10));
    if (!bot) {
        throw error(404, {
            message: 'No such bot.'
        });
    }
    
    let userEmail = cookies.get('session_userEmail')||'';
    let user = await GetUser(userEmail);
    let session = cookies.get('session_code')||'';
    let allowEdit =
        user && (
            (userEmail === bot.userEmail
            && await CheckLoginSession(userEmail, session))
            || (user!.role === 'ADMIN'))
    return {
        params: params,
        allowEdit,
        bot: {
            id: bot.id,
            api: bot.api,
            botName: bot.botName,
            icon: bot.icon,
            userEmail: bot.userEmail,
        }
    };
}
