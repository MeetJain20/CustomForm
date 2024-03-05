import React, { useState } from "react";
import classes from "./MyForms.module.css";

import { form } from "../../../../../../assets/index";
import { FormsListContainer } from "../index";

const MyForms = () => {
 
  const forms = [
    { img: form, title: "My Title" },
    { img: form, title: "My Title" },
    { img: form, title: "My Title" },
    { img: form, title: "My Title" },
    { img: form, title: "My Title" },
  ];
  return <FormsListContainer forms={forms} formtitle={"My Forms"} />;
};

export default MyForms;

