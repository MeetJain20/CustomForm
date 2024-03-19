
import React, { useState, useRef } from "react";
import classes from "./NewFields.module.css";
import Select from "react-select";
import FieldTypeAttributes from "../FieldTypeAttributes";
import { RiDeleteBin6Line } from "react-icons/ri";
import { IoMdAddCircleOutline } from "react-icons/io";
import { MdOutlineContentCopy } from "react-icons/md";
import useOutsideClick from "../../../../hooks/useOutsideClick";
import { useDispatch } from "react-redux";

const NewFields = ({ fieldData={} }) => {
  const dispatch = useDispatch();
  const [currentdiv, setCurrentDiv] = useState(false);
  const optionList = [
    { value: "shortanswer", label: "Short Answer" },
    { value: "longanswer", label: "Long Answer" },
    { value: "multiplechoice", label: "Multiple Choice" },
    { value: "checkboxtype", label: "Checkbox Type" },
    { value: "dropdown", label: "Dropdown" },
    { value: "datetype", label: "Date Type" },
    { value: "timetype", label: "Time Type" },
    { value: "filetype", label: "File Type" },
  ];
  const [selectedOptions, setSelectedOptions] = useState({value: fieldData.type.replace(/\s+/g, "").toLowerCase(), label: fieldData.type});

  const handleSelect = (data) => {
    setSelectedOptions(data);
    // Dispatch action to update field type in Redux store
    dispatch({
      type: "UPDATE_FIELD_TYPE",
      payload: { fieldId: fieldData.fieldid, type: data.label },
    });
  };

  // const addfieldHandler = () => {
  //   dispatch({
  //     type: "ADD_FIELD",
  //     payload: true,
  //   });
  // };

  const containerRef = useRef(null);
  const insideClickHandler = () => {
    setCurrentDiv(true);
  };
  useOutsideClick(containerRef, () => {
    setCurrentDiv(false);
  });
  // useState(() => {
  //   if (fieldData.type) {
  //     const transformedType = fieldData.type.replace(/\s+/g, "").toLowerCase();
  //     setSelectedOptions({ value: transformedType, label: fieldData.type });
  //   }
  // }, [fieldData]);


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
    
        <FieldTypeAttributes
          type={(fieldData.type.replace(/\s+/g, "").toLowerCase() || selectedOptions.value).replace(/\s+/g, "").toLowerCase()}
          fieldData={fieldData}
        />
  
        <div
          className={`${classes.saveandcopydiv} ${
            currentdiv ? classes.showSaveAndCopy : ""
          }`}
        >
          {/* <div className={classes.addfieldbutton} onClick={addfieldHandler}>
            <IoMdAddCircleOutline />
          </div> */}
          <div className={classes.copyfieldbutton}>
            <MdOutlineContentCopy />
          </div>
          <div className={classes.deletefieldbutton}>
            <RiDeleteBin6Line />
          </div>
        </div>
 
    </div>
  );
};


export default NewFields;
