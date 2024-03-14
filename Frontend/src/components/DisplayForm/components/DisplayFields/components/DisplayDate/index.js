import React,{useState, useEffect} from "react";
import classes from "./DisplayDate.module.css";
import { IoCalendarOutline } from "react-icons/io5";

const DisplayDate = ({fieldData}) => {
  
  return (<>
    <div className={classes.displaydatefieldcontainer}>
      <input
        type="text"
        className={classes.questionfield}
        placeholder="Question"
        value={fieldData.question}
        readOnly
      />
      <div className={classes.dateContainer}>
        <input
          type="date"
          className={classes.datefield}
          disabled={localStorage.getItem('role') === "admin" ? true : false}
        />
        <IoCalendarOutline className={classes.calendarIcon} />
      </div>
    </div>
    </>
  );
};

export default DisplayDate;
