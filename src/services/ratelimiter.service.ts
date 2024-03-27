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
    const randomNum = Math.floor(Math.random() * 1000);
    const requestDate = new Date().getTime() / 1000 + randomNum;
    const key = this.getSortedSetKey(ip, route);

    await this.redisClient.zAdd(`${key}`, [
      {
        score: requestDate,
        value: `${requestDate.toString()}_${randomNum.toString()}`,
      },
    ]);

    await this.redisClient.expire(key, expiry);
  }

  async getAccessLogRecords(rateRecord: RateRecord): Promise<string[]> {
    const { ip, route } = rateRecord;
    const key = this.getSortedSetKey(ip, route);

    return this.redisClient.zRange(key, 0, -1);
  }

  async isRateLimitExceeded(accessRecords: string[], requestsAllowed: number) {
    return accessRecords.length > requestsAllowed;
  }
}
