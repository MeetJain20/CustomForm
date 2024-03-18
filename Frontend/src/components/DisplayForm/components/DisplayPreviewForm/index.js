import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import classes from "./DisplayPreviewForm.module.css";
import { useNavigate, useParams } from "react-router-dom";
import { useRequest } from "../../../../context/request-hook";
import { MAIN_LINK } from "../../../../urls/urls";
import Cookies from "js-cookie";
import DisplayFields from "../DisplayFields";

const DisplayPreviewForm = () => {
  const { formid } = useParams();
  const { sendRequest } = useRequest();
  const [formtitle, setFormtitle] = useState("");
  const [formdesc, setFormdesc] = useState("");

  const fields = useSelector((state) => state.formData.fields);
  const dispatch = useDispatch();

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
  }, [sendRequest]);
  
  return (
    <>
      <div className={classes.displaypreviewformcontainer}>
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
          <div className={classes.displayinnerformbody}>
            {fields.map((fieldData, index) => (
              <DisplayFields
                key={index}
                activeType={fieldData.type}
                fieldData={fieldData}
              />
            ))}
          </div>
        </div>
      </div>

    </>
  );
};

export default DisplayPreviewForm;
