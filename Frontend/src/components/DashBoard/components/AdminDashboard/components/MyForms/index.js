import React, { useState, useEffect } from "react";
import { FormsListContainer } from "../index";
import { useSelector } from "react-redux";
import { useRequest } from "../../../../../../context/request-hook";
import { MAIN_LINK } from "../../../../../../urls/urls";
import Cookies from "js-cookie";
import { toast } from "sonner";
import Loader from "../../../../../Loader";

const MyForms = () => {

  const { sendRequest } = useRequest();
  const [filteredForms, setFilteredForms] = useState([]);
  const [isloading, setIsloading] = useState(false);
  const searchvalue = useSelector(
    (state) => state.searchtext.searchText
  );
  const deleteform = useSelector((state) => state.funcfield.deleteform);

  useEffect(() => {
    const fetchItems = async () => {
      try {
        setIsloading(true);
        const responseData = await sendRequest(
          `${MAIN_LINK}/form/getcompletedforms/${localStorage.getItem('userid')}`,
          "GET",
          null,
          {
            "Content-Type": "application/json",
            Authorization: `Bearer ${Cookies.get("token")}`,
          }
        );
        // console.log(responseData);
        if (responseData) {
          setIsloading(false);
          // toast.success("Saved forms fetched successfully");

          const filtered = responseData.filter((form) =>
            form.formtitle
              .toLowerCase()
              .replace(/\s/g, "")
              .includes(searchvalue.toLowerCase().replace(/\s/g, ""))
          );
          setFilteredForms(filtered);
        }
      } catch (err) {
        setIsloading(false);
        if(err.message === "No forms found")
        {
        toast.info("No Saved Forms");
        }
        else{
          toast.error("Error fetching Saved forms");
        }
      }
    };
    fetchItems();
  }, [sendRequest,searchvalue,deleteform]);


  return (<>{isloading && <Loader/>}<FormsListContainer forms={filteredForms} formtitle={"My Forms"} /></>);
};

export default MyForms;

