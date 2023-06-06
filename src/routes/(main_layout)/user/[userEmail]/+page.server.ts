
import { GetUser, GetUserBotList } from '$lib/db/prisma.js';
import { CheckLoginSession } from '$lib/session';
import { error } from '@sveltejs/kit';

export async function load({ params, cookies }) {
    let user = await GetUser(params.userEmail);
    if (!user) {
        throw error(404, {
            message: 'No such user.'
        });
    }
    let botList = await GetUserBotList(params.userEmail);
    
    let userEmail = cookies.get('session_userEmail')||'';
    let session = cookies.get('session_code')||'';
    let allowEdit =
        (userEmail === params.userEmail
        && await CheckLoginSession(userEmail, session))
        || (user!.role === 'ADMIN');
    return {
        params: params,
        allowEdit: allowEdit,
        user: {
            email: params.userEmail,
            icon: user.icon,
            bot: botList? botList.map((v) => {
                return {
                    id: v.id,
                    name: v.botName,
                    icon: v.icon || '/default-bot-icon.jpg',
                }
            }) : []
        }
    }
}
