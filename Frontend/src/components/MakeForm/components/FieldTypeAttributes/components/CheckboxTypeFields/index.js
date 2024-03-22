import React, { useState, useEffect, useRef } from "react";
import classes from "./CheckboxTypeFields.module.css";
import { RxCross1 } from "react-icons/rx";
import { IoMdAddCircleOutline } from "react-icons/io";
import Functionalities from "../Functionalities";
import useOutsideClick from "../../../../../../hooks/useOutsideClick";
import { toast } from "sonner";

const CheckboxTypeFields = ({ fieldData }) => {
  const [fieldState, setFieldState] = useState({
    fieldid: fieldData.fieldid,
    type: fieldData.type || "Checkbox Type",
    question: fieldData.question || "",
    isrequired: fieldData.isrequired || false,
    options: fieldData.options || [""],
  });
  const [hasChanged, setHasChanged] = useState(false); // State to track changes
  const [errorMessage, setErrorMessage] = useState("");
  const containerRef = useRef(null);

  const handleQuestionChange = (e) => {
    setFieldState({ ...fieldState, question: e.target.value });
    setHasChanged(true); // Set flag when question changes
  };

  const handleOptionChange = (index, value) => {
    const newOptions = [...fieldState.options];
    newOptions[index] = value;
    setFieldState({ ...fieldState, options: newOptions });
    setHasChanged(true); // Set flag when option changes
    setErrorMessage(""); // Clear error message
  };

  const handleAddOption = () => {
    if (fieldState.options[fieldState.options.length - 1].trim() !== "") {
      const newOptions = [...fieldState.options, ""];
      setFieldState({ ...fieldState, options: newOptions });
      setHasChanged(true); // Set flag when option added
      setErrorMessage(""); // Clear error message
    } else {
      toast.warning("Please enter a value for the option");
      setErrorMessage("Please enter a value for the option");
    }
  };

  const handleDeleteOption = (index) => {
    const newOptions = fieldState.options.filter((_, i) => i !== index);
    setFieldState({ ...fieldState, options: newOptions });
    setHasChanged(true); // Set flag when option deleted
    setErrorMessage(""); // Clear error message
  };

  useEffect(() => {
    // Reset flag when fieldData changes
    setHasChanged(false);
  }, [fieldData]);

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
      <div className={classes.checkboxfieldcontainer} ref={containerRef}>
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
                type="checkbox"
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
                <div
                  className={classes.addOptiondiv}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleAddOption();
                  }}
                >
                  <IoMdAddCircleOutline />
                </div>
              )}
              {index !== 0 && (
                <div
                  className={classes.deleteOptiondiv}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDeleteOption(index);
                  }}
                >
                  <RxCross1 />
                </div>
              )}
            </div>
          ))}
        </div>
        {errorMessage && (
          <p className={classes.errorMessage}>{errorMessage}</p>
        )}
      </div>
      <Functionalities
        fieldState={fieldState}
        hasChanged={hasChanged}
        setHasChanged={setHasChanged}
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

export default CheckboxTypeFields;
