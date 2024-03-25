import { RedisClientType } from "redis";
import { RateRecord } from "../middleware/ratelimiter";

export default class RateLimiterService {
  constructor(protected redisClient: RedisClientType) {
    this.redisClient = redisClient;
  }
  getSortedSetKey(ip: string, route: string) {
    return `${ip}:${route}`;
  }

  async addUserToAccessRecord(rateRecord: RateRecord) {
    const { ip, route, expiry } = rateRecord;
    const requestDate = new Date().getTime() / 1000;
    const key = this.getSortedSetKey(ip, route);

    await this.redisClient.zAdd(key, [
      {
        score: requestDate,
        value: requestDate.toString(),
      },
    ]);

    await this.redisClient.expire(key, expiry);
  }

  async isRateLimitExceeded(rateRecord: RateRecord, requestsAllowed: number) {
    const { ip, route } = rateRecord;
    const key = this.getSortedSetKey(ip, route);

    const rateLimit = await this.redisClient.zRange(key, 0, -1);

    return rateLimit.length > requestsAllowed;
  }
}
