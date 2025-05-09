import React, { useState, useEffect } from 'react';
import { Modal, Button, ListGroup, Spinner } from 'react-bootstrap';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const EventCalendar = () => {
  const [date, setDate] = useState(new Date());
  const [events, setEvents] = useState([]);
  const [selectedDateEvents, setSelectedDateEvents] = useState([]);
  const [showEventsModal, setShowEventsModal] = useState(false);
  const [hoveredDateEvents, setHoveredDateEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await axios.get('http://localhost:8080/api/events');
        setEvents(response.data);
      } catch (error) {
        setError("Error fetching events. Please try again later.");
        console.error('Error fetching events', error);
      } finally {
        setLoading(false);
      }
    };
    fetchEvents();
  }, []);

  const handleDateChange = (newDate) => {
    setDate(newDate);
    const selectedDateString = newDate.toISOString().split('T')[0];
    const eventsOnSelectedDate = events.filter(event => {
      return event.date.split('T')[0] === selectedDateString;
    });
    setSelectedDateEvents(eventsOnSelectedDate);
    setShowEventsModal(eventsOnSelectedDate.length > 0);
  };

  const handleMouseOver = (date) => {
    const selectedDateString = date.toISOString().split('T')[0];
    const eventsOnSelectedDate = events.filter(event => event.date.split('T')[0] === selectedDateString);
    setHoveredDateEvents(eventsOnSelectedDate);
  };

  const closeEventsModal = () => setShowEventsModal(false);

  const handleViewEvent = (eventId) => {
    closeEventsModal();
    console.log('Calendar: Navigating to event detail page for ID:', eventId);
    navigate(`/events/${eventId}`);
  };

  if (loading) {
    return (
      <div className="loading-container d-flex justify-content-center align-items-center" style={{ minHeight: '50vh' }}>
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-message alert alert-danger">
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div className="event-calendar container mt-4">
      <h2 className="mb-4">Event Calendar</h2>
      <div className="calendar-container">
        <Calendar
          onChange={handleDateChange}
          value={date}
          tileClassName={({ date, view }) => {
            const eventDates = events.map(event => event.date.split('T')[0]);
            return eventDates.includes(date.toISOString().split('T')[0]) ? 'event-day' : '';
          }}
          onClickDay={handleDateChange}
          tileContent={({ date, view }) => {
            const dateStr = date.toISOString().split('T')[0];
            const dateEvents = events.filter(event => event.date.split('T')[0] === dateStr);
            return dateEvents.length > 0 ? (
              <div className="event-indicator">
                <span className="event-dot"></span>
              </div>
            ) : null;
          }}
        />
      </div>

      <div className="hovered-events mt-3">
        {hoveredDateEvents.length > 0 && (
          <div className="card p-2">
            <h5>Events on this day:</h5>
            <ul className="list-unstyled">
              {hoveredDateEvents.map(event => (
                <li key={event.id}>{event.name}</li>
              ))}
            </ul>
          </div>
        )}
      </div>

      <Modal show={showEventsModal} onHide={closeEventsModal} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Events on {date.toLocaleDateString()}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedDateEvents.length > 0 ? (
            <ListGroup>
              {selectedDateEvents.map((event) => (
                <ListGroup.Item key={event.id}>
                  <h5>{event.name}</h5>
                  <p>{event.description}</p>
                  <Button variant="info" onClick={() => handleViewEvent(event.id)}>
                    View Event
                  </Button>
                </ListGroup.Item>
              ))}
            </ListGroup>
          ) : (
            <p>No events for this day.</p>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={closeEventsModal}>Close</Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default EventCalendar;