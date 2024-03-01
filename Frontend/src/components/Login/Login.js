import img from "../../assets/loginvector.png";
import classes from "./Login.module.css";
import { MDBContainer, MDBCol, MDBRow } from "mdb-react-ui-kit";
import LoginFormAdm from "../LoginForm/LoginFormAdm";
import LoginFormEmp from "../LoginForm/LoginFormEmp";
import { useLocation } from "react-router-dom";

const Login = () => {
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  let role = params.get("role") || "employee";

  return (
    <MDBContainer fluid className={`p-3 ${classes.h_custom}`}>
      <MDBRow className={`${classes.vectorimage}`}>
        <MDBCol col="10" md="6">
          <img src={img} alt="Loading" className="img-fluid" />
        </MDBCol>
        {role === "admin" ? <LoginFormAdm /> : <LoginFormEmp />}
      </MDBRow>
    </MDBContainer>
  );
};

export default Login;
