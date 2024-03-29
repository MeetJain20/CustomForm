const chai = require("chai");
const chaiHttp = require("chai-http");
const server = require("../server"); // Replace with the actual path
const AdminModel = require("../models/AdminModel");
const EmployeeModel = require("../models/EmployeeModel");
const sinon = require("sinon");
chai.use(chaiHttp);
const expect = chai.expect;

const mockAdmin = {
  empName: "Test12",
  mobile: "1234567890",
  email: "test12@gmail.com",
  password: "123456",
  teamName: "Team1",
  role: "admin",
};

const mockEmployee = [{
  empName: "Test12",
  mobile: "1234567890",
  email: "test12@gmail.com",
  password: "123456",
  teamName: "Team1",
  role: "employee",
  adminId:["45"]
}];

describe("TestCases for saving the admin details", () => {
  afterEach(() => {
    sinon.restore();
  });
  it("Should create a new admin", (done) => {
    const adminModelMock = {
      findOne: () => Promise.resolve(null),
    };
    Object.assign(AdminModel, adminModelMock);
    sinon.stub(AdminModel.prototype, "save").resolves(mockAdmin);
    const employeeMock = {
      
      find: () => Promise.resolve(mockEmployee),
      adminId: { push: sinon.stub().resolves({}) },
      save: ()=>Promise.resolve({}), // Stub the save method
    };
    Object.assign(EmployeeModel, employeeMock);
    chai
      .request(server)
      .post("/admin/signupadm")
      .send({
        empName: "Meet Jain",
        mobile: "9321431492",
        email: "temp123@gmail.com",
        password: "meet@2000",
        teamName: "Intern",
        role: "admin",
      })
      .end((err, response) => {
        expect(response).to.have.status(201);
  
        // Assert that newuser was pushed to employee's adminId array
        // expect(employeeMock.adminId.push.calledOnce).to.be.true;
  
        // Assert that employee.save() was called for each employee
  
        done();
      });
  });
  

});

describe("Error Handling while saving details for admin signup", () => {
  afterEach(() => {
    sinon.restore();
  });

  it("Should give status code 409 if user already exists", (done) => {
    const adminModelMock = {};
    Object.assign(AdminModel, adminModelMock);
    sinon.stub(AdminModel, "findOne").resolves(mockAdmin);
    chai
      .request(server)
      .post("/admin/signupadm")
      .send({
        empName: "Meet Jain",
        mobile: "9321431491",
        email: "test12@gmail.com",
        password: "meet@2002",
        teamName: "Intern",
        role: "admin",
      })
      .end((err, response) => {
        expect(response).to.have.status(409);
        expect(response.body.message).to.equal(
          "User exists already, please login instead."
        );
        done();
      });
  });

  it("Should give statusCode 500 if error while saving new admin", (done) => {
    const adminModelMock = {
      findOne: () => Promise.resolve(null),
    };
    Object.assign(AdminModel, adminModelMock);
    sinon
      .stub(AdminModel.prototype, "save")
      .rejects(new Error("Database Error"));
    chai
      .request(server)
      .post("/admin/signupadm")
      .send({
        empName: "Meet Jain",
        mobile: "9321431492",
        email: "temp123@gmail.com",
        password: "meet@2000",
        teamName: "Intern",
        role: "admin",
      })
      .end((err, response) => {
        expect(response).to.have.status(500);
        expect(response.body.message).to.equal(
          "Signing up failed, please try again later."
        );
        done();
      });
  });

  it("Should give status code 500 if error while searching for existing emails", (done) => {
    const adminModelMock = {};
    Object.assign(AdminModel, adminModelMock);
    sinon.stub(AdminModel, "findOne").rejects(new Error("Database Error"));
    chai
      .request(server)
      .post("/admin/signupadm")
      .send({
        empName: "Meet Jain",
        mobile: "9321431491",
        email: "test12@gmail.com",
        password: "meet@2002",
        teamName: "Intern",
        role: "admin",
      })
      .end((err, response) => {
        expect(response).to.have.status(500);
        expect(response.body.message).to.equal(
          "Error while searching for existing Emails."
        );
        done();
      });
  });
});
