import React, { useState, useRef } from "react";
import classes from "./MultipleChoiceFields.module.css";
import { RxCross1 } from "react-icons/rx";
import { IoMdAddCircleOutline } from "react-icons/io";
import useOutsideClick from "../../../../../../hooks/useOutsideClick";

const MultipleChoiceFields = () => {
  const [options, setOptions] = useState([""]);
  const [errorMessage, setErrorMessage] = useState("");
  const containerRef = useRef(null);

  const handleOptionChange = (index, value) => {
    const newOptions = [...options];
    newOptions[index] = value;
    setOptions(newOptions);
    setErrorMessage("");
  };

  const handleAddOption = () => {
    // Check if the last option is not empty before adding a new one
    if (options[options.length - 1].trim() !== "") {
      setOptions([...options, ""]);
      setErrorMessage("");
    } else {
      setErrorMessage("Please enter a value for the option");
    }
  };

  const handleDeleteOption = (index) => {
    const newOptions = options.filter((_, i) => i !== index);
    setOptions(newOptions);
  };

  useOutsideClick(containerRef, () => {
    // Remove empty options
    if (options.length > 1 || options[0].trim() !== "") {
      const nonEmptyOptions = options.filter((option) => option.trim() !== "");
      setOptions(nonEmptyOptions);
    }
  });

  return (
    <div className={classes.multiplefieldcontainer} ref={containerRef}>
      <input
        type="text"
        className={classes.questionfield}
        placeholder="Question"
      />
      <div className={classes.optionsarray}>
        {options.map((option, index) => (
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
            {index === options.length - 1 && ( // Render add icon only for the last option
              <div className={classes.addOptiondiv} onClick={handleAddOption}>
                <IoMdAddCircleOutline />
              </div>
            )}
            {index !== 0 && ( // Render delete icon for all options except the first one
              <div
                className={classes.deleteOptiondiv}
                onClick={() => handleDeleteOption(index)}
              >
                <RxCross1 />
              </div>
            )}
          </div>
        ))}
      </div>
      {errorMessage && <p className={classes.errorMessage}>{errorMessage}</p>}
    </div>
  );
};

export default MultipleChoiceFields;
