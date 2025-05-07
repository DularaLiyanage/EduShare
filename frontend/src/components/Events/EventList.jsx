import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Button } from 'react-bootstrap';
import EventCard from './EventCard';
import EventForm from './EventForm';
import EventDetail from './EventDetail';
import RegisterAttendeeForm from './AttendeeForm'; // Make sure this import is present
import axios from 'axios';
import '../../index.css';  // Default styles
import '../../App.css';

const EventList = () => {
  const [events, setEvents] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [currentEvent, setCurrentEvent] = useState(null);
  const [eventId, setEventId] = useState(null);
  const [showDetail, setShowDetail] = useState(false);
  const [showAddAttendeeModal, setShowAddAttendeeModal] = useState(false); // Added state for attendee modal

  const API_URL = 'http://localhost:8080/api/events';

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const response = await axios.get(API_URL);
      setEvents(response.data);
    } catch (error) {
      console.error('Error fetching events', error);
    }
  };

  const handleAddEvent = () => {
    setCurrentEvent(null);
    setShowForm(true);
  };

  const handleEditEvent = (eventId) => {
    const event = events.find(e => e.id === eventId);
    setCurrentEvent(event);
    setShowForm(true);
  };

  const handleDeleteEvent = async (eventId) => {
    if (window.confirm('Are you sure you want to delete this event?')) {
      try {
        await axios.delete(`${API_URL}/${eventId}`);
        fetchEvents();
      } catch (error) {
        console.error('Error deleting event', error);
      }
    }
  };

  const handleFormSubmit = async (eventData) => {
    try {
      if (currentEvent) {
        await axios.put(`${API_URL}/${currentEvent.id}`, eventData);
      } else {
        await axios.post(API_URL, eventData);
      }
      fetchEvents();
    } catch (error) {
      console.error('Error saving event', error);
    }
  };

  const handleViewEvent = (id) => {
    setEventId(id);
    setShowDetail(true);
  };

  const handleAddAttendee = (id) => { // Added function to show attendee modal
    setEventId(id);
    setShowAddAttendeeModal(true);
  };

  return (
    <div className="content-container">
      <Container>
        <Row className="d-flex justify-content-end mb-3">
          <Col xs="auto">
            <Button variant="primary" onClick={handleAddEvent}>Add New Event</Button>
          </Col>
        </Row>
        <Row>
          {events.length > 0 ? (
            events.map((event,index) => (
              <Col key={event.id} sm={12} className="mb-2">
                <EventCard
                  event={event}
                  index={index}
                  handleEdit={handleEditEvent}
                  handleDelete={handleDeleteEvent}
                  handleView={handleViewEvent}
                  handleAddAttendee={handleAddAttendee} // Pass the handler to the EventCard
                />
              </Col>
            ))
          ) : (
            <Col sm={12}>
              <p>No events available. Please add some events.</p>
            </Col>
          )}
        </Row>
        <EventForm
          show={showForm}
          handleClose={() => setShowForm(false)}
          handleSubmit={handleFormSubmit}
          event={currentEvent}
        />
        <EventDetail
          show={showDetail}
          handleClose={() => setShowDetail(false)}
          eventId={eventId}
        />
        <RegisterAttendeeForm
          show={showAddAttendeeModal}
          handleClose={() => setShowAddAttendeeModal(false)} // Handle closing the modal
          eventId={eventId}
        />
      </Container>
    </div>
  );
};

export default EventList;
