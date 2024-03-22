import React, { useState, useEffect } from "react";
import { BiTime } from "react-icons/bi";
import classes from "./TimeTypeFields.module.css";
import Functionalities from "../Functionalities";

const TimeTypeFields = ({ fieldData }) => {
  const [fieldState, setFieldState] = useState({
    fieldid: fieldData.fieldid,
    type: fieldData.type || "Short Answer",
    question: fieldData.question || "",
    isrequired: fieldData.isrequired || false,
  });

  const [hasChanged, setHasChanged] = useState(false);

  const handleQuestionChange = (e) => {
    setFieldState({ ...fieldState, question: e.target.value });
    setHasChanged(true); // Set flag when question changes
  };

  useEffect(() => {
    // Reset flag when fieldData changes
    setHasChanged(false);
  }, [fieldData]);

  return (
    <>
      <div className={classes.timetypefieldcontainer}>
        <input
          type="text"
          className={classes.questionfield}
          placeholder="Question"
          value={fieldState.question}
          onChange={handleQuestionChange}
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
      <Functionalities fieldState={fieldState} hasChanged={hasChanged} setHasChanged={setHasChanged} />
    </>
  );
};

export default TimeTypeFields;
