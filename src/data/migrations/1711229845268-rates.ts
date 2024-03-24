import { MigrationInterface } from "typeorm";
import config from "config";
import { RateLimit } from "../entities/rate-limit";

export class Rates1711229845268 implements MigrationInterface {
  public async up(): Promise<void> {
    const rateLimiterConfig = config.get("rateLimits") as RateLimit[];
    await Promise.all(
      rateLimiterConfig.map(async (rateLimit) => {
        await RateLimit.create(rateLimit).save();
      }),
    );
  }

  public async down(): Promise<void> {
    await RateLimit.delete({});
  }
}
