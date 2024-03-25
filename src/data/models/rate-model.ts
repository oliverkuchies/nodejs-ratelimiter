import { RateLimit } from "../entities/rate-limit";
import { Raw } from "typeorm";

export const GROUP_UNAUTHENTICATED = "unauthenticated";
export const GROUP_AUTHENTICATED = "authenticated";

export default class RateModel {
  public async findOneByRoute(
    route: string,
    group: string = GROUP_UNAUTHENTICATED,
  ) {
    const rateRules = await RateLimit.find({
      order: { id: "DESC" },
      where: [
        {
          ruleExpiry: Raw(() => "NOW() < ruleExpiry OR ruleExpiry IS NULL"),
          group: group,
        },
      ],
    });

    return rateRules.find((rule: RateLimit) => route.match(rule.routeRegex));
  }
}
