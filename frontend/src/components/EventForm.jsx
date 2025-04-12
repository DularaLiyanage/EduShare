import React, { useState,  useEffect } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';

const EventForm = ({ show, handleClose, handleSubmit, event }) => {
  const [eventData, setEventData] = useState(event || {
    name: '',
    description: '',
    date: '',
    location: ''
  });



  const handleChange = (e) => {
    const { name, value } = e.target;
    setEventData({ ...eventData, [name]: value });
  };

  const submitForm = (e) => {
    e.preventDefault();
    handleSubmit(eventData);
    handleClose();
  };
  

  useEffect(() => {
    if (event) {
      setEventData(event);
    }else{
        setEventData({ name: '', description: '', date: '', location: '' });
    }
  }, [event]);




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
            />
          </Form.Group>
          <Form.Group controlId="formDate">
            <Form.Label>Date</Form.Label>
            <Form.Control
              type="date"
              name="date"
              value={eventData.date}
              onChange={handleChange}
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

export default EventForm;
