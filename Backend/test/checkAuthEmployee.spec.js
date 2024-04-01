const chai = require("chai");
const chaiHttp = require("chai-http");
const jwt = require("jsonwebtoken");
// const check_Authentication = require("../middlewares/check_Authentication");
const server = require("../server"); // Replace with the actual path to your server file
const expect = chai.expect;

chai.use(chaiHttp);

describe("check_Authentication Middleware", () => {
  it("Should return 403 if token is not provided", (done) => {

    const mockId = "1";
    chai
      .request(server)
      .get(`/empform/getresponses/${mockId}`)
      .end((err, res) => {
        expect(res).to.have.status(403);
        expect(res.body.error).to.equal("Not able to identify the token or token not provided");
        
        done();
      });
  });

  it("Should return 403 if token is invalid", (done) => {
    const mockId = "1";

    chai
      .request(server)
      .get(`/empform/getresponses/${mockId}`)
      .set("Authorization", `Bearer`)
      .end((err, res) => {
        expect(res).to.have.status(403);
        expect(res.body.error).to.equal("Not able to identify the token or token not provided");

        done();
      });
  });

  it("Should return 401 if user is not an employee", (done) => {
    const userToken = jwt.sign({ role: "user" }, process.env.SUPERSECRET_KEY);
    const mockId = "1";

    chai
      .request(server)
      .get(`/empform/getresponses/${mockId}`)
      .set("Authorization", `Bearer ${userToken}`)
      .end((err, res) => {
        expect(res).to.have.status(401);
        expect(res.body.message).to.equal("Unauthorized! Please login as an employee");

        done();
      });
  });

});
