import React, { useState, useEffect } from "react";
import classes from "./MyForms.module.css";

import { form } from "../../../../../../assets/index";
import { FormsListContainer } from "../index";
import { useSelector } from "react-redux";

const MyForms = () => {
 
  const forms = [
    { img: form, title: "My Title" },
    { img: form, title: "My Title" },
    { img: form, title: "My Title" },
    { img: form, title: "My Title" },
    { img: form, title: "My Title" },
  ];
  const searchvalue = useSelector((state) => state.searchtext.searchText);
  const filteredForms = forms.filter((form) =>
  form.title.toLowerCase().replace(/\s/g, "").includes(searchvalue.toLowerCase().replace(/\s/g, ""))
);

  return <FormsListContainer forms={filteredForms} formtitle={"My Forms"} />;
};

export default MyForms;

