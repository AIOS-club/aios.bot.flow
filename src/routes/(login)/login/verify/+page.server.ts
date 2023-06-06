import { redirect } from '@sveltejs/kit';
import type { RequestEvent } from "./$types";
import { CheckLoginOTP, InvalidateLoginOTP } from '$lib/otp';
import { RegisterLoginSession } from '$lib/session';
import { dev } from '$app/environment';
import { RegisterUser } from '$lib/db/prisma';

export function load({cookies}) {
    if (!cookies.get('login_userEmail')) {
        throw redirect(303, '/login');
    }
    return { success: true };
}

export const actions = {
    default: async (e: RequestEvent) => {
        const data = await e.request.formData();
        let code = data.get('code')?.toString()||'';
        let userEmail = e.cookies.get('login_userEmail')||'';
        let res = await CheckLoginOTP(userEmail, code);
        if (res) {
            await InvalidateLoginOTP(userEmail);
            await RegisterUser(userEmail);
            let session = await RegisterLoginSession(userEmail);
            e.cookies.delete(`login_userEmail`);
            e.cookies.set(
                `session_userEmail`, userEmail,
                {
                    path: '/',
                    secure: !dev,
                }
            );
            e.cookies.set(
                `session_code`, session,
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
