import React, { useState } from "react";
import classes from "./AdminDashboard.module.css";
import { Navbar, Footer } from "../../../index";
import { FaPlus } from "react-icons/fa";

import { CurrentForms, TemplateForms, MyForms } from "./components/index";
import { useNavigate } from "react-router-dom";

const AdminDashboard = () => {
  const navigate = useNavigate();
  const createFormHandler = () => {
    if(localStorage.getItem('role') === "admin")
    {
      navigate('/createform');

    }
    else{
      navigate('/landingpage');
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
