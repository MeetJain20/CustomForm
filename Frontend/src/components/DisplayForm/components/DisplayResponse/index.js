import React from "react";
import classes from "./DisplayResponse.module.css";
import { Navbar, Footer } from "../../../index";
import { Link, useLocation } from "react-router-dom";

const DisplayResponse = () => {
  const location = useLocation();
  const { totalResponseData } = location.state;
  //   console.log(totalResponseData);
  return (
    <>
      <Navbar />
      <div className={classes.responsecontainer}>
        <div className={classes.responseheader}>Responses</div>
        <div className={classes.responsetable}>
          <table className={classes.responseTable}>
            <thead>
              <tr>
                <th>
                  <div
                    className={classes.questionn}
                    style={{
                      borderBottom: "1px solid #adadad",
                      paddingBottom: "5px",
                    }}
                  >
                    Questions
                  </div>
                  <div
                    className={classes.nameempp}
                    style={{ paddingTop: "5px" }}
                  >
                    Employee Name
                  </div>
                </th>
                {totalResponseData[0].responses.map((element, index) => (
                  <th key={index} title={element.question}>
                    {element.question}
                  </th>
                ))}
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {totalResponseData.map((response, index) => (
                <tr key={index}>
                  <td>{response.empName}</td>
                  {response.responses.map((element, index) => {
                    let displayData;

                    if (element.type === "Dropdown") {
                      // If the response is an object with a "label" field, use the label
                      displayData = [element.response.label].toString();
                    } else if (element.type === "File Type") {
                      displayData = (
                        <a href={element.response} target="_blank" rel="noopener noreferrer">
                        View File
                     </a>
                      );
                    } else {
                      // If the response is not an object with a "label" field, use the response itself
                      displayData = element.response.toString();
                    }

                    // Generate <td> elements for each element in displayData
                    return (
                      <td key={index} title={response.empName}>
                        {displayData}
                      </td>
                    );
                  })}
                  <td>
                    <button className={classes.approveresponse}>Approve</button>{" "}
                    <button className={classes.rejectresponse}>Reject</button>
                  </td>
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
