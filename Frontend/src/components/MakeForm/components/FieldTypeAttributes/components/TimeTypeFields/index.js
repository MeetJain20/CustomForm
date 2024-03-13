import React,{useState} from "react";
import { BiTime } from "react-icons/bi";
import classes from "./TimeTypeFields.module.css";
import Functionalities from "../Functionalities";

const TimeTypeFields = ({fieldData}) => {
  const [fieldState, setFieldState] = useState({
    fieldid: fieldData.fieldid,
    type: fieldData.type || "Short Answer",
    question: fieldData.question || "",
  });

  const handleQuestionChange = (e) => {
    setFieldState({ ...fieldState, question: e.target.value });
  };

  return (<>
    <div className={classes.timetypefieldcontainer}>
      <input
        type="text"
        className={classes.questionfield}
        placeholder="Question"
        value={fieldState.question}
        onChange={handleQuestionChange}
      />
      <div className={classes.timeContainer}>
        <input
          type="time"
          className={classes.timefield}
          disabled
        />
        <BiTime className={classes.timeIcon} />
      </div>
    </div>
    <Functionalities fieldState={fieldState}/>
    </>
  );
};

export default TimeTypeFields;
