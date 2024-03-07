import React, { useState, useRef } from "react";
import classes from "./NewFields.module.css";
import Select from "react-select";
import FieldTypeAttributes from "../FieldTypeAttributes";
import { RiDeleteBin6Line } from "react-icons/ri";
import { IoMdAddCircleOutline } from "react-icons/io";
import { MdOutlineContentCopy } from "react-icons/md";
import useInsideClick from "../../../../hooks/useInsideClick";
import useOutsideClick from "../../../../hooks/useOutsideClick";

const NewFields = () => {
  const [currentdiv, setCurrentDiv] = useState(false);
  const optionList = [
    { value: "shortanswer", label: "Short Answer" },
    { value: "longanswer", label: "Long Answer" },
    { value: "multiplechoice", label: "Multiple Choice" },
    { value: "checkboxtype", label: "Checkbox" },
    { value: "dropdown", label: "Dropdown" },
    { value: "datetype", label: "Date" },
    { value: "timetype", label: "Time" },
  ];
  const [selectedOptions, setSelectedOptions] = useState();

  function handleSelect(data) {
    setSelectedOptions(data);
  }

  const containerRef = useRef(null);
  useInsideClick(containerRef, () => {
    setCurrentDiv(true);
  });
  useOutsideClick(containerRef, () => {
    setCurrentDiv(false);
  });

  return (
    <div className={classes.newfieldcontainer} ref={containerRef}>
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
      {selectedOptions && <FieldTypeAttributes type={selectedOptions.value} />}
      {selectedOptions && currentdiv && (
        <div className={classes.saveandcopydiv}>
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

export default NewFields;
