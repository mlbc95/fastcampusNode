import {} from "jest";
import * as supertest from "supertest";
const request = supertest("http://localhost:8000");

describe("post /auth/signup", () => {
  it("should return 200 OK", (done) => {
    request.post("/auth/signup")
      .expect(200, done);
  });
});