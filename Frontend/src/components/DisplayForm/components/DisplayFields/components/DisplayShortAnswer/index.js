import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import debounce from "lodash.debounce";
import classes from "./DisplayShortAnswer.module.css";

const DisplayShortAnswer = ({ fieldData }) => {
  const dispatch = useDispatch();
  const [responseData, setResponseData] = useState({
    fieldid: fieldData.fieldid,
    question: fieldData.question,
    type: fieldData.type,
    response: "",
  });

  const responseHandler = (e) => {
    e.preventDefault();
    setResponseData((prevState) => ({
      ...prevState,
      response: e.target.value,
    }));
  };

  const debouncedResponseHandler = debounce(async (responseData) => {
    try {
      // Dispatch action to update response array
      dispatch({
        type: "UPDATE_RESPONSE",
        payload: { responseData },
      });
    } catch (err) {
      console.log(err);
    }
  }, 100);

  const req = `{<span style={{color: 'red';}}>*</span>}`;

  useEffect(() => {
    debouncedResponseHandler(responseData);
  }, [responseData]);
  return (
    <div className={classes.displayshortanswercontainer}>
      <div
        className={`${classes.questionfield} ${
          fieldData.isrequired ? classes.required : ""
        }`}
      >
        {fieldData.question}
      </div>
      <input
        type="text"
        className={classes.answerfield}
        placeholder={fieldData.placeholder}
        readOnly={localStorage.getItem("role") === "admin"}
        required={fieldData.isrequired}
        onChange={responseHandler}
      />
    </div>
  );
};

export default DisplayShortAnswer;
