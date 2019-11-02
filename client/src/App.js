import React, { useState, useEffect } from "react";
import { BrowserRouter, Route } from "react-router-dom";
import axios from "axios";

// COMPONENTS
import Spinner from "./img/spinner.gif";
import Login from "./components/Login";
import Home from "./components/Home";
import EditContact from "./components/Contact";
import Register from "./components/Register";
import Errors from "./components/Errors";
// SEMANTIC
import { Container } from "semantic-ui-react";
import NavBar from "./components/Layout/Header";
// CSS
import "./css/Style.css";
import "semantic-ui-css/semantic.min.css";

import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { success } from "./Utils/Notify";
import moment from "moment";

import jwtDecode from "jwt-decode";

export const App = props => {
  const [state, setState] = useState({
    loginToken: "",
    registerToken: "",
    user: "",
    loggedIn: false
  });

  const [error, setError] = useState({
    isErrors: false,
    errors: ""
  });

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    checkToken();
  }, [state.loggedIn]);

  // MAKE A CHECK WHEN SWITCHING TO DIFFERENT ROUTES
  useEffect(() => {
    checkToken();
  }, []);

  // CHECKS JWT EXPIRATION DATE
  const checkToken = () => {
    const token = localStorage.getItem("LoginToken");
    if (token) {
      const unixToday = Date.now();
      const today = moment(unixToday).format("MM/DD/YYYY HH:mm:ss");

      const decodeToken = jwtDecode(token);
      const {
        user: { id, name },
        exp
      } = decodeToken;
      const tokenExpires = moment.unix(exp).format("MM/DD/YYYY HH:mm:ss");

      if (today >= tokenExpires) {
        return setState({ ...state, loggedIn: false });
      } else {
        setState({ ...state, loggedIn: true });
      }
    }
  };

  // LOGS OUT THE USER
  const logOut = () => {
    localStorage.removeItem("LoginToken");
    setState({ ...state, loggedIn: false });
  };

  // LOGS IN THE USER
  const login = async loginState => {
    const { name, password, email } = loginState;

    try {
      const response = await axios.post("/api/auth", {
        name,
        password,
        email
      });
      const data = await response.data;
      await localStorage.setItem("LoginToken", data.token);
      await setState({ ...state, loggedIn: true });
    } catch (error) {
      toast.error(error.response.data.msg);
    }
  };

  const register = async registerState => {
    try {
      const { name, password, email } = registerState;
      await axios.post("/api/users", {
        name,
        password,
        email
      });

      success("User Created");
    } catch (error) {
      toast.error(error.response.data.msg);
    }
  };

  const showErrors = error => {
    setError({
      isErrors: true,
      errors: error.message
    });
  };
  const goBack = () => {
    setError({
      isErrors: false,
      errors: ""
    });
  };

  if (error.isErrors) {
    return <Errors errors={error.errors} goBack={goBack} />;
  } else if (loading) {
    return (
      <div>
        <img
          style={{ width: "600px" }}
          alt="Loading"
          title="Loading"
          src={Spinner}
        />
        <h1>Brb</h1>
      </div>
    );
  } else {
    return (
      <BrowserRouter>
        <>
          <Container fluid>
            <NavBar logOut={logOut} loggedIn={state.loggedIn} {...props} />
            <Route
              exact
              path="/Home"
              render={() => (
                <Home
                  setLoading={setLoading}
                  loggedIn={state.loggedIn}
                  checkToken={checkToken}
                  showErrors={showErrors}
                />
              )}
            />
            <Route exact path="/edit/:id" component={EditContact} />
            <Route
              exact
              path="/"
              render={() => (
                <Login
                  checkToken={checkToken}
                  login={login}
                  setError={setError}
                  loggedIn={state.loggedIn}
                  {...props}
                />
              )}
            />
            <Route
              exact
              path="/Register"
              render={() => (
                <Register
                  setError={setError}
                  register={register}
                  checkToken={checkToken}
                  {...props}
                />
              )}
            />
            <ToastContainer />
          </Container>
        </>
      </BrowserRouter>
    );
  }
};

export default App;
