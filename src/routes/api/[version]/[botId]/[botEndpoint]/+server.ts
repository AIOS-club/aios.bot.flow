import { GetBotById } from "$lib/db/prisma";
import { BotAPIResponseType } from "$lib/response";
import type { RequestEvent } from "@sveltejs/kit";

function _Error(code: BotAPIResponseType, message: string, headers: {[key: string]: string} = {}) {
    return new Response(
        JSON.stringify({
            code: code,
            message: message
        }),
        {
            headers: {
                'Content-Type': 'application/json',
                ...headers
            }
        }
    );
}

function _Ok(data: any, headers: {[key: string]: string} = {}) {
    return new Response(
        JSON.stringify({
            code: BotAPIResponseType.OK,
            message: '',
            data: data
        }),
        {
            headers: {
                'Content-Type': 'application/json',
                ...headers
            }
        }
    );
}

export async function GET(e: RequestEvent) {
    let bot = await GetBotById(parseInt(e.params.botId||'', 10));
    if (!bot) {
        return _Error(BotAPIResponseType.ERR_NO_BOT, 'No such bot.');
    }
    let descriptor = (bot!.api as any[]).filter((v) => v.path.substring(1) === e.params.botEndpoint);
    if (descriptor.length <= 0) {
        return _Error(BotAPIResponseType.ERR_NO_ENDPOINT, 'No such endpoint.');
    }
    let descriptorIndex = descriptor.findIndex((v) => v.type.toUpperCase() === 'GET');
    if (descriptorIndex === -1) {
        return _Error(BotAPIResponseType.ERR_WRONG_REQUEST_TYPE, `GET not supported here.`)
    }
    return _Ok(descriptor[descriptorIndex]);
    // TODO: request api here.
}

export async function POST(e: RequestEvent) {
    let bot = await GetBotById(parseInt(e.params.botId||'', 10));
    if (!bot) {
        return _Error(BotAPIResponseType.ERR_NO_BOT, 'No such bot.');
    }
    let descriptor = (bot!.api as any[]).filter((v) => v.path.substring(1) === e.params.botEndpoint);
    if (descriptor.length <= 0) {
        return _Error(BotAPIResponseType.ERR_NO_ENDPOINT, 'No such endpoint.');
    }
    let descriptorIndex = descriptor.findIndex((v) => v.type.toUpperCase() === 'GET');
    if (descriptorIndex === -1) {
        return _Error(BotAPIResponseType.ERR_WRONG_REQUEST_TYPE, `GET not supported here.`)
    }
    return _Ok(descriptor[descriptorIndex]);
    // TODO: request api here.
}
