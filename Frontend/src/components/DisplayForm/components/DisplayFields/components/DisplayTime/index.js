import React, { useEffect, useState } from "react";
import { BiTime } from "react-icons/bi";
import classes from "./DisplayTime.module.css";
import { useDispatch } from "react-redux";
import debounce from "lodash.debounce";

const DisplayTime = ({ fieldData }) => {

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
    <div className={classes.displaytimecontainer}>
      <input
        type="text"
        className={classes.questionfield}
        placeholder="Question"
        value={fieldData.question}
        readOnly
      />
      <div className={classes.timeContainer}>
        <input
          type="time"
          className={classes.timefield}
          disabled={localStorage.getItem("role") === "admin" ? true : false}
          onChange={responseHandler}
        />
        {localStorage.getItem("role") === "admin" && (
          <BiTime className={classes.timeIcon} />
        )}
      </div>
    </div>
  );
};

export default DisplayTime;
