import React, { useState, useEffect } from "react";
import classes from "./TemplateForms.module.css";
import debounce from "lodash.debounce";
import { form } from "../../../../../../assets/index";
import { FormsListContainer } from "../index";
import { useSelector } from "react-redux";

const TemplateForms = () => {
  const forms = [
    { img: form, title: "Template Title" },
    { img: form, title: "Template Title" },
    { img: form, title: "Template Title" },
    { img: form, title: "Template Title" },
    { img: form, title: "Template Title" },
    { img: form, title: "Template Title" },
    { img: form, title: "Template Title" },
  ];
  const searchvalue = useSelector((state) => state.searchtext.searchText);
  const filteredForms = forms.filter((form) =>
    form.title
      .toLowerCase()
      .replace(/\s/g, "")
      .includes(searchvalue.toLowerCase().replace(/\s/g, ""))
  );

  return (
    <FormsListContainer forms={filteredForms} formtitle={"Template Forms"} />
  );
};

export default TemplateForms;
