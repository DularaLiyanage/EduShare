package com.edushare.backend.service;

import com.edushare.backend.model.Event;
import com.edushare.backend.model.EventAttendee;
import com.edushare.backend.repository.EventAttendeeRepository;
import com.edushare.backend.repository.EventRepository;
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
}
