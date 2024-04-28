const chai = require("chai");
const chaiHttp = require("chai-http");
const jwt = require("jsonwebtoken");
const server = require("../server"); // Replace with the actual path to your server file
const expect = chai.expect;
const FormModel = require("../models/FormModel");
const sinon = require("sinon");

chai.use(chaiHttp);

const mockForm = [
    {
      _id: "1",
      adminId: "3",
      formtitle: "Jodd",
      formdesc: "desc",
      fields: [{}],
      isComplete: true,
      isTemplate: true,
    },
  ];

describe("check_Authentication Middleware", () => {
  it("Should return 403 if token is not provided", (done) => {
    chai
      .request(server)
      .get("/form/gettemplateforms")
      .end((err, res) => {
        expect(res).to.have.status(403);
        expect(res.body.error).to.equal("Not able to identify the token or token not provided");
        
        done();
      });
  });

  it("Should return 403 if token is invalid", (done) => {
    chai
      .request(server)
      .get("/form/gettemplateforms")
      .set("Authorization", `Bearer`)
      .end((err, res) => {
        expect(res).to.have.status(403);
        expect(res.body.error).to.equal("Not able to identify the token or token not provided");

        done();
      });
  });

  it("Should return 401 if user is not an admin", (done) => {
    const userToken = jwt.sign({ role: "user" }, process.env.SUPERSECRET_KEY);
    chai
      .request(server)
      .get("/form/gettemplateforms")
      .set("Authorization", `Bearer ${userToken}`)
      .end((err, res) => {
        expect(res).to.have.status(401);
        expect(res.body.message).to.equal("Unauthorized! Please login as an admin");

        done();
      });
  });

  it("Should call next() if user is an admin", (done) => {
    const adminToken = jwt.sign({ role: "admin" }, process.env.SUPERSECRET_KEY);
    sinon.stub(FormModel, "find").resolves(mockForm);
    chai
      .request(server)
      .get("/form/gettemplateforms")
      .set("Authorization", `Bearer ${adminToken}`)
      .end((err, res) => {
        // console.log(res.body);
        expect(res).to.have.status(200);
        done();
      });
  });
});
