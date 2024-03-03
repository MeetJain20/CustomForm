import { React, useState, useContext, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import logo from "../../assets/logo.png";
import Select from "react-select";
import { AuthContext } from "../../context/authcontext";
import { useRequest } from "../../hooks/request-hook";
import classes from "./Navbar.module.css";
import { LuLogOut } from "react-icons/lu";
import { CgProfile } from "react-icons/cg";

const Navbar = () => {
  const auth = useContext(AuthContext);
  const navigate = useNavigate();
  const [selectedOptions, setSelectedOptions] = useState();
  const optionList = [
    { value: "employee", label: "Employee" },
    { value: "admin", label: "Admin" },
  ];

  function handleSelect(data) {
    setSelectedOptions(data);
    navigate(`/login?role=${data.value}`);
  }

  const logoutHandler = () => {
    if (auth.isLoggedIn) {
      auth.logout();
      localStorage.removeItem("userid");
      localStorage.removeItem("role");
      navigate("/");
    }
  };
  return (
    <nav
      className={`${classes.navbarr} navbar fixed-top navbar-expand-lg navbar-dark`}
    >
      <div className="container-fluid">
        <Link className="navbar-brand" to="/">
          <img
            src={logo}
            alt="Loading"
            style={{
              height: "50px",
              width: "150px",
              borderRadius: "5px",
              objectFit: "cover",
              marginLeft: "1.5rem",
            }}
          />
        </Link>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarSupportedContent"
          aria-controls="navbarSupportedContent"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarSupportedContent">
          <ul
            className={`navbar-nav me-auto mb-2 mb-lg-0 ${classes.navbarcontent}`}
          >
            <div className={classes.leftnavbar}>
              <Link className="nav-link active" aria-current="page" to="/">
                Home
              </Link>
              <Link className="nav-link active" aria-current="page" to="/forms">
                Forms
              </Link>
            </div>
            {localStorage.hasOwnProperty("userid") ? (
              <div className={classes.rightnavbar}>
                <Link
                  className={`${classes.logoutbutton}`}
                  onClick={logoutHandler}
                  aria-current="page"
                  to="/"
                >
                  <LuLogOut />
                </Link>

                <Link
                  className={`${classes.profile}`}
                  aria-current="page"
                  to="/profile"
                >
                  <CgProfile />
                </Link>
              </div>
            ) : (
              <li className="nav-item">
                <div className={classes.logindropdowm}>
                  <Select
                    options={optionList}
                    placeholder="Login as"
                    value={selectedOptions}
                    onChange={handleSelect}
                    isSearchable={false}
                    isClearable={false} // Disable clear button
                  />
                </div>
              </li>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
