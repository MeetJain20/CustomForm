import React, { useState, useEffect } from "react";
import classes from "./DisplayDate.module.css";
import { IoCalendarOutline } from "react-icons/io5";
import { useDispatch } from "react-redux";
import debounce from "lodash.debounce";

const DisplayDate = ({ fieldData }) => {
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
  }, 100);

  useEffect(() => {
    debouncedResponseHandler(responseData);
  }, [responseData]);
  return (
    <div className={classes.displaydatefieldcontainer}>
       <div
        className={`${classes.questionfield} ${
          fieldData.isrequired ? classes.required : ""
        }`}
      >
        {fieldData.question}
      </div>
      <div className={classes.dateContainer}>
        <input
          type="date"
          className={classes.datefield}
          disabled={localStorage.getItem("role") === "admin" ? true : false}
          onChange={responseHandler}
          required={fieldData.isrequired}

        />
        {localStorage.getItem("role") === "admin" && (
          <IoCalendarOutline className={classes.calendarIcon} />
        )}
      </div>
    </div>
  );
};

export default DisplayDate;
