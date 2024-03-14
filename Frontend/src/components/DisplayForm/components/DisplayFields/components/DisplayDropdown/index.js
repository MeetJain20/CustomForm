import React, { useState, useEffect, useRef } from "react";
import classes from "./DisplayDropdown.module.css";
import Select from "react-select";

const DisplayDropdown = ({ fieldData }) => {
  const optionList = fieldData.options.map((option) => ({
    value: option.replace(/\s+/g, "").toLowerCase(), // Remove spaces and convert to lowercase
    label: option,
  }));

  // State to manage selected option
  const [selectedOptions, setSelectedOptions] = useState(null);

  // Handler function for option change
  const handleSelect = (selectedOption) => {
    setSelectedOptions(selectedOption);
  };
  return (
    <>
      <div className={classes.dropdownfieldcontainer}>
        <input
          type="text"
          className={classes.questionfield}
          placeholder="Question"
          value={fieldData.question}
          readOnly
        />
        <div className={classes.optionsarray}>
          <Select
            options={optionList}
            placeholder="Choose An Option"
            value={selectedOptions}
            onChange={handleSelect}
            isSearchable={false}
            isClearable={true} // Disable clear button
          />
        </div>
      </div>
    </>
  );
};

export default DisplayDropdown;
