import React, { useState, useEffect } from "react";
import classes from "./TemplateForms.module.css";
import debounce from "lodash.debounce";
import { form } from "../../../../../../assets/index";
import { FormsListContainer } from "../index";
import { useSelector } from "react-redux";

const TemplateForms = () => {
  const forms = [
    { img: form, formtitle: "Template Title" },
    { img: form, formtitle: "Template Title" },
    { img: form, formtitle: "Template Title" },
    { img: form, formtitle: "Template Title" },
    { img: form, formtitle: "Template Title" },
    { img: form, formtitle: "Template Title" },
    { img: form, formtitle: "Template Title" },
  ];
  const searchvalue = useSelector((state) => state.searchtext.searchText);
  const filteredForms = forms.filter((form) =>
    form.formtitle
      .toLowerCase()
      .replace(/\s/g, "")
      .includes(searchvalue.toLowerCase().replace(/\s/g, ""))
  );

  return (
    <FormsListContainer forms={filteredForms} formtitle={"Template Forms"} />
  );
};

export default TemplateForms;
