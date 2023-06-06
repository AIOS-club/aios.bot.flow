import { error, redirect } from "@sveltejs/kit";
import type { RequestEvent } from "./$types";
import { dev } from "$app/environment";
import { SendMail } from "$lib/mail/send";
import { RegisterLoginOTP } from "$lib/otp";
import { env } from '$env/dynamic/private';
export const actions = {
    default: async (e: RequestEvent) => {
        const data = await e.request.formData();
        let userEmail = data.get('email')?.toString()||'';
        e.cookies.set('login_userEmail', userEmail, {
            secure: !(dev || import.meta.env.DEV)
        });
        // console.log(`OTP Registering...`);
        let code: string = await RegisterLoginOTP(userEmail);
        if (env.LOGIN_LOG_ONLY) {
            console.log(`OTP Registered. ${code}`);
        } else {
            SendMail(
                userEmail!,
                'You are logging in on aios.bot.flow.',
                `The code is ${code}.\nPlease enter it in 10 minutes.`
            );
        }
        throw redirect(302, '/login/verify');
    }
}

