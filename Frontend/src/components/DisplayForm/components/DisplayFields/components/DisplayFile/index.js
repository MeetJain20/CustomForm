import React, { useEffect, useState, useRef } from "react";
import classes from "./DisplayFile.module.css";
import { useDispatch, useSelector } from "react-redux";
import debounce from "lodash.debounce";
import { MAIN_LINK } from "../../../../../../urls/urls";
import Cookies from "js-cookie";
import Loader from "../../../../../Loader";
import { toast } from "sonner";

const DisplayFile = ({ fieldData }) => {
  const dispatch = useDispatch();
  const fieldResponse = useSelector((state) => state.response.fieldResponse);
const [isloading, setIsloading] = useState(false);
  const fileRef = useRef(null);
  // let formData = new FormData();
  // const [responseData, setResponseData] = useState({
  //   fieldid: fieldData.fieldid,
  //   question: fieldData.question,
  //   response: "",
  // });

  const responseHandler = async () => {
    if (fileRef.current.files[0]) {
      toast.info("Adding File");
      setIsloading(true);
      const file = fileRef.current.files[0];
      const newFormData = new FormData(); // Create a new FormData object
      newFormData.append("file", file);
      const res = await fetch(MAIN_LINK + "/file/uploadFileToS3", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${Cookies.get("token")}`,
        },
        body: newFormData,
      });

      const { link } = await res.json();

      // Dispatch action to update response array
      dispatch({
        type: "UPDATE_RESPONSE",
        payload: {
          responseData: {
            fieldid: fieldData.fieldid,
            question: fieldData.question,
            type: fieldData.type,
            response: link,
          },
        },
      });
      setIsloading(false);
      toast.success("File Added");

      // fileRef.current.value = null;
    }
  };

  useEffect(() => {
    // No need for debounce, directly call responseHandler
    responseHandler();
  }, []);
  // console.log(fieldResponse);
  return (
    <>
    {isloading && <Loader/>}
    <div className={classes.displayfilefieldcontainer}>
    <div
        className={`${classes.questionfield} ${
          fieldData.isrequired ? classes.required : ""
        }`}
      >
        {fieldData.question}
      </div>
      <div className={classes.fileContainer}>
        <input
          type="file"
          ref={fileRef}
          className={classes.filefield}
          disabled={localStorage.getItem("role") === "admin" ? true : false}
          onChange={responseHandler}
          required={fieldData.isrequired}

        />
      </div>
    </div></>
  );
};

export default DisplayFile;
