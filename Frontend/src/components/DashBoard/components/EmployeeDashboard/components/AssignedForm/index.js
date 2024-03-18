import React, { useEffect, useState } from "react";
import classes from "./AssignedForm.module.css";


import { useSelector } from "react-redux";
import { useRequest } from "../../../../../../context/request-hook";
import { MAIN_LINK } from "../../../../../../urls/urls";
import Cookies from "js-cookie";
import { FormsListContainer } from "../../../AdminDashboard/components";

const AssignedForm = () => {
  const { sendRequest } = useRequest();
  const [filteredForms, setFilteredForms] = useState([]);
  const searchvalue = useSelector(
    (state) => state.searchtext.searchText
  );
  useEffect(() => {
    const fetchItems = async () => {
      try {
        const responseData = await sendRequest(
          `${MAIN_LINK}/empform/getassignedforms/${localStorage.getItem('userid')}`,
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

  return (
    <FormsListContainer forms={filteredForms} formtitle={"Assigned Forms"} />
  );
};

export default AssignedForm;