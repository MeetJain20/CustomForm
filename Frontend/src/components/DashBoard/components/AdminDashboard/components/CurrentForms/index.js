import React, { useState } from "react";
import classes from "./CurrentForms.module.css";

import { form } from "../../../../../../assets/index";
import { FormsListContainer } from "../index";

const CurrentForms = () => {
 
  const forms = [
    { img: form, title: "Active Title" },
    { img: form, title: "Active Title" },
    { img: form, title: "Active Title" },
  ];
  return <FormsListContainer forms={forms} formtitle={"Active Forms"} />;
};

export default CurrentForms;
