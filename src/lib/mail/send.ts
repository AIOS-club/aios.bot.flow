import { env } from '$env/dynamic/private';
import * as nodemailer from 'nodemailer';

let _mailAccount: nodemailer.Transporter|undefined = undefined;

export async function SendMail(to: string, title: string, content: string) {
    if (!_mailAccount) {
        _mailAccount = nodemailer.createTransport({
            host: env.SMTP_SERVER,
            port: env.SMTP_PORT,
            secure: true,
            auth: {
                user: env.SMTP_EMAIL,
                pass: env.SMTP_PASSWORD,
            }
        } as any);
    }
    await _mailAccount.verify();
    let message = {
        from: env.SMTP_EMAIL,
        to: to,
        subject: title,
        html: content
    };
    await _mailAccount.sendMail(message);
}
