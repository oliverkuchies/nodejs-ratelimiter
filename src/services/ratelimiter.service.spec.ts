import dataSource, { redisClient } from "../data/datasource";
import RateLimiterService from "./ratelimiter.service";
import { RateRecord } from "../middleware/ratelimiter";

describe("Rate Limiter Middleware", () => {
  const request: any = {
    ip: "123.123.123.123",
    path: "/api/v1/users",
    method: "GET",
  };

  beforeAll(async () => {
    await dataSource.initialize();
    await redisClient.connect();
    await redisClient.flushAll();
    request.redisClient = redisClient;
  });

  it("rate limiter should return good response", async () => {
    const rateLimiterService = new RateLimiterService(request.redisClient);
    expect(await rateLimiterService.isRateLimitExceeded(request, 5)).toEqual(
      false,
    );
  });

  it("rate limiter should return bad response", async () => {
    const rateLimiterService = new RateLimiterService(request.redisClient);

    const rateRecord = new RateRecord(
      request.ip,
      request.path,
      new Date().getTime() + 1000 * 60 * 60,
    );

    for (let i = 0; i < 50; i++) {
      await rateLimiterService.addUserToAccessRecord(rateRecord);
      await new Promise((resolve) => setTimeout(resolve, 10));
    }

    expect(
      await rateLimiterService.isRateLimitExceeded(rateRecord, 40),
    ).toEqual(true);
  });

  afterAll(() => {
    redisClient.flushAll();
  });
});
