import React, { useState } from "react";
import classes from "./TemplateForms.module.css";

import { form } from "../../../../../../assets/index";
import { FormsListContainer } from "../index";

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
  return <FormsListContainer forms={forms} formtitle={"Template Forms"} />;
};

export default TemplateForms;

