const dotenv = require("dotenv");
dotenv.config();
const app = require("../../app");
const {User} = require("../../model/user")
const supertest = require("supertest");
const mongoose = require("mongoose");
mongoose.set("strictQuery", false);

const { HOST_TEST_URI } = process.env;
describe("register", () => {
  beforeAll(async () => {
    await mongoose.connect(HOST_TEST_URI);

    await User.deleteMany();
  });
  afterAll(async () => {
    await mongoose.disconnect(HOST_TEST_URI);
  });
  it("should register new user", async () => {
   const response = await supertest(app).post("/api/auth/register").send({
    email: "testUser@mail.com",
    password: "12345"
   })

   expect(response.statusCode).toBe(201);
   expect(response.body.data.user.email).toBe("testUser@mail.com");
  });
});
