import { redisClient } from "../../server"

export const getOrSetCache = async (key: string, callback: Function, ttl: number) => {
    const cachedValue = await redisClient.get(key);

    if(cachedValue) return JSON.parse(cachedValue);

    const resourceValue = await callback();

    redisClient.setEx(key, ttl, JSON.stringify(resourceValue));

    return resourceValue;
}

export const checkAndSetCache = async (key: string, callback: Function, ttl: number) => {
    if(await redisClient.exists(key)) return;

    await callback();

    redisClient.setEx(key, ttl, Date.now().toString());
}