import React, { useState, useEffect } from "react";
import classes from "./FileTypeFields.module.css";
import Functionalities from "../Functionalities";

const FileTypeFields = ({ fieldData }) => {
  const [fieldState, setFieldState] = useState({
    fieldid: fieldData.fieldid,
    type: fieldData.type || "Short Answer",
    question: fieldData.question || "",
  });

  const handleQuestionChange = (e) => {
    setFieldState({ ...fieldState, question: e.target.value });
  };

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
      <Functionalities fieldState={fieldState} />
    </>
  );
};

export default FileTypeFields;
