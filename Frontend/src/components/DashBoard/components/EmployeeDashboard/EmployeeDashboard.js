import React from 'react'
import classes from "./EmployeeDashboard.module.css";
import { Navbar, Footer } from "../../../index";

const EmployeeDashboard = () => {
  return (
    <>
    <Navbar/>
      <div className={classes.employeedashboardcontainer}>
        Employee Dashboard
      </div>
      <Footer/>
    </>
  )
}

export default EmployeeDashboard
