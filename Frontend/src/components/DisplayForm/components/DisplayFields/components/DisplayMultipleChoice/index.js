import React, { useState, useEffect, useRef } from "react";
import classes from "./DisplayMultipleChoice.module.css";

const DisplayMultipleChoice = ({ fieldData }) => {
  return (
    <>
      <div className={classes.displaymultiplefieldcontainer}>
        <input
          type="text"
          className={classes.questionfield}
          placeholder="Question"
          value={fieldData.question}
          readOnly
        />
        <div className={classes.optionsarray}>
          {fieldData.options.map((option, index) => (
            <div key={index} className={classes.optionContainer}>
              <input
                type="radio"
                id={`option-${index}`}
                name="options"
                className={classes.optionInput}
                value={option}
              />
              <input
                type="text"
                className={classes.optionField}
                placeholder="Option"
                value={option}
                readOnly
              />
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default DisplayMultipleChoice;
