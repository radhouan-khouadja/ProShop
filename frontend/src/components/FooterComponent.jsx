import React from "react";
import { Container, Row, Col } from "react-bootstrap";

const FooterComponent = () => {
  return (
    <footer>
      <Container>
        <Row>
          <Col className="text-center py-3">Copright &copy; ProShop</Col>
        </Row>
      </Container>
    </footer>
  );
};

export default FooterComponent;
