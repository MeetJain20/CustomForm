import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Navbar, Footer } from "../index";
import classes from "./MakeForm.module.css";
import NewFields from "./components/NewFields";
import { useParams } from "react-router-dom";
import { useRequest } from "../../context/request-hook";
import { MAIN_LINK } from "../../urls/urls";
import Cookies from "js-cookie";
import debounce from "lodash.debounce";
import FirstNewFields from "./components/FirstNewFields";

const MakeForm = () => {
  const { formid } = useParams();
  const { sendRequest } = useRequest();
  const savefield = useSelector((state) => state.funcfield.saveChanges);
  const copyfield = useSelector((state) => state.funcfield.copyField);
  const deletefield = useSelector((state) => state.funcfield.deleteField);
  const [formtitle, setFormtitle] = useState("");
  const [formdesc, setFormdesc] = useState("");
  const fields = useSelector((state) => state.formData.fields);
  const dispatch = useDispatch();

  const formtitleHandler = async (e) => {
    e.preventDefault();
    setFormtitle(e.target.value);
  };

  const debouncedFormtitleHandler = debounce(async (value) => {
    try {
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
      // setFormtitle(responseData.formtitle);
    } catch (err) {
      console.log(err);
    }
  }, 500);

  useEffect(() => {
    debouncedFormtitleHandler(formtitle);
  }, [formtitle]);

  const formdescHandler = async (e) => {
    e.preventDefault();
    setFormdesc(e.target.value);
  };

  const debouncedFormDescHandler = debounce(async (value) => {
    try {
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
    } catch (err) {
      console.log(err);
    }
  }, 500);

  useEffect(() => {
    debouncedFormDescHandler(formdesc);
  }, [formdesc]);

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
        }
      } catch (err) {
        console.log(err);
      }
    };
    fetchItems();
  }, [sendRequest, copyfield, deletefield, savefield]);
  // console.log(fields);
  return (
    <>
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
      <Footer />
    </>
  );
};

export default MakeForm;
