import request from "supertest";
import datasource, { redisClient } from "./data/datasource";
import { RateLimit } from "./data/entities/rate-limit";

const rootURL = "http://localhost:3000";

const rateEntity = new RateLimit();
rateEntity.windowSeconds = 60;
rateEntity.requestsAllowed = 5;
rateEntity.routeRegex = "/dapi/hello";
rateEntity.group = "default";

beforeAll(async () => {
  await redisClient.connect();
  await redisClient.flushAll();
  // Create rate entity
  await datasource.initialize();
  await rateEntity.save();
});

it("rate limiter works accordingly", function (done) {
  request(rootURL).get("/dapi/hello").expect(200, done);

  request(rootURL).get("/dapi/hello").expect(200, done);

  request(rootURL).get("/dapi/hello").expect(200, done);

  request(rootURL).get("/dapi/hello").expect(200, done);

  request(rootURL).get("/dapi/hello").expect(200, done);

  request(rootURL).get("/dapi/hello").expect(429, done);
});

afterAll(async () => {
  await rateEntity.remove();
});
