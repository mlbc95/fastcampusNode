import {} from "jest";
import * as supertest from "supertest";
const request = supertest("http://localhost:8000");

describe("GET /students", () => {
    it("should return 200 OK", (done) => {
      request.get("/students")
        .expect(200, done);
      });
  });