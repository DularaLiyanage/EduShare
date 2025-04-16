package com.edushare.backend.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "event_attendees")
public class EventAttendee {
    @Id
    private String id;
    private String eventId;
    private String attendeeId;

    // Getters and Setters
    public String getId() { return id; }
    public void setId(String id) { this.id = id; }
    public String getEventId() { return eventId; }
    public void setEventId(String eventId) { this.eventId = eventId; }
    public String getAttendeeId() { return attendeeId; }
    public void setAttendeeId(String attendeeId) { this.attendeeId = attendeeId; }
}