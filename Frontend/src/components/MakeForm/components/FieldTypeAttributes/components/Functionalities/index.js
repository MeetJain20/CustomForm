import React, { useState } from "react";
import classes from "./Functionalities.module.css";
import { useDispatch } from "react-redux";
import { useParams } from "react-router-dom";
import { useRequest } from "../../../../../../context/request-hook";
import { MAIN_LINK } from "../../../../../../urls/urls";
import Cookies from "js-cookie";
import { v4 as uuidv4 } from "uuid";
import { toast } from "sonner";

const Functionalities = ({ fieldState, hasChanged=false,setHasChanged }) => {
  const { formid } = useParams();
  const dispatch = useDispatch();
  const { sendRequest } = useRequest();
  const [newFieldData, setNewFieldData] = useState({
    fieldid: uuidv4(),
    type: "Short Answer",
    question: "",
    placeholder: "Enter the text you want the user to see here ...",
  });
  const [isRequired, setIsRequired] = useState(fieldState.isrequired); // State to track whether the field is required or not
  // Save Changes

  const updatefieldHandler = async () => {
    if (!fieldState.question.trim()) {
      toast.warning("Question field cannot be empty");
      return;
    }
    fieldState.isrequired = isRequired;
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
      toast.success("Details saved successfully");
      dispatch({ type: "SAVE_FIELD" });

      // setFormtitle(responseData.formtitle);
    } catch (err) {
      toast.error(`${err.message}`);
    }
  };

  // Delete Field

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
      toast.success("Field deleted successfully");
      dispatch({
        type: "DELETE_FIELD_ARRAY",
        payload: { fieldid: fieldState.fieldid },
      });
      dispatch({ type: "DELETE_FIELD" });
    } catch (err) {
      toast.error(`${err.message}`);
    }
  };

  // Copy Field

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
      toast.success("Field copied successfully");
      dispatch({ type: "COPY_FIELD" });
    } catch (err) {
      toast.error(`${err.message}`);
    }
  };

  // Add New Field

  const addnewfieldHandler = async () => {
    try {
      const responseData = await sendRequest(
        `${MAIN_LINK}/form/addnewfield`,
        "PUT",
        JSON.stringify({
          formid: formid,
          newFieldData: newFieldData,
        }),
        {
          "Content-Type": "application/json",
          Authorization: `Bearer ${Cookies.get("token")}`,
        }
      );
      toast.success("New field added successfully");

      dispatch({ type: "SAVE_FIELD" });

      // setFormtitle(responseData.formtitle);
    } catch (err) {
      toast.error(`${err.message}`);
    }
  };

  return (
    <>
      <div className={`${classes.isrequiredfield}`}>
        <label className={classes.requiredcontainer}>
          <input
            type="checkbox"
            className={classes.requiredcheckbox}
            checked={isRequired}
            onChange={(e) => {
              setIsRequired(e.target.checked);
              setHasChanged(true);
            }}
          />
         Field Required
        </label>
      </div>
      <div className={classes.functionalities}>
        <button className={`${classes.copyfieldbutton}`} onClick={copyFieldHandler}>
          Copy Field
        </button>
        <button
          className={`${classes.deletefieldbutton}`}
          onClick={deletefieldHandler}
        >
          Delete Field
        </button>
        <button
           className={`${classes.savechangebutton} ${hasChanged ? classes.changed : ""}`}
          onClick={updatefieldHandler}
          style={{ cursor: hasChanged ? "pointer" : "not-allowed" }}
          disabled={hasChanged?false:true}
        >
          Save Changes
        </button>
        <button className={`${classes.addfieldbutton}`} onClick={addnewfieldHandler}>
          Add New Field
        </button>
      </div>
    </>
  );
};

export default Functionalities;
