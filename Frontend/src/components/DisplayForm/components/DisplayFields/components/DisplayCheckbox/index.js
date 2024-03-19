import React, { useState, useEffect, useRef } from "react";
import classes from "./DisplayCheckbox.module.css";
import { useDispatch, useSelector } from "react-redux";
import debounce from "lodash.debounce";

const DisplayCheckbox = ({ fieldData }) => {
  const dispatch = useDispatch();

  const [responseData, setResponseData] = useState({
    fieldid: fieldData.fieldid,
    question: fieldData.question,
    response: [], // Store selected options as an array
  });

  const responseHandler = (e) => {
    const { value, checked } = e.target;
    setResponseData((prevState) => {
      // If option is checked, add it to the array, otherwise remove it
      if (checked) {
        return {
          ...prevState,
          response: [...prevState.response, value],
        };
      } else {
        return {
          ...prevState,
          response: prevState.response.filter((option) => option !== value),
        };
      }
    });
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
    <div className={classes.displaycheckboxcontainer}>
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
              type="checkbox"
              id={`option-${index}`}
              name="options"
              className={classes.optionInput}
              value={option}
              checked={responseData.response.includes(option)}
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
  );
};

export default DisplayCheckbox;
