import React from "react";
import { Header, Icon } from "semantic-ui-react";
import { NavLink } from "react-router-dom";

const NavBar = ({ ...props }) => {
  return (
    <Header className="nav-header">
      <nav>
        <h1>
          <Icon size="large" name="book" />
          Contact Keeper
        </h1>
        {
          <NavLink exact to="/">
            {props && props.loggedIn ? "Home" : "Login"}
          </NavLink>
        }
        {props && !props.loggedIn ? (
          <NavLink to="/Register">Register</NavLink>
        ) : (
          ""
        )}
        {props && props.loggedIn ? (
          <button className="logOut" onClick={props.logOut}>
            Log Out
          </button>
        ) : (
          ""
        )}
      </nav>
    </Header>
  );
};

export default NavBar;
