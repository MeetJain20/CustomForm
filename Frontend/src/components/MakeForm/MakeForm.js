import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Navbar, Footer } from "../index";
import classes from "./MakeForm.module.css";
import NewFields from "./components/NewFields";

const MakeForm = () => {
  const formTitle = useSelector((state) => state.formData.formtitle);
  const formDesc = useSelector((state) => state.formData.formdesc);
  const dispatch = useDispatch();

  const formtitleHandler = (e) => {
    dispatch({
      type: "UPDATE_TITLE",
      payload: e.target.value,
    });
  };

  const formdescHandler = (e) => {
    dispatch({
      type: "UPDATE_DESC",
      payload: e.target.value,
    });
  };

  return (
    <>
      <Navbar />
      <div className={classes.createformcontainer}>
        <div className={classes.customcontainer}>
          <div className={classes.createformheader}>
            <input
              type="text"
              value={formTitle}
              className={classes.createformheadertitle}
              onChange={formtitleHandler}
            />
            <input
              type="text"
              value={formDesc}
              className={classes.createformheaderdesc}
              onChange={formdescHandler}
            />
          </div>
        </div>
        <div className={classes.createformbody}>
         <NewFields/>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default MakeForm;
