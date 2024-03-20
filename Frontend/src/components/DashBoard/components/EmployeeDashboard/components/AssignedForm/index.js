import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useRequest } from "../../../../../../context/request-hook";
import { MAIN_LINK } from "../../../../../../urls/urls";
import Cookies from "js-cookie";
import { FormsListContainer } from "../../../AdminDashboard/components";
import Loader from "../../../../../Loader";
import { toast } from "sonner";

const AssignedForm = () => {
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
          `${MAIN_LINK}/empform/getassignedforms/${localStorage.getItem('userid')}`,
          "GET",
          null,
          {
            "Content-Type": "application/json",
            Authorization: `Bearer ${Cookies.get("token")}`,
          }
        );
        if (responseData) {
            setIsloading(false);
            // toast.success("Assigned forms fetched successfully");

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
        toast.error("Error fetching Assigned Forms");
        console.log(err);
      }
    };
    fetchItems();
  }, [sendRequest,searchvalue,deleteform]);

  return (<>{isloading && <Loader/>}
    <FormsListContainer forms={filteredForms} formtitle={"Assigned Forms"} /></>
  );
};

export default AssignedForm;
