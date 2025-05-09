import React from 'react';
import { Card, Button, Row, Col } from 'react-bootstrap';
import { FaEdit, FaTrashAlt, FaEye, FaUserPlus } from 'react-icons/fa'; // Added icons for buttons

const EventCard = ({ event, index, handleEdit, handleDelete, handleView, handleAddAttendee }) => (
  <Card className="event-card" style={{ width: '100%', borderRadius: '10px', boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)', transition: 'transform 0.3s ease-in-out' }} 
    onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.05)'} 
    onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'} >
    <Card.Body>
      <Row>
        <Col className="d-flex justify-content-start">
          <Card.Title>{index + 1}. {event.name}</Card.Title>
        </Col>
        <Col className="d-flex justify-content-end">
          <Button 
            variant="info" 
            className="m-1" 
            onClick={() => handleView(event.id)}  // Ensure handleView is called correctly
            title="View Event"
            style={{ borderRadius: '50%' }}
          >
            <FaEye />
          </Button>
          <Button 
            variant="warning" 
            className="m-1" 
            onClick={() => handleEdit(event.id)} 
            title="Edit Event"
            style={{ borderRadius: '50%' }}
          >
            <FaEdit />
          </Button>
          <Button 
            variant="danger" 
            className="m-1" 
            onClick={() => handleDelete(event.id)} 
            title="Delete Event"
            style={{ borderRadius: '50%' }}
          >
            <FaTrashAlt />
          </Button>
          <Button 
            variant="success" 
            className="m-1" 
            onClick={() => handleAddAttendee(event.id)} 
            title="Add Attendee"
            style={{ borderRadius: '50%' }}
          >
            <FaUserPlus />
          </Button>
        </Col>
      </Row>
      <Row>
        <Col><strong>Date:</strong> {event.date}</Col>
      </Row>
      <Row>
        <Col><strong>Location:</strong> {event.location}</Col>
      </Row>
    </Card.Body>
  </Card>
);

export default EventCard;
