import React, { Fragment, useState, useEffect } from "react";
import { Redirect } from "react-router-dom";
import decode from "jwt-decode";
import {
  Header,
  Segment,
  List,
  Button,
  Input,
  Divider,
  Radio,
  Label,
  Grid,
  Icon,
  Form
} from "semantic-ui-react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Axios from "axios";

const Home = ({ ...props }) => {
  const [state, setState] = useState({
    account: "",
    name: "",
    email: "",
    phone: "",
    type: "",
    user: "",
    refetch: false,
    edit: false,
    editContact: "",
    delete: false,
    deleteContact: ""
  });

  // Separate state for User's contacts
  const [contacts, setContacts] = useState({
    contacts: []
  });

  // For unsubscribing
  const source = Axios.CancelToken.source();

  //  Hooks =================================

  useEffect(() => {
    let isSubscribed = true;

    // Async/Await All Contacts CB
    const getContacts = async () => {
      try {
        const token = localStorage.getItem("LoginToken");
        const decodedToken = decode(token);
        const contacts = await Axios.get("/api/contacts", {
          headers: {
            "Content-Type": "application/json",
            "x-auth-token": token
          },
          cancelToken: source.token
        });
        // Gets all user's contacts
        if (contacts.data.UserContacts[0].name && isSubscribed) {
          setContacts({ contacts: contacts.data.UserContacts });
          setState({
            ...state,
            user: contacts.data.UserContacts[0].user,
            account: decodedToken.user.name
          });
          // If User has no contacts
        } else if (!contacts.data.UserContacts[0].name && isSubscribed) {
          setState({
            ...state,
            user: contacts.data.UserContacts[0].user,
            account: decodedToken.user.name
          });
        }
      } catch (err) {
        console.log(err.response.data);
      }
    };

    // Func Call
    getContacts();

    // Also check headers
    props.checkToken();
    return () => {
      // Unmount
      isSubscribed = false;
    };
  }, [state.refetch]);

  // Event Listeners =============================

  const onChange = e => {
    setState({
      ...state,
      [e.target.name]: e.target.value
    });
  };

  const onSelect = (e, data) => {
    setState({
      ...state,
      type: data.name
    });
  };

  const addContact = async e => {
    e.preventDefault();
    try {
      await Axios({
        method: "post",
        url: "/api/contacts",
        data: state,
        headers: {
          "x-auth-token": localStorage.getItem("LoginToken")
        }
      });

      setState(prevState => ({
        ...state,
        name: "",
        email: "",
        phone: "",
        type: "",
        refetch: !prevState.refetch
      }));
      toast.success("Contact Created", {
        autoClose: 2000,
        position: "top-right"
      });
    } catch (err) {
      toast.error(err.response.data.msg, {
        autoClose: 3000,
        position: "top-left"
      });
    }
  };

  const editContact = contact => {
    setState(prevState => ({
      ...state,
      editContact: contact,
      edit: !prevState.edit
    }));
  };

  const deleteContact = async contact => {
    try {
      const contacts = await Axios({
        method: "delete",
        url: `/api/contacts/${contact._id}`,
        headers: {
          "x-auth-token": localStorage.getItem("LoginToken")
        }
      });

      setContacts({
        ...state,
        contacts: contacts.data.UserContacts
      });
    } catch (err) {
      console.log(err.response.data);
    }
  };
  // =================================

  const allContacts = (contact, index) => {
    return (
      <List.Item padded="true" key={index} style={{ wordWrap: "break-word" }}>
        <List.Content>
          <List.Header as="a" style={{ marginBottom: "10px" }}>
            <Icon name="user" /> {contact.name}{" "}
            <Label
              color={contact.type === "personal" ? "green" : "blue"}
              pointing="left"
              size="large"
            >
              {contact.type}
            </Label>
          </List.Header>
          <List.Description>
            <Icon name="mail" />
            {contact.email}
          </List.Description>
          <List.Description style={{ marginBottom: "10px" }}>
            <Icon name="phone" />
            {contact.phone}
          </List.Description>
        </List.Content>
        <Button onClick={() => editContact(contact)} color="black">
          Edit
        </Button>
        <Button onClick={() => deleteContact(contact)} color="red">
          Delete
        </Button>
      </List.Item>
    );
  };

  const { name, email, phone, type } = state;
  if (!props.loggedIn) {
    return <Redirect to="/" />;
  } else if (state.edit) {
    return (
      <Redirect
        to={{
          pathname: `edit/${state.editContact._id}`,
          state: { contact: state.editContact }
        }}
      />
    );
  } else {
    return (
      <Fragment>
        <Grid columns={2} stackable padded>
          <Grid.Row>
            <Grid.Column textalign="left">
              <Segment className="addContact">
                <Header as="h1">
                  {state.account ? `Welcome ${state.account} !` : ""}
                </Header>
                <Form
                  onSubmit={addContact}
                  className="addContact"
                  textalign="left"
                >
                  <Header textalign="left">
                    <Icon name="add user" size="massive" />
                    ADD NEW CONTACT
                  </Header>
                  <Divider />
                  <Form.Field
                    onChange={onChange}
                    name="name"
                    control={Input}
                    label="Contact Name"
                    placeholder="Contact name"
                    type="text"
                    value={name}
                  />
                  <Form.Field
                    onChange={onChange}
                    name="email"
                    control={Input}
                    label="Email"
                    placeholder="Email Address"
                    type="mail"
                    value={email}
                  />
                  <Form.Field
                    name="phone"
                    onChange={onChange}
                    control={Input}
                    label="Phone Number"
                    placeholder="Phone Number"
                    type="phone"
                    value={phone}
                  />

                  <Label color="grey" pointing="below">
                    <Icon name="dot circle" />
                    Contact Type
                  </Label>

                  <Form.Field
                    control={Radio}
                    label="Personal"
                    name="personal"
                    checked={type === "personal"}
                    onChange={onSelect}
                  />
                  <Form.Field
                    control={Radio}
                    label="Business"
                    name="business"
                    checked={type === "business"}
                    onChange={onSelect}
                  />
                  <Form.Field
                    label="Other"
                    control={Radio}
                    name="other"
                    checked={type === "other"}
                    onChange={onSelect}
                  />
                  <Form.Field size="large" color="green" fluid control={Button}>
                    Add Contact
                  </Form.Field>
                </Form>
              </Segment>
            </Grid.Column>
            <Grid.Column>
              <Segment>
                <Header as="h1">
                  <Icon name="address card" />
                  {state.account ? `Your Contacts` : ""}
                </Header>
                <List size="massive" selection divided animated>
                  {contacts && contacts.contacts[0]
                    ? contacts.contacts.map((contact, index) =>
                        allContacts(contact, index)
                      )
                    : "No Contacts Yet..."}
                </List>
              </Segment>
            </Grid.Column>
          </Grid.Row>

          <Grid.Row></Grid.Row>
        </Grid>
        <ToastContainer />
      </Fragment>
    );
  }
};

export default Home;
