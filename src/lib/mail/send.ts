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
    let message = {
        from: env.SMTP_EMAIL,
        to: to,
        subject: title,
        html: content
    };
    return new Promise((resolve, reject) => {
        _mailAccount?.sendMail(message, (err, info) => {
            if (err) { reject(err); }
            else { resolve(info); }
        });
    });
}
