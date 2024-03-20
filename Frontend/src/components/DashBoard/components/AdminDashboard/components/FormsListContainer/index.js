import React, { useState } from "react";
import classes from "./FormsListContainer.module.css";
import { FormCard } from "../index";
import { IoIosArrowDown, IoIosArrowUp } from "react-icons/io";
import { IoSearchOutline } from "react-icons/io5";
import { useDispatch, useSelector } from "react-redux";
import debounce from "lodash.debounce";
import { form as formimg } from "../../../../../../assets/index";

const FormsListContainer = ({ forms, formtitle }) => {
  // console.log("meet",forms)
  const dispatch = useDispatch();
  const [searchvalue, setSearchValue] = useState(
    useSelector((state) => state.searchtext.searchText)
  );
  const [showAllForms, setShowAllForms] = useState(false);
  const showallformsHandler = () => {
    setShowAllForms((prev) => !prev);
  };
  //   const [searchText, setSearchText] = useState("");
  const searchHandler = () => {};
  const updateSearchValue = (e) => {
    const newSearchValue = e?.target?.value;
    setSearchValue(newSearchValue);
    debouncedDispatch(newSearchValue);
  };

  const debouncedDispatch = debounce((value) => {
    dispatch({
      type: "SEARCH_TEXT",
      payload: value,
    });
  }, 500);

  return (
    <div className={`${showAllForms ? classes.showAllForms : ""}`}>
      <div className={classes.createneworupdateformcontainer}>
        <div className={classes.formlists}>
          <div className={classes.formlistheader}>
            <div className={classes.formtitle}>{formtitle}</div>
            <div className={classes.rightformlistheader}>
              {(formtitle === "Active Forms" || formtitle === "Assigned Forms") && (
                <div className={classes.searchcontainer}>
                  <input
                    type="text"
                    name="searchforms"
                    value={searchvalue}
                    placeholder="Search Forms"
                    className={classes.searchbox}
                    onChange={updateSearchValue}
                  />
                  <div className={classes.searchicon} onClick={searchHandler}>
                    <IoSearchOutline />
                  </div>
                </div>
              )}
              {forms.length > 6 &&
                (!showAllForms ? (
                  <div
                    className={classes.downarrow}
                    onClick={showallformsHandler}
                  >
                    <IoIosArrowDown />
                  </div>
                ) : (
                  <div
                    className={classes.uparrow}
                    onClick={showallformsHandler}
                  >
                    <IoIosArrowUp />
                  </div>
                ))}
            </div>
          </div>
          {/* <div className={`${showAllForms ? classes.showAllForms1 : ""}`}> */}
          {forms.length > 0 ? (
            <div className={classes.allformlist}>
              {showAllForms
                ? forms.map((form, index) => (
                    <FormCard
                      key={index}
                      formid={form._id}
                      img={formimg}
                      formtitle={formtitle}
                      title={form.formtitle}
                    />
                  ))
                : forms
                    .slice(0, 6)
                    .map((form, index) => (
                      <FormCard
                        key={index}
                      formid={form._id}
                        img={formimg}
                      formtitle={formtitle}
                        title={form.formtitle}
                      />
                    ))}
            </div>
          ) : (
            <div>No {formtitle}</div>
          )}
          {/* </div> */}
        </div>
      </div>
    </div>
  );
};

export default FormsListContainer;
