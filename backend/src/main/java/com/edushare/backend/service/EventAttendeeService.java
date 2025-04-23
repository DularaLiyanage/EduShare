package com.edushare.backend.service;

import com.edushare.backend.model.EventAttendee;
import com.edushare.backend.repository.EventAttendeeRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class EventAttendeeService {
    @Autowired
    private EventAttendeeRepository eventAttendeeRepository;

    public EventAttendee registerAttendee(EventAttendee eventAttendee) {
        return eventAttendeeRepository.save(eventAttendee);
    }

    public List<EventAttendee> getAttendeesByEventId(String eventId) {
        return eventAttendeeRepository.findByEventId(eventId);
    }
}
