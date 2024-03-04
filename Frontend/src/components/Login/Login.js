import img from "../../assets/loginvector.png";
import classes from "./Login.module.css";
import { MDBContainer, MDBCol, MDBRow } from "mdb-react-ui-kit";
import { LoginFormAdm, LoginFormEmp } from "./components/index";
import { useLocation } from "react-router-dom";
import { Navbar } from "../index.js";

const Login = () => {
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  let role = params.get("role") || "employee";

  return (
    <>
      <Navbar />
      <MDBContainer fluid className={`my-4 p-3 ${classes.h_custom}`}>
        <MDBRow className={`${classes.vectorimage}`}>
          <MDBCol col="10" md="6">
            <img src={img} alt="Loading" className="img-fluid" />
          </MDBCol>
          {role === "admin" ? <LoginFormAdm /> : <LoginFormEmp />}
        </MDBRow>
      </MDBContainer>
    </>
  );
};

export default Login;
