export enum BotAPIResponseType {
    OK = 0,
    ERR_NO_TOKEN = -2001,
    ERR_NO_POINTS = -2002,
    ERR_PRIVATE_ONLY = -2004,
    ERR_INPUT_FORMAT_ERROR = -3001,
    ERR_NO_BOT = -4001,
    ERR_NO_ENDPOINT = -4002,
    ERR_WRONG_REQUEST_TYPE = -4003,
    ERR_INTERNAL_ERROR = -5001,
}
export type BotAPIResponse = {
    code: BotAPIResponseType,
    message?: string,
    data: any
};
