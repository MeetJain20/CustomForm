import React, { useContext } from "react";
import { AuthContext } from "../../context/authcontext";
import { Link, useNavigate } from "react-router-dom";
import { Navbar, Footer } from "../index";
import classes from "./LandingPage.module.css";
import {
  mainbodyimage,
  approveresponse,
  sendformforresponse,
  formcreation,
} from "../../assets/index";
import { toast } from "sonner";
import FeatureItem from "./components/FeatureItem/FeatureItem";
const LandingPage = () => {
  const navigate = useNavigate();
  const features = [
    {
      title: "Create an online form as easily as creating a document",
      description:
        "Select from multiple question types, drag-and-drop to reorder questions, and customize values as easily as pasting a list.",
      image: formcreation,
    },
    {
      title: "Send polished surveys and forms",
      description:
        "Customize colors, images, and fonts to adjust the look and feel or reflect your organization’s branding. And add custom logic that shows questions based on answers, for a more seamless experience.",
      image: sendformforresponse,
    },
    {
      title: "Appove the response received",
      description:
        "Based on the response received from employee decide whether to approve it or not",
      image: approveresponse,
    },
  ];

  const gotoformHandler = ()=>{
    if(localStorage.getItem('role') === "admin")
    {
      toast.info("Admin Dashboard");
      navigate('/admindashboard');
    }
    else if(localStorage.getItem('role') === "employee")
    {
      toast.info("Employee Dashboard");
      navigate('/employeedashboard');
    }
  }

  return (
    <>
      <Navbar />
      <div className={classes.landingpagecontainer}>
        <div className={classes.mainbody}>
          <div className={classes.mainbodydescription}>
            <div className={classes.bodytitle}>
              Get insights quickly, with Dbox Forms
            </div>
            <div className={classes.bodydesc}>
              Easily create and share online forms and surveys, and analyze
              responses in real-time.
            </div>
            <div className={classes.bodyformslink}>
              <button className={classes.gotoformsbutton} onClick={gotoformHandler}>Go To Forms</button>
            </div>
            {!localStorage.getItem("userid") && <div className={classes.gotosignup}>
              <div className={classes.donthavetext}>Don't Have an account?</div>
              <div className={classes.listofsignup}>
                <div className="dropdown">
                  <div
                    className={`${classes.dropdownbutton} dropdown-toggle`}
                    type="button"
                    data-bs-toggle="dropdown"
                    aria-expanded="false"
                  >
                    Sign Up for free
                  </div>
                  <ul className={`${classes.dropdownmenu} dropdown-menu`}>
                    <li>
                      <Link
                        to={`/signup?role=admin`}
                        className={classes.linktosignup}
                      >
                        As An Admin
                      </Link>
                    </li>
                    <li>
                      <Link
                        to={`/signup?role=employee`}
                        className={classes.linktosignup}
                      >
                        As An Employee
                      </Link>
                    </li>
                  </ul>
                </div>
              </div>
            </div>}
          </div>
          <div className={classes.mainbodyimage}>
            <img
              src={mainbodyimage}
              alt="Loading"
              className={classes.bodyimage}
            />
          </div>
        </div>
        <div className={classes.featurescontainer}>
          <div className={classes.featuresheading}>Features</div>
          {features.map((feature, index) => {
            const isOddIndex = index % 2 !== 0;
            const sideProp = isOddIndex ? "switch" : null;

            return (
              <FeatureItem
                key={index}
                title={feature.title}
                description={feature.description}
                image={feature.image}
                side={sideProp} // Pass the side prop
              />
            );
          })}
        </div>
      </div>
      <Footer />
    </>
  );
};

export default LandingPage;
