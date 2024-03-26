import React, { useEffect, useState } from "react";
import classes from "./EditProfile.module.css";
import { MAIN_LINK } from "../../../urls/urls";
import { toast } from "sonner";
import { useRequest } from "../../../context/request-hook";
import Cookies from "js-cookie";
import Loader from "../../Loader";

const EditProfile = (props) => {
  const { sendRequest } = useRequest();
  const { id, role, closeModal } = props;
  const [isloading, setIsloading] = useState(false);
  const [empName, setEmpName] = useState("");
  const [email, setEmail] = useState("");
  const [teamName, setTeamName] = useState("");
  const [mobile, setMobile] = useState(0);
  const [change, setChange] = useState(false);

  const validateEmail = (email) => {
    const re =
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
  };
  const validateMobile = (mobile) => {
    const mobchecker = /^[0-9]+$/;
    return mobchecker.test(String(mobile));
  };

  // Edit Profile Details

  const editdetailsHandler = async() => {
    let profileEndpoint;
    if (role === "admin") {
      profileEndpoint = `${MAIN_LINK}/profile/updateadmprofiledetails`;
    } else {
      profileEndpoint = `${MAIN_LINK}/profile/updateempprofiledetails`;
    }

    try {
      if(email === "" || empName === "")
      {
        toast.warning("Please fill in all fields");
        return;
      }
      if(!validateEmail(email))
      {
        toast.warning("Invalid Email");
        return;
      }
      if(!validateMobile(mobile))
      {
        toast.warning("Mobile Number must only contain numbers");
        return;
      }
      else if(validateMobile(mobile) && String(mobile).length !== 10)
      {
        toast.warning("Mobile Number must be of 10 digits");
        return;
      }
      setIsloading(true);
      const responseData = await sendRequest(profileEndpoint, 
        "PUT",
      JSON.stringify({
        userid: id,
        empName,
        mobile,
        email
      }), 
      {
        "Content-Type": "application/json",
        Authorization: `Bearer ${Cookies.get("token")}`,
      });
      // console.log(responseData);
      setIsloading(false);
      setChange(false);
      closeModal();
      toast.success(`${responseData.message}`);
    } catch (err) {
      setIsloading(false);
      toast.error(`${err.message}`);
    }
  };

  // Fetch Profile Details
  let profileEndpoint;
  if (role === "admin") {
    profileEndpoint = `${MAIN_LINK}/profile/getadmprofiledetails/${id}`;
  } else {
    profileEndpoint = `${MAIN_LINK}/profile/getempprofiledetails/${id}`;
  }

  useEffect(() => {
    const fetchItems = async () => {
      try {
        setIsloading(true);
        const responseData = await sendRequest(profileEndpoint, "GET", null, {
          "Content-Type": "application/json",
          Authorization: `Bearer ${Cookies.get("token")}`,
        });
        // console.log(responseData);
        if (responseData) {
          setIsloading(false);
          setEmail(responseData[0].email);
          setTeamName(responseData[0].teamName);
          setEmpName(responseData[0].empName);
          setMobile(responseData[0].mobile);
          // toast.success("Profile details fetched successfully");
          // console.log(responseData);
        }
      } catch (err) {
        setIsloading(false);
        toast.error(`${err.message}`);
      }
    };
    fetchItems();
  }, [sendRequest]);
  
  return (
    <>
      {isloading && <Loader />}
      <div className={classes.editprofilecontainer}>
        <div className={classes.profileheader}>Profile Details</div>
        <div className={classes.profilebody}>
          <div className={classes.individualdetail}>
            <label className={classes.inputname}>Employee Name :</label>
            <input
              type="text"
              className={classes.profiledets}
              name="name"
              value={empName}
              onChange={(e) => {
                setChange(true);
                setEmpName(e.target.value);
              }}
            />
          </div>
          <div className={classes.individualdetail}>
            <label className={classes.inputname}>Email :</label>
            <input
              type="text"
              className={classes.profiledets}
              name="email"
              value={email}
              onChange={(e) => {
                setChange(true);
                setEmail(e.target.value);
              }}
            />
          </div>
          <div className={classes.individualdetail}>
            <label className={classes.inputname}>Mobile Number :</label>
            <input
              type="number"
              className={classes.profiledets}
              name="mobile"
              value={mobile}
              onChange={(e) => {
                setChange(true);
                setMobile(e.target.value);
              }}
            />
          </div>
          <div className={classes.individualdetail}>
            <label className={classes.inputname}>Team Name :</label>
            <input
              type="text"
              className={classes.profiledets}
              name="teamname"
              value={teamName}
              readOnly
              onChange={(e) => {
                setChange(true);
                setTeamName(e.target.value);
              }}
            />
          </div>
        </div>
        <div className={classes.profilefooter}>
          <button
            className={classes.editprofilebutton}
            style={{
              cursor: change ? "pointer" : "not-allowed",
              opacity: change ? "1" : "0.6",
            }}
            disabled={change ? false : true}
            onClick={editdetailsHandler}
          >
            Edit Details
          </button>
          <button className={classes.closebutton} onClick={() => closeModal()}>
            Close
          </button>
        </div>
      </div>
    </>
  );
};

export default EditProfile;
