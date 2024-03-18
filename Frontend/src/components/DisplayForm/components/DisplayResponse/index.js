import React from "react";
import classes from "./DisplayResponse.module.css";
import { Navbar, Footer } from "../../../index";
import { useLocation } from "react-router-dom";

const DisplayResponse = () => {
  const location = useLocation();
  const { totalResponseData } = location.state;
//   console.log(totalResponseData);
  return (
    <>
      <Navbar />
  <div className={classes.responsecontainer}>
    <div className={classes.responsetable}>
      <table className={classes.responseTable}>
        <thead>
          <tr>
            {totalResponseData[0].responses.map((element, index) => (
              <th key={index}>{element.question}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {totalResponseData.map((response, index) => (
            <tr key={index}>
              {response.responses.map((element, index) => {
                let displayData;

                if (
                  typeof element.response === "object" &&
                  "label" in element.response
                ) {
                  // If the response is an object with a "label" field, use the label
                  displayData = [element.response.label];
                } else {
                  // If the response is not an object with a "label" field, use the response itself
                  displayData = [element.response];
                }

                // Generate <td> elements for each element in displayData
                return <td key={index}>{displayData.toString()}</td>;
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
  <Footer />
    </>
  );
};

export default DisplayResponse;
