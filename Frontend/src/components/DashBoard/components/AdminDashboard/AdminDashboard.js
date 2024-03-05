import React from "react";
import classes from "./AdminDashboard.module.css";
import { Navbar, Footer } from "../../../index";
import { FaPlus } from "react-icons/fa";
import { CurrentForms, TemplateForms, MyForms } from "./components/index";

const AdminDashboard = () => {
  return (
    <>
      <Navbar />
      <div className={classes.admindashboardcontainer}>
        <div className={classes.addformbutton}>
          <div className={classes.newformbutton}>
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
