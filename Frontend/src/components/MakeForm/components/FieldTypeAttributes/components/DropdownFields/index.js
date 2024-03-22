import React, { useState, useEffect, useRef } from "react";
import classes from "./DropdownFields.module.css";
import { RxCross1 } from "react-icons/rx";
import { IoMdAddCircleOutline } from "react-icons/io";
import Functionalities from "../Functionalities";
import useOutsideClick from "../../../../../../hooks/useOutsideClick";
import { toast } from "sonner";

const DropdownFields = ({ fieldData }) => {
  const [fieldState, setFieldState] = useState({
    fieldid: fieldData.fieldid,
    type: fieldData.type || "Dropdown",
    question: fieldData.question || "",
    isrequired:fieldData.isrequired || false,
    options: fieldData.options || [""],
  });

  const [errorMessage, setErrorMessage] = useState("");
  const containerRef = useRef(null);
  const [hasChanged, setHasChanged] = useState(false); // State to track changes

  const handleQuestionChange = (e) => {
    setFieldState({ ...fieldState, question: e.target.value });
    setHasChanged(true);
  };

  const handleOptionChange = (index, value) => {
    const newOptions = [...fieldState.options];
    newOptions[index] = value;
    setFieldState({ ...fieldState, options: newOptions });
    setErrorMessage("");
    setHasChanged(true);
  };

  const handleAddOption = () => {
    // Check if the last option is not empty before adding a new one
    if (fieldState.options[fieldState.options.length - 1].trim() !== "") {
      const newOptions = [...fieldState.options, ""];
      setFieldState({ ...fieldState, options: newOptions });
      setErrorMessage("");
      setHasChanged(true);
    } else {
      toast.warning("Please enter a value for the option")
      setErrorMessage("Please enter a value for the option");
    }
  };

  const handleDeleteOption = (index) => {
    const newOptions = fieldState.options.filter((_, i) => i !== index);
    setFieldState({ ...fieldState, options: newOptions });
    setErrorMessage("");
    setHasChanged(true);
  };

  useEffect(() => {
    // Reset flag when fieldData changes
    setHasChanged(false);
  }, [fieldData]);

  useOutsideClick(containerRef, () => {
    // Remove empty options
    if (fieldState.options.length > 1 || fieldState.options[0].trim() !== "") {
      const nonEmptyOptions = fieldState.options.filter(
        (option) => option.trim() !== ""
      );
      setFieldState({ ...fieldState, options: nonEmptyOptions });
    }
  });
  return (
    <>
      <div className={classes.dropdownfieldcontainer} ref={containerRef}>
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
              <div className={classes.bullet}>{index + 1}.</div> {/* Display bullet points */}
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

export default DropdownFields;
