

import React, { useState } from "react";
import classes from "./EmployeeDashboard.module.css";
import { Navbar, Footer } from "../../../index";
import { FaPlus } from "react-icons/fa";
import { AssignedForm,SubmittedForm } from "./components/index";
import { useNavigate } from "react-router-dom";
import { MAIN_LINK } from "../../../../urls/urls";
import Cookies from "js-cookie";
import { useRequest } from "../../../../context/request-hook";

const EmployeeDashboard = () => {
  const navigate = useNavigate();
  const { sendRequest } = useRequest();
  const createFormHandler = async () => {
    if (localStorage.getItem("role") === "admin") {
      const response = await sendRequest(
        `${MAIN_LINK}/form/createforms`,
        "POST",
        JSON.stringify({
          adminId: localStorage.getItem("userid"),
        }),
        {
          "Content-Type": "application/json",
          Authorization: `Bearer ${Cookies.get("token")}`,
        }
      );
      navigate(`/createform/${response.form.id}`);
    } else {
      navigate("/landingpage");
    }
  };
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
