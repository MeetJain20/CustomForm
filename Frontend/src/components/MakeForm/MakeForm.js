import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Navbar, Footer, DisplayForm } from "../index";
import classes from "./MakeForm.module.css";
import NewFields from "./components/NewFields";
import { useNavigate, useParams } from "react-router-dom";
import { useRequest } from "../../context/request-hook";
import { MAIN_LINK } from "../../urls/urls";
import Cookies from "js-cookie";
import debounce from "lodash.debounce";
import FirstNewFields from "./components/FirstNewFields";
import DisplayPreviewForm from "../DisplayForm/components/DisplayPreviewForm";
import { toast } from "sonner";
import Loader from "../Loader";

const MakeForm = () => {
  const { formid } = useParams();
  const navigate = useNavigate();
  const { sendRequest } = useRequest();
  const savefield = useSelector((state) => state.funcfield.saveChanges);
  const copyfield = useSelector((state) => state.funcfield.copyField);
  const deletefield = useSelector((state) => state.funcfield.deleteField);
  const [formtitle, setFormtitle] = useState("");
  const [formdesc, setFormdesc] = useState("");
  const [isSaved, setIsSaved] = useState("");
  const [isTemplate, setIsTemplate] = useState("");
  const [isloading, setIsloading] = useState(false);
  const fields = useSelector((state) => state.formData.fields);
  const dispatch = useDispatch();

  const formtitleHandler = async (e) => {
    e.preventDefault();
    setFormtitle(e.target.value);
  };

  const debouncedFormtitleHandler = debounce(async (value) => {
    try {
      if (value) {
        const responseData = await sendRequest(
          `${MAIN_LINK}/form/updateformtitle`,
          "PUT",
          JSON.stringify({
            formid: formid,
            formtitle: value,
          }),
          {
            "Content-Type": "application/json",
            Authorization: `Bearer ${Cookies.get("token")}`,
          }
        );
        dispatch({
          type: "UPDATE_TITLE"
        });
      }
      // setFormtitle(responseData.formtitle);
    } catch (err) {
      toast.error("Error saving Title");
      console.log(err);
    }
  }, 300);

  useEffect(() => {
    debouncedFormtitleHandler(formtitle);
  }, [formtitle]);

  const formdescHandler = async (e) => {
    e.preventDefault();
    setFormdesc(e.target.value);
  };

  const debouncedFormDescHandler = debounce(async (value) => {
    try {
      if (value) {
        const responseData = await sendRequest(
          `${MAIN_LINK}/form/updateformdesc`,
          "PUT",
          JSON.stringify({
            formid: formid,
            formdesc: value,
          }),
          {
            "Content-Type": "application/json",
            Authorization: `Bearer ${Cookies.get("token")}`,
          }
        );
        dispatch({
          type: "UPDATE_DESC"
        });
      }
    } catch (err) {
      toast.error("Error saving Description");
      console.log(err);
    }
  }, 300);

  useEffect(() => {
    debouncedFormDescHandler(formdesc);
  }, [formdesc]);

  // Save Form

  const saveFormHandler = async () => {
    try {
      setIsloading(true);
      const responseData = await sendRequest(
        `${MAIN_LINK}/form/updateformstatus`,
        "PUT",
        JSON.stringify({
          formid: formid,
        }),
        {
          "Content-Type": "application/json",
          Authorization: `Bearer ${Cookies.get("token")}`,
        }
      );
      setIsloading(false);
      toast.success("Form Saved Successfully");
      navigate("/admindashboard");
    } catch (err) {
      setIsloading(false);
      toast.error("Error saving Form");
      console.log(err);
    }
  };

  // Save Form as a Template

  const saveFormTemplateHandler = async () => {
    try {
      setIsloading(true);
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
      setIsloading(false);
      toast.success("Template Saved Successfully");
      navigate("/admindashboard");
    } catch (err) {
      setIsloading(false);
      toast.error("Error saving Template");
      console.log(err);
    }
  };

  // Get FormData

  useEffect(() => {
    const fetchItems = async () => {
      try {
        setIsloading(true);
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
        // toast.success("Form details fetched successfully")
        // console.log(responseData);
        if (responseData) {
          setIsloading(false);

          setFormtitle(responseData[0].formtitle);
          setFormdesc(responseData[0].formdesc);
          // setFields(responseData[0].fields);
          dispatch({
            type: "UPDATE_FIELDS_FROM_BACKEND",
            payload: responseData[0].fields,
          });
          setIsTemplate(responseData[0].isTemplate);
          setIsSaved(responseData[0].isComplete);
        }
      } catch (err) {
        setIsloading(false);

        toast.error("Error fetching Form Details");
        console.log(err);
      }
    };
    fetchItems();
  }, [sendRequest, copyfield, deletefield, savefield]);

  const handleScroll = (e) => {
    const element = e.target;
    // Check if the scroll position is at the bottom
    if (element.scrollHeight - element.scrollTop === element.clientHeight) {
      // Prevent the event from bubbling up to the outer page
      e.stopPropagation();
    }
  };

  return (
    <>
      {isloading && <Loader />}
      <Navbar />
      <div className={classes.createformcontainer}>
        <div className={classes.customcontainer}>
          <div className={classes.createformheader}>
            <input
              type="text"
              value={formtitle}
              className={classes.createformheadertitle}
              onChange={formtitleHandler}
            />
            <input
              type="text"
              value={formdesc}
              className={classes.createformheaderdesc}
              onChange={formdescHandler}
            />
          </div>
        </div>
        <div className={classes.createformbody}>
          <div className={classes.createinnerformbody}>
            {fields.length > 0 ? (
              <>
                {fields.map((fieldData, index) => (
                  <NewFields key={index} fieldData={fieldData} />
                ))}
              </>
            ) : (
              <FirstNewFields />
            )}
          </div>
        </div>

        {fields.length > 0 && (
          <div className={classes.submitformbuttoncontainer}>
            {localStorage.getItem("role") === "admin" && !isTemplate && (
              <button
                className={classes.submitformbutton}
                onClick={saveFormTemplateHandler}
              >
                Save Form as a Template
              </button>
            )}
            {localStorage.getItem("role") === "admin" && !isSaved && (
              <button
                className={classes.submitformbutton}
                onClick={saveFormHandler}
              >
                Save Form
              </button>
            )}
          </div>
        )}
      </div>
      <div className={classes.formpreview} onScroll={handleScroll}>
        <h5 style={{ textAlign: "center" }}>Form Preview</h5>
        <DisplayPreviewForm />
      </div>
      <Footer />
    </>
  );
};

export default MakeForm;
