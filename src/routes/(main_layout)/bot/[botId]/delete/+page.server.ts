import { DeleteBotById, GetBotById, GlobalPrismaClient } from "$lib/db/prisma.js";
import { CheckLoginSession } from "$lib/session";
import { error, redirect } from "@sveltejs/kit";

export async function load({params, cookies}) {
    let userEmail = cookies.get('session_userEmail')||'';
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
            botName: bot.botName,
            icon: bot.icon,
            token: bot.token,
            userEmail: bot.userEmail,
        }
    };
}

export const actions = {
    default: async (e) => {
        await DeleteBotById(parseInt(e.params.botId, 10));
        let userEmail = e.cookies.get('session_userEmail')||'';
        throw redirect(302, `/user/${userEmail}`);
    }
};
