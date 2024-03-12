import React from "react";
import { BiTime } from "react-icons/bi";
import classes from "./TimeTypeFields.module.css";

const TimeTypeFields = () => {
  return (
    <div className={classes.timetypefieldcontainer}>
      <input
        type="text"
        className={classes.questionfield}
        placeholder="Question"
      />
      <div className={classes.timeContainer}>
        <input
          type="time"
          className={classes.timefield}
          disabled
        />
        <BiTime className={classes.timeIcon} />
      </div>
    </div>
  );
};

export default TimeTypeFields;
