import React, { useState, useEffect } from "react";
import classes from "./DisplayLongAnswer.module.css";

const DisplayLongAnswer = ({ fieldData }) => {
  return (
    <>
      <div className={classes.displaylonganswercontainer}>
        <input
          type="text"
          className={classes.questionfield}
          placeholder="Question"
          value={fieldData.question}
          readOnly
        />
        <textarea
          name="answer"
          id="answer"
          cols="30"
          rows="2"
          placeholder={fieldData.placeholder}
          className={`${classes.answerfield}`}
          readOnly={localStorage.getItem("role") === "admin" ? true : false}
        ></textarea>
      </div>
    </>
  );
};

export default DisplayLongAnswer;
