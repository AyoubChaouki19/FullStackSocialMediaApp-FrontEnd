//Imports
import React, { useEffect } from "react";
import Home from "./pages/Home";
import "./App.css";
import { BrowserRouter as Router, Route, Link, Routes } from "react-router-dom";
import CreatePost from "./pages/CreatePost";
import Post from "./pages/Post";
import Login from "./pages/Login";
import Registration from "./pages/Registration";
import { AuthContext } from "./helpers/AuthContext";
import { useState } from "react";
import axios from "axios";
//Main functions
function App() {
  const [authState, setAuthState] = useState({
    username: "",
    id: 0,
    status: false,
  });
  //authState:Status of user (logged in or no)
  //setAuthState: Helps use to change the status of user
  //Status initialized as NOT LOGGED IN

  useEffect(() => {
    axios
      .get("http://localhost:3004/auth/validate", {
        headers: { accessToken: localStorage.getItem("accessToken") },
      })
      .then((response) => {
        if (response.data.error) {
          setAuthState({
            ...authState,
            status: false,
          });
        } else {
          setAuthState({
            username: response.data.username,
            id: response.data.id,
            status: true,
          });
        }
      });
  }, [authState.status]);
  const handleLogout = () => {
    localStorage.removeItem("accessToken");
    setAuthState({
      ...authState,
      status: false,
    });
  };
  return (
    <div className="App">
      <AuthContext.Provider value={{ authState, setAuthState }}>
        <Router>
          <div className="linkDiv">
            {/* (true) && (true) */}
            {/* (false) && (false) */}
            {!authState.status && (
              <>
                {" "}
                <Link to="/login" className="Link">
                  Login
                </Link>
                <Link to="/registration" className="Link">
                  Registration
                </Link>
              </>
            )}
            {authState.status && (
              <>
                <div className="menu">
                  <div className="leftSection">
                    <Link to="/createpost" className="Link">
                      Create A Post
                    </Link>

                    <Link className="Link" to="/">
                      Home Page
                    </Link>
                    <Link className="Link" onClick={handleLogout} to="/login">
                      Log Out
                    </Link>
                  </div>
                  <div className="introductionProfile">
                    <span className="menuImage"></span>
                    <div className="menuUsername">{authState.username}</div>
                  </div>
                </div>
              </>
            )}
          </div>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/createpost" element={<CreatePost />} />
            <Route path="/post/:id" element={<Post />} />
            <Route path="/login" element={<Login />} />
            <Route path="/registration" element={<Registration />} />
          </Routes>
        </Router>
      </AuthContext.Provider>
    </div>
  );
}
export default App;
