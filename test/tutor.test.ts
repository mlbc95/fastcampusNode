import {} from "jest";
import * as supertest from "supertest";
const request = supertest("http://localhost:8000");

describe("GET /tutors", () => {
    it("should return 200 OK", (done) => {
      request.get("/tutors")
        .expect(200, done);
      });
  });