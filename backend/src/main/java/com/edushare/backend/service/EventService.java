package com.edushare.backend.service;

import com.edushare.backend.model.Attendee;
import com.edushare.backend.model.Event;
import com.edushare.backend.model.EventAttendee;
import com.edushare.backend.repository.AttendeeRepository;
import com.edushare.backend.repository.EventAttendeeRepository;
import com.edushare.backend.repository.EventRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class EventService {

    private final EventRepository eventRepository;
    private final AttendeeRepository attendeeRepository;
    private final EventAttendeeRepository eventAttendeeRepository;

    @Autowired
    public EventService(EventRepository eventRepository,
                        AttendeeRepository attendeeRepository,
                        EventAttendeeRepository eventAttendeeRepository) {
        this.eventRepository = eventRepository;
        this.attendeeRepository = attendeeRepository;
        this.eventAttendeeRepository = eventAttendeeRepository;
    }

    public Event addEvent(Event event) {
        return eventRepository.save(event);
    }

    public List<Event> getAllEvents() {
        return eventRepository.findAll();
    }

    public Event updateEvent(Long id, Event eventDetails) {
        Event event = eventRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Event not found for this id :: " + id));

        event.setName(eventDetails.getName());
        event.setDescription(eventDetails.getDescription());
        event.setDate(eventDetails.getDate());
        event.setLocation(eventDetails.getLocation());

        return eventRepository.save(event);
    }

    public void deleteEvent(Long id) {
        Event event = eventRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Event not found for this id :: " + id));

        eventRepository.delete(event);
    }

    public Optional<Event> getEventById(Long id) {
        return eventRepository.findById(id);
    }

    public EventAttendee registerAttendeeToEvent(Long eventId, Long attendeeId) {
        Event event = eventRepository.findById(eventId)
                .orElseThrow(() -> new RuntimeException("Event not found for this id :: " + eventId));

        Attendee attendee = attendeeRepository.findById(attendeeId)
                .orElseThrow(() -> new RuntimeException("Attendee not found for this id :: " + attendeeId));

        EventAttendee eventAttendee = new EventAttendee();
        EventAttendee.EventAttendeeKey key = new EventAttendee.EventAttendeeKey();
        key.setEventId(eventId);
        key.setAttendeeId(attendeeId);

        eventAttendee.setId(key);
        eventAttendee.setEvent(event);
        eventAttendee.setAttendee(attendee);

        return eventAttendeeRepository.save(eventAttendee);
    }

    public List<Attendee> getAttendeesByEventId(Long eventId) {
        List<EventAttendee> eventAttendees = eventAttendeeRepository.findByEventId(eventId);

        List<Long> attendeeIds = eventAttendees.stream()
                .map(eventAttendee -> eventAttendee.getAttendee().getId())
                .collect(Collectors.toList());

        return attendeeRepository.findAllById(attendeeIds);
    }
}
