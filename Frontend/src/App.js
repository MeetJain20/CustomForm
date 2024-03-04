import "./App.css";
// import Navbar from "./components/Navbar/Navbar";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useCallback, useState, useEffect } from "react";
import { AuthContext } from "./context/authcontext";
import { SignUp, Login, LandingPage, Navbar } from "./components/index";
import Cookies from "js-cookie";

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  // const [LoggedIn, setLoggedIn] = useState(false);
  const [userId, setuserId] = useState("");
  // const [userNumber, setuserNumber] = useState(0);

  const login = useCallback((uid, role, token) => {
    localStorage.setItem("userid", uid);
    localStorage.setItem("role", role);
    Cookies.set("token", token, { expires: 1 });
    setIsLoggedIn(true);
    setuserId(localStorage.getItem("userid"));
  }, []);

  const logout = useCallback(() => {
    setIsLoggedIn(false);
    setuserId(null);
    Cookies.remove('token');
  }, []);

  useEffect(() => {
    if (localStorage.hasOwnProperty("userid")) {
      setuserId(localStorage.getItem("userid"));
      setIsLoggedIn(true);
    }
  }, []);

  let routes;
  if (isLoggedIn) {
    routes = (
      <Router>
        <Routes>
          {/* {localStorage.getItem("role") == "customer" ? (<Route path="/" element={<Homepage />} />) : (<Route path="/" element={<Homepagem />} />)}  */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/landingpage" element={<LandingPage />} />
        </Routes>
      </Router>
    );
  } else {
    routes = (
      <Router>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          {/* <Route path="/landingpage" element={<Login />} /> */}
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<SignUp />} />
          {/* <Route path="/login" element={<><Navbar /><Login /></>} /> */}
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
