import React from "react";
import classes from "./DateTypeFields.module.css";
import { IoCalendarOutline } from "react-icons/io5";

const DateTypeFields = () => {
  return (
    <div className={classes.datetypefieldcontainer}>
      <input
        type="text"
        className={classes.questionfield}
        placeholder="Question"
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
  );
};

export default DateTypeFields;
