import request from "supertest";
import { redisClient } from "./data/datasource";

const rootURL = "http://localhost:3000";

beforeAll(async () => {
  await redisClient.connect();
  await redisClient.flushAll();
});

it("responds with json", function (done) {
  const calls = 6;

  for (let i = 0; i < calls; i++) {
    request(rootURL)
      .get("/api/hello")
      .expect("Content-Type", "text/html; charset=utf-8")
      .expect(200, done);
  }

  request(rootURL)
    .get("/api/hello")
    .expect("Content-Type", "text/html; charset=utf-8")
    .expect(200, done);
});
