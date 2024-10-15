import { redisClient } from "../../server"

export const getOrSetCache = async <T>(key: string, callback: () => Promise<T>, ttl: number): Promise<T> => {
    const cachedValue: string | null = await redisClient.get(key);

    if(cachedValue) return JSON.parse(cachedValue);

    const resourceValue: T = await callback();

    redisClient.setEx(key, ttl, JSON.stringify(resourceValue));

    return resourceValue;
}

export const checkAndSetCache = async (key: string, callback: Function, ttl: number): Promise<void> => {
    if(await redisClient.exists(key)) return;

    await callback();

    redisClient.setEx(key, ttl, Date.now().toString());
}