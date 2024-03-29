import React, { useState, useEffect } from "react";
import classes from "./DisplayLongAnswer.module.css";
import debounce from "lodash.debounce";
import { useDispatch } from "react-redux";

const DisplayLongAnswer = ({ fieldData }) => {
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

  useEffect(() => {
    debouncedResponseHandler(responseData);
  }, [responseData]);

  return (
    <>
      <div className={classes.displaylonganswercontainer}>
      <div
        className={`${classes.questionfield} ${
          fieldData.isrequired ? classes.required : ""
        }`}
      >
        {fieldData.question}
      </div>
        <textarea
          name="answer"
          id="answer"
          cols="30"
          rows="2"
          placeholder={fieldData.placeholder}
          className={`${classes.answerfield}`}
          readOnly={localStorage.getItem("role") === "admin" ? true : false}
          onChange={responseHandler}
          required={fieldData.isrequired}

        ></textarea>
      </div>
    </>
  );
};

export default DisplayLongAnswer;
