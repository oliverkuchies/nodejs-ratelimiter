import { NextFunction, Response } from "express";
import RateModel from "../data/models/rate-model";
import RateLimiterService from "../services/ratelimiter.service";

export class RateRecord {
  ip: string;
  route: string;
  expiry: number;

  constructor(ip: string, route: string, expiry: number) {
    this.ip = ip;
    this.route = route;
    this.expiry = expiry;
  }
}

export const rateLimiter = async (
  req: any,
  res: Response,
  next: NextFunction,
) => {
  const currentRoute = req.url;
  const rateModel = new RateModel();
  const rateRule = await rateModel.findOneByRoute(currentRoute);

  if (!rateRule) {
    return next();
  }

  req.log.info(`Rate limit for ${currentRoute}: ${rateRule.requestsAllowed}`);

  const rateLimiter = new RateLimiterService(req.redisClient);
  const ip = req.ip as string;
  const rateObject = new RateRecord(ip, currentRoute, rateRule.windowSeconds);

  if (rateRule) {
    await rateLimiter.addUserToAccessRecord(rateObject);

    const exceeded = await rateLimiter.isRateLimitExceeded(
      rateObject,
      rateRule.requestsAllowed,
    );

    if (exceeded) {
      return res.status(429).send("Rate limit exceeded");
    }
  }

  next();
};
