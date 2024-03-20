import React, { useReducer, useState } from "react";
import classes from "./FormCard.module.css";
import { useNavigate } from "react-router-dom";
import { AiTwotoneDelete } from "react-icons/ai";
import { useRequest } from "../../../../../../context/request-hook";
import { MAIN_LINK } from "../../../../../../urls/urls";
import Cookies from "js-cookie";
import { toast } from "sonner";
import { useDispatch, useSelector } from "react-redux";
import Loader from "../../../../../Loader";

const FormCard = ({ formid, img, title, formtitle }) => {
  const navigate = useNavigate();
  const {sendRequest} = useRequest();
  const dispatch = useDispatch();
  const [isloading,setIsloading] = useState(false);

  const gotoformHandler = () => {
    const titleToRouteMap = {
      "Active Forms": `/createform/${formid}`,
      "Template Forms": `/displayform/${formid}`,
      "My Forms": `/displayform/${formid}`,
      "Assigned Forms": `/displayform/${formid}`,
      "Submitted Forms": `/displayform/${formid}`,
    };

    const route = titleToRouteMap[formtitle];
    if (route) {
      navigate(route);
    }
  };

  const isSubmittedForm = formtitle === "Submitted Forms";

  const deleteFormHandler = async () => {
    try {
      setIsloading(true);
      const response = await sendRequest(
        `${MAIN_LINK}/form/deleteform`,
        'DELETE',
        JSON.stringify({ formid }), // Assuming formid is available in the scope
        {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${Cookies.get('token')}`,
        }
      );
  
      if (!response) {
        setIsloading(false);
        toast.error("Error deleting form");
        throw new Error('Failed to delete form');
      }
      setIsloading(false);
      toast.success("Form deleted successfully");
      dispatch({ type: "DELETE_FORM" });      // console.log('Form deleted successfully');
    } catch (error) {
      setIsloading(false);
      toast.error("Error deleting form");
      console.error('Error deleting form:', error);
    }
  };

  return (<>{isloading && <Loader/>}
    <div
      className={`card ${classes.cardcontainer}`}
      style={{
        width: "200px",
        cursor: isSubmittedForm ? "not-allowed" : "pointer",
      }}
      onClick={!isSubmittedForm ? gotoformHandler : undefined}
    >
      <img
        src={img}
        className={`${classes.formcardimage} card-img-top`}
        alt="..."
      />
      <div className={`${classes.formcardbody} card-body`}>
        <h6 className={`card-title`}>{title}</h6>

        {localStorage.getItem("role") === "admin" &&
          formtitle !== "Template Forms" && (
            <div
              className={classes.deleteformicon}
              onClick={(e) => {
                e.stopPropagation();
                deleteFormHandler();
              }}
            >
              <AiTwotoneDelete size={25} />
            </div>
          )}
      </div>
    </div></>
  );
};

export default FormCard;
