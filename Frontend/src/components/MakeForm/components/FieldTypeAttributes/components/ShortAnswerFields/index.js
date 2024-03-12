import React, { useState, useEffect } from "react";
import classes from "./ShortAnswerFields.module.css";
import { useSelector, useDispatch } from "react-redux";
import { useParams } from "react-router-dom";
import { useRequest } from "../../../../../../context/request-hook";
import { MAIN_LINK } from "../../../../../../urls/urls";
import Cookies from "js-cookie";
import { v4 as uuidv4 } from "uuid";

const ShortAnswerFields = ({ fieldData }) => {
  const { formid } = useParams();
  const dispatch = useDispatch();
  const { sendRequest } = useRequest();
  const [fieldState, setFieldState] = useState({
    fieldid: fieldData.fieldid,
    type: fieldData.type || "Short Answer",
    question: fieldData.question || "",
    placeholder:
      fieldData.placeholder ||
      "Enter the text you want the user to see here ...",
  });

  const updatefieldHandler = async () => {
    console.log(fieldState);
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
          fieldid: fieldData.fieldid,
        }),
        {
          "Content-Type": "application/json",
          Authorization: `Bearer ${Cookies.get("token")}`,
        }
      );
      dispatch({ type: "DELETE_FIELD" });
      dispatch({ type: "DELETE_FIELD_ARRAY", payload: { fieldId: fieldData.fieldid } });

      // window.location.reload();
      // setFormtitle(responseData.formtitle);
    } catch (err) {
      console.log(err);
    }
  };

  const copyFieldHandler = async () => {
    const copiedField = {
      ...fieldState,
      fieldid: uuidv4(),
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

  const handleQuestionChange = (e) => {
    setFieldState({ ...fieldState, question: e.target.value });
  };

  const handlePlaceholderChange = (e) => {
    setFieldState({ ...fieldState, placeholder: e.target.value });
  };

  return (
    <>
      <div className={classes.shortanswerfieldcontainer}>
        <input
          type="text"
          className={classes.questionfield}
          placeholder="Question"
          value={fieldState.question}
          onChange={handleQuestionChange}
        />
        <input
          type="text"
          className={classes.answerfield}
          placeholder={
            fieldState.placeholder ||
            "Enter the text you want the user to see here ..."
          }
          onChange={handlePlaceholderChange}
        />
      </div>
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
        <button
          className={classes.savechangebutton}
          onClick={updatefieldHandler}
        >
          Save Changes
        </button>
      </div>
    </>
  );
};

export default ShortAnswerFields;
