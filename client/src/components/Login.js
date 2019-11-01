import React, { Fragment, useState } from "react";
import { Redirect } from "react-router-dom";
import { Form, Divider, Icon, Header, Input, Button } from "semantic-ui-react";
import "semantic-ui-css/semantic.min.css";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Login = ({ ...props }) => {


  const [state, setState] = useState({
    email: "",
    password: "",
    token: ""
  });

  const {  login, loggedIn } = props;

  const onSubmit = async e => {
    e.preventDefault();

    login(state);
  };

  const onChange = e => {
    setState({
      ...state,
      [e.target.name]: e.target.value
    });
  };
 if (loggedIn) {
    return <Redirect to="/Home" />;
  } else {
    return (
      <Fragment>
        <Form onSubmit={onSubmit}>
          <Icon name="user circle" size="massive" />
          <Header as="h1" dividing>
            Sign In
          </Header>
          <Form.Group block={"true"} widths="equal">
            <Form.Field>
              <Input
                icon="mail"
                onChange={onChange}
                iconPosition="left"
                name="email"
                type="text"
                id="email"
                value={state.email}
                placeholder="Email"
                required
              />
            </Form.Field>
          </Form.Group>
          <Form.Group widths="equal">
            <Form.Field>
              <Input
                onChange={onChange}
                name="password"
                icon="eye"
                iconPosition="left"
                type="password"
                value={state.password}
                placeholder="Password"
                min={5}
                required
              />
            </Form.Field>
          </Form.Group>
          <Divider></Divider>
          <Button primary fluid size="huge">
            Login
          </Button>
        </Form>
        <ToastContainer />
      </Fragment>
    );
  }
};

export default Login;
