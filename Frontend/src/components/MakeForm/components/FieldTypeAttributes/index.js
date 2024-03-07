import React, { useState, useEffect } from "react";
import {
  ShortAnswerFields,
  LongAnswerFields,
  DropdownFields,
  MultipleChoiceFields,
  CheckboxTypeFields,
  DateTypeFields,
  TimeTypeFields,
} from "./components";

const FieldTypeAttributes = ({ type }) => {
  // State to hold the active type
  const [activeType, setActiveType] = useState(null);

  // Effect to update the active type when the prop value changes
  useEffect(() => {
    setActiveType(type);
  }, [type]);

  return (
    <div>
      {activeType === "shortanswer" && <ShortAnswerFields />}
      {activeType === "longanswer" && <LongAnswerFields />}
      {activeType === "multiplechoice" && <MultipleChoiceFields />}
      {activeType === "checkboxtype" && <CheckboxTypeFields />}
      {activeType === "dropdown" && <DropdownFields />}
      {activeType === "datetype" && <DateTypeFields />}
      {activeType === "timetype" && <TimeTypeFields />}
    </div>
  );
};

export default FieldTypeAttributes;
