import { createClient, RedisClientType } from "redis";
import {RateRecord} from "../middleware/ratelimiter";

export default class RateLimiterService {
  protected client: RedisClientType;
  constructor() {
    this.client = createClient({
      url: `redis://:@${process.env.REDIS_HOST}:${process.env.REDIS_PORT}`,
    });
    this.client.on("error", (err) => console.log("Redis Client Error", err));
    this.client
        .connect()
        .then(() => console.log("Successfully connected redis"));
  }
  getSortedSetKey(ip: string, route: string) {
    return `${ip}:${route}`;
  }

  async addUserToAccessRecord(rateRecord : RateRecord) {
    const { ip, route, expiry } = rateRecord;
    const requestDate = Math.round(new Date().getTime() / 1000);
    const key = this.getSortedSetKey(ip, route);

    console.log(`Adding user to access record: ${key}`, {
      score: requestDate,
      value: requestDate.toString(),
    })

    await this.client.zAdd(key, [{
      score: requestDate,
      value: requestDate.toString(),
    }]);

    await this.client.expire(key, expiry);
  }

  async isRateLimitExceeded(
      rateRecord: RateRecord,
      requestsAllowed: number
  ) {
    const { ip, route, expiry } = rateRecord;
    const key = this.getSortedSetKey(ip, route);
    const rateLimit = await this.client.zRange(key, 0, -1);
    return rateLimit.length > requestsAllowed;
  }
}
