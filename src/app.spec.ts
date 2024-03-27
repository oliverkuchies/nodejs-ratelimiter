import request from "supertest";
import datasource, { redisClient } from "./data/datasource";
import { RateLimit } from "./data/entities/rate-limit";
import { GROUP_UNAUTHENTICATED } from "./data/models/rate-model";

const rootURL = "http://localhost:3000";

const rateEntity = new RateLimit();
rateEntity.windowSeconds = 60;
rateEntity.requestsAllowed = 5;
rateEntity.routeRegex = "/another-route/*";
rateEntity.group = GROUP_UNAUTHENTICATED;

beforeAll(async () => {
  await redisClient.connect();
  await redisClient.keys("*").then((keys) => {
    keys.forEach((key) => {
      redisClient.del(key);
    });
  });
  // Create rate entity
  await datasource.initialize();
  await rateEntity.save();
});

it("rate limiter works accordingly", async () => {
  await request(rootURL).get("/another-route/hello").expect(200);
  await request(rootURL).get("/another-route/hello").expect(200);
  await request(rootURL).get("/another-route/hello").expect(200);
  await request(rootURL).get("/another-route/hello").expect(200);
  await request(rootURL).get("/another-route/hello").expect(200);
  await request(rootURL).get("/another-route/hello").expect(429);
});

afterAll(async () => {
  await rateEntity.remove();
  await redisClient.disconnect();
  await datasource.destroy();
});
