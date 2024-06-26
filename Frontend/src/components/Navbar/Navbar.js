import { React, useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import logo from "../../assets/logo.png";
import Select from "react-select";
import { AuthContext } from "../../context/authcontext";
import { useRequest } from "../../context/request-hook";
import classes from "./Navbar.module.css";
import { LuLogOut } from "react-icons/lu";
import { CgProfile } from "react-icons/cg";
import { toast } from "sonner";
import Modal from "../Reusable/Modal";
import EditProfile from "../Reusable/EditProfile";
import Cookies from "js-cookie";

const Navbar = () => {
  const auth = useContext(AuthContext);
  const navigate = useNavigate();
  const [modalOpen, setModalOpen] = useState(false);
  const openModal = () => setModalOpen(true);
  const closeModal = () => setModalOpen(false);
  const role = localStorage.getItem("role");
  const destination =
    role === "admin" ? "/admindashboard" : "/employeedashboard";

  const [selectedOptions, setSelectedOptions] = useState();
  const optionList = [
    { value: "employee", label: "Employee" },
    { value: "admin", label: "Admin" },
  ];

  function handleSelect(data) {
    setSelectedOptions(data);
    toast.info(`${data.label} Login`);
    navigate(`/login?role=${data.value}`);
  }

  const logoutHandler = () => {
    if (auth.isLoggedIn) {
      auth.logout();
      localStorage.removeItem("userid");
      localStorage.removeItem("role");
      toast.success("Logged Out Successfully");
      navigate("/");
    }
  };

  // const profileHandler = () => {};

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

              {Cookies.get('token') && <Link
                className="nav-link active"
                aria-current="page"
                to={destination}
              >
                Forms
              </Link>}
            </div>
            {localStorage.hasOwnProperty("userid") && Cookies.get('token') ? (
              <div className={classes.rightnavbar}>
                <Link
                  className={`${classes.logoutbutton}`}
                  onClick={logoutHandler}
                  aria-current="page"
                  to="/"
                >
                  <LuLogOut />
                </Link>

                <div className={classes.profileicon} onClick={()=> openModal()}>
                  <CgProfile size={27}/>
                </div>
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
      <Modal isOpen={modalOpen} onClose={closeModal}>
        <EditProfile
          id={localStorage.getItem('userid')}
          role={localStorage.getItem('role')}
          closeModal={closeModal}
        />
      </Modal>
    </nav>
  );
};

export default Navbar;
