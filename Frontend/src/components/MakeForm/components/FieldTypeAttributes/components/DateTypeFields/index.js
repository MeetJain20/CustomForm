import React, { useState, useEffect } from "react";
import classes from "./DateTypeFields.module.css";
import { IoCalendarOutline } from "react-icons/io5";
import Functionalities from "../Functionalities";

const DateTypeFields = ({ fieldData }) => {
  const [fieldState, setFieldState] = useState({
    fieldid: fieldData.fieldid,
    type: fieldData.type || "Short Answer",
    isrequired:fieldData.isrequired || false,
    question: fieldData.question || "",
  });

  const handleQuestionChange = (e) => {
    setFieldState({ ...fieldState, question: e.target.value });
  };

  return (
    <>
      <div className={classes.datetypefieldcontainer}>
        <input
          type="text"
          className={classes.questionfield}
          placeholder="Question"
          value={fieldState.question}
          onChange={handleQuestionChange}
        />
        <div className={classes.dateContainer}>
          <input
            type="date"
            className={classes.datefield}
            disabled // Make the input disabled
          />
          <IoCalendarOutline className={classes.calendarIcon} />
        </div>
      </div>
      <Functionalities fieldState={fieldState} />
    </>
  );
};

export default DateTypeFields;
