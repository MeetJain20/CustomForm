import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Navbar, Footer } from "../index";
import classes from "./DisplayForm.module.css";
import { useNavigate, useParams } from "react-router-dom";
import { useRequest } from "../../context/request-hook";
import { MAIN_LINK } from "../../urls/urls";
import Cookies from "js-cookie";
import DisplayFields from "./components/DisplayFields";

const DisplayForm = () => {
  const { formid } = useParams();
  const navigate = useNavigate();
  const { sendRequest } = useRequest();
  const [formtitle, setFormtitle] = useState("");
  const [formdesc, setFormdesc] = useState("");
  const [adminid, setAdminid] = useState("");
  const [isSaved, setIsSaved] = useState("");
  const [isTemplate, setIsTemplate] = useState("");
  const fields = useSelector((state) => state.formData.fields);
  const dispatch = useDispatch();

  // Save Form as a Template

  const saveFormTemplateHandler = async () => {
    try {
      const responseData = await sendRequest(
        `${MAIN_LINK}/form/updatetemplatestatus`,
        "PUT",
        JSON.stringify({
          formid: formid,
        }),
        {
          "Content-Type": "application/json",
          Authorization: `Bearer ${Cookies.get("token")}`,
        }
      );
      navigate("/admindashboard");
    } catch (err) {
      console.log(err);
    }
  };

  // Edit Form

  const editFormHandler = async () => {
    try {
      const responseData = await sendRequest(
        `${MAIN_LINK}/form/updateeditstatus`,
        "PUT",
        JSON.stringify({
          formid: formid,
        }),
        {
          "Content-Type": "application/json",
          Authorization: `Bearer ${Cookies.get("token")}`,
        }
      );
      navigate(`/createform/${formid}`);
    } catch (err) {
      console.log(err);
    }
  };

  // Use Template

  const useTemplateHandler = async()=>{
    try {
        const responseData = await sendRequest(
          `${MAIN_LINK}/form/createFromTemplate`,
          "POST",
          JSON.stringify({
            formid: formid,
            adminId: localStorage.getItem('userid')
          }),
          {
            "Content-Type": "application/json",
            Authorization: `Bearer ${Cookies.get("token")}`,
          }
        );
        navigate(`/createform/${responseData._id}`);
      } catch (err) {
        console.log(err);
      }
  }

  // Get FormData

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const responseData = await sendRequest(
          `${MAIN_LINK}/form/getcurrentform`,
          "POST",
          JSON.stringify({
            formid: formid,
          }),
          {
            "Content-Type": "application/json",
            Authorization: `Bearer ${Cookies.get("token")}`,
          }
        );
        // console.log(responseData);
        if (responseData) {
          setFormtitle(responseData[0].formtitle);
          setFormdesc(responseData[0].formdesc);
          // setFields(responseData[0].fields);
          dispatch({
            type: "UPDATE_FIELDS_FROM_BACKEND",
            payload: responseData[0].fields,
          });
          setAdminid(responseData[0].adminId);
          setIsSaved(responseData[0].isComplete);
          setIsTemplate(responseData[0].isTemplate)
        }
      } catch (err) {
        console.log(err);
      }
    };
    fetchItems();
  }, [sendRequest]);
  // console.log(fields);
  return (
    <>
      <Navbar />
      <div className={classes.displayformcontainer}>
        <div className={classes.customcontainer}>
          <div className={classes.displayformheader}>
            <input
              type="text"
              value={formtitle}
              className={classes.displayformheadertitle}
              readOnly
            />
            <input
              type="text"
              value={formdesc}
              className={classes.displayformheaderdesc}
              readOnly
            />
          </div>
        </div>
        <div className={classes.displayformbody}>
          {fields.map((fieldData, index) => (
            <DisplayFields
              key={index}
              activeType={fieldData.type}
              fieldData={fieldData}
            />
          ))}
        </div>
        <div className={classes.submitformbuttoncontainer}>
        {localStorage.getItem('role') === "admin" && !isTemplate &&  <button
            className={classes.submitformbutton}
            onClick={saveFormTemplateHandler}
          >
            Save Form as a Template
          </button>}
          {localStorage.getItem('role') === "admin" && isSaved && localStorage.getItem('userid') === adminid ? (<button
            className={classes.submitformbutton}
            onClick={editFormHandler}
          >
             Edit Form
          </button>):(<button
            className={classes.submitformbutton}
            onClick={useTemplateHandler}
          >
             Use Template
          </button>)}
        </div>
      </div>
      <Footer />
    </>
  );
};

export default DisplayForm;
