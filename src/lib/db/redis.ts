// NOTE: requires

import { env } from '$env/dynamic/private';
import * as ioredis from 'ioredis';
// import * as redis from 'redis';

let _redisClient: ioredis.Redis|undefined = undefined;

export async function GetRedisClient() {
    if (!_redisClient) {
        _redisClient = new ioredis.Redis(env.REDIS_URL);
    }
    return _redisClient;
}
