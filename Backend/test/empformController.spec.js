const chai = require("chai");
const chaiHttp = require("chai-http");
const server = require("../server"); // Replace with the actual path
const EmployeeModel = require("../models/EmployeeModel");
const ResponseModel = require("../models/ResponseModel");
const sinon = require("sinon");
chai.use(chaiHttp);
const expect = chai.expect;
const jwt = require("jsonwebtoken");
const FormModel = require("../models/FormModel");
const mongoose = require("mongoose");

const mockEmployee = {

  empName: "Test12",
  mobile: "1234567890",
  email: "test12@gmail.com",
  password: "123456",
  teamName: "Team1",
  role: "employee",
  adminId: ["45"],
};

const mockResponse = [
  {
    formId: "1",
    employeeId: "2",
    empName: "Jodd",
    adminId: "3",
    responses: [{}],
  },
];

const mockResponse2 = {
  formId: "1",
  employeeId: "2",
  adminId: "3",
  responses: [{ response: "hello" }],
};

const mockForm = [
  {
    _id: "1",
    adminId: "3",
    formtitle: "Jodd",
    formdesc: "desc",
    fields: [{}],
    isComplete: true,
    isTemplate: false,
  },
];

//

describe("Test cases while fetching responses for a form", () => {
  afterEach(() => {
    sinon.restore();
  });
  beforeEach(() => {
    const jwtStub = sinon.stub(jwt, "verify");
    jwtStub.callsFake((token, secret, callback) => {
      // Mocking a decoded token with role "Admin"
      const decodedToken = { role: "admin" };
      callback(null, decodedToken);
    });
  });

  it("Should give statusCode 200 if response fetched successfully", (done) => {
    const responseModelMock = {
      find: () => Promise.resolve(mockResponse),
    };
    Object.assign(ResponseModel, responseModelMock);
    const mockId = "1";
    chai
      .request(server)
      .get(`/empform/getresponses/${mockId}`)
      .set("Authorization", "Bearer mokedToken")
      .end((err, response) => {
        expect(response).to.have.status(200);
        done();
      });
  });

  it("Should give statusCode 404 if there is no response for a given formid", (done) => {
    const responseModelMock = {
      find: () => Promise.resolve(null),
    };
    Object.assign(ResponseModel, responseModelMock);
    const mockId = "1";
    chai
      .request(server)
      .get(`/empform/getresponses/${mockId}`)
      .set("Authorization", "Bearer mokedToken")
      .end((err, response) => {
        expect(response).to.have.status(404);
        expect(response.body.message).to.equal("Response not found");
        done();
      });
  });

  it("Should give statusCode 500 if there is error fetching response", (done) => {
    const responseModelMock = {
      find: () => Promise.reject(new Error("Database Error")),
    };
    Object.assign(ResponseModel, responseModelMock);
    const mockId = "1";
    chai
      .request(server)
      .get(`/empform/getresponses/${mockId}`)
      .set("Authorization", "Bearer mokedToken")
      .end((err, response) => {
        expect(response).to.have.status(500);
        expect(response.body.message).to.equal(
          "Failed to fetch assigned forms"
        );
        done();
      });
  });
});

//

describe("Test cases while fetching submitted forms of employee", () => {
  afterEach(() => {
    sinon.restore();
  });
  beforeEach(() => {
    const jwtStub = sinon.stub(jwt, "verify");
    jwtStub.callsFake((token, secret, callback) => {
      // Mocking a decoded token with role "Admin"
      const decodedToken = { role: "admin" };
      callback(null, decodedToken);
    });
  });

  it("Should give statusCode 200 when submitted forms are successfully fetched", (done) => {
    const responseModelMock = {
      find: () => Promise.resolve(mockResponse),
    };
    Object.assign(ResponseModel, responseModelMock);
    sinon.stub(FormModel, "find").resolves(mockForm);
    const mockId = "1";
    chai
      .request(server)
      .get(`/empform/getsubmittedforms/${mockId}`)
      .set("Authorization", "Bearer mockedToken")
      .end((err, response) => {
        expect(response).to.have.status(200);
        done();
      });
  });

  it("Should give statusCode 404 if there is no submitted response of an employee", (done) => {
    const responseModelMock = {
      find: () => Promise.resolve(null),
    };
    Object.assign(ResponseModel, responseModelMock);
    const mockId = "1";
    chai
      .request(server)
      .get(`/empform/getsubmittedforms/${mockId}`)
      .set("Authorization", "Bearer mockedToken")
      .end((err, response) => {
        expect(response).to.have.status(404);
        expect(response.body.message).to.equal("No forms found");
        done();
      });
  });

  it("Should give statusCode 500 if there is error fetching submitted response", (done) => {
    const responseModelMock = {
      find: () => Promise.reject(new Error("Database Error")),
    };
    Object.assign(ResponseModel, responseModelMock);
    const mockId = "1";
    chai
      .request(server)
      .get(`/empform/getsubmittedforms/${mockId}`)
      .set("Authorization", "Bearer mockedToken")
      .end((err, response) => {
        expect(response).to.have.status(500);
        expect(response.body.message).to.equal(
          "Failed to fetch submitted forms"
        );
        done();
      });
  });

  it("Should give statusCode 404 when there is a response but no form of that formid", (done) => {
    const responseModelMock = {
      find: () => Promise.resolve(mockResponse),
    };
    Object.assign(ResponseModel, responseModelMock);
    sinon.stub(FormModel, "find").resolves(null);
    const mockId = "1";
    chai
      .request(server)
      .get(`/empform/getsubmittedforms/${mockId}`)
      .set("Authorization", "Bearer mockedToken")
      .end((err, response) => {
        expect(response).to.have.status(404);
        expect(response.body.message).to.equal("Form details not found");
        done();
      });
  });

  it("Should give statusCode 500 when there is error fetching form for a submitted response", (done) => {
    const responseModelMock = {
      find: () => Promise.resolve(mockResponse),
    };
    Object.assign(ResponseModel, responseModelMock);
    sinon.stub(FormModel, "find").rejects(new Error("Database Error"));
    const mockId = "1";
    chai
      .request(server)
      .get(`/empform/getsubmittedforms/${mockId}`)
      .set("Authorization", "Bearer mockedToken")
      .end((err, response) => {
        expect(response).to.have.status(500);
        expect(response.body.message).to.equal(
          "Failed to fetch submitted forms"
        );
        done();
      });
  });
});

//

describe("Test cases while fetching assigned forms of an employee", () => {
  afterEach(() => {
    sinon.restore();
  });

  beforeEach(() => {
    const jwtStub = sinon.stub(jwt, "verify");
    jwtStub.callsFake((token, secret, callback) => {
      // Mocking a decoded token with role "Admin"
      const decodedToken = { role: "admin" };
      callback(null, decodedToken);
    });
  });

  it("Should return status code 200 and forms when successfully fetched", (done) => {
    sinon.stub(EmployeeModel, "findById").resolves(mockEmployee);
    sinon.stub(FormModel, "find").resolves(mockForm);
    sinon.stub(ResponseModel, "distinct").resolves([]);
    const mockEmployeeId = new mongoose.Types.ObjectId();
    chai
      .request(server)
      .get(`/empform/getassignedforms/${mockEmployeeId}`)
      .set("Authorization", "Bearer mockedToken")
      .end((err, response) => {
        expect(response).to.have.status(200);
        expect(response.body).to.be.an("array").that.is.not.empty;
        done();
      });
  });

  it("Should return status code 404 if employee is not found", (done) => {
    sinon.stub(EmployeeModel, "findById").resolves(null);
    const mockEmployeeId = new mongoose.Types.ObjectId();

    chai
      .request(server)
      .get(`/empform/getassignedforms/${mockEmployeeId}`)
      .set("Authorization", "Bearer mockedToken")
      .end((err, response) => {
        expect(response).to.have.status(404);
        expect(response.body.message).to.equal("Employee not found");
        done();
      });
  });

  it("Should return status code 404 if no forms are found", (done) => {
    sinon.stub(EmployeeModel, "findById").resolves(mockEmployee);
    sinon.stub(FormModel, "find").resolves([]);
    const mockEmployeeId = new mongoose.Types.ObjectId();

    chai
      .request(server)
      .get(`/empform/getassignedforms/${mockEmployeeId}`)
      .set("Authorization", "Bearer mockedToken")
      .end((err, response) => {
        expect(response).to.have.status(404);
        expect(response.body.message).to.equal("No forms found");
        done();
      });
  });

  it("Should return status code 500 if there is an error fetching employee by id", (done) => {
    sinon.stub(EmployeeModel, "findById").rejects(new Error("Database Error"));
    sinon.stub(FormModel, "find").resolves(mockForm);
    const mockEmployeeId = new mongoose.Types.ObjectId();

    chai
      .request(server)
      .get(`/empform/getassignedforms/${mockEmployeeId}`)
      .set("Authorization", "Bearer mockedToken")
      .end((err, response) => {
        expect(response).to.have.status(500);
        expect(response.body.message).to.equal(
          "Failed to fetch assigned forms"
        );
        done();
      });
  });

  it("Should return status code 500 if there is an error fetching forms", (done) => {
    sinon.stub(EmployeeModel, "findById").resolves(mockEmployee);
    sinon.stub(FormModel, "find").rejects(new Error("Database Error"));
    const mockEmployeeId = new mongoose.Types.ObjectId();

    chai
      .request(server)
      .get(`/empform/getassignedforms/${mockEmployeeId}`)
      .set("Authorization", "Bearer mockedToken")
      .end((err, response) => {
        expect(response).to.have.status(500);
        expect(response.body.message).to.equal(
          "Failed to fetch assigned forms"
        );
        done();
      });
  });

  it("Should return status code 500 if there is an error fetching responses", (done) => {
    sinon.stub(EmployeeModel, "findById").resolves(mockEmployee);
    sinon.stub(FormModel, "find").resolves(mockForm);
    sinon.stub(ResponseModel, "distinct").rejects(new Error("Database Error"));
    const mockEmployeeId = new mongoose.Types.ObjectId();

    chai
      .request(server)
      .get(`/empform/getassignedforms/${mockEmployeeId}`)
      .set("Authorization", "Bearer mockedToken")
      .end((err, response) => {
        expect(response).to.have.status(500);
        expect(response.body.message).to.equal(
          "Failed to fetch assigned forms"
        );
        done();
      });
  });
});

//

describe("Test cases for saving employee response", () => {
  afterEach(() => {
    sinon.restore();
  });
  beforeEach(() => {
    const jwtStub = sinon.stub(jwt, "verify");
    jwtStub.callsFake((token, secret, callback) => {
      // Mocking a decoded token with role "Admin"
      const decodedToken = { role: "admin" };
      callback(null, decodedToken);
    });
  });

  it("Should give statusCode 201 if response saved successfully", (done) => {
    sinon.stub(EmployeeModel, "findById").resolves(mockEmployee);
    sinon.stub(ResponseModel.prototype, "save").resolves(mockResponse);
    chai
      .request(server)
      .post("/empform/saveresponse")
      .set("Authorization", "Bearer mockedId")
      .send(mockResponse2)
      .end((err,response)=>{
        expect(response).to.have.status(201);
        expect(response.body.message).to.equal("Response saved successfully");
        done();
      })
  });

  it("Should give statusCode 404 if no employee is found", (done) => {
    sinon.stub(EmployeeModel, "findById").resolves(null);
    chai
      .request(server)
      .post("/empform/saveresponse")
      .set("Authorization", "Bearer mockedId")
      .send(mockResponse2)
      .end((err,response)=>{
        expect(response).to.have.status(404);
        expect(response.body.message).to.equal("Employee not found");
        done();
      })
  });

  it("Should give statusCode 500 if there is error while fetching employee details", (done) => {
    sinon.stub(EmployeeModel, "findById").rejects(new Error("Database Error"));
    chai
      .request(server)
      .post("/empform/saveresponse")
      .set("Authorization", "Bearer mockedId")
      .send(mockResponse2)
      .end((err,response)=>{
        expect(response).to.have.status(500);
        expect(response.body.message).to.equal("Failed to save response");
        done();
      })
  });

  it("Should give statusCode 500 if there is error while saving response", (done) => {
    sinon.stub(EmployeeModel, "findById").resolves(mockEmployee);
    sinon.stub(ResponseModel.prototype, "save").rejects(new Error("Database Error"));
    chai
      .request(server)
      .post("/empform/saveresponse")
      .set("Authorization", "Bearer mockedId")
      .send(mockResponse2)
      .end((err,response)=>{
        expect(response).to.have.status(500);
        expect(response.body.message).to.equal("Failed to save response");
        done();
      })
  });

});
