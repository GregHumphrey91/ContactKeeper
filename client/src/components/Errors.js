import React from "react";
import {
  Container,
  Button,
  Divider,
  Header,
  Segment
} from "semantic-ui-react";

const Errors = ({ ...props }) => {
  const { errors, goBack } = props;

  return (
    <Container>
      <Segment style={{ margin: "200px auto" }} padded="very" size="massive">
        <Header textAlign="left" as="h1">
          Error
        </Header>

        <Divider></Divider>
        <h2>{errors}</h2>
      </Segment>

      <Button className="btn-error" size="massive" onClick={goBack}>
        Return
      </Button>
    </Container>
  );
};

export default Errors;
