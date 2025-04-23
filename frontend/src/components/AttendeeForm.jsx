import React, { useState, useEffect } from 'react';
import { Modal, Button, Form, Alert } from 'react-bootstrap';
import axios from 'axios';

const AttendeeForm = ({ show, handleClose, eventId }) => {
  const [attendeeData, setAttendeeData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phoneNumber: ''
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const BASE_URL = 'http://localhost:8080/api';

  // Reset form data when the modal is opened
  useEffect(() => {
    if (show) {
      setAttendeeData({
        firstName: '',
        lastName: '',
        email: '',
        phoneNumber: ''
      });
      setError('');
      setSuccess(false);
    }
  }, [show]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setAttendeeData({ ...attendeeData, [name]: value });
  };

  const submitForm = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess(false);
    
    try {
      // First create the attendee
      const attendeeResponse = await axios.post(`${BASE_URL}/attendees`, attendeeData);
      const attendeeId = attendeeResponse.data.id;
      
      // Then register the attendee to the event
      await axios.post(`${BASE_URL}/events/${eventId}/attendees/${attendeeId}`);
      
      setSuccess(true);
      
      // Reset form after successful submission
      setAttendeeData({
        firstName: '',
        lastName: '',
        email: '',
        phoneNumber: ''
      });
      
      // Close modal after a short delay to show success message
      setTimeout(() => {
        handleClose();
      }, 1500);
      
    } catch (error) {
      console.error('Error adding attendee', error);
      setError('Failed to register attendee. Please try again.');
    }
  };

  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Register for Event</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {error && <Alert variant="danger">{error}</Alert>}
        {success && <Alert variant="success">Successfully registered for the event!</Alert>}
        
        <Form onSubmit={submitForm}>
          <Form.Group className="mb-3" controlId="formFirstName">
            <Form.Label>First Name</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter first name"
              name="firstName"
              value={attendeeData.firstName}
              onChange={handleChange}
              required
            />
          </Form.Group>
          
          <Form.Group className="mb-3" controlId="formLastName">
            <Form.Label>Last Name</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter last name"
              name="lastName"
              value={attendeeData.lastName}
              onChange={handleChange}
              required
            />
          </Form.Group>
          
          <Form.Group className="mb-3" controlId="formEmail">
            <Form.Label>Email</Form.Label>
            <Form.Control
              type="email"
              placeholder="Enter email"
              name="email"
              value={attendeeData.email}
              onChange={handleChange}
              required
            />
          </Form.Group>
          
          <Form.Group className="mb-3" controlId="formPhoneNumber">
            <Form.Label>Phone Number</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter phone number"
              name="phoneNumber"
              value={attendeeData.phoneNumber}
              onChange={handleChange}
              required
            />
          </Form.Group>
          
          <Button variant="primary" type="submit">
            Register
          </Button>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default AttendeeForm;