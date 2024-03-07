import React, { useState } from "react";
import classes from "./CurrentForms.module.css";

import { form } from "../../../../../../assets/index";
import { FormsListContainer } from "../index";
import { useSelector } from "react-redux";

const CurrentForms = () => {
 
  const forms = [
    { img: form, title: "Active Title" },
    { img: form, title: "Active Title" },
    { img: form, title: "Active Title" },
  ];
  const searchvalue = useSelector((state) => state.searchtext.searchText);
  const filteredForms = forms.filter((form) =>
  form.title.toLowerCase().replace(/\s/g, "").includes(searchvalue.toLowerCase().replace(/\s/g, ""))
);

  return <FormsListContainer forms={filteredForms} formtitle={"Active Forms"} />;
};

export default CurrentForms;
