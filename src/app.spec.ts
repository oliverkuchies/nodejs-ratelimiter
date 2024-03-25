import request from "supertest";

const rootURL = "http://localhost:3000";

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
