package com.edushare.backend.service;

import com.edushare.backend.model.Attendee;
import com.edushare.backend.repository.AttendeeRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class AttendeeService {
    @Autowired
    private AttendeeRepository attendeeRepository;

    public Attendee addAttendee(Attendee attendee) {
        return attendeeRepository.save(attendee);
    }

    public Attendee getAttendeeById(String id) {
        return attendeeRepository.findById(id).orElse(null);  // Return null if not found
    }
}
