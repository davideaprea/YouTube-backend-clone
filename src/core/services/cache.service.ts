import { redisClient } from "../../server"

export const getOrSetCache = async (key: string, callback: Function, ttl: number) => {
    const cachedValue = await redisClient.get(key);

    if(cachedValue) return JSON.parse(cachedValue);

    const resourceValue = await callback();

    redisClient.setEx(key, ttl, JSON.stringify(resourceValue));

    return resourceValue;
}