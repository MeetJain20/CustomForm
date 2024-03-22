import React, { useState, useEffect } from "react";
import classes from "./DisplayDropdown.module.css";
import Select from "react-select";
import debounce from "lodash.debounce";
import { useDispatch, useSelector } from "react-redux";

const DisplayDropdown = ({ fieldData }) => {
  const dispatch = useDispatch();
  const [selectedOption, setSelectedOption] = useState(null);
  const [responseData, setResponseData] = useState({
    fieldid: fieldData.fieldid,
    question: fieldData.question,
    type: fieldData.type,
    response: "", // Initialize with null since no option is selected initially
  });

  // Handler function for option change
  const handleSelect = (selectedOption) => {
    setSelectedOption(selectedOption);
    setResponseData((prevState) => ({
      ...prevState,
      response: selectedOption,
    }));
  };

  const debouncedResponseHandler = debounce(async (responseData) => {
    try {
      // Dispatch action to update response array
      dispatch({
        type: "UPDATE_RESPONSE",
        payload: { responseData },
      });
    } catch (err) {
      console.log(err);
    }
  }, 100);

  useEffect(() => {
    debouncedResponseHandler(responseData);
  }, [responseData]);

  // Map options to required format
  let optionList = [];
  if (fieldData.options) {
    optionList = fieldData.options.map((option) => ({
      value: option.replace(/\s+/g, "").toLowerCase(),
      label: option,
    }));
  }

  return (
    <div className={classes.dropdownfieldcontainer}>
     <div
        className={`${classes.questionfield} ${
          fieldData.isrequired ? classes.required : ""
        }`}
      >
        {fieldData.question}
      </div>
      <div className={classes.optionsarray}>
        <Select
          options={optionList}
          placeholder="Choose An Option"
          value={selectedOption}
          onChange={handleSelect}
          isSearchable={false}
          isClearable={true} // Enable clear button
        />
      </div>
    </div>
  );
};

export default DisplayDropdown;
