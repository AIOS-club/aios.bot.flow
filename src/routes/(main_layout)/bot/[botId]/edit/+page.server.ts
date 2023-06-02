import * as yaml from 'yaml';
import { GetBotById, GlobalPrismaClient } from "$lib/db/prisma.js";
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
        const data = await e.request.formData();
        let botName = data.get('botName')?.toString()||'';
        let botFlow = data.get('botFlow')?.toString()||'';
        let token = data.get('token')?.toString()||'';
        let icon = data.get('icon')?.toString()||'';
        let useYaml = data.get('useYaml');
        botFlow = useYaml? yaml.parse(botFlow) : JSON.parse(botFlow);
        await GlobalPrismaClient.bot.update({
            where: { id: parseInt(e.params.botId, 10) },
            data: {
                api: botFlow,
                botName: botName,
                icon: icon,
                token: token,
            }
        });
        
        throw redirect(302, `/bot/${bot.id}`);
    }
};
