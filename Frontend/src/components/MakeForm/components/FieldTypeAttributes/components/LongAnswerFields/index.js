import React, { useState, useEffect } from "react";
import classes from "./LongAnswerFields.module.css";
import Functionalities from "../Functionalities";

const LongAnswerFields = ({ fieldData }) => {
  const [fieldState, setFieldState] = useState({
    fieldid: fieldData.fieldid,
    type: fieldData.type || "Long Answer",
    isrequired: fieldData.isrequired || false,
    question: fieldData.question || "",
    placeholder:
      fieldData.placeholder ||
      "Enter the text you want the user to see here ...",
  });

  const [hasChanged, setHasChanged] = useState(false);

  const handleQuestionChange = (e) => {
    setFieldState({ ...fieldState, question: e.target.value });
    setHasChanged(true); // Set flag when question changes
  };

  const handlePlaceholderChange = (e) => {
    setFieldState({ ...fieldState, placeholder: e.target.value });
    setHasChanged(true); // Set flag when placeholder changes
  };

  useEffect(() => {
    // Reset flag when fieldData changes
    setHasChanged(false);
  }, [fieldData]);

  return (
    <>
      <div className={classes.longanswerfieldcontainer}>
        <input
          type="text"
          className={classes.questionfield}
          placeholder="Question"
          value={fieldState.question}
          onChange={handleQuestionChange}
        />
        <textarea
          name="answer"
          id="answer"
          cols="30"
          rows="2"
          placeholder={fieldState.placeholder}
          onChange={handlePlaceholderChange}
          className={`${classes.answerfield} my-1`}
        ></textarea>
      </div>
      <Functionalities
        fieldState={fieldState}
        hasChanged={hasChanged}
        setHasChanged={setHasChanged}
      />
    </>
  );
};

export default LongAnswerFields;
