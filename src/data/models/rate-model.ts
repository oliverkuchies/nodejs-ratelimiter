import { RateLimit } from "../entities/rate-limit";

export default class RateModel {
  public async findOneByRoute(route: string) {
    const rateRules = await RateLimit.find();
    return rateRules.find((rule: RateLimit) => route.match(rule.routeRegex));
  }
}
