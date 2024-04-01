import React from "react";
import classes from "./Error.module.css";
import { errorimg } from "../../../assets";
import { Navbar, Footer } from "../../index";
import { useNavigate } from "react-router-dom";

const Error = () => {
    const navigate = useNavigate();
  return (
    <>
    <Navbar/>
    <div className={classes.errorcontainer}>
      <div className={classes.errorbox}>
        <div className={classes.errorimagediv}>
          <img src={errorimg} alt="Error 404" className={classes.errorimage} />
        </div>
        <div className={classes.errortexthead}>
          Error 404
        </div>
        <div className={classes.errortext}>
          Sorry, the page you are looking for could not be found. Please check
          the URL and try again
        </div>
      </div>
      <button className={classes.buttonforhomepage} onClick={()=>{
        navigate('/');
      }}>Go back to Homepage</button>
    </div>
    <Footer/>
  </>
  );
};

export default Error;
