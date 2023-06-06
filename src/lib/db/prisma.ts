import { PrismaClient } from '@prisma/client';

export const GlobalPrismaClient = new PrismaClient();


export async function RegisterUser(handle: string) {
    if (!await GlobalPrismaClient.user.findFirst({where: {handle: handle}})) {
        const user = await GlobalPrismaClient.user.create({
            data: {
                handle: handle,
            }
        });
    }
    return;
}

export async function GetUser(handle: string) {
    return await GlobalPrismaClient.user.findFirst({
        where: { handle: handle }
    });
}

export async function UpdateUser(handle: string, newValue: {[key: string]: any}) {
    let user = await GlobalPrismaClient.user.findFirst({
        where: {handle: handle}
    });
    if (!user) { throw new Error(`Cannot find user ${handle}`); }
    delete newValue.email;
    return await GlobalPrismaClient.user.update({
        where: { handle: handle },
        data: newValue
    });
}

export async function GetUserBotList(handle: string) {
    const res = await GlobalPrismaClient.bot.findMany({
        where: { userHandle: handle }
    });
    return res;
}

export async function RegisterBot(userHandle: string, botName: string, icon: string, token: string) {
    return await GlobalPrismaClient.bot.create({
        data: {
            botName: botName,
            userHandle: userHandle,
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
