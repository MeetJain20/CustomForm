import React from "react";
import classes from "./Footer.module.css";

const Footer = () => {
  return (
    <div className={classes.footerbody}>
      <footer className={classes.footer}>
        <p>&copy;2023 Darwinbox | All Rights Reserved</p>
      </footer>
    </div>
  );
};

export default Footer;
