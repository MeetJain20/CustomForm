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

const FieldTypeAttributes = ({ type, fieldData }) => {
  // console.log("meet",type);
  // State to hold the active type
  const [activeType, setActiveType] = useState(null);
  // Effect to update the active type when the prop value changes
  useEffect(() => {
    setActiveType(type);
  }, [type]);

  return (
    <div>
      {activeType === "shortanswer" && <ShortAnswerFields fieldData={fieldData} />}
      {activeType === "longanswer" && <LongAnswerFields fieldData={fieldData} />}
      {activeType === "multiplechoice" && <MultipleChoiceFields fieldData={fieldData} />}
      {activeType === "checkboxtype" && <CheckboxTypeFields fieldData={fieldData} />}
      {activeType === "dropdown" && <DropdownFields fieldData={fieldData} />}
      {activeType === "datetype" && <DateTypeFields fieldData={fieldData} />}
      {activeType === "timetype" && <TimeTypeFields fieldData={fieldData} />}
    </div>
  );
};

export default FieldTypeAttributes;
