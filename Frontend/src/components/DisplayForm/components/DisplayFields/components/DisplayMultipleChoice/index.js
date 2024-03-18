import React, { useState, useEffect, useRef } from "react";
import classes from "./DisplayMultipleChoice.module.css";
import { useDispatch } from "react-redux";
import debounce from "lodash.debounce";

const DisplayMultipleChoice = ({ fieldData }) => {
  const dispatch = useDispatch();
  const [responseData, setResponseData] = useState({
    fieldid: fieldData.fieldid,
    question: fieldData.question,
    response: "",
  });

  const responseHandler = (e) => {
    e.preventDefault();
    setResponseData((prevState) => ({
      ...prevState,
      response: e.target.value,
    }));
    // console.log(responseData);
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
  }, 500);

  useEffect(() => {
    debouncedResponseHandler(responseData);
  }, [responseData]);

  return (
    <>
      <div className={classes.displaymultiplefieldcontainer}>
        <input
          type="text"
          className={classes.questionfield}
          placeholder="Question"
          value={fieldData.question}
          readOnly
        />
        <div className={classes.optionsarray}>
          {fieldData.options.map((option, index) => (
            <div key={index} className={classes.optionContainer}>
              <input
                type="radio"
                id={`option-${index}`}
                name="options"
                className={classes.optionInput}
                value={option}
                checked={option === responseData.response}
                onChange={responseHandler}
              />
              <input
                type="text"
                className={classes.optionField}
                placeholder="Option"
                value={option}
                readOnly
              />
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default DisplayMultipleChoice;
