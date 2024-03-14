import React, { useState } from "react";
import classes from "./DisplayFields.module.css";
import {
    DisplayShortAnswer,
    DisplayLongAnswer,
    DisplayDropdown,
    DisplayMultipleChoice,
    DisplayCheckbox,
    DisplayDate,
    DisplayTime,
  } from "./components";

const DisplayFields = ({ activeType, fieldData }) => {
  
  return (
    <div className={`${classes.displayfieldcontainer}`}>
      <div>
        {activeType === "Short Answer" && (
          <DisplayShortAnswer fieldData={fieldData} />
        )}
        {activeType === "Long Answer" && (
          <DisplayLongAnswer fieldData={fieldData} />
        )}
        {activeType === "Multiple Choice" && (
          <DisplayMultipleChoice fieldData={fieldData} />
        )}
        {activeType === "Checkbox Type" && (
          <DisplayCheckbox fieldData={fieldData} />
        )}
        {activeType === "Dropdown" && <DisplayDropdown fieldData={fieldData} />}
        {activeType === "Date Type" && <DisplayDate fieldData={fieldData} />}
        {activeType === "Time Type" && <DisplayTime fieldData={fieldData} />}
      </div>
    </div>
  );
};

export default DisplayFields;
