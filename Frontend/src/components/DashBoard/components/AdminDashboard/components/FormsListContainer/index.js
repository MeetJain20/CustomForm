import React, { useState } from "react";
import classes from "./FormsListContainer.module.css";
import { FormCard } from "../index";
import { IoIosArrowDown, IoIosArrowUp } from "react-icons/io";

const FormsListContainer = ({ forms, formtitle }) => {
  const [showAllForms, setShowAllForms] = useState(false);
  const showallformsHandler = () => {
    setShowAllForms((prev) => !prev);
  };

  return (

    <div className={`${showAllForms ? classes.showAllForms : ""}`}>
    <div className={classes.createneworupdateformcontainer}>
   
      <div className={classes.formlists}>
        <div className={classes.formlistheader}>
          <div className={classes.formtitle}>{formtitle}</div>
          {!showAllForms ? (
            <div className={classes.downarrow} onClick={showallformsHandler}>
              <IoIosArrowDown />
            </div>
          ) : (
            <div className={classes.uparrow} onClick={showallformsHandler}>
              <IoIosArrowUp />
            </div>
          )}
        </div>
        {/* <div className={`${showAllForms ? classes.showAllForms1 : ""}`}> */}
        <div className={classes.allformlist}>
          {showAllForms
            ? forms.map((form, index) => (
                <FormCard key={index} img={form.img} title={form.title} />
              ))
            : forms
                .slice(0, 6)
                .map((form, index) => (
                  <FormCard key={index} img={form.img} title={form.title} />
                ))}
        </div>
        {/* </div> */}
      </div>
      </div>
  </div>
  );
};

export default FormsListContainer;
