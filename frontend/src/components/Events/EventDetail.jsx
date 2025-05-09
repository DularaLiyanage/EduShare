import React, { useState, useEffect } from 'react';
import { Container, Card, Button, ListGroup, Spinner, Alert } from 'react-bootstrap';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

const EventDetail = () => {
  const { eventId } = useParams();  // Fetch the eventId from URL params
  const [event, setEvent] = useState(null);
  const [attendees, setAttendees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (!eventId) {
      navigate('/events'); // Redirect to events list if eventId is missing
      return;
    }

    const fetchEventDetails = async () => {
      try {
        setLoading(true);
        
        // Fetch event details
        const eventResponse = await axios.get(`http://localhost:8080/api/events/${eventId}`);
        setEvent(eventResponse.data);
        
        // Fetch attendees
        const attendeesResponse = await axios.get(`http://localhost:8080/api/events/${eventId}/attendees`);
        setAttendees(attendeesResponse.data);
      } catch (error) {
        setError('Failed to load event details. Please try again later.');
        console.error('Error fetching event details:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchEventDetails();
  }, [eventId, navigate]);

  const handleBack = () => {
    navigate(-1); // Go back to the previous page
  };

  if (loading) {
    return (
      <Container className="d-flex justify-content-center align-items-center" style={{ minHeight: '50vh' }}>
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
      </Container>
    );
  }

  if (error) {
    return (
      <Container className="mt-4">
        <Alert variant="danger">{error}</Alert>
        <Button variant="secondary" onClick={handleBack}>Go Back</Button>
      </Container>
    );
  }

  if (!event) {
    return (
      <Container className="mt-4">
        <Alert variant="warning">Event not found</Alert>
        <Button variant="secondary" onClick={handleBack}>Go Back</Button>
      </Container>
    );
  }

  const formattedDate = new Date(event.date).toLocaleString();

  return (
    <Container className="mt-4">
      <Card>
        <Card.Header className="d-flex justify-content-between align-items-center">
          <h2>{event.name}</h2>
          <Button variant="outline-secondary" onClick={handleBack}>Back</Button>
        </Card.Header>
        <Card.Body>
          <Card.Title>Event Details</Card.Title>
          
          <div className="mb-4">
            <h5>Description</h5>
            <p>{event.description}</p>
          </div>
          
          <div className="mb-4">
            <h5>Date & Time</h5>
            <p>{formattedDate}</p>
          </div>
          
          <div className="mb-4">
            <h5>Location</h5>
            <p>{event.location}</p>
          </div>
          
          <div className="mb-4">
            <h5>Attendees</h5>
            {attendees.length > 0 ? (
              <ListGroup>
                {attendees.map((attendeeData, index) => {
                  const attendee = attendeeData.attendee;
                  return (
                    <ListGroup.Item key={attendee.id}>
                      {index + 1}. {attendee.firstName} {attendee.lastName} - {attendee.email} - {attendee.phoneNumber}
                    </ListGroup.Item>
                  );
                })}
              </ListGroup>
            ) : (
              <p>No attendees yet</p>
            )}
          </div>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default EventDetail;
