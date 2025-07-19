import React from "react";
import { Container, Spinner } from "react-bootstrap";

const Loading = () => {
  return (
    <Container className="text-center my-5">
      <Spinner animation="border" role="status" />
    </Container>
  );
};

export default Loading;
