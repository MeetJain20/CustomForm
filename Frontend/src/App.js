import "./App.css";
// import Navbar from "./components/Navbar/Navbar";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useNavigate,
  Navigate
} from "react-router-dom";
import { useCallback, useState, useEffect } from "react";
import { AuthContext } from "./context/authcontext";
import {
  SignUp,
  Login,
  LandingPage,
  MakeForm,
  DisplayForm,
} from "./components/index";
import Cookies from "js-cookie";
import {
  AdminDashboard,
  EmployeeDashboard,
} from "./components/DashBoard/index";
import DisplayResponse from "./components/DisplayForm/components/DisplayResponse";
import Error from "./components/Reusable/Error.js";

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userId, setUserId] = useState("");

  const login = useCallback((uid, role, token) => {
    localStorage.setItem("userid", uid);
    localStorage.setItem("role", role);
    Cookies.set("token", token, { expires: 1 });
    // tokenid
    setIsLoggedIn(true);
    setUserId(localStorage.getItem("userid"));
  }, []);

  const logout = useCallback(() => {
    setIsLoggedIn(false);
    setUserId(null);
    Cookies.remove("token");
  }, []);

  useEffect(() => {
    if (localStorage.hasOwnProperty("userid")) {
      setUserId(localStorage.getItem("userid"));
      setIsLoggedIn(true);
    }
    const token = Cookies.get("token");
    if (!token) {
      localStorage.removeItem("userid");
      localStorage.removeItem("role");
      logout();
    }
  }, [isLoggedIn]);

  let routes;
  if (isLoggedIn) {
    routes = (
      <Router>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LandingPage />} />
          <Route path="/signup" element={<LandingPage />} />
          <Route path="/landingpage" element={<LandingPage />} />
          <Route path="/createform/:formid" element={localStorage.getItem('role')==='admin' ? <MakeForm /> : <Navigate to="/error" />} />
          <Route path="/displayform/:formid" element={<DisplayForm />} />
          <Route path="/admindashboard" element={localStorage.getItem('role')==='admin' ? <AdminDashboard /> : <Navigate to="/error" />} />
          <Route path="/employeedashboard" element={<EmployeeDashboard />} />
          <Route path="/viewresponse/:formid" element={localStorage.getItem('role')==='admin' ? <DisplayResponse /> : <Navigate to="/error" />} />
          <Route path="*" element={<Error />} />
        </Routes>
      </Router>
    );
  } else {
    routes = (
      <Router>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/landingpage" element={<LandingPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/admindashboard" element={<Login />} />
          <Route path="/employeedashboard" element={<Login />} />
          <Route path="/createform/:formid" element={<Login />} />
          <Route path="/displayform/:formid" element={<Login />} />
          <Route path="/viewresponse/:formid" element={<Login />} />
          <Route path="*" element={<Error />} />
        </Routes>
      </Router>
    );
  }

  return (
    <>
      <AuthContext.Provider
        value={{
          isLoggedIn: isLoggedIn,
          userId: userId,
          login: login,
          logout: logout,
        }}
      >
        <main>{routes}</main>
      </AuthContext.Provider>
    </>
  );
}

export default App;
