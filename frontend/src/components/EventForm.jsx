import React, { useState, useEffect } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import axios from 'axios';

const EventForm = ({ show, handleClose, handleSubmit, event }) => {
  const [eventData, setEventData] = useState({
    name: '',
    description: '',
    date: '',
    location: ''
  });

  useEffect(() => {
    if (event) {
      // For existing events, we need to format the date from the backend
      let formattedDate = '';
      if (event.date) {
        // If the date is a full ISO string, get just the date part
        const dateObj = new Date(event.date);
        formattedDate = dateObj.toISOString().split('T')[0];
      }
      
      setEventData({
        name: event.name || '',
        description: event.description || '',
        date: formattedDate || '',
        location: event.location || ''
      });
    } else {
      // Reset form for new event
      setEventData({
        name: '',
        description: '',
        date: '',
        location: ''
      });
    }
  }, [event]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEventData({ ...eventData, [name]: value });
  };

  const submitForm = (e) => {
    e.preventDefault();
    
    // Create a copy of the form data
    const formattedData = { ...eventData };
    
    // Format the date string to a valid LocalDateTime format for the backend
    if (formattedData.date) {
      // Append time to make it a valid LocalDateTime (set to noon)
      formattedData.date = `${formattedData.date}T12:00:00`;
    }
    
    handleSubmit(formattedData);  // Send the formatted data
    handleClose();  // Close the modal
  };

  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>{event ? 'Edit Event' : 'Add New Event'}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={submitForm}>
          <Form.Group controlId="formEventName">
            <Form.Label>Event Name</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter event name"
              name="name"
              value={eventData.name}
              onChange={handleChange}
              required
            />
          </Form.Group>
          <Form.Group controlId="formDescription">
            <Form.Label>Description</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              placeholder="Enter event description"
              name="description"
              value={eventData.description}
              onChange={handleChange}
              required
            />
          </Form.Group>
          <Form.Group controlId="formDate">
            <Form.Label>Date</Form.Label>
            <Form.Control
              type="date"
              name="date"
              value={eventData.date}
              onChange={handleChange}
              required
            />
          </Form.Group>
          <Form.Group controlId="formLocation">
            <Form.Label>Location</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter event location"
              name="location"
              value={eventData.location}
              onChange={handleChange}
              required
            />
          </Form.Group>
          <Button variant="primary" className="mt-3" type="submit">
            Submit
          </Button>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default EventForm;