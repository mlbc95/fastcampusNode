import {} from "jest";
import * as supertest from "supertest";
const request = supertest("http://localhost:8000");

describe("Invalid URLs ", () => {
  it("GET should return 404", (done) => {
    request.get("/invalid")
      .expect(404, done);
  });
  it("POST should return 404", (done) => {
    request.get("/invalid")
      .expect(404, done);
  });
  it("PATCH should return 404", (done) => {
    request.get("/invalid")
      .expect(404, done);
  });
  it("DELETE should return 404", (done) => {
    request.get("/invalid")
      .expect(404, done);
  });
});
