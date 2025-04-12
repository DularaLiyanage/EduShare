package com.edushare.backend.model;

import jakarta.persistence.*;
import java.io.Serializable;

@Table(name = "event_attendee")
@Entity
public class EventAttendee {
    @EmbeddedId
    private EventAttendeeKey id;

    @ManyToOne
    @MapsId("eventId")
    @JoinColumn(name = "event_id")
    private Event event;

    @ManyToOne
    @MapsId("attendeeId")
    @JoinColumn(name = "attendee_id")
    private Attendee attendee;

    // Getters and Setters
    public EventAttendeeKey getId() {
        return id;
    }

    public void setId(EventAttendeeKey id) {
        this.id = id;
    }

    public Event getEvent() {
        return event;
    }

    public void setEvent(Event event) {
        this.event = event;
    }

    public Attendee getAttendee() {
        return attendee;
    }

    public void setAttendee(Attendee attendee) {
        this.attendee = attendee;
    }

    @Embeddable
    public static class EventAttendeeKey implements Serializable {
        private Long eventId;
        private Long attendeeId;

        // Getters and Setters
        public Long getEventId() {
            return eventId;
        }

        public void setEventId(Long eventId) {
            this.eventId = eventId;
        }

        public Long getAttendeeId() {
            return attendeeId;
        }

        public void setAttendeeId(Long attendeeId) {
            this.attendeeId = attendeeId;
        }

        // hashCode and equals methods
        @Override
        public int hashCode() {
            final int prime = 31;
            int result = 1;
            result = prime * result + ((eventId == null) ? 0 : eventId.hashCode());
            result = prime * result + ((attendeeId == null) ? 0 : attendeeId.hashCode());
            return result;
        }

        @Override
        public boolean equals(Object obj) {
            if (this == obj)
                return true;
            if (obj == null)
                return false;
            if (getClass() != obj.getClass())
                return false;
            EventAttendeeKey other = (EventAttendeeKey) obj;
            if (eventId == null) {
                if (other.eventId != null)
                    return false;
            } else if (!eventId.equals(other.eventId))
                return false;
            if (attendeeId == null) {
                if (other.attendeeId != null)
                    return false;
            } else if (!attendeeId.equals(other.attendeeId))
                return false;
            return true;
        }
    }
}
