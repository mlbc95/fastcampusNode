import {} from "jest";
import * as supertest from "supertest";
const request = supertest("http://localhost:8000");

describe("GET /course", () => {
  it("should return 200 OK", (done) => {
    request.get("/courses")
      .expect(200, done);
    });
});