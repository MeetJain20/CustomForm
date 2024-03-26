// const chai = require("chai");
// const chaiHttp = require("chai-http");
// const { describe, it } = require("mocha");
// const server = require("../server"); // Replace with the actual path
// const EmployeeModel = require("../models/EmployeeModel");
// const sinon = require("sinon");
// chai.use(chaiHttp);
// const expect = chai.expect;

// const mockAdmin = {
//   empName: "Test12",
//   mobile: "1234567890",
//   email: "test12@gmail.com",
//   password: "123456",
//   teamName: "Team1",
//   role: "admin",
// };

// describe("Signup Routes", () => {
//   afterEach(() => {
//     sinon.restore();
//   });
//   it("Should create a new admin", (done) => {
//     const adminModelMock = {};
//     Object.assign(AdminModel, adminModelMock);
//     sinon.stub(AdminModel.prototype, "save").resolves(mockAdmin);
//     chai
//       .request(server)
//       .post("/admin/signupadm")
//       .send({
//         empName: "Meet Jain",
//         mobile: "9321431492",
//         email: "temp123@gmail.com",
//         password: "meet@2000",
//         teamName: "Intern",
//         role: "admin",
//       })
//       .end((err, response) => {
//         expect(response).to.have.status(201);
//         done();
//       });
//   });

//   it("Should give user already exists with status code 409", (done) => {
//     // const existingUser = mockAdmin; 
    
//     sinon.stub(AdminModel, "findOne").resolves(mockAdmin);
    
//     chai
//       .request(server)
//       .post("/admin/signupadm")
//       .send({
//         empName: "Meet Jain",
//         mobile: "9321431491",
//         email: "test12@gmail.com",
//         password: "meet@2002",
//         teamName: "Intern",
//         role: "admin",
//       })
//       .end((err, response) => {
//         expect(response).to.have.status(409);
//         expect(response.body.message).to.equal(
//           "User exists already, please login instead."
//         );
//         done();
//       });
//   });
// });
