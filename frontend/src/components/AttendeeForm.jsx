import React, { useState, useEffect } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import axios from 'axios';

const AttendeeForm = ({ show, handleClose, eventId }) => {
  const [attendeeData, setAttendeeData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phoneNumber: ''
  });

  const API_URL = 'http://localhost:8080/api/attendees';

  const handleChange = (e) => {
    const { name, value } = e.target;
    setAttendeeData({ ...attendeeData, [name]: value });
  };

  const submitForm = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${API_URL}/${eventId}`, attendeeData);
      handleClose();
    } catch (error) {
      console.error('Error adding attendee', error);
    }
  };

  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Add Attendee</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={submitForm}>
          <Form.Group controlId="formFirstName">
            <Form.Label>First Name</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter first name"
              name="firstName"
              value={attendeeData.firstName}
              onChange={handleChange}
            />
          </Form.Group>
          <Form.Group controlId="formLastName">
            <Form.Label>Last Name</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter last name"
              name="lastName"
              value={attendeeData.lastName}
              onChange={handleChange}
            />
          </Form.Group>
          <Form.Group controlId="formEmail">
            <Form.Label>Email</Form.Label>
            <Form.Control
              type="email"
              placeholder="Enter email"
              name="email"
              value={attendeeData.email}
              onChange={handleChange}
            />
          </Form.Group>
          <Form.Group controlId="formPhoneNumber">
            <Form.Label>Phone Number</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter phone number"
              name="phoneNumber"
              value={attendeeData.phoneNumber}
              onChange={handleChange}
            />
          </Form.Group>
          <Button variant="primary" className="mb-2" type="submit">
            Submit
          </Button>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default AttendeeForm;
