import React, { useState, useEffect } from "react";
import classes from "./MyForms.module.css";

import { form } from "../../../../../../assets/index";
import { FormsListContainer } from "../index";
import { useSelector } from "react-redux";
import { useRequest } from "../../../../../../context/request-hook";
import { MAIN_LINK } from "../../../../../../urls/urls";
import Cookies from "js-cookie";

const MyForms = () => {

  const { sendRequest } = useRequest();
  const [filteredForms, setFilteredForms] = useState([]);
  const searchvalue = useSelector(
    (state) => state.searchtext.searchText
  );
  useEffect(() => {
    const fetchItems = async () => {
      try {
        const responseData = await sendRequest(
          `${MAIN_LINK}/form/getcompletedforms`,
          "GET",
          null,
          {
            "Content-Type": "application/json",
            Authorization: `Bearer ${Cookies.get("token")}`,
          }
        );
        // console.log(responseData);
        if (responseData) {
          const filtered = responseData.filter((form) =>
            form.formtitle
              .toLowerCase()
              .replace(/\s/g, "")
              .includes(searchvalue.toLowerCase().replace(/\s/g, ""))
          );
          setFilteredForms(filtered);
        }
      } catch (err) {
        console.log(err);
      }
    };
    fetchItems();
  }, [sendRequest,searchvalue]);


  return <FormsListContainer forms={filteredForms} formtitle={"My Forms"} />;
};

export default MyForms;

