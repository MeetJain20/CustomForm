import React from "react";
import classes from "./Functionalities.module.css";
import { useDispatch } from "react-redux";
import { useParams } from "react-router-dom";
import { useRequest } from "../../../../../../context/request-hook";
import { MAIN_LINK } from "../../../../../../urls/urls";
import Cookies from "js-cookie";
import { v4 as uuidv4 } from "uuid";

const Functionalities = ({ onSave, fieldState }) => {
  const { formid } = useParams();
  const dispatch = useDispatch();
  const { sendRequest } = useRequest();

  const updatefieldHandler = async () => {
    // console.log(fieldState);
    if (fieldState.type === "Multiple Choice") {
      onSave();
    }
    try {
      const responseData = await sendRequest(
        `${MAIN_LINK}/form/updateformfields`,
        "PUT",
        JSON.stringify({
          formid: formid,
          fielddata: fieldState,
        }),
        {
          "Content-Type": "application/json",
          Authorization: `Bearer ${Cookies.get("token")}`,
        }
      );
      dispatch({ type: "SAVE_FIELD" });

      // setFormtitle(responseData.formtitle);
    } catch (err) {
      console.log(err);
    }
  };

  const deletefieldHandler = async () => {
    try {
      const responseData = await sendRequest(
        `${MAIN_LINK}/form/deletefield`,
        "DELETE",
        JSON.stringify({
          formid: formid,
          fieldid: fieldState.fieldid,
        }),
        {
          "Content-Type": "application/json",
          Authorization: `Bearer ${Cookies.get("token")}`,
        }
      );
      dispatch({ type: "DELETE_FIELD" });
      dispatch({
        type: "DELETE_FIELD_ARRAY",
        payload: { fieldId: fieldState.fieldid },
      });

      // window.location.reload();
      // setFormtitle(responseData.formtitle);
    } catch (err) {
      console.log(err);
    }
  };

  const copyFieldHandler = async () => {
    let newFieldid;
    do {
      newFieldid = uuidv4(); // Generate a new UUID
    } while (newFieldid === fieldState.fieldid); // Check if it's the same as the previous one

    const copiedField = {
      ...fieldState,
      fieldid: newFieldid,
    };
    try {
      const responseData = await sendRequest(
        `${MAIN_LINK}/form/copyfield`,
        "POST",
        JSON.stringify({
          formid: formid,
          fielddata: copiedField,
        }),
        {
          "Content-Type": "application/json",
          Authorization: `Bearer ${Cookies.get("token")}`,
        }
      );
      dispatch({ type: "COPY_FIELD" });
    } catch (err) {
      console.log(err);
    }
  };
  return (
    <div className={classes.functionalities}>
      <button className={classes.copyfieldbutton} onClick={copyFieldHandler}>
        Copy Field
      </button>
      <button
        className={classes.deletefieldbutton}
        onClick={deletefieldHandler}
      >
        Delete Field
      </button>
      <button className={classes.savechangebutton} onClick={updatefieldHandler}>
        Save Changes
      </button>
    </div>
  );
};

export default Functionalities;
