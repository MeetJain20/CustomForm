const chai = require("chai");
const chaiHttp = require("chai-http");
const server = require("../server"); // Replace with the actual path
const EmployeeModel = require("../models/EmployeeModel");
const ResponseModel = require("../models/ResponseModel");
const sinon = require("sinon");
const nodemailer = require("nodemailer");
chai.use(chaiHttp);
const expect = chai.expect;
const jwt = require("jsonwebtoken");
const FormModel = require("../models/FormModel");
const mongoose = require("mongoose");

const mockEmployee = [{
  empName: "Test12",
  mobile: "1234567890",
  email: "test12@gmail.com",
  password: "123456",
  teamName: "Team1",
  role: "employee",
  adminId: ["45"],
}];

const mockResponse = [
  {
    formId: "1",
    employeeId: "66047223caf43fb8e8d2b1a2",
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
    isTemplate: true,
  },
];

const mockForm1 = {
  _id: "1",
  adminId: "3",
  formtitle: "Jodd",
  formdesc: "desc",
  fields: [{}],
  isComplete: true,
  isTemplate: true,
};

const mockForm2 = new FormModel({
  adminId: "3",
  formtitle: "Jodd",
  formdesc: "desc",
  fields: [{ fieldid: "1" }, { fieldid: "2" }],
  isComplete: true,
  isTemplate: true,
});

const mockForm3 = {
  adminId: "3",
  formtitle: "Jodd",
  formdesc: "desc",
  fields: [{ fieldid: "1" }],
  isComplete: true,
  isTemplate: true,
};

const mockFormId = new mongoose.Types.ObjectId();
const mockFormData = {
  _id: mockFormId,
  fields: [
    { fieldid: "1", fieldName: "Field 1" },
    { fieldid: "2", fieldName: "Field 2" },
  ],
};
const updatedMockForm = { ...mockFormData };

// Test cases for all get requests

describe("Test cases for fetching all Templates", () => {
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

  it("Should give statusCode 200 if templates are fetched successfully", (done) => {
    sinon.stub(FormModel, "find").resolves(mockForm);
    chai
      .request(server)
      .get("/form/gettemplateforms")
      .set("Authorization", "Bearer mockedToken")
      .end((err, response) => {
        expect(response).to.have.status(200);
        done();
      });
  });

  it("Should give statusCode 404 if no template form found", (done) => {
    sinon.stub(FormModel, "find").resolves(null);
    chai
      .request(server)
      .get("/form/gettemplateforms")
      .set("Authorization", "Bearer mockedToken")
      .end((err, response) => {
        expect(response).to.have.status(404);
        expect(response.body.message).to.equal("No forms found");
        done();
      });
  });

  it("Should give statusCode 500 if there is error while fetching form", (done) => {
    sinon.stub(FormModel, "find").rejects(new Error("Database Error"));
    chai
      .request(server)
      .get("/form/gettemplateforms")
      .set("Authorization", "Bearer mockedToken")
      .end((err, response) => {
        expect(response).to.have.status(500);
        expect(response.body.message).to.equal("Error fetching forms");
        done();
      });
  });
});

describe("Test cases for fetching all active forms", () => {
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

  it("Should give statusCode 200 if active forms are fetched successfully", (done) => {
    sinon.stub(FormModel, "find").resolves(mockForm);
    const mockId = "12";
    chai
      .request(server)
      .get(`/form/getactiveforms/${mockId}`)
      .set("Authorization", "Bearer mockedToken")
      .end((err, response) => {
        expect(response).to.have.status(200);
        done();
      });
  });

  it("Should give statusCode 404 if no active form found", (done) => {
    sinon.stub(FormModel, "find").resolves(null);
    const mockId = "12";
    chai
      .request(server)
      .get(`/form/getactiveforms/${mockId}`)
      .set("Authorization", "Bearer mockedToken")
      .end((err, response) => {
        expect(response).to.have.status(404);
        expect(response.body.message).to.equal("No forms found");
        done();
      });
  });

  it("Should give statusCode 500 if there is error while fetching form", (done) => {
    sinon.stub(FormModel, "find").rejects(new Error("Database Error"));
    const mockId = "12";
    chai
      .request(server)
      .get(`/form/getactiveforms/${mockId}`)
      .set("Authorization", "Bearer mockedToken")
      .end((err, response) => {
        expect(response).to.have.status(500);
        expect(response.body.message).to.equal("Error fetching forms");
        done();
      });
  });
});

describe("Test cases for fetching all saved forms", () => {
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

  it("Should give statusCode 200 if saved forms are fetched successfully", (done) => {
    sinon.stub(FormModel, "find").resolves(mockForm);
    const mockId = "12";
    chai
      .request(server)
      .get(`/form/getcompletedforms/${mockId}`)
      .set("Authorization", "Bearer mockedToken")
      .end((err, response) => {
        expect(response).to.have.status(200);
        done();
      });
  });

  it("Should give statusCode 404 if no saved form found", (done) => {
    sinon.stub(FormModel, "find").resolves(null);
    const mockId = "12";
    chai
      .request(server)
      .get(`/form/getcompletedforms/${mockId}`)
      .set("Authorization", "Bearer mockedToken")
      .end((err, response) => {
        expect(response).to.have.status(404);
        expect(response.body.message).to.equal("No forms found");
        done();
      });
  });

  it("Should give statusCode 500 if there is error while fetching form", (done) => {
    sinon.stub(FormModel, "find").rejects(new Error("Database Error"));
    const mockId = "12";
    chai
      .request(server)
      .get(`/form/getcompletedforms/${mockId}`)
      .set("Authorization", "Bearer mockedToken")
      .end((err, response) => {
        expect(response).to.have.status(500);
        expect(response.body.message).to.equal("Error fetching forms");
        done();
      });
  });
});

describe("Test cases for fetching form details", () => {
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

  it("Should give statusCode 200 if form details fetched successfully", (done) => {
    sinon.stub(FormModel, "find").resolves(mockForm);
    const mockId = "12";
    chai
      .request(server)
      .get(`/form/getcurrentform/${mockId}`)
      .set("Authorization", "Bearer mockedToken")
      .end((err, response) => {
        expect(response).to.have.status(200);
        done();
      });
  });

  it("Should give statusCode 404 if no form found", (done) => {
    sinon.stub(FormModel, "find").resolves(null);
    const mockId = "12";
    chai
      .request(server)
      .get(`/form/getcurrentform/${mockId}`)
      .set("Authorization", "Bearer mockedToken")
      .end((err, response) => {
        expect(response).to.have.status(404);
        expect(response.body.message).to.equal("No forms found");
        done();
      });
  });

  it("Should give statusCode 500 if there is error while fetching form", (done) => {
    sinon.stub(FormModel, "find").rejects(new Error("Database Error"));
    const mockId = "12";
    chai
      .request(server)
      .get(`/form/getcurrentform/${mockId}`)
      .set("Authorization", "Bearer mockedToken")
      .end((err, response) => {
        expect(response).to.have.status(500);
        expect(response.body.message).to.equal("Error fetching forms");
        done();
      });
  });
});

// Test cases for all post requests

describe("Test cases for copying a field", () => {
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

  it("Should give statusCode 200 if field is copied successfully", (done) => {
    sinon.stub(FormModel, "findById").resolves(mockForm2);
    const formModelMock = {
      fields: {
        push: sinon.stub().resolves({}),
      },
    };
    Object.assign(FormModel, formModelMock);
    sinon.stub(FormModel.prototype, "save").resolves(mockForm2);
    chai
      .request(server)
      .post(`/form/copyfield`)
      .set("Authorization", "Bearer mockedToken")
      .send({
        formid: "1",
        fielddata: {},
      })
      .end((err, response) => {
        expect(response).to.have.status(200);
        done();
      });
  });

  it("Should give statusCode 404 if form is not found", (done) => {
    sinon.stub(FormModel, "findById").resolves(null);
    chai
      .request(server)
      .post(`/form/copyfield`)
      .set("Authorization", "Bearer mockedToken")
      .send({
        formid: "1",
        fielddata: {},
      })
      .end((err, response) => {
        expect(response).to.have.status(404);
        expect(response.body.message).to.equal("Form not found");
        done();
      });
  });

  it("Should give statusCode 500 if there is error fetching form", (done) => {
    sinon.stub(FormModel, "findById").rejects(new Error("Database Error"));
    chai
      .request(server)
      .post(`/form/copyfield`)
      .set("Authorization", "Bearer mockedToken")
      .send({
        formid: "1",
        fielddata: {},
      })
      .end((err, response) => {
        expect(response).to.have.status(500);
        expect(response.body.message).to.equal("Failed to copy form field");
        done();
      });
  });

  it("Should give statusCode 404 if form is not found after copying the field", (done) => {
    sinon.stub(FormModel, "findById").resolves(mockForm2);
    sinon.stub(FormModel.prototype, "save").resolves(null);
    chai
      .request(server)
      .post(`/form/copyfield`)
      .set("Authorization", "Bearer mockedToken")
      .send({
        formid: "1",
        fielddata: {},
      })
      .end((err, response) => {
        expect(response).to.have.status(404);
        expect(response.body.message).to.equal("Form not found");
        done();
      });
  });

  it("Should give statusCode 500 if there is error fetching form after copying the field", (done) => {
    sinon.stub(FormModel, "findById").resolves(mockForm1);
    sinon
      .stub(FormModel.prototype, "save")
      .rejects(new Error("Database Error"));

    chai
      .request(server)
      .post(`/form/copyfield`)
      .set("Authorization", "Bearer mockedToken")
      .send({
        formid: "1",
        fielddata: {},
      })
      .end((err, response) => {
        expect(response).to.have.status(500);
        expect(response.body.message).to.equal("Failed to copy form field");
        done();
      });
  });
});

describe("Test cases for creating new form", () => {
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

  it("Should give statusCode 200 if form is created successfully", (done) => {
    sinon.stub(FormModel.prototype, "save").resolves(mockForm3);
    chai
      .request(server)
      .post(`/form/createforms`)
      .set("Authorization", "Bearer mockedToken")
      .send({
        adminId: "2",
      })
      .end((err, response) => {
        expect(response).to.have.status(200);
        done();
      });
  });

  it("Should give statusCode 500 if there is error fetching form", (done) => {
    sinon
      .stub(FormModel.prototype, "save")
      .rejects(new Error("Database Error"));
    chai
      .request(server)
      .post(`/form/createforms`)
      .set("Authorization", "Bearer mockedToken")
      .send({
        adminId: "2",
      })
      .end((err, response) => {
        expect(response).to.have.status(500);
        expect(response.body.message).to.equal("Form Creation Failed");
        done();
      });
  });
});

describe("Test cases for creating form using template", () => {
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

  it("Should give statusCode 201 if form is created successfullt using the template", (done) => {
    sinon.stub(FormModel, "findById").resolves(mockForm1);
    sinon.stub(FormModel.prototype, "save").resolves(mockForm1);
    chai
      .request(server)
      .post(`/form/createFromTemplate`)
      .set("Authorization", "Bearer mockedToken")
      .send({
        formid: "1",
        adminId: "2",
      })
      .end((err, response) => {
        expect(response).to.have.status(201);
        done();
      });
  });

  it("Should give statusCode 404 if template not found", (done) => {
    sinon.stub(FormModel, "findById").resolves(null);
    chai
      .request(server)
      .post(`/form/createFromTemplate`)
      .set("Authorization", "Bearer mockedToken")
      .send({
        formid: "1",
        adminId: "2",
      })
      .end((err, response) => {
        expect(response).to.have.status(404);
        expect(response.body.message).to.equal("Template form not found");
        done();
      });
  });

  it("Should give statusCode 500 if there is error while finding template", (done) => {
    sinon.stub(FormModel, "findById").rejects(new Error("Database Error"));
    chai
      .request(server)
      .post(`/form/createFromTemplate`)
      .set("Authorization", "Bearer mockedToken")
      .send({
        formid: "1",
        adminId: "2",
      })
      .end((err, response) => {
        expect(response).to.have.status(500);
        expect(response.body.message).to.equal(
          "Failed to create form from template"
        );
        done();
      });
  });

  it("Should give statusCode 500 if returns empty form after creating", (done) => {
    sinon.stub(FormModel, "findById").resolves(mockForm1);
    sinon.stub(FormModel.prototype, "save").resolves(null);
    chai
      .request(server)
      .post(`/form/createFromTemplate`)
      .set("Authorization", "Bearer mockedToken")
      .send({
        formid: "1",
        adminId: "2",
      })
      .end((err, response) => {
        expect(response).to.have.status(500);
        expect(response.body.message).to.equal(
          "Error while saving the form to database"
        );
        done();
      });
  });

  it("Should give statusCode 500 if there is error while creating the template form", (done) => {
    sinon.stub(FormModel, "findById").resolves(mockForm1);
    sinon
      .stub(FormModel.prototype, "save")
      .rejects(new Error("Database Error"));
    chai
      .request(server)
      .post(`/form/createFromTemplate`)
      .set("Authorization", "Bearer mockedToken")
      .send({
        formid: "1",
        adminId: "2",
      })
      .end((err, response) => {
        expect(response).to.have.status(500);
        expect(response.body.message).to.equal(
          "Failed to create form from template"
        );
        done();
      });
  });
});

// Test cases for all put requests

describe("Test cases for updating form status to complete", () => {
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
  
    it("Should give statusCode 200 if form status updated successfully", (done) => {
        sinon.stub(FormModel, "findById").resolves(mockForm1);
        sinon.stub(EmployeeModel, "find").resolves(mockEmployee);
        sinon.stub(FormModel, "findByIdAndUpdate").resolves(mockForm1);

        chai
          .request(server)
          .put(`/form/updateformstatus`)
          .set("Authorization", "Bearer mockedToken")
          .send({
            formid: "1",
          })
          .end((err, response) => {
            expect(response).to.have.status(200);
            done();
          });
      });
  
    it("Should give statusCode 200 if form status updated successfully but no mail is send", (done) => {
        sinon.stub(FormModel, "findById").resolves(mockForm1);
        sinon.stub(EmployeeModel, "find").resolves([]);
        sinon.stub(FormModel, "findByIdAndUpdate").resolves(mockForm1);

        chai
          .request(server)
          .put(`/form/updateformstatus`)
          .set("Authorization", "Bearer mockedToken")
          .send({
            formid: "1",
          })
          .end((err, response) => {
            expect(response).to.have.status(200);
            done();
          });
      });

    it("Should give statusCode 404 if form not found", (done) => {
        sinon.stub(FormModel, "findById").resolves(null);
        chai
          .request(server)
          .put(`/form/updateformstatus`)
          .set("Authorization", "Bearer mockedToken")
          .send({
            formid: "1",
          })
          .end((err, response) => {
            expect(response).to.have.status(404);
            expect(response.body.message).to.equal("Form not found");
            done();
          });
      });
    
      it("Should give statusCode 500 if there is error finding form", (done) => {
        sinon.stub(FormModel, "findById").rejects(new Error("Database Error"));
        chai
          .request(server)
          .put(`/form/updateformstatus`)
          .set("Authorization", "Bearer mockedToken")
          .send({
            formid: "1",
          })
          .end((err, response) => {
            expect(response).to.have.status(500);
            expect(response.body.message).to.equal(
              "Failed to Save the form"
            );
            done();
          });
      });
    
      it("Should give statusCode 500 if there is error finding employee", (done) => {
        sinon.stub(FormModel, "findById").resolves(mockForm1);
        sinon.stub(EmployeeModel, "find").rejects(new Error("Database Error"));
        chai
          .request(server)
          .put(`/form/updateformstatus`)
          .set("Authorization", "Bearer mockedToken")
          .send({
            formid: "1",
          })
          .end((err, response) => {
            expect(response).to.have.status(500);
            expect(response.body.message).to.equal(
              "Failed to Save the form"
            );
            done();
          });
      });
    
      it("Should give statusCode 500 if there is error updating form status to complete", (done) => {
        sinon.stub(FormModel, "findById").resolves(mockForm1);
        sinon.stub(EmployeeModel, "find").resolves(mockEmployee);
        sinon.stub(FormModel, "findByIdAndUpdate").rejects(new Error("Database Error"));
        chai
          .request(server)
          .put(`/form/updateformstatus`)
          .set("Authorization", "Bearer mockedToken")
          .send({
            formid: "1",
          })
          .end((err, response) => {
            expect(response).to.have.status(500);
            expect(response.body.message).to.equal(
              "Failed to Save the form"
            );
            done();
          });
      });
  
  });

//

describe("Test cases for updating edit status", () => {
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
  
    it("Should give statusCode 200 if form edit status updated successfully", (done) => {
        sinon.stub(FormModel, "findByIdAndUpdate").resolves(mockForm1);
        sinon.stub(ResponseModel, "deleteMany").resolves({});

        chai
          .request(server)
          .put(`/form/updateeditstatus`)
          .set("Authorization", "Bearer mockedToken")
          .send({
            formid: "1",
          })
          .end((err, response) => {
            expect(response).to.have.status(200);
            done();
          });
      });

    it("Should give statusCode 404 if form not found", (done) => {
        sinon.stub(FormModel, "findByIdAndUpdate").resolves(null);
        chai
          .request(server)
          .put(`/form/updateeditstatus`)
          .set("Authorization", "Bearer mockedToken")
          .send({
            formid: "1",
          })
          .end((err, response) => {
            expect(response).to.have.status(404);
            expect(response.body.message).to.equal("Form not found");
            done();
          });
      });
    
      it("Should give statusCode 500 if there is error finding form", (done) => {
        sinon.stub(FormModel, "findByIdAndUpdate").rejects(new Error("Database Error"));
        chai
          .request(server)
          .put(`/form/updateeditstatus`)
          .set("Authorization", "Bearer mockedToken")
          .send({
            formid: "1",
          })
          .end((err, response) => {
            expect(response).to.have.status(500);
            expect(response.body.message).to.equal(
              "Failed to make the form Editable"
            );
            done();
          });
      });
    
      it("Should give statusCode 500 if there is error deleting responses of the form", (done) => {
        sinon.stub(FormModel, "findByIdAndUpdate").resolves(mockForm1);
        sinon.stub(ResponseModel, "deleteMany").rejects(new Error("Database Error"));
        chai
          .request(server)
          .put(`/form/updateeditstatus`)
          .set("Authorization", "Bearer mockedToken")
          .send({
            formid: "1",
          })
          .end((err, response) => {
            expect(response).to.have.status(500);
            expect(response.body.message).to.equal(
              "Failed to make the form Editable"
            );
            done();
          });
      });
  
  });

//

describe("Test cases for updating template status", () => {
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
  
    it("Should give statusCode 200 if template status updated successfully", (done) => {
        sinon.stub(FormModel, "findByIdAndUpdate").resolves(mockForm1);
        chai
          .request(server)
          .put(`/form/updatetemplatestatus`)
          .set("Authorization", "Bearer mockedToken")
          .send({
            formid: "1",
          })
          .end((err, response) => {
            expect(response).to.have.status(200);
            done();
          });
      });

    it("Should give statusCode 404 if form not found", (done) => {
        sinon.stub(FormModel, "findByIdAndUpdate").resolves(null);
        chai
          .request(server)
          .put(`/form/updatetemplatestatus`)
          .set("Authorization", "Bearer mockedToken")
          .send({
            formid: "1",
          })
          .end((err, response) => {
            expect(response).to.have.status(404);
            expect(response.body.message).to.equal("Form not found");
            done();
          });
      });
    
      it("Should give statusCode 500 if there is error saving form as template", (done) => {
        sinon.stub(FormModel, "findByIdAndUpdate").rejects(new Error("Database Error"));
        chai
          .request(server)
          .put(`/form/updatetemplatestatus`)
          .set("Authorization", "Bearer mockedToken")
          .send({
            formid: "1",
          })
          .end((err, response) => {
            expect(response).to.have.status(500);
            expect(response.body.message).to.equal(
              "Failed to Save the form as Template"
            );
            done();
          });
      });
  
  });

//

describe("Test cases for updating form title", () => {
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
  
    it("Should give statusCode 200 if form title updated successfully", (done) => {
        sinon.stub(FormModel, "findByIdAndUpdate").resolves(mockForm1);
        chai
          .request(server)
          .put(`/form/updateformtitle`)
          .set("Authorization", "Bearer mockedToken")
          .send({
            formid: "1",
            formtitle: "titlee",
          })
          .end((err, response) => {
            expect(response).to.have.status(200);
            done();
          });
      });

    it("Should give statusCode 404 if form not found", (done) => {
        sinon.stub(FormModel, "findByIdAndUpdate").resolves(null);
        chai
          .request(server)
          .put(`/form/updateformtitle`)
          .set("Authorization", "Bearer mockedToken")
          .send({
            formid: "1",
            formtitle: "titlee",
          })
          .end((err, response) => {
            expect(response).to.have.status(404);
            expect(response.body.message).to.equal("Form not found");
            done();
          });
      });
    
      it("Should give statusCode 500 if there is error while finding form", (done) => {
        sinon.stub(FormModel, "findByIdAndUpdate").rejects(new Error("Database Error"));
        chai
          .request(server)
          .put(`/form/updateformtitle`)
          .set("Authorization", "Bearer mockedToken")
          .send({
            formid: "1",
            formtitle: "titlee",
          })
          .end((err, response) => {
            expect(response).to.have.status(500);
            expect(response.body.message).to.equal(
              "Failed to update form title"
            );
            done();
          });
      });
  
  });

//

describe("Test cases for updating form description", () => {
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
  
    it("Should give statusCode 200 if form description updated successfully", (done) => {
        sinon.stub(FormModel, "findByIdAndUpdate").resolves(mockForm1);
        chai
          .request(server)
          .put(`/form/updateformdesc`)
          .set("Authorization", "Bearer mockedToken")
          .send({
            formid: "1",
            formdesc: "descc",
          })
          .end((err, response) => {
            expect(response).to.have.status(200);
            done();
          });
      });

    it("Should give statusCode 404 if form not found", (done) => {
        sinon.stub(FormModel, "findByIdAndUpdate").resolves(null);
        chai
          .request(server)
          .put(`/form/updateformdesc`)
          .set("Authorization", "Bearer mockedToken")
          .send({
            formid: "1",
            formdesc: "descc",
          })
          .end((err, response) => {
            expect(response).to.have.status(404);
            expect(response.body.message).to.equal("Form not found");
            done();
          });
      });
    
      it("Should give statusCode 500 if there is error while finding form", (done) => {
        sinon.stub(FormModel, "findByIdAndUpdate").rejects(new Error("Database Error"));
        chai
          .request(server)
          .put(`/form/updateformdesc`)
          .set("Authorization", "Bearer mockedToken")
          .send({
            formid: "1",
            formdesc: "descc",
          })
          .end((err, response) => {
            expect(response).to.have.status(500);
            expect(response.body.message).to.equal(
              "Failed to update form description"
            );
            done();
          });
      });
  
  });

//

describe("Test cases for updating form fields", () => {
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

  it("Should give statusCode 200 if new field updated successfully", (done) => {
    sinon.stub(FormModel, "findById").resolves(mockForm2);
   
    sinon.stub(FormModel.prototype, "save").resolves(mockForm2);

    const requestBody = {
      formid: mockFormId,
      fielddata: { fieldid: "3", fieldName: "Updated Field 1" },
    };

    chai
      .request(server)
      .put("/form/updateformfields")
      .set("Authorization", "Bearer mockedToken")
      .send(requestBody)
      .end((err, res) => {
        expect(res).to.have.status(200);
        done();
      });
  });


  it("Should give statusCode 200 if new field updated successfully", (done) => {
    sinon.stub(FormModel, "findById").resolves(mockForm2);

    sinon.stub(FormModel.prototype, "save").resolves(mockForm2);

    const requestBody = {
      formid: mockFormId,
      fielddata: { fieldid: "1", fieldName: "Updated Field 1" },
    };

    chai
      .request(server)
      .put("/form/updateformfields")
      .set("Authorization", "Bearer mockedToken")
      .send(requestBody)
      .end((err, res) => {
        expect(res).to.have.status(200);
        done();
      });
  });

  it("Should give statusCode 404 if form is not found", (done) => {
    sinon.stub(FormModel, "findById").resolves(null);

    const requestBody = {
      formid: "invalid_form_id",
      fielddata: { fieldid: "1", fieldName: "Updated Field 1" },
    };

    chai
      .request(server)
      .put("/form/updateformfields")
      .set("Authorization", "Bearer mockedToken")
      .send(requestBody)
      .end((err, res) => {
        expect(res).to.have.status(404);
        expect(res.body.message).to.equal("Form not found");
        done();
      });
  });

  it("Should give statusCode 404 if form is not found", (done) => {
    sinon.stub(FormModel, "findById").resolves(mockForm2);
    sinon.stub(FormModel.prototype, "save").resolves(null);

    const requestBody = {
      formid: "invalid_form_id",
      fielddata: { fieldid: "1", fieldName: "Updated Field 1" },
    };

    chai
      .request(server)
      .put("/form/updateformfields")
      .set("Authorization", "Bearer mockedToken")
      .send(requestBody)
      .end((err, res) => {
        expect(res).to.have.status(404);
        expect(res.body.message).to.equal("Form not found");
        done();
      });
  });

  it("Should give statusCode 500 if there is error fetching form", (done) => {
    sinon.stub(FormModel, "findById").rejects(new Error("Database Error"));

    const requestBody = {
      formid: mockFormId,
      fielddata: { fieldid: "1", fieldName: "Updated Field 1" },
    };

    chai
      .request(server)
      .put("/form/updateformfields")
      .set("Authorization", "Bearer mockedToken")
      .send(requestBody)
      .end((err, res) => {
        expect(res).to.have.status(500);
        expect(res.body.message).to.equal("Failed to update form fields");
        done();
      });
  });

  it("Should give statusCode 500 if there is error saving new field", (done) => {
    sinon.stub(FormModel, "findById").resolves(mockForm2);

    sinon
      .stub(FormModel.prototype, "save")
      .rejects(new Error("Database Error"));

    const requestBody = {
      formid: mockFormId,
      fielddata: { fieldid: "1", fieldName: "Updated Field 1" },
    };

    chai
      .request(server)
      .put("/form/updateformfields")
      .set("Authorization", "Bearer mockedToken")
      .send(requestBody)
      .end((err, res) => {
        expect(res).to.have.status(500);
        expect(res.body.message).to.equal("Failed to update form fields");
        done();
      });
  });
});

//

describe("Test cases for adding new field", () => {
    afterEach(() => {
      sinon.restore();
    });
    beforeEach(() => {
      const jwtStub = sinon.stub(jwt, "verify");
      jwtStub.callsFake((token, secret, callback) => {
        const decodedToken = { role: "admin" };
        callback(null, decodedToken);
      });
    });
  
    it("Should give statusCode 200 if new field is added successfully", (done) => {
      sinon.stub(FormModel, "findById").resolves(mockForm2);
      const formModelMock = {
        fields: {
          push: sinon.stub().resolves({}),
        },
      };
      Object.assign(FormModel, formModelMock);
      sinon.stub(FormModel.prototype, "save").resolves(mockForm2);
      chai
        .request(server)
        .put(`/form/addnewfield`)
        .set("Authorization", "Bearer mockedToken")
        .send({
          formid: "1",
          newFieldData: {},
        })
        .end((err, response) => {
          expect(response).to.have.status(200);
          done();
        });
    });
  
    it("Should give statusCode 404 if form is not found", (done) => {
      sinon.stub(FormModel, "findById").resolves(null);
      chai
        .request(server)
        .put(`/form/addnewfield`)
        .set("Authorization", "Bearer mockedToken")
        .send({
          formid: "1",
          newFieldData: {},
        })
        .end((err, response) => {
          expect(response).to.have.status(404);
          expect(response.body.message).to.equal("Form not found");
          done();
        });
    });
  
    it("Should give statusCode 500 if there is error fetching form", (done) => {
      sinon.stub(FormModel, "findById").rejects(new Error("Database Error"));
      chai
        .request(server)
        .put(`/form/addnewfield`)
        .set("Authorization", "Bearer mockedToken")
        .send({
          formid: "1",
          newFieldData: {},
        })
        .end((err, response) => {
          expect(response).to.have.status(500);
          expect(response.body.message).to.equal("Failed to add new field");
          done();
        });
    });
  
    it("Should give statusCode 404 if form is not found after adding new field", (done) => {
      sinon.stub(FormModel, "findById").resolves(mockForm2);
      const formModelMock = {
        fields: {
          push: sinon.stub().resolves({}),
        },
      };
      Object.assign(FormModel, formModelMock);
      sinon.stub(FormModel.prototype, "save").resolves(null);
      chai
        .request(server)
        .put(`/form/addnewfield`)
        .set("Authorization", "Bearer mockedToken")
        .send({
          formid: "1",
          newFieldData: {},
        })
        .end((err, response) => {
          expect(response).to.have.status(404);
          expect(response.body.message).to.equal("Form not found");
          done();
        });
    });
  
    it("Should give statusCode 500 if there is error saving new field", (done) => {
      sinon.stub(FormModel, "findById").resolves(mockForm2);
      const formModelMock = {
        fields: {
          push: sinon.stub().resolves({}),
        },
      };
      Object.assign(FormModel, formModelMock);
      sinon
        .stub(FormModel.prototype, "save")
        .rejects(new Error("Database Error"));
      chai
        .request(server)
        .put(`/form/addnewfield`)
        .set("Authorization", "Bearer mockedToken")
        .send({
          formid: "1",
          newFieldData: {},
        })
        .end((err, response) => {
          expect(response).to.have.status(500);
          expect(response.body.message).to.equal("Failed to add new field");
          done();
        });
    });
  });

// Test cases for all delete requests

describe("Test cases for deleting a field", () => {
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

  it("Should give statusCode 200 if field is deleted successfully", (done) => {
    sinon.stub(FormModel, "findById").resolves(mockForm2);
    const formModelMock = {
      fields: {
        findIndex: () => Promise.resolve(1),
        splice: () => Promise.resolve([{}]),
      },
    };
    Object.assign(FormModel, formModelMock);
    sinon.stub(FormModel.prototype, "save").resolves(mockForm2);
    chai
      .request(server)
      .delete(`/form/deletefield`)
      .set("Authorization", "Bearer mockedToken")
      .send({
        formid: "1",
        fieldid: "2",
      })
      .end((err, response) => {
        expect(response).to.have.status(200);
        done();
      });
  });

  it("Should give statusCode 404 if form not found for the field", (done) => {
    sinon.stub(FormModel, "findById").resolves(null);
    chai
      .request(server)
      .delete(`/form/deletefield`)
      .set("Authorization", "Bearer mockedToken")
      .send({
        formid: "1",
        fieldid: "2",
      })
      .end((err, response) => {
        expect(response).to.have.status(404);
        expect(response.body.message).to.equal("Form not found");
        done();
      });
  });

  it("Should give statusCode 500 if something unusual happens", (done) => {
    sinon.stub(FormModel, "findById").rejects(new Error("Database Error"));
    chai
      .request(server)
      .delete(`/form/deletefield`)
      .set("Authorization", "Bearer mockedToken")
      .send({
        formid: "1",
        fieldid: "2",
      })
      .end((err, response) => {
        expect(response).to.have.status(500);
        expect(response.body.message).to.equal("Failed to delete form field");
        done();
      });
  });

  it("Should give statusCode 404 if field is not present", (done) => {
    sinon.stub(FormModel, "findById").resolves(mockForm2);
    const formModelMock = {
      fields: {
        findIndex: () => Promise.resolve(-1),
      },
    };
    Object.assign(FormModel, formModelMock);
    chai
      .request(server)
      .delete(`/form/deletefield`)
      .set("Authorization", "Bearer mockedToken")
      .send({
        formid: "1",
        fieldid: "2",
      })
      .end((err, response) => {
        expect(response).to.have.status(404);
        expect(response.body.message).to.equal("Field not found");
        done();
      });
  });
});

describe("Test cases for deleting a form", () => {
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

  it("Should give statusCode 200 if form is deleted successfully", (done) => {
    const mockForm5 = { _id: "formid", isComplete: false }; // Mocking a form where isComplete is false

    sinon.stub(FormModel, "findByIdAndDelete").resolves(mockForm5);
    chai
      .request(server)
      .delete(`/form/deleteform`)
      .set("Authorization", "Bearer mockedToken")
      .send({
        formid: new mongoose.Types.ObjectId(),
      })
      .end((err, response) => {
        expect(response).to.have.status(200);
        done();
      });
  });

  it("Should give statusCode 200 if form is deleted successfully and it has responses", (done) => {
    sinon.stub(FormModel, "findByIdAndDelete").resolves(mockForm1);
    sinon.stub(ResponseModel, "deleteMany").resolves({});
    chai
      .request(server)
      .delete(`/form/deleteform`)
      .set("Authorization", "Bearer mockedToken")
      .send({
        formid: new mongoose.Types.ObjectId(),
      })
      .end((err, response) => {
        expect(response).to.have.status(200);
        done();
      });
  });

  it("Should give statusCode 404 if form not found for the field", (done) => {
    sinon.stub(FormModel, "findByIdAndDelete").resolves(null);
    chai
      .request(server)
      .delete(`/form/deleteform`)
      .set("Authorization", "Bearer mockedToken")
      .send({
        formid: new mongoose.Types.ObjectId(),
      })
      .end((err, response) => {
        expect(response).to.have.status(404);
        expect(response.body.message).to.equal("Form not found");
        done();
      });
  });

  it("Should give statusCode 500 if something unusual happens", (done) => {
    sinon
      .stub(FormModel, "findByIdAndDelete")
      .rejects(new Error("Database Error"));
    chai
      .request(server)
      .delete(`/form/deleteform`)
      .set("Authorization", "Bearer mockedToken")
      .send({
        formid: new mongoose.Types.ObjectId(),
      })
      .end((err, response) => {
        expect(response).to.have.status(500);
        expect(response.body.message).to.equal("Failed to delete form");
        done();
      });
  });

  it("Should give statusCode 500 if there is error while deleting responses for the form", (done) => {
    sinon.stub(FormModel, "findByIdAndDelete").resolves(mockForm1);
    sinon
      .stub(ResponseModel, "deleteMany")
      .rejects(new Error("Database Error"));
    chai
      .request(server)
      .delete(`/form/deleteform`)
      .set("Authorization", "Bearer mockedToken")
      .send({
        formid: new mongoose.Types.ObjectId(),
      })
      .end((err, response) => {
        expect(response).to.have.status(500);
        expect(response.body.message).to.equal("Failed to delete form");
        done();
      });
  });
});
