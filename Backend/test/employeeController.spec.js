const chai = require("chai");
const chaiHttp = require("chai-http");
const server = require("../server"); // Replace with the actual path
const EmployeeModel = require("../models/EmployeeModel");
const AdminModel = require("../models/AdminModel");
const sinon = require("sinon");
chai.use(chaiHttp);
const expect = chai.expect;
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const mockEmployee = {
  empName: "Test12",
  mobile: "1234567890",
  email: "test12@gmail.com",
  password: "123456",
  teamName: "Team1",
  role: "employee",
  adminId: ["1", "2"],
};

const mockLoginE = {
  _id: "1",
  email: "meet@gmail.com",
  password: "meet40",
  role: "employee",
};
const mockLoginA = {
  _id: "1",
  email: "meet@gmail.com",
  password: "meet20",
  role: "admin",
};

// getteamnames

describe("Fetching Teams", (done) => {
  afterEach(() => {
    sinon.restore();
  });

  it("Should give all the existing teams", (done) => {
    const mockTeam = ["Intern", "PM"];
    sinon.stub(AdminModel, "distinct").resolves(mockTeam);
    chai
      .request(server)
      .get("/employee/getteamnames")
      .end((err, response) => {
        expect(response).to.have.status(200);
        done();
      });
  });

  it("Should give null if there is no existing team", (done) => {
    const mockTeam = null;
    sinon.stub(AdminModel, "distinct").resolves(mockTeam);
    chai
      .request(server)
      .get("/employee/getteamnames")
      .end((err, response) => {
        expect(response).to.have.status(200);
        done();
      });
  });

  it("Should give statusCode 500 if error while fetching team names", (done) => {
    sinon.stub(AdminModel, "distinct").rejects(new Error("Database error"));
    chai
      .request(server)
      .get("/employee/getteamnames")
      .end((err, response) => {
        expect(response).to.have.status(500);
        expect(response.body.message).to.equal("Error fetching existing teams");
        done();
      });
  });
});

// signupemp

describe("TestCases for saving the employee details", () => {
  afterEach(() => {
    sinon.restore();
  });

  it("Should create a new employee", (done) => {
    const employeeModelMock = {
      findOne: () => Promise.resolve(null),
    };
    Object.assign(EmployeeModel, employeeModelMock);
    sinon.stub(EmployeeModel.prototype, "save").resolves(mockEmployee);
    chai
      .request(server)
      .post("/employee/signupemp")
      .send({
        empName: "Meet Jain",
        mobile: "1234567890",
        email: "meet@gmail.com",
        password: "meet20",
        teamName: "Intern",
      })
      .end((err, response) => {
        expect(response).to.have.status(201);
        done();
      });
  });
});

describe("Error handling while saving details for employee signup", () => {
  afterEach(() => {
    sinon.restore();
  });

  it("Should give status code 409 if user already exists", (done) => {
    const employeeModelMock = {};
    Object.assign(EmployeeModel, employeeModelMock);
    sinon.stub(EmployeeModel, "findOne").resolves(mockEmployee);
    chai
      .request(server)
      .post("/employee/signupemp")
      .send({
        empName: "Meet Jain",
        mobile: "9321431491",
        email: "test12@gmail.com",
        password: "meet@2002",
        teamName: "Intern",
      })
      .end((err, response) => {
        expect(response).to.have.status(409);
        expect(response.body.message).to.equal(
          "User exists already, please login instead."
        );
        done();
      });
  });

  it("Should give statusCode 500 if there is any error while saving details", (done) => {
    const employeeModelMock = {
      findOne: () => Promise.resolve(null),
    };
    Object.assign(EmployeeModel, employeeModelMock);
    sinon
      .stub(EmployeeModel.prototype, "save")
      .rejects(new Error("Database error"));
    chai
      .request(server)
      .post("/employee/signupemp")
      .send({
        empName: "Meet Jain",
        mobile: "1234567890",
        email: "meet@gmail.com",
        password: "meet20",
        teamName: "Intern",
      })
      .end((err, response) => {
        expect(response).to.have.status(500);
        expect(response.body.message).to.equal(
          "Error saving details, please try again later."
        );
        done();
      });
  });

  it("Should give statusCode 500 if error while searching for existing emails", (done) => {
    const employeeModelMock2 = {
      findOne: () => Promise.reject(new Error("Database error")),
    };
    Object.assign(EmployeeModel, employeeModelMock2);
    chai
      .request(server)
      .post("/employee/signupemp")
      .send({
        empName: "Meet Jain",
        mobile: "9321431491",
        email: "test12@gmail.com",
        password: "meet@2002",
        teamName: "Intern",
      })
      .end((err, response) => {
        expect(response).to.have.status(500);
        expect(response.body.message).to.equal(
          "Error while searching for existing Emails."
        );
        done();
      });
  });

  it("Should give statusCode 500 if there is any error while fetching adminIds", (done) => {
    const adminModelMock = {
      find: () => {
        select: () => Promise.reject(new Error("Database Error"));
      },
    };
    Object.assign(AdminModel, adminModelMock);
    chai
      .request(server)
      .post("/employee/signupemp")
      .send({
        empName: "Meet Jain",
        mobile: "1234567890",
        email: "meet@gmail.com",
        password: "meet20",
        teamName: "Intern",
      })
      .end((err, response) => {
        expect(response).to.have.status(500);
        expect(response.body.message).to.equal(
          "Error fetching adminIds, please try again later."
        );
        done();
      });
  });
});

// Login

describe("Successful Login", () => {
  let compareBcrypt;
  beforeEach(() => {
    compareBcrypt = sinon.stub(bcrypt, "compare");
  });
  afterEach(() => {
    sinon.restore();
  });

  it("Should give statusCode 200 if successful login of employee", (done) => {
    const employeeModelMock = {
      findOne: () => Promise.resolve(mockLoginE),
    };
    Object.assign(EmployeeModel, employeeModelMock);
    compareBcrypt.resolves(true);
    chai
      .request(server)
      .post("/employee/login")
      .send({
        email: "meet@gmail.com",
        password: "meet40",
        role: "employee",
      })
      .end((err, response) => {
        expect(response).to.have.status(200);
        expect(response.body).to.have.property("token");
        done();
      });
  });

    it("Should give statusCode 200 if successful login of admin", (done) => {
      const adminModelMock = {
        findOne: () => Promise.resolve(mockLoginA),
      };
      Object.assign(AdminModel, adminModelMock);
      compareBcrypt.resolves(true);
      chai
        .request(server)
        .post("/employee/login")
        .send({
          email: "meet@gmail.com",
          password: "meet20",
          role: "admin",
        })
        .end((err, response) => {
          expect(response).to.have.status(200);
          expect(response.body).to.have.property("token");
          done();
        });
    });
});

describe("Error Handling for login", () => {
  let compareBcrypt;
  beforeEach(() => {
    compareBcrypt = sinon.stub(bcrypt, "compare");
  });
  afterEach(() => {
    sinon.restore();
  });

  it("Should give statusCode 500 if error finding employee email in database", (done) => {
    const employeeModelMock = {
      findOne: () => Promise.reject(new Error("Database Error")),
    };
    Object.assign(EmployeeModel, employeeModelMock);
    chai
      .request(server)
      .post("/employee/login")
      .send({
        email: "meet@gmail.com",
        password: "meet40",
        role: "employee",
      })
      .end((err, response) => {
        expect(response).to.have.status(500);
        expect(response.body.message).to.equal(
          "Login failed, check your credentials or signup."
        );
        done();
      });
  });

  it("Should give statusCode 500 if error finding admin email in database", (done) => {
    const adminModelMock = {
      findOne: () => Promise.reject(new Error("Database Error")),
    };
    Object.assign(AdminModel, adminModelMock);
    chai
      .request(server)
      .post("/employee/login")
      .send({
        email: "meet@gmail.com",
        password: "meet20",
        role: "admin",
      })
      .end((err, response) => {
        expect(response).to.have.status(500);
        expect(response.body.message).to.equal(
          "Login failed, check your credentials or signup."
        );
        done();
      });
  });

  it("Should give statusCode 401 if there is no such employee email in database", (done) => {
    const employeeModelMock = {
      findOne: () => Promise.resolve(null),
    };
    Object.assign(EmployeeModel, employeeModelMock);
    chai
      .request(server)
      .post("/employee/login")
      .send({
        email: "meet@gmail.com",
        password: "meet40",
        role: "employee",
      })
      .end((err, response) => {
        expect(response).to.have.status(401);
        expect(response.body.message).to.equal(
          "Invalid credentials, could not log you in."
        );
        done();
      });
  });

  it("Should give statusCode 401 if there is no such admin email in database", (done) => {
    const adminModelMock = {
      findOne: () => Promise.resolve(null),
    };
    Object.assign(AdminModel, adminModelMock);
    chai
      .request(server)
      .post("/employee/login")
      .send({
        email: "meet@gmail.com",
        password: "meet20",
        role: "admin",
      })
      .end((err, response) => {
        expect(response).to.have.status(401);
        expect(response.body.message).to.equal(
          "Invalid credentials, could not log you in."
        );
        done();
      });
  });

  it("Should give statusCode 401 if password is not correct for employee", (done) => {
    const employeeModelMock = {
      findOne: () => Promise.resolve(mockLoginE),
    };
    Object.assign(EmployeeModel, employeeModelMock);
    compareBcrypt.resolves(false);
    chai
      .request(server)
      .post("/employee/login")
      .send({
        email: "meet@gmail.com",
        password: "meet40",
        role: "employee",
      })
      .end((err, response) => {
        expect(response).to.have.status(401);
        expect(response.body.message).to.equal(
          "Invalid password, could not log you in."
        );
        done();
      });
  });

  it("Should give statusCode 401 if password is not correct for admin", (done) => {
    const adminModelMock = {
      findOne: () => Promise.resolve(mockLoginA),
    };
    Object.assign(AdminModel, adminModelMock);
    compareBcrypt.resolves(false);
    chai
      .request(server)
      .post("/employee/login")
      .send({
        email: "meet@gmail.com",
        password: "meet20",
        role: "admin",
      })
      .end((err, response) => {
        expect(response).to.have.status(401);
        expect(response.body.message).to.equal(
          "Invalid password, could not log you in."
        );
        done();
      });
  });

  it("Should give statusCode 401 if role is not employee while signing in as an employee", (done) => {
    const employeeModelMock = {
      findOne: () => Promise.resolve(mockLoginA),
    };
    Object.assign(EmployeeModel, employeeModelMock);
    compareBcrypt.resolves(true);
    chai
      .request(server)
      .post("/employee/login")
      .send({
        email: "meet@gmail.com",
        password: "meet40",
        role: "employee",
      })
      .end((err, response) => {
        expect(response).to.have.status(401);
        expect(response.body.message).to.equal(
          "Invalid role as per entered while registering."
        );
        done();
      });
  });

  it("Should give statusCode 401 if role is not admin while signing in as an admin", (done) => {
    const adminModelMock = {
      findOne: () => Promise.resolve(mockLoginE),
    };
    Object.assign(AdminModel, adminModelMock);
    compareBcrypt.resolves(true);
    chai
      .request(server)
      .post("/employee/login")
      .send({
        email: "meet@gmail.com",
        password: "meet20",
        role: "admin",
      })
      .end((err, response) => {
        expect(response).to.have.status(401);
        expect(response.body.message).to.equal(
          "Invalid role as per entered while registering."
        );
        done();
      });
  });

  it("Should give statusCode 500 if there is error while signing jwt token for employee", (done) => {
    const employeeModelMock = {
      findOne: () => Promise.resolve(mockLoginE),
    };
    Object.assign(EmployeeModel, employeeModelMock);
    compareBcrypt.resolves(true);
    sinon.stub(jwt, "sign").throws();
    chai
      .request(server)
      .post("/employee/login")
      .send({
        email: "meet@gmail.com",
        password: "meet40",
        role: "employee",
      })
      .end((err, response) => {
        expect(response).to.have.status(500);
        expect(response.body.message).to.equal(
          "Error while signing JWT Token."
        );
        done();
      });
  });

  it("Should give statusCode 500 if there is error while signing jwt token for admin", (done) => {
    const adminModelMock = {
      findOne: () => Promise.resolve(mockLoginA),
    };
    Object.assign(AdminModel, adminModelMock);
    compareBcrypt.resolves(true);
    sinon.stub(jwt, "sign").throws();
    chai
      .request(server)
      .post("/employee/login")
      .send({
        email: "meet@gmail.com",
        password: "meet20",
        role: "admin",
      })
      .end((err, response) => {
        expect(response).to.have.status(500);
        expect(response.body.message).to.equal(
          "Error while signing JWT Token."
        );
        done();
      });
  });
});
