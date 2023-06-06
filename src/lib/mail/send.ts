import { env } from '$env/dynamic/private';
import { GetPersistentConfigByKey } from '$lib/db/prisma';
import * as nodemailer from 'nodemailer';

let _mailAccount: nodemailer.Transporter|undefined = undefined;

type _Message = {
    from?: string,
    to: string,
    subject: string,
    html: string,
};

function _ResolveSMTPSender(mailerConfig: any) {
    let host = mailerConfig.config.server || env.SMTP_SERVER;
    let port = mailerConfig.config.port || env.SMTP_PORT;
    let email = mailerConfig.config.email || env.SMTP_EMAIL;
    let password = mailerConfig.config.password || env.SMTP_PASSWORD;
    return async function (message: _Message) {
        let _mailAccount = nodemailer.createTransport({
            host: host,
            port: port,
            secure: true,
            auth: {
                user: email,
                pass: password,
            }
        } as any);
        await _mailAccount.verify();
        message.from = email;
        await _mailAccount.sendMail(message);
    };
}


export async function SendMail(to: string, title: string, content: string) {
    let mailerConfig = (await GetPersistentConfigByKey('mailer'))?.value;
    if (!mailerConfig) {
        return await _ResolveSMTPSender(undefined)({
            to: to,
            subject: title,
            html: content,
        });
    }
    let sender: any;
    switch (mailerConfig.type) {
        case 'smtp': sender = _ResolveSMTPSender(mailerConfig); break;
        // case 'postmark': sender = _ResolvePostmarkSender(mailerConfig); break;
    }
    await sender({
        to: to,
        subject: title,
        html: content,
    });
}
