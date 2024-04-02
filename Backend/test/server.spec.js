const chai = require("chai");
const chaiHttp = require("chai-http");
const server = require("../server"); // Replace with the actual path
const mongoose = require("mongoose");
const sinon = require("sinon");
const { expect } = require("chai");
chai.use(chaiHttp);

describe("Error Handling", () => {
  it("should return 404 for non-existent route", (done) => {
    chai
      .request(server)
      .get("/non-existent-route")
      .end((err, res) => {
        expect(res).to.have.status(404);
        done();
      });
  });
  
});

// describe("DbConnect", () => {
//   let connectStub;
//   let consoleErrorStub;

//   beforeEach(() => {
//     connectStub = sinon.stub(mongoose, "connect");
//     consoleErrorStub = sinon.stub(console, "error");
//   });

//   afterEach(() => {
//     connectStub.restore();
//     consoleErrorStub.restore();
//   });

//   it("should handle connection error", async () => {
//     const error = new Error("Connection error");
//     connectStub.rejects(error);

//     await mongoose.connect(process.env.MONGO_URL);

//     // Expect console.error to be called with the connection error
//     expect(consoleErrorStub.calledWith("Connection error:", error)).to.be.true;
//   });
// });


