import { redirect } from '@sveltejs/kit';
import type { RequestEvent } from "./$types";
import { CheckLoginOTP, InvalidateLoginOTP } from '$lib/otp';
import { RegisterLoginSession, SESSION_USER_CODE_KEY, SESSION_USER_HANDLE_KEY } from '$lib/session';
import { dev } from '$app/environment';
import { RegisterUser } from '$lib/db/prisma';

export function load(e: RequestEvent) {
    if (!e.cookies.get('login_userEmail')) {
        throw redirect(303, '/login');
    }
    return { success: true };
}

export const actions = {
    default: async (e: RequestEvent) => {
        const data = await e.request.formData();
        let code = data.get('code')?.toString()||'';
        let userEmail = e.cookies.get('login_userHandle')||'';
        let res = await CheckLoginOTP(userEmail, code);
        if (res) {
            await InvalidateLoginOTP(userEmail);
            await RegisterUser(userEmail);
            let session = await RegisterLoginSession(userEmail);
            e.cookies.delete(`login_userHandle`);
            e.cookies.set(
                SESSION_USER_HANDLE_KEY, userEmail,
                {
                    path: '/',
                    secure: !dev,
                }
            );
            e.cookies.set(
                SESSION_USER_CODE_KEY, session,
                {
                    path: '/',
                    secure: !dev,
                }
            );
            throw redirect(302, '/');
        }
        return {
            success: false,
            data: {
                errorMsg: 'Failed at checking code. Please try again.'
            }
        }
    }
};
