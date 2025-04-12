import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Button } from 'react-bootstrap';
import EventCard from './EventCard';
import EventForm from './EventForm';
import EventDetail from './EventDetail';
import RegisterAttendeeForm from './AttendeeForm';
import axios from 'axios';

const EventList = () => {
  const [events, setEvents] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [currentEvent, setCurrentEvent] = useState(null);
  const [eventId, setEventId] = useState(null);
  const [showDetail, setShowDetail] = useState(false);
  const [showAddAttendeeModal, setShowAddAttendeeModal] = useState(false);

  const API_URL = 'http://localhost:8080/api/events';

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const response = await axios.get(API_URL);
      setEvents(response.data);
      console.log(response)
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

  const handleAddAttendee = (eventId) => {
    setEventId(eventId);
    setShowAddAttendeeModal(true);
  }

  return (
    <Container>
      <Row className="d-flex justify-content-end mb-3">
        <Col xs="auto">
            <Button variant="primary" onClick={handleAddEvent}>Add New Event</Button>
        </Col>
    </Row>
      <Row>
        {events.map(event => (
          <Col key={event.id} sm={12} md={12} lg={12} className="mb-2">
            <EventCard
              event={event}
              handleEdit={handleEditEvent}
              handleDelete={handleDeleteEvent}
              handleView={handleViewEvent}
              handleAddAttendee={handleAddAttendee}
            />
          </Col>
        ))}
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
         handleClose={() => setShowAddAttendeeModal(false)}
         eventId={eventId}
      />
    </Container>
  );
};

export default EventList;
