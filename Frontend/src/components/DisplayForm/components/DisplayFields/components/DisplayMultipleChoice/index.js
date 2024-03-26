import React, { useState, useEffect, useRef } from "react";
import classes from "./DisplayMultipleChoice.module.css";
import { useDispatch } from "react-redux";
import debounce from "lodash.debounce";

const DisplayMultipleChoice = ({ fieldData }) => {
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
      <div className={classes.displaymultiplefieldcontainer}>
        <div
          className={`${classes.questionfield} ${
            fieldData.isrequired ? classes.required : ""
          }`}
        >
          {fieldData.question}
        </div>
        <div className={classes.optionsarray}>
          {fieldData.options &&
            fieldData.options
              .filter((option) => option.trim() !== "") // Filter out empty options
              .map((option, index) => (
                <div key={index} className={classes.optionContainer}>
                  <input
                    type="radio"
                    id={`option-${fieldData.fieldid}-${index}`}
                    name={`options-${fieldData.fieldid}`} // Unique name attribute
                    className={classes.optionInput}
                    value={option}
                    checked={option === responseData.response}
                    onChange={responseHandler}
                    required={fieldData.isrequired}
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
