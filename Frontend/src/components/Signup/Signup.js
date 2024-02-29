import React from "react";

import { MDBContainer, MDBCol, MDBRow } from "mdb-react-ui-kit";
import classes from "./Signup.module.css";
import img from "../../assets/signupvector.jpg";
import SignUpFormAdm from "../SignUpForm/SignUpFormAdm";
import { useLocation } from "react-router-dom";
import SignUpFormEmp from "../SignUpForm/SignUpFormEmp";

const SignUp = () => {
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  let role = params.get("role");
  return (
    <MDBContainer fluid className="p-3 h-custom">
      <MDBRow className={`${classes.signvectorimg}`}>
        <MDBCol col="10" md="6">
          <img src={img} alt="Loading" className="img-fluid" />
        </MDBCol>

        {role === "employee" ? <SignUpFormEmp /> : <SignUpFormAdm />}
      </MDBRow>

      {/* <div className="d-flex flex-column flex-md-row text-center text-md-start justify-content-between py-4 px-4 bg-primary footer">
                <div className="text-white mt-2">
                    Copyright © 2020. All rights reserved.
                </div>

                <div>
                    <button
                        tag="a"
                        color="none"
                        className="mx-3 btn btn-primary"
                        style={{ color: "white" }}
                    >
                        <MDBIcon fab icon="facebook-f" size="md" />
                    </button>

                    <button
                        tag="a"
                        color="none"
                        className="mx-3 btn btn-primary"
                        style={{ color: "white" }}
                    >
                        <MDBIcon fab icon="twitter" size="md" />
                    </button>

                    <button
                        tag="a"
                        color="none"
                        className="mx-3 btn btn-primary"
                        style={{ color: "white" }}
                    >
                        <MDBIcon fab icon="google" size="md" />
                    </button>

                    <button
                        tag="a"
                        color="none"
                        className="mx-3 btn btn-primary"
                        style={{ color: "white" }}
                    >
                        <MDBIcon fab icon="linkedin-in" size="md" />
                    </button>
                </div>
            </div> */}
    </MDBContainer>
  );
};

export default SignUp;
