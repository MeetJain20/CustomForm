import React, { useState } from "react";
import { useRequest } from "../../../../context/request-hook";
import { AuthContext } from "../../../../context/authcontext";
import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { MDBCol, MDBInput } from "mdb-react-ui-kit";
import { Link } from "react-router-dom";
import classes from "./LoginForm.module.css";
import { MAIN_LINK } from "../../../../urls/urls";
import { toast } from "sonner";
import Loader from "../../../Loader";

const LoginFormAdm = () => {
  const auth = useContext(AuthContext);
  const { sendRequest } = useRequest();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isError, setisError] = useState(false);
  const [isloading, setIsloading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const validateEmail = (email) => {
    const re =
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
  };
  const validatePass = (password) => {
    if (password.length < 6) {
      return false;
    }
    return true;
  };

  const handleClick = async (e) => {
    e.preventDefault();
    if (email && password) {
      if (validateEmail(email)) {
        if (validatePass(password)) {
          e.preventDefault();
          try{
            setIsloading(true);
          const response = await sendRequest(
            `${MAIN_LINK}/employee/login`,
            "POST",
            JSON.stringify({
              email: email,
              password: password,
              role: "admin",
            }),
            {
              "Content-Type": "application/json",
            }
          );
          setIsloading(false);
            toast.success("Login Successful");
            navigate("/admindashboard");
            auth.login(response.id, "admin", response.token);
            setEmail("");
            setPassword("");
          
          }catch(err){
          setIsloading(false);
            toast.error(`${err.message}`);
            navigate('/login?role=admin')
            setError(`${err.message}`);
            setisError(true);
          }
          
        } else {
          setIsloading(false);
          toast.warning("Password must be atleast 6 characters");
          setError("Password must be atleast 6 characters");
          setisError(true);
        }
      } else {
        toast.error("Invalid Email");
        setError("Invalid email");
        setisError(true);
      }
    } else if (email === "" || password === "") {
      toast.warning("Please fill in all fields");
      setError("Please fill in all fields");
      setisError(true);
    }
  };
  return (
    <>
    {isloading && <Loader/>}
      <MDBCol col="4" md="6" className={classes.logindiv}>
        <div className="d-flex flex-row align-items-center justify-content-center">
          <p className="lead fw-normal mb-0 me-3">Sign In As Admin</p>
        </div>

        <div className={`d-flex align-items-center my-4`}>
          <p className="text-center fw-bold mx-3 mb-0"></p>
        </div>

        <MDBInput
          wrapperClass="mb-4"
          placeholder="Email"
          id="formControllemail"
          type="email"
          size="lg"
          onChange={(e) => {
            setEmail(e.target.value);
            setError("");
          }}
        />
        <MDBInput
          wrapperClass="mb-4"
          placeholder="Password"
          id="formControllpassword"
          type="password"
          size="lg"
          onChange={(e) => {
            setPassword(e.target.value);
            setError("");
          }}
        />
        <div className="container my-3">
          {isError && (
            <span className="loginError" style={{ color: "red" }}>
              {error}
            </span>
          )}
        </div>

        <div className="text-center text-md-start mt-4 pt-2">
          <button
            className={`mb-3 px-5 btn btn-outline-info`}
            size="lg"
            onClick={handleClick}
          >
            Login
          </button>
          <p className="fw-bold">
            Don't have an account?{" "}
            <Link
              to="/signup?role=admin" // Pass role as a query parameter without quotation marks
              className="link-info"
            >
              Register
            </Link>
          </p>
          <Link to="/termsandcondition">
            <p className={`${classes.termscondition}`}>Terms And Conditions*</p>
          </Link>
        </div>
      </MDBCol>
    </>
  );
};

export default LoginFormAdm;
