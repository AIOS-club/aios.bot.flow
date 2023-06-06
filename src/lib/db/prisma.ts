import { PrismaClient } from '@prisma/client';

export const GlobalPrismaClient = new PrismaClient();


export async function RegisterUser(email: string) {
    if (!await GlobalPrismaClient.user.findFirst({where: {email: email}})) {
        const user = await GlobalPrismaClient.user.create({
            data: {
                email: email,
            }
        });
    }
    return;
}

export async function GetUser(email: string) {
    return await GlobalPrismaClient.user.findFirst({
        where: {email: email}
    });
}

export async function UpdateUser(email: string, newValue: {[key: string]: any}) {
    let user = await GlobalPrismaClient.user.findFirst({
        where: {email: email}
    });
    if (!user) { throw new Error(`Cannot find user ${email}`); }
    delete newValue.email;
    return await GlobalPrismaClient.user.update({
        where: { email: email },
        data: newValue
    });
}

export async function GetUserBotList(email: string) {
    const res = await GlobalPrismaClient.bot.findMany({
        where: { userEmail: email }
    });
    return res;
}

export async function RegisterBot(userEmail: string, botName: string, icon: string, token: string) {
    return await GlobalPrismaClient.bot.create({
        data: {
            botName: botName,
            userEmail: userEmail,
            token: token,
            icon: icon,
            api: [],
        }
    });
}

export async function DeleteBotById(botId: number) {
    await GlobalPrismaClient.bot.delete({
        where: { id: botId }
    });
}

export async function GetBotById(id: number) {
    return await GlobalPrismaClient.bot.findFirst({
        where: {id: id}
    });
}

export async function IsUserAdmin(email: string) {
    let user = await GetUser(email);
    return user && user.role === 'ADMIN';
}

export async function UpdateBot(botId: number, newValue: {[key: string]: any}) {
    delete newValue.id;
    return await GlobalPrismaClient.bot.update({
        where: { id: botId },
        data: newValue
    });
}

export async function GetAllConfig() {
    return await GlobalPrismaClient.config.findMany();
}

export async function RegisterConfig(key: string) {
    return await GlobalPrismaClient.config.create({
        data: {
            key: key,
            value: ""
        }
    });
}

export async function GetPersistentConfigByKey(key: string) {
    return await GlobalPrismaClient.config.findUnique({
        where: { key: key }
    });
}

export async function UpdateConfig(key: string, value: any) {
    return await GlobalPrismaClient.config.update({
        where: { key: key },
        data: {
            value: value
        }
    });
}
