import React, { useState } from "react";
import classes from "./AdminDashboard.module.css";
import { Navbar, Footer } from "../../../index";
import { FaPlus } from "react-icons/fa";
import { CurrentForms, TemplateForms, MyForms } from "./components/index";
import { useNavigate } from "react-router-dom";
import { MAIN_LINK } from "../../../../urls/urls";
import Cookies from "js-cookie";
import { useRequest } from "../../../../context/request-hook";

const AdminDashboard = () => {
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
      <div className={classes.admindashboardcontainer}>
        <div className={classes.addformbutton}>
          <div className={classes.newformbutton} onClick={createFormHandler}>
            <FaPlus />
          </div>
          Create New Form
        </div>
        <div className={classes.allformscontainer}>
          <CurrentForms />
          <TemplateForms />
          <MyForms />
        </div>
      </div>
      <Footer />
    </>
  );
};

export default AdminDashboard;
