import React, { useState, useEffect, useRef } from "react";
import classes from "./DisplayCheckbox.module.css";

const DisplayCheckbox = ({ fieldData }) => {
  return (
    <>
      <div className={classes.displaycheckboxcontainer}>
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
                type="checkbox"
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

export default DisplayCheckbox;
