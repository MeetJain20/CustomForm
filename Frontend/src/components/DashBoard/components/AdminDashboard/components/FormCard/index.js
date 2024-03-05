import React from "react";
import classes from "./FormCard.module.css";

const FormCard = ({img, title}) => {
  return (
    <div className={`card ${classes.cardcontainer}`} style={{ width: "200px" }}>
      <img
        src={img}
        className={`${classes.formcardimage} card-img-top`}
        alt="..."
      />
      <div className={`${classes.formcardbody} card-body`}>
        <h6 className={`card-title`}>{title}</h6>
      </div>
    </div>
  );
};

export default FormCard;
