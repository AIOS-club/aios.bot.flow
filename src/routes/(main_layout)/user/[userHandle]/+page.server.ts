
import { GetUser, GetUserBotList } from '$lib/db/prisma.js';
import { CheckLoginSession, SESSION_USER_CODE_KEY, SESSION_USER_HANDLE_KEY } from '$lib/session';
import { error } from '@sveltejs/kit';

export async function load({ params, cookies }) {
    let user = await GetUser(params.userHandle);
    if (!user) {
        throw error(404, {
            message: 'No such user.'
        });
    }
    let botList = await GetUserBotList(params.userHandle);
    
    let userHandle = cookies.get(SESSION_USER_HANDLE_KEY)||'';
    let session = cookies.get(SESSION_USER_CODE_KEY)||'';
    let allowEdit =
        (userHandle === params.userHandle
        && await CheckLoginSession(userHandle, session))
        || (user!.role === 'ADMIN');
    return {
        params: params,
        allowEdit: allowEdit,
        user: {
            handle: params.userHandle,
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
