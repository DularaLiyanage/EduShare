import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { Link } from 'react-router-dom';

const AuthLayout = ({ children, title, subtitle, linkText, linkPath }) => {
  return (
    <Container className="mt-5">
      <Row className="justify-content-center">
        <Col md={6} lg={5}>
          <div className="text-center mb-4">
            <h1>{title}</h1>
            <p className="text-muted">{subtitle}</p>
          </div>
          {children}
          <div className="text-center mt-3">
            <Link to={linkPath}>{linkText}</Link>
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default AuthLayout;