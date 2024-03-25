import RateModel from "./rate-model";
import dataSource from "../datasource";
import { RateLimit } from "../entities/rate-limit";

function createStandardRateLimit() {
  const rateLimit = new RateLimit();
  rateLimit.windowSeconds = 60;
  rateLimit.requestsAllowed = 5;
  rateLimit.routeRegex = "/api/*";
  rateLimit.group = "unauthenticated";
  return rateLimit;
}

function createRateLimitWithBadExpiry() {
  const rateLimit = new RateLimit();
  rateLimit.windowSeconds = 60;
  rateLimit.requestsAllowed = 5;
  rateLimit.routeRegex = "/bapi/*";
  rateLimit.ruleExpiry = new Date("2020-01-01");
  rateLimit.group = "unauthenticated";
  return rateLimit;
}

function createRateLimitOverride() {
  const rateLimit = new RateLimit();
  rateLimit.windowSeconds = 1000;
  rateLimit.requestsAllowed = 1000;
  rateLimit.routeRegex = "/api/*";
  rateLimit.ruleExpiry = new Date("2025-01-01");
  rateLimit.group = "unauthenticated";
  return rateLimit;
}

function createRateLimitWithAuthenticationGroup() {
  const rateLimit = new RateLimit();
  rateLimit.windowSeconds = 6000;
  rateLimit.requestsAllowed = 1000;
  rateLimit.routeRegex = "/api/*";
  rateLimit.group = "authenticated";
  return rateLimit;
}

describe("RateModel", () => {
  const expiredRateLimit = createRateLimitWithBadExpiry();
  const rateLimit = createStandardRateLimit();
  const rateLimitOverride = createRateLimitOverride();
  const rateLimitAuthenticated = createRateLimitWithAuthenticationGroup();

  beforeAll(async () => {
    await dataSource.initialize();
    await rateLimit.save();
    await expiredRateLimit.save();
    await rateLimitAuthenticated.save();
  });

  it("should create a RateModel instance", () => {
    const rateModel = new RateModel();
    expect(rateModel).toBeInstanceOf(RateModel);
  });

  it("should not find by route when empty", async () => {
    const rateModel = new RateModel();
    const route = "route";
    const rate = await rateModel.findOneByRoute(route);
    expect(rate).toEqual(undefined);
  });

  it("should have routes defined (1)", async () => {
    const rateEntity = await RateLimit.findOne({
      where: {
        routeRegex: "/api/*",
      },
    });
    expect(rateEntity?.requestsAllowed).toBe(5);
    expect(rateEntity?.routeRegex).toBe("/api/*");
    expect(rateEntity?.ruleExpiry).toBe(null);
    expect(rateEntity?.windowSeconds).toBe(60);
  });

  it("should find by route", async () => {
    const rateModel = new RateModel();
    const route = "/api/v1/test";
    const rate = await rateModel.findOneByRoute(route);
    expect(rate?.requestsAllowed).toBe(5);
    expect(rate?.routeRegex).toBe("/api/*");
    expect(rate?.ruleExpiry).toBe(null);
    expect(rate?.windowSeconds).toBe(60);
  });

  it("should ignore expired rate limits", async () => {
    const rateModel = new RateModel();
    const route = "/bapi/v1/test";
    const rate = await rateModel.findOneByRoute(route);
    expect(rate).toBe(undefined);
  });

  it("should create an override when required, and replace existing rule", async () => {
    await rateLimitOverride.save();

    const rateModel = new RateModel();
    const route = "/api/v1/test";
    const rate = await rateModel.findOneByRoute(route);
    expect(rate?.requestsAllowed).toBe(1000);
    expect(rate?.routeRegex).toBe("/api/*");
    expect(rate?.ruleExpiry).toEqual(new Date("2025-01-01T00:00:00.000Z"));
    expect(rate?.windowSeconds).toBe(1000);
  });

  it("should get rate limit when group is authenticated", async () => {
    const rateModel = new RateModel();
    const route = "/api/v1/test";
    const rate = await rateModel.findOneByRoute(route, "authenticated");
    expect(rate?.requestsAllowed).toBe(1000);
    expect(rate?.routeRegex).toBe("/api/*");
    expect(rate?.ruleExpiry).toBe(null);
    expect(rate?.windowSeconds).toBe(6000);
  });

  afterAll(async () => {
    await rateLimit.remove();
    await expiredRateLimit.remove();
    await rateLimitOverride.remove();
    await rateLimitAuthenticated.remove();
    await dataSource.destroy();
  });
});
