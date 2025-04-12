import React from 'react';
import { Card, Button, Row , Col} from 'react-bootstrap';

const EventCard = ({ event, handleEdit, handleDelete, handleView, handleAddAttendee }) => (
  <Card style={{ width: '100%' }}>
    <Card.Body>
        <Row >
            <Col className='d-flex justify-content-start'>
                <Card.Title >{event.id}. {event.name} </Card.Title>
            </Col>
            <Col>
                <Button variant="primary" className="me-2" onClick={() => handleView(event.id)}>View Details</Button>
                <Button variant="secondary" className="me-2" onClick={() => handleEdit(event.id)}>Edit</Button>
                <Button variant="danger" className="me-2" onClick={() => handleDelete(event.id)}>Delete</Button>
                <Button variant="success" className="me-2" onClick={() => handleAddAttendee(event.id)}>Add Attendee</Button>
            </Col>
        </Row>
    </Card.Body>
  </Card>
);

export default EventCard;
