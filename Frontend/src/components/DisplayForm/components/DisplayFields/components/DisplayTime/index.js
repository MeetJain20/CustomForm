import React,{useState} from "react";
import { BiTime } from "react-icons/bi";
import classes from "./DisplayTime.module.css";

const DisplayTime = ({fieldData}) => {

  return (<>
    <div className={classes.displaytimecontainer}>
      <input
        type="text"
        className={classes.questionfield}
        placeholder="Question"
        value={fieldData.question}
        readOnly
      />
      <div className={classes.timeContainer}>
        <input
          type="time"
          className={classes.timefield}
          disabled={localStorage.getItem('role')==='admin'?true:false}
        />
        <BiTime className={classes.timeIcon} />
      </div>
    </div>
    </>
  );
};

export default DisplayTime;
