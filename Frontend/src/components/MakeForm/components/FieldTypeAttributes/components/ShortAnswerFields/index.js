import React, { useState, useEffect } from "react";
import classes from "./ShortAnswerFields.module.css";
import Functionalities from "../Functionalities";

const ShortAnswerFields = ({ fieldData }) => {

  const [fieldState, setFieldState] = useState({
    fieldid: fieldData.fieldid,
    type: fieldData.type || "Short Answer",
    question: fieldData.question || "",
    placeholder:
      fieldData.placeholder ||
      "Enter the text you want the user to see here ...",
  });

 
  const handleQuestionChange = (e) => {
    setFieldState({ ...fieldState, question: e.target.value });
  };

  const handlePlaceholderChange = (e) => {
    setFieldState({ ...fieldState, placeholder: e.target.value });
  };

  return (
    <>
      <div className={classes.shortanswerfieldcontainer}>
        <input
          type="text"
          className={classes.questionfield}
          placeholder="Question"
          value={fieldState.question}
          onChange={handleQuestionChange}
        />
        <input
          type="text"
          className={classes.answerfield}
          placeholder={
            fieldState.placeholder ||
            "Enter the text you want the user to see here ..."
          }
          onChange={handlePlaceholderChange}
        />
      </div>
      <Functionalities fieldState={fieldState} />
    </>
  );
};

export default ShortAnswerFields;
