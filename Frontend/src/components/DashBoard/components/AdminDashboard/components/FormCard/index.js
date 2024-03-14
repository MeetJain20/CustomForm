import React from "react";
import classes from "./FormCard.module.css";
import { useNavigate } from "react-router-dom";

const FormCard = ({formid, img, title, formtitle}) => {
const navigate = useNavigate();
  const gotoformHandler = ()=>{
    if(formtitle === 'Active Forms')
    {
      navigate(`/createform/${formid}`);
    }
    else if(formtitle === 'Template Forms')
    {
      navigate(`/displayform/${formid}`);
    }
    else if(formtitle === 'My Forms')
    {
      navigate(`/displayform/${formid}`);
    }
  }

  return (
    <div className={`card ${classes.cardcontainer}`} style={{ width: "200px" }} onClick={gotoformHandler}>
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
