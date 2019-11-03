import React, { Fragment, useState } from "react";
import { Redirect } from "react-router-dom";
import { Header, Button, Radio, Label, Icon, Form } from "semantic-ui-react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Axios from "axios";

// Edit Contact Component

const Contact = ({ ...props }) => {
  const { name, phone, email, type, user, _id } = props.location.state.contact;

  const [state, setState] = useState({
    email: email,
    name: name,
    phone: phone,
    type: type,
    user: user,
    _id: _id,
    finishedEditing: false
  });

  // Event listeners ===================
  const onChange = e => {
    setState({
      ...state,
      [e.target.name]: e.target.value
    });
  };
  const onSelect = (e, data) => {
    setState(prevState => ({
      ...state,
      type: data.name
    }));
  };

  const goBack = () => {
    setState(prevState => ({
      ...state,
      finishedEditing: !prevState.finishedEditing
    }));
  };

  const onSubmit = async e => {
    e.preventDefault();
    try {
      await Axios({
        method: "put",
        url: `http://localhost:5000/api/contacts/${state._id}`,
        data: state,
        headers: {
          "x-auth-token": localStorage.getItem("LoginToken")
        }
      });
      toast.success("Contact Updated!", { autoClose: 2000 });
    } catch (err) {
      toast.error(err.message);
    }
  };
  // =============================

  if (state.finishedEditing) {
    return <Redirect to={{ pathname: "/Home" }} />;
  } else {
    return (
      <Fragment>
        <Form
          className="edit-contact"
          onSubmit={onSubmit}
          style={{ textAlign: "left" }}
        >
          <Header as="h1">
            <Icon size="massive" name="edit outline" />
            Edit Contact
          </Header>
          <Form.Group widths="equal">
            <Form.Field onChange={onChange}>
              <Label size="large">
                <Icon name="address card outline" />
                Contact Name
              </Label>
              <Form.Input name="name" value={state.name} />
            </Form.Field>
            <Form.Field onChange={onChange}>
              <Label size="large">
                <Icon name="mail" />
                Email Address
              </Label>
              <Form.Input name="email" value={state.email} type="text" />
            </Form.Field>
            <Form.Field onChange={onChange}>
              <Label size="large">
                <Icon name="phone" />
                Phone Number
              </Label>
              <Form.Input name="phone" value={state.phone} type="phone" />
            </Form.Field>
          </Form.Group>
          <Label size="large">
            <Icon name="check circle" />
            Type
          </Label>
          <Form.Group width="equal">
            <Form.Field
              control={Radio}
              label="Personal"
              name="personal"
              checked={state.type === "personal"}
              onChange={onSelect}
            />
            <Form.Field
              control={Radio}
              label="Business"
              name="business"
              checked={state.type === "business"}
              onChange={onSelect}
            />
            <Form.Field
              label="Other"
              control={Radio}
              name="other"
              checked={state.type === "other"}
              onChange={onSelect}
            />
          </Form.Group>
          <Form.Button
            style={{ marginTop: "20px " }}
            className="edit-submit"
            fluid
            color="green"
            size="huge"
          >
            Update
          </Form.Button>
          <Button fluid size="huge" color="black" onClick={goBack}>
            Return
          </Button>
        </Form>
        <ToastContainer />
      </Fragment>
    );
  }
};

export default Contact;
