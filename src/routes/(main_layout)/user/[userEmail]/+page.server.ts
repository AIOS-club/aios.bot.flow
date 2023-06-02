
import { GetUser, GetUserBotList } from '$lib/db/prisma.js';
import { CheckLoginSession } from '$lib/session';
import { error } from '@sveltejs/kit';
import * as crypto from 'crypto';

function md5hex(str: string) {
    const md5 = crypto.createHash('md5')
    return md5.update(str, 'binary').digest('hex')
}

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
            icon: `https://www.gravatar.com/avatar/${md5hex(params.userEmail.trim())}`,
            
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
