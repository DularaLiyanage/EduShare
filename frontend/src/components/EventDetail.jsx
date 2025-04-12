import React, { useState, useEffect } from 'react';
import { Modal, Button, ListGroup } from 'react-bootstrap';
import axios from 'axios';

const EventDetail = ({ show, handleClose, eventId }) => {
  const [event, setEvent] = useState(null);
  const [attendees, setAttendees] = useState([]);

  useEffect(() => {
    if (show) {
      fetchEventDetails();
      fetchAttendees();
    }
  }, [show]);

  const fetchEventDetails = async () => {
    try {
      const response = await axios.get(`http://localhost:8080/api/events/${eventId}`);
      setEvent(response.data);
    } catch (error) {
      console.error('Error fetching event details', error);
    }
  };

  const fetchAttendees = async () => {
    try {
      const response = await axios.get(`http://localhost:8080/api/events/${eventId}/attendees`);
      setAttendees(response.data);
    } catch (error) {
      console.error('Error fetching attendees', error);
    }
  };

  return (
    <Modal show={show} onHide={handleClose} size="lg">
      <Modal.Header closeButton>
        <Modal.Title>Event Details</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {event && (
          <>
            <h5>Name</h5>
            <p>{event.name}</p>
            <h5>Description</h5>
            <p>{event.description}</p>
            <h5>Date</h5>
            <p>{event.date}</p>
            <h5>Location</h5>
            <p>{event.location}</p>
            <h5>Attendees</h5>
            {attendees.length > 0 ? (
              <ListGroup>
                {attendees.map((attendee , index) => (
                  <ListGroup.Item key={attendee.id}>
                    {index+1}. {attendee.firstName} {attendee.lastName} - {attendee.email} - {attendee.phoneNumber}
                  </ListGroup.Item>
                ))}
              </ListGroup>
            ) : (
              <p>No attendees yet</p>
            )}
          </>
        )}
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>Close</Button>
      </Modal.Footer>
    </Modal>
  );
};

export default EventDetail;
