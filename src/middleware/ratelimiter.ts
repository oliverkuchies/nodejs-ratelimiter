import {NextFunction, Request, request, Response} from "express";
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

export const rateLimiter = async (req : Request, res : Response, next : NextFunction) => {
  const currentRoute = req.url;
  const rateModel = new RateModel();
  const rate = await rateModel.findOneByRoute(currentRoute);

  if (!rate) {
    return next();
  }

  const rateLimiter = new RateLimiterService();
  const ip = req.ip as string;
  const rateObject = new RateRecord(ip, currentRoute, rate.windowSeconds);

  if (rate) {
    await rateLimiter.addUserToAccessRecord(rateObject);

    const exceeded = await rateLimiter.isRateLimitExceeded(
        rateObject,
        rate.requestsAllowed
    );

    if (exceeded) {
      return res.status(429).send("Rate limit exceeded");
    }
  }

  next();
};
