

import React, { useState } from "react";
import classes from "./EmployeeDashboard.module.css";
import { Navbar, Footer } from "../../../index";
import { AssignedForm,SubmittedForm } from "./components/index";

const EmployeeDashboard = () => {
 
  return (
    <>
      <Navbar />
      <div className={classes.employeedashboardcontainer}>
        <div className={classes.allformscontainer}>
          <AssignedForm />
          <SubmittedForm/>
          {/* <TemplateForms />
          <MyForms /> */}
        </div>
      </div>
      <Footer />
    </>
  );
};

export default EmployeeDashboard;
