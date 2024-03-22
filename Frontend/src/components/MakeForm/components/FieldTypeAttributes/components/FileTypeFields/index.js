import React, { useState, useEffect } from "react";
import classes from "./FileTypeFields.module.css";
import Functionalities from "../Functionalities";

const FileTypeFields = ({ fieldData }) => {
  const [fieldState, setFieldState] = useState({
    fieldid: fieldData.fieldid,
    type: fieldData.type || "Short Answer",
    question: fieldData.question || "",
    isrequired: fieldData.isrequired || false,
  });
  const [hasChanged, setHasChanged] = useState(false); // State to track changes

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
      <div className={classes.filetypefieldcontainer}>
        <input
          type="text"
          className={classes.questionfield}
          placeholder="Question"
          value={fieldState.question}
          onChange={handleQuestionChange}
        />
        <div className={classes.fileContainer}>
          <input
            type="file"
            className={classes.filefield}
            disabled // Make the input disabled
          />
        </div>
      </div>
      <Functionalities fieldState={fieldState} hasChanged={hasChanged} setHasChanged={setHasChanged} />
    </>
  );
};

export default FileTypeFields;
