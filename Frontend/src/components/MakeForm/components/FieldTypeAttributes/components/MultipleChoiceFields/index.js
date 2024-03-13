import React, { useState, useEffect, useRef } from "react";
import classes from "./MultipleChoiceFields.module.css";
import { RxCross1 } from "react-icons/rx";
import { IoMdAddCircleOutline } from "react-icons/io";
import Functionalities from "../Functionalities";
import useOutsideClick from "../../../../../../hooks/useOutsideClick";

const MultipleChoiceFields = ({ fieldData }) => {
  const [fieldState, setFieldState] = useState({
    fieldid: fieldData.fieldid,
    type: fieldData.type || "Multiple Choice",
    question: fieldData.question || "",
    options: fieldData.options || [""],
  });
  const [errorMessage, setErrorMessage] = useState("");
  const containerRef = useRef(null);

  const handleQuestionChange = (e) => {
    setFieldState({ ...fieldState, question: e.target.value });
  };

  const handleOptionChange = (index, value) => {
    const newOptions = [...fieldState.options];
    newOptions[index] = value;
    setFieldState({ ...fieldState, options: newOptions });
    setErrorMessage("");
  };

  const handleAddOption = () => {
    // Check if the last option is not empty before adding a new one
    if (fieldState.options[fieldState.options.length - 1].trim() !== "") {
      const newOptions = [...fieldState.options, ""];
      setFieldState({ ...fieldState, options: newOptions });
      setErrorMessage("");
    } else {
      setErrorMessage("Please enter a value for the option");
    }
  };

  const handleDeleteOption = (index) => {
    const newOptions = fieldState.options.filter((_, i) => i !== index);
    setFieldState({ ...fieldState, options: newOptions });
  };

  useOutsideClick(containerRef, () => {
    // Remove empty options
    if (
      fieldState.options.length > 1 ||
      fieldState.options[0].trim() !== ""
    ) {
      const nonEmptyOptions = fieldState.options.filter(
        (option) => option.trim() !== ""
      );
      setFieldState({ ...fieldState, options: nonEmptyOptions });
    }
  });
  return (
    <>
      <div className={classes.multiplefieldcontainer} ref={containerRef}>
        <input
          type="text"
          className={classes.questionfield}
          placeholder="Question"
          value={fieldState.question}
          onChange={handleQuestionChange}
        />
        <div className={classes.optionsarray}>
          {fieldState.options.map((option, index) => (
            <div key={index} className={classes.optionContainer}>
              <input
                type="radio"
                id={`option-${index}`}
                name="options"
                className={classes.optionInput}
                value={option}
                onChange={(e) => handleOptionChange(index, e.target.value)}
              />
              <input
                type="text"
                className={classes.optionField}
                placeholder="Option"
                value={option}
                onChange={(e) => handleOptionChange(index, e.target.value)}
              />
              {index === fieldState.options.length - 1 && (
                // Render add icon only for the last option
                <div className={classes.addOptiondiv}  onClick={(e) => {
                  e.stopPropagation();
                  handleAddOption()
                }}>
                  <IoMdAddCircleOutline />
                </div>
              )}
              {index !== 0 && (
                // Render delete icon for all options except the first one
                <div
                  className={classes.deleteOptiondiv}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDeleteOption(index)
                  }}
                >
                  <RxCross1 />
                </div>
              )}
            </div>
          ))}
        </div>
        {errorMessage && <p className={classes.errorMessage}>{errorMessage}</p>}
      </div>
      <Functionalities
        fieldState={fieldState}
        onSave={() => {
          const nonEmptyOptions = fieldState.options.filter(
            (option) => option.trim() !== ""
          );
          setFieldState({ ...fieldState, options: nonEmptyOptions });
        }}
      />
    </>
  );
};

export default MultipleChoiceFields;