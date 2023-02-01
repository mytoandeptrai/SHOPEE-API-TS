import IORedis, { Redis } from 'ioredis';
import config from 'config';
import logger from 'logger';

const connection = (): Redis => {
  if (!config.redisHost) {
    return;
  }
  const redisInstance = new IORedis(config.redisHost, { connectTimeout: 10000 });

  redisInstance.on('error', (error: any) => {
    logger.error(`Redis error: ${error}`);
  });

  redisInstance.on('connect', () => {
    logger.info('Redis connected');
  });

  return redisInstance;
};

/** Notes with redis instance
 * @param EX seconds -- Set the specified expire time, in seconds.
 * @param PX milliseconds -- Set the specified expire time, in milliseconds.
 * @param NX -- Only set the key if it does not already exist.
 * @param XX -- Only set the key if it already exist.
 */

const redis = connection();

const setEX = async (key: string, seconds: number, data: string) => {
  logger.info(`set cache with key: ${key} and data: ${data} in seconds: ${seconds} seconds`);
  return redis.setex(key, seconds, data);
};

const setNX = async (key: string, data: string | number) => {
  logger.info(`set cache with key: ${key} and data: ${data}`);
  return redis.setnx(key, data);
};

const get = async (key: string) => {
  logger.info(`get cache with key: ${key}`);
  const data = await redis.get(key);
  logger.info(`get redis: ${data}`);
  return data;
};

const clear = async (key: string) => {
  logger.info(`clear cache with key: ${key}`);
  const data = await redis.del(key);
  logger.info(`clear redis: ${data}`);
  return data;
};

export { setEX, setNX, get, clear };
