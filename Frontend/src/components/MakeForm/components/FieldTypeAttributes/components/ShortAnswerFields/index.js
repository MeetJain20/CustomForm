import React from 'react';
import classes from "./ShortAnswerFields.module.css"

const ShortAnswerFields = () => {
  return (
    
      <div className={classes.shortanswerfieldcontainer}>
        <input type="text" className={classes.questionfield} placeholder='Question'/>
        <input type="text" className={classes.answerfield} placeholder='Answer Here' readOnly/>
      </div>

  )
}

export default ShortAnswerFields