import { PrismaClient, user_type } from '@prisma/client';

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