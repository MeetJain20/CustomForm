import React from "react";
import { MDBContainer, MDBCol, MDBRow } from "mdb-react-ui-kit";
import classes from "./Signup.module.css";
import img from "../../assets/signupvector.jpg";
import { SignUpFormAdm, SignUpFormEmp } from "./components/index";
import { useLocation } from "react-router-dom";
import { Navbar } from "../index.js";

const SignUp = () => {
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  let role = params.get("role");
  return (
    <>
      <Navbar />
      <MDBContainer fluid className="p-3 h-custom">
        <MDBRow className={`${classes.signvectorimg}`}>
          <MDBCol col="10" md="6">
            <img src={img} alt="Loading" className="img-fluid" />
          </MDBCol>

          {role === "employee" ? <SignUpFormEmp /> : <SignUpFormAdm />}
        </MDBRow>
      </MDBContainer>
    </>
  );
};

export default SignUp;
