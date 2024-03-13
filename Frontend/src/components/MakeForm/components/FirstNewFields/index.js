import React, { useState, useRef } from "react";
import classes from "./FirstNewFields.module.css";
import Select from "react-select";
import { useDispatch, useSelector } from "react-redux";
import { IoMdAddCircleOutline } from "react-icons/io";
import { MdOutlineContentCopy } from "react-icons/md";
import { RiDeleteBin6Line } from "react-icons/ri";
import { v4 as uuidv4 } from "uuid";

const FirstNewFields = () => {
    // console.log("In firstnewfields")
  const dispatch = useDispatch();
  const formFields = useSelector((state) => state.formData.fields);
  const [currentdiv, setCurrentDiv] = useState(false);
  const [selectedOptions, setSelectedOptions] = useState();
  const containerRef = useRef(null);

  const optionList = [
    { value: "shortanswer", label: "Short Answer" },
    { value: "longanswer", label: "Long Answer" },
    { value: "multiplechoice", label: "Multiple Choice" },
    { value: "checkboxtype", label: "Checkbox Type" },
    { value: "dropdown", label: "Dropdown" },
    { value: "datetype", label: "Date Type" },
    { value: "timetype", label: "Time Type" },
  ];

  const insideClickHandler = () => {
    setCurrentDiv(true);
  };

  const handleSelect = (data) => {
    setSelectedOptions(data);
   
      // Generate unique fieldId using uuidv4
      const newFieldId = uuidv4();
      dispatch({
        type: "ADD_FIELD",
        payload: { id: newFieldId, type: data.label },
      });
  };

  return (
    <div
      className={`${classes.newfieldcontainer} ${
        currentdiv ? classes.addborder : ""
      }`}
      onClick={insideClickHandler}
      ref={containerRef}
    >
      <div
        className={classes.optionlistfields}
        onClick={(e) => {
          e.stopPropagation();
        }}
      >
        <Select
          options={optionList}
          placeholder="Choose the Question Type"
          value={selectedOptions}
          onChange={handleSelect}
          isSearchable={false}
          isClearable={false} // Disable clear button
        />
      </div>
      {selectedOptions && (
        <div
          className={`${classes.saveandcopydiv} ${
            currentdiv ? classes.showSaveAndCopy : ""
          }`}
        >
          <div className={classes.addfieldbutton}>
            <IoMdAddCircleOutline />
          </div>
          <div className={classes.copyfieldbutton}>
            <MdOutlineContentCopy />
          </div>
          <div className={classes.deletefieldbutton}>
            <RiDeleteBin6Line />
          </div>
        </div>
      )}
    </div>
  );
};

export default FirstNewFields;
