import React, { useContext } from "react";
import { AuthContext } from "../../context/authcontext";
import { useNavigate } from "react-router-dom";

const DashBoard = () => {
  const auth = useContext(AuthContext);
  const navigate = useNavigate();

  const logoutHandler = () => {
    if (auth.isLoggedIn) {
      auth.logout();
      localStorage.removeItem("userid");
      localStorage.removeItem("role");
      navigate("/");
    }
  };

  return (
    <div>

      {/* <div className="container">Hello World</div> */}
      <button onClick={logoutHandler}>logout</button>
    </div>
  );
};

export default DashBoard;
