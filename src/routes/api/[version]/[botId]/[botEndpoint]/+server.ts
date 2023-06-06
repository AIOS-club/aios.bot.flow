import fetch from 'node-fetch';
import { GetBotById } from "$lib/db/prisma";
import { BotAPIResponseType } from "$lib/response";
import type { RequestEvent } from "@sveltejs/kit";
import { IsRelativePathEqual } from '$lib/util';

function _CheckSchema(value: any, schema: any) {
    if (
        (typeof value === 'string' && schema === 'string')
        || (typeof value === 'number' && schema === 'number')
        || (typeof value === 'boolean' && schema === 'boolean')
        || (value === undefined && schema === 'undefined')
        || (value === null && schema === 'null')
        || (((value === undefined)||(value === null)) && schema === 'none')
    ) { return true; }
    if (!Array.isArray(schema)) { return false; }
    if (schema.length < 2) { return false; }
    switch (schema[0]) {
        case 'array': {
            if (!Array.isArray(value)) { return false; }
            for (let i = 0; i < value.length; i++) {
                if (!_CheckSchema(value[i], schema[1])) { return false; }
            }
            return true;
        }
        case 'map': {
            if (value.length < 3) { return false; }
            if (typeof value !== 'object') { return false; }
            for (let k in value) {
                if (typeof k !== schema[1]) { return false; }
                if (!_CheckSchema(value[k], schema[2])) { return false; }
            }
            return true;
        }
        case 'object': {
            if (typeof value !== 'object') { return false; }
            for (let k in schema[1]) {
                if (!_CheckSchema(value[k], schema[1][k])) { return false; }
            }
            return true;
        }
        case 'oneof': {
            let subsch = schema.slice(1);
            for (let i = 0; i < subsch.length; i++) {
                if (_CheckSchema(value, subsch[i])) { return true; }
            }
            return false;
        }
    }
}
const REGEX_COMMAND = /([a-zA-Z0-9_$]+)=(?:(\*(?:str|json))|((?:\[\d+\]|\.[a-zA-Z0-9_$]+|#number|#boolean|#string)+))/;
const REGEX_SINGLE_COMMAND = /^((?:\[\d+\]|\.[a-zA-Z0-9_$]+|#number|#boolean|#string))(.*)/;
function _ExecuteEffect(currentEnv: {[key: string]: any}, response: string, effect: string) {
    effect.split('\n').forEach((v) => {
        let matchres = REGEX_COMMAND.exec(v);
        if (!matchres) { return; }
        let key = matchres[1].trim();
        let valueDescriptor = matchres[2].trim();
        if (valueDescriptor.startsWith('*')) {
            currentEnv[key] =
            valueDescriptor === '*str'? response
            : valueDescriptor === '*json'? JSON.parse(response)
            : response;
        }
        let subj = JSON.stringify(response);
        while (true) {
            if (valueDescriptor.trim() === '') {
                break;
            }
            matchres = REGEX_SINGLE_COMMAND.exec(valueDescriptor);
            if (!matchres) { return; }
            if (matchres[1].startsWith('#')) {
                // conversion...
            } else if (matchres[1].startsWith('.')) {
                subj = subj[matchres[1].substring(1) as any];
                valueDescriptor = matchres[2];
                continue;
            } else if (matchres[1].startsWith('[')) {
                subj = subj[parseInt(matchres[1].substring(1, matchres[1].length-1))];
                valueDescriptor = matchres[2];
                continue;
            }
        }
        currentEnv[key] = subj;
    });
    return currentEnv;
}

const REGEX_TEMPLATE_VAR = /\{([a-zA-Z0-9_ $]+)\}/g;
function _InstantiateTemplate(env: {[key: string]: any}, template: string) {
    let refs = [...template.matchAll(REGEX_TEMPLATE_VAR)];
    let subj = template;
    refs.forEach((v) => {
        let s = typeof env[v[1]] === 'object'? JSON.stringify(env[v[1]]) : env[v[1]];
        subj = subj.replace(v[0], s);
    });
    return subj;
}

async function _RequestLLM(currentEnv: {[key: string]: any}, template: string, effect: string, format: string, token: string) {
    let _prompt = _InstantiateTemplate(currentEnv, template);
    let fetchReq = await fetch(
        'https://api.aios.chat/v1/chat/completions',
        {
            method: 'POST',
            body: JSON.stringify({
                frequency_penalty: 1,
                temperature: 0.8,
                presence_penalty: -1,
                model: 'gpt-3.5-turbo',
                messages: [
                    {
                        role: 'user',
                        content: `${_prompt}. Please reply in ${format} and with the code itself only.`,
                    }
                ]
            }),
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        }
    );
    
    if (fetchReq.status !== 200) {
        throw _Error(BotAPIResponseType.ERR_INTERNAL_ERROR, fetchReq.statusText);
    }
    let res = await fetchReq.json();
    let responseList = (res as any).choices;
    let lastResponse = responseList[responseList.length - 1].message.content;
    let realRes = _ExecuteEffect(currentEnv, lastResponse, effect);
    return realRes;
}

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
    let descriptor = (bot!.api as any[]).filter((v) => IsRelativePathEqual(v.path, e.params.botEndpoint!));
    if (descriptor.length <= 0) {
        return _Error(BotAPIResponseType.ERR_NO_ENDPOINT, 'No such endpoint.');
    }
    let descriptorIndex = descriptor.findIndex((v) => v.type.toUpperCase() === 'GET');
    if (descriptorIndex === -1) {
        return _Error(BotAPIResponseType.ERR_WRONG_REQUEST_TYPE, `GET not supported here.`)
    }
    
    let endpointConfig = descriptor[descriptorIndex].config;
    let flowList = endpointConfig.flow;
    let env: {[key: string]: any} = {};
    for (let i = 0; i < flowList.length; i++) {
        let flowStep = flowList[i];
        let realEffect = flowStep.result? `${flowStep.result}=*json` : flowStep.effect;
        if (flowStep.template) {
            env = await _RequestLLM(env, flowStep.template, realEffect, flowStep.responseFormat||'JSON', bot.token);
        } else {
            _ExecuteEffect(env, JSON.stringify(env), realEffect);
        }
    }
    let r: {[key: string]: any} = {};
    endpointConfig.output.forEach((v: any) => {
        r[v] = env[v];
    })
    return _Ok(r);
}

export async function POST(e: RequestEvent) {
    let bot = await GetBotById(parseInt(e.params.botId||'', 10));
    if (!bot) {
        return _Error(BotAPIResponseType.ERR_NO_BOT, 'No such bot.');
    }
    let descriptor = (bot!.api as any[]).filter((v) => IsRelativePathEqual(v.path, e.params.botEndpoint!));
    if (descriptor.length <= 0) {
        return _Error(BotAPIResponseType.ERR_NO_ENDPOINT, 'No such endpoint.');
    }
    let descriptorIndex = descriptor.findIndex((v) => v.type.toUpperCase() === 'POST');
    if (descriptorIndex === -1) {
        return _Error(BotAPIResponseType.ERR_WRONG_REQUEST_TYPE, `POST not supported here.`)
    }

    let req = await e.request.json();

    let endpointConfig = descriptor[descriptorIndex].config;
    let flowList = endpointConfig.flow;
    let env: {[key: string]: any} = req;
    for (let i = 0; i < flowList.length; i++) {
        let flowStep = flowList[i];
        let realEffect = flowStep.result? `${flowStep.result}=*json` : flowStep.effect;
        if (flowStep.template) {
            env = await _RequestLLM(env, flowStep.template, realEffect, flowStep.responseFormat||'JSON', bot.token);
        } else {
            _ExecuteEffect(env, JSON.stringify(env), realEffect);
        }
    }
    let r: {[key: string]: any} = {};
    endpointConfig.output.forEach((v: any) => {
        r[v] = env[v];
    })
    return _Ok(r);
}
