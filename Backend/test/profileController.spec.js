const chai = require("chai");
const chaiHttp = require("chai-http");
const server = require("../server"); // Replace with the actual path
const EmployeeModel = require("../models/EmployeeModel");
const AdminModel = require("../models/AdminModel");
const sinon = require("sinon");
chai.use(chaiHttp);
const expect = chai.expect;
const jwt = require("jsonwebtoken");

const mockEmployee = {
    _id: "66047223caf43fb8e8d2b1a2",
    empName: "Jodd",
    mobile: "1234567890",
    email: "meet@gmail.com",
    password: "meet20",
    teamName: "Intern",
    role: "employee",
    adminId: ["1", "2"],
  };

const mockEmployee2 = {
    userid: "66047223caf43fb8e8d2b1a2",
    empName: "Jodd",
    mobile: "1234567890",
    email: "meet@gmail.com",
  };

  const mockAdmin = {
    _id: "66025e3258c7e34959114d5a",
    empName: "Meet Jain",
    mobile: "1234567888",
    email: "meet30@gmail.com",
    password: "meet30",
    teamName: "Intern",
    role: "admin",
  };

  const mockAdmin2 = {
    userid: "66025e3258c7e34959114d5a",
    empName: "Meet Jain",
    mobile: "1234567888",
    email: "meet30@gmail.com",
  };

// For Employee

describe("Test cases while fetching details of Employee",()=>{
  afterEach(()=>{
    sinon.restore();
  })
  beforeEach(() => {
    const jwtStub = sinon.stub(jwt, "verify");
    jwtStub.callsFake((token, secret, callback) => {
      // Mocking a decoded token with role "Admin"
      const decodedToken = { role: "employee" };
      callback(null, decodedToken);
    });
  });

  it("Should give statusCode 200 if employee is present",(done)=>{
    const employeeModelMock = {
      find:()=>Promise.resolve(mockEmployee)
    }
    const mockId="66047223caf43fb8e8d2b1a2"
    Object.assign(EmployeeModel,employeeModelMock)
    chai.request(server)
    .get(`/profile/getempprofiledetails/${mockId}`)
    .set("Authorization", "Bearer mockedToken")
    .end((err,response)=>{
      expect(response).to.have.status(200);
      done();
    })
  })

  it("Should give statusCode 404 if employee with given id is not present",(done)=>{
    const employeeModelMock = {
      find:()=>Promise.resolve(null)
    }
    const mockId="66047223caf43fb8e8d2b1a2"
    Object.assign(EmployeeModel,employeeModelMock)
    chai.request(server)
    .get(`/profile/getempprofiledetails/${mockId}`)
    .set("Authorization", "Bearer mockedToken")
    .end((err,response)=>{
      expect(response).to.have.status(404);
      expect(response.body.message).to.equal("Profile with given Id not found");
      done();
    })
  })

  it("Should give statusCode 500 if there is error fetching details for employee",(done)=>{
    const employeeModelMock = {
      find:()=>Promise.reject(new Error("Database Error"))
    }
    const mockId="66047223caf43fb8e8d2b1a2"
    Object.assign(EmployeeModel,employeeModelMock)
    chai.request(server)
    .get(`/profile/getempprofiledetails/${mockId}`)
    .set("Authorization", "Bearer mockedToken")
    .end((err,response)=>{
      expect(response).to.have.status(500);
      expect(response.body.message).to.equal("Error fetching Employee details");
      done();
    })
  })
})

// For Admin

describe("Test cases while fetching details of Admin",()=>{
  afterEach(()=>{
    sinon.restore();
  })
  beforeEach(() => {
    const jwtStub = sinon.stub(jwt, "verify");
    jwtStub.callsFake((token, secret, callback) => {
      // Mocking a decoded token with role "Admin"
      const decodedToken = { role: "admin" };
      callback(null, decodedToken);
    });
  });

  it("Should give statusCode 200 if admin is present",(done)=>{
    const adminModelMock = {
      find:()=>Promise.resolve(mockAdmin)
    }
    const mockId="66025e3258c7e34959114d5a"
    Object.assign(AdminModel,adminModelMock)
    chai.request(server)
    .get(`/profile/getadmprofiledetails/${mockId}`)
    .set("Authorization", "Bearer mockedToken")
    .end((err,response)=>{
      expect(response).to.have.status(200);
      done();
    })
  })

  it("Should give statusCode 404 if admin with given id is not present",(done)=>{
    const adminModelMock = {
      find:()=>Promise.resolve(null)
    }
    const mockId="66025e3258c7e34959114d5a"
    Object.assign(AdminModel,adminModelMock)
    chai.request(server)
    .get(`/profile/getadmprofiledetails/${mockId}`)
    .set("Authorization", "Bearer mockedToken")
    .end((err,response)=>{
      expect(response).to.have.status(404);
      expect(response.body.message).to.equal("Profile with given Id not found");
      done();
    })
  })

  it("Should give statusCode 500 if there is error fetching details for admin",(done)=>{
    const adminModelMock = {
      find:()=>Promise.reject(new Error("Database error"))
    }
    const mockId="66025e3258c7e34959114d5a"
    Object.assign(AdminModel,adminModelMock)
    chai.request(server)
    .get(`/profile/getadmprofiledetails/${mockId}`)
    .set("Authorization", "Bearer mockedToken")
    .end((err,response)=>{
      expect(response).to.have.status(500);
      expect(response.body.message).to.equal("Error fetching Admin details");
      done();
    })
  })

})

// For Employee Update

describe("Test cases while updating details of Employee",()=>{
  afterEach(()=>{
    sinon.restore();
  })
  beforeEach(() => {
    const jwtStub = sinon.stub(jwt, "verify");
    jwtStub.callsFake((token, secret, callback) => {
      // Mocking a decoded token with role "Admin"
      const decodedToken = { role: "employee" };
      callback(null, decodedToken);
    });
  });

  it("Should give statusCode 200 if employee details updated successfully",(done)=>{
    const employeeModelMock = {
      updateOne:()=>Promise.resolve(mockEmployee)
    }
    const mockId="66047223caf43fb8e8d2b1a2"
    Object.assign(EmployeeModel,employeeModelMock)
    chai.request(server)
    .put(`/profile/updateempprofiledetails`)
    .set("Authorization", "Bearer mockedToken")
    .send(mockEmployee2)
    .end((err,response)=>{
      expect(response).to.have.status(200);
      done();
    })
  })

  it("Should give statusCode 404 if that employee is not present",(done)=>{
    const employeeModelMock = {
      updateOne:()=>Promise.resolve(null)
    }
    const mockId="66047223caf43fb8e8d2b1a2"
    Object.assign(EmployeeModel,employeeModelMock)
    chai.request(server)
    .put(`/profile/updateempprofiledetails`)
    .set("Authorization", "Bearer mockedToken")
    .send(mockEmployee2)
    .end((err,response)=>{
      expect(response).to.have.status(404);
      expect(response.body.message).to.equal("Profile not found");
      done();
    })
  })

  it("Should give statusCode 500 if there is error updating employee details",(done)=>{
    const employeeModelMock = {
      updateOne:()=>Promise.reject(new Error("Database Error"))
    }
    const mockId="66047223caf43fb8e8d2b1a2"
    Object.assign(EmployeeModel,employeeModelMock)
    chai.request(server)
    .put(`/profile/updateempprofiledetails`)
    .set("Authorization", "Bearer mockedToken")
    .send(mockEmployee2)
    .end((err,response)=>{
      expect(response).to.have.status(500);
      expect(response.body.message).to.equal("Error updating profile");
      done();
    })
  })
})

// For Admin Update

describe("Test cases while updating details of Admin",()=>{
  afterEach(()=>{
    sinon.restore();
  })
  beforeEach(() => {
    const jwtStub = sinon.stub(jwt, "verify");
    jwtStub.callsFake((token, secret, callback) => {
      // Mocking a decoded token with role "Admin"
      const decodedToken = { role: "admin" };
      callback(null, decodedToken);
    });
  });

  it("Should give statusCode 200 if admin details updated successfully",(done)=>{
    const adminModelMock = {
      updateOne:()=>Promise.resolve(mockAdmin)
    }
    const mockId="66025e3258c7e34959114d5a"
    Object.assign(AdminModel,adminModelMock)
    chai.request(server)
    .put(`/profile/updateadmprofiledetails`)
    .set("Authorization", "Bearer mockedToken")
    .send(mockAdmin2)
    .end((err,response)=>{
      expect(response).to.have.status(200);
      done();
    })
  })

  it("Should give statusCode 404 if that admin is not present",(done)=>{
    const adminModelMock = {
      updateOne:()=>Promise.resolve(null)
    }
    const mockId="66025e3258c7e34959114d5a"
    Object.assign(AdminModel,adminModelMock)
    chai.request(server)
    .put(`/profile/updateadmprofiledetails`)
    .set("Authorization", "Bearer mockedToken")
    .send(mockAdmin2)
    .end((err,response)=>{
      expect(response).to.have.status(404);
      expect(response.body.message).to.equal("Profile not found");
      done();
    })
  })

  it("Should give statusCode 500 if there is error updating admin details",(done)=>{
    const adminModelMock = {
      updateOne:()=>Promise.reject(new Error("Database error"))
    }
    const mockId="66025e3258c7e34959114d5a"
    Object.assign(AdminModel,adminModelMock)
    chai.request(server)
    .put(`/profile/updateadmprofiledetails`)
    .set("Authorization", "Bearer mockedToken")
    .send(mockAdmin2)
    .end((err,response)=>{
      expect(response).to.have.status(500);
      expect(response.body.message).to.equal("Error updating profile");
      done();
    })
  })

})