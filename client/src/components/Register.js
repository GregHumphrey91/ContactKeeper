import React, { Fragment, useState } from "react";

import { Form, Divider, Icon, Header, Input, Button } from "semantic-ui-react";
import "semantic-ui-css/semantic.min.css";
import { ToastContainer, toast } from "react-toastify";

const Register = ({ ...props }) => {
  const [state, setState] = useState({
    name: "",
    email: "",
    password: "",
    password2: ""
  });

  const { register } = props;

  const onSubmit = async e => {
    e.preventDefault();

    try {
      if (state.password === state.password2) {
        await register(state);
      } else {
        toast.error("Passwords Must Match !");
      }
    } catch (error) {
      toast.error(error.response.data.msg);
    }
  };

  const onChange = e => {
    setState({
      ...state,
      [e.target.name]: e.target.value
    });
  };

  return (
    <Fragment>
      <Form action="" onSubmit={onSubmit}>
        <Icon name="user plus" size="massive" />
        <Header as="h1" dividing>
          Registration
        </Header>
        <Form.Group block={"true"} widths="equal">
          <Form.Field>
            <Input
              icon="user"
              onChange={onChange}
              iconPosition="left"
              name="name"
              type="text"
              id="name"
              type="text"
              value={state.name}
              placeholder="Username"
            />
          </Form.Field>
          <Form.Field>
            <Input
              icon="mail"
              onChange={onChange}
              iconPosition="left"
              name="email"
              type="mail"
              id="email"
              value={state.email}
              placeholder="Email"
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
            />
          </Form.Field>
          <Form.Field>
            <Input
              onChange={onChange}
              name="password2"
              icon="eye"
              iconPosition="left"
              type="password"
              value={state.password2}
              placeholder="Re-Enter Password"
            />
          </Form.Field>
        </Form.Group>
        <Divider></Divider>
        <Button primary fluid size="huge">
          Sign Up
        </Button>
      </Form>
      <ToastContainer />
    </Fragment>
  );
};

export default Register;
