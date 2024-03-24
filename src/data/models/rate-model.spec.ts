import RateModel from "./rate-model";
import dataSource from "../datasource";
import { RateLimit } from "../entities/rate-limit";

describe("RateModel", () => {
  beforeAll(async () => {
    await dataSource.initialize();

    const rateLimit = new RateLimit();
    rateLimit.windowSeconds = 60;
    rateLimit.requestsAllowed = 100;
    rateLimit.routeRegex = "/api/v1/.*";
    await rateLimit.save();
  });

  it("should create a RateModel instance", () => {
    const rateModel = new RateModel();
    expect(rateModel).toBeInstanceOf(RateModel);
  });

  it("should not find by route when empty", async () => {
    const rateModel = new RateModel();
    const route = "route";
    const rate = await rateModel.findOneByRoute(route);
    expect(rate).toEqual([]);
  });

  it("should have routes defined (1)", async () => {
    const rateEntity = await RateLimit.findOne({
      where: {
        routeRegex: "/api/v1/.*",
      },
    });
    expect(rateEntity).toEqual({
      id: 1,
      requestsAllowed: 100,
      routeRegex: "/api/v1/.*",
      ruleExpiry: null,
      windowSeconds: 60,
    });
  });

  it("should find by route", async () => {
    const rateModel = new RateModel();
    const route = "/api/v1/test";
    const rate = await rateModel.findOneByRoute(route);
    expect(rate).toEqual([
      {
        id: 1,
        requestsAllowed: 100,
        routeRegex: "/api/v1/.*",
        ruleExpiry: null,
        windowSeconds: 60,
      },
    ]);
  });

  afterAll(async () => {
    // Clear mock data
    await RateLimit.clear();
    await dataSource.destroy();
  });
});
