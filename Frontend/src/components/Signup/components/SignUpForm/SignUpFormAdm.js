import React, { useEffect, useState } from "react";
import { MDBCol, MDBInput, MDBCheckbox } from "mdb-react-ui-kit";
import { useRequest } from "../../../../context/request-hook";
import { Link, useNavigate } from "react-router-dom";
import classes from "./SignUpForm.module.css";
import Select from "react-select";
import { MAIN_LINK } from "../../../../urls/urls";
import { toast } from "sonner";
import Loader from "../../../Loader";

const SignUpFormAdm = () => {
  const { sendRequest } = useRequest();
  const navigate = useNavigate();
  const [hasteam, setHasteam] = useState(false);
  const [empName, setEmpName] = useState("");
  const [mobile, setMobile] = useState(0);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [teamName, setTeamName] = useState("");
  const [teamName1, setTeamName1] = useState("");
  const [isError, setisError] = useState(false);
  const [error, setError] = useState("");
  const [isChecked, setIsChecked] = useState(false);
  const [isloading, setIsloading] = useState(false);
  const handleCheckboxChange = (event) => {
    setIsChecked(event.target.checked);
  };
  const validateEmail = (email) => {
    const re =
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
  };
  const validateMobile = (mobile) => {
    const mobchecker = /^[0-9]+$/;
    return mobchecker.test(String(mobile));
  };
  const validatePass = (password) => {
    if (password.length < 6) {
      return false;
    }
    return true;
  };

  const [selectedOptions, setSelectedOptions] = useState();

  const [optionList, setOptionList] = useState([]);
  function handleSelect(data) {
    setSelectedOptions(data);
    setTeamName1(data);
  }

  const loginredirectHandler = () => {
    navigate("/login?role=admin");
  };

  const signupHandler = async (e) => {
    e.preventDefault();
  
    if (empName && email && password && mobile && (teamName || teamName1)) {
      if (isChecked) {
        if (validateEmail(email)) {
          if (validatePass(password)) {
            if (validateMobile(mobile) && String(mobile).length === 10) {
              setError("");
              setisError(false);
              e.preventDefault();
              setIsloading(true);
              try {
                const response = await sendRequest(
                  `${MAIN_LINK}/admin/signupadm`,
                  "POST",
                  JSON.stringify({
                    empName: empName,
                    mobile: mobile,
                    teamName: teamName === "" ? teamName1.label : teamName,
                    email: email,
                    password: password,
                  }),
                  { "Content-Type": "application/json" }
                );
                if (response.status === 201) {
                  // Sign up successful
                  navigate("/login?role=admin");
                  setIsloading(false);
                  toast.success("Sign Up Successful");
                  setEmpName("");
                  setEmail("");
                  setPassword("");
                  setMobile(0);
                  setTeamName("");
                  setTeamName1("");
                } 
              } catch (err) {
                // Error while signing up
                setIsloading(false);
                toast.error(`${err.message}`);
                navigate('/signup?role=admin');
                setError(`${err.message}`);
            setisError(true);
              }
            } else {
              setIsloading(false);
  
              toast.warning("Invalid Mobile Number");
              setError("Invalid Mobile Number");
              setisError(true);
            }
          } else {
            setIsloading(false);
  
            toast.warning("Password must be atleast 6 characters");
            setError("Password must be atleast 6 characters");
            setisError(true);
          }
        } else {
          setIsloading(false);
  
          toast.error("Invalid Email");
          setError("Invalid Email");
          setisError(true);
        }
      } else if (!isChecked) {
        setIsloading(false);
  
        toast.warning("Please accept Terms and Conditions");
        setError("Please accept Terms and Conditions");
        setisError(true);
      }
    } else if (
      empName === "" ||
      email === "" ||
      password === "" ||
      mobile === "" ||
      teamName === ""
    ) {
      toast.warning("Please fill in all fields");
      setError("Please fill in all fields");
      setisError(true);
    } else if (password.length < 6) {
      toast.warning("Password must be at least 6 characters");
      setError("Password must be at least 6 characters");
      setisError(true);
    }
  };
  

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const responseData = await sendRequest(
          `${MAIN_LINK}/employee/getteamnames`,
          "GET",
          null,
          {
            "Content-Type": "application/json",
          }
        );
        if (responseData) {
          setHasteam(true);
          const updatedOptionList = [];
          responseData.forEach((item) => {
            const newTeamname = {
              value: item.trim().replace(/\s/g, "").toLowerCase(),
              label: item.charAt(0).toUpperCase() + item.slice(1),
            };
            updatedOptionList.push(newTeamname);
          });
          setOptionList(updatedOptionList);
        } else {
          setHasteam(false);
        }
      } catch (err) {
        console.log(err);
      }
    };
    fetchItems();
  }, [sendRequest]);

  return (
    <>
      {isloading && <Loader />}
      <MDBCol col="4" md="6" className={classes.signupdiv}>
        <div className="d-flex flex-row align-items-center justify-content-center">
          <p className="lead fw-normal mb-0 me-3">Sign Up as Admin</p>
        </div>

        <div className="divider d-flex align-items-center my-4">
          <p className="text-center fw-bold mx-3 mb-0"></p>
        </div>
        <MDBInput
          wrapperClass="mb-4"
          // label="Email team"
          placeholder="Enter Name"
          id="formControlLg"
          type="text"
          size="lg"
          onChange={(e) => {
            setEmpName(e.target.value);
            setError("");
          }}
        />
        <MDBInput
          wrapperClass="mb-4"
          placeholder="Enter Mobile Number"
          id="formControlLg"
          type="number"
          size="lg"
          onChange={(e) => {
            setMobile(e.target.value);
            setError("");
          }}
        />
        {hasteam && (
          <Select
            options={optionList}
            placeholder="Select Existing Team"
            value={selectedOptions}
            onChange={handleSelect}
            isSearchable={true}
            isClearable={true}
            className="my-4"
          />
        )}
        {!teamName1 && (
          <MDBInput
            wrapperClass="mb-4"
            placeholder="Enter New Team"
            id="formControlLg"
            type="text"
            size="lg"
            onChange={(e) => {
              setTeamName(e.target.value);
              setError("");
              if (e.target.value === "") {
                setHasteam(true);
              } else setHasteam(false);
            }}
          />
        )}
        <MDBInput
          wrapperClass="mb-4"
          placeholder="Email"
          id="formControlLg"
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
          id="formControlLg"
          type="password"
          size="lg"
          onChange={(e) => {
            setPassword(e.target.value);
            setError("");
          }}
        />
        <MDBCheckbox
          name="flexCheck"
          value=""
          id="flexCheckDefault"
          style={{ color: "red" }}
          label="Accept all Terms and Conditions*"
          checked={isChecked}
          onChange={handleCheckboxChange}
        />
        <div className="contain my-3">
          {isError && (
            <span className="signError" style={{ color: "red" }}>
              {error}
            </span>
          )}
        </div>
        <div className="text-center text-md-start mt-4 pt-2">
          <button
            className="mb-0 px-5 btn btn-outline-info"
            size="lg"
            onClick={signupHandler}
          >
            Register
          </button>
          <button
            className="mx-3 mb-0 px-5 btn btn-outline-success"
            size="lg"
            onClick={loginredirectHandler}
          >
            Have an account
          </button>
        </div>
        <Link to="/termsandcondition">
          <p className={classes.termscondition}>Terms And Conditions*</p>
        </Link>
      </MDBCol>
    </>
  );
};

export default SignUpFormAdm;
