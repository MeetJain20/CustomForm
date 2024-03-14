import React, { useState, useEffect } from "react";
import classes from "./DisplayShortAnswer.module.css";

const DisplayShortAnswer = ({ fieldData }) => {
  return (
    <>
      <div className={classes.displayshortanswercontainer}>
        <input
          type="text"
          className={classes.questionfield}
          placeholder="Question"
          value={fieldData.question}
          readOnly
        />
        <input
          type="text"
          className={classes.answerfield}
          placeholder={fieldData.placeholder}
          readOnly={localStorage.getItem("role") === "admin" ? true : false}
        />
      </div>
    </>
  );
};

export default DisplayShortAnswer;
