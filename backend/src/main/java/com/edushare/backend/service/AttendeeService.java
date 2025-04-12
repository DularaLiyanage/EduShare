package com.edushare.backend.service;

import com.edushare.backend.model.Attendee;
import com.edushare.backend.repository.AttendeeRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class AttendeeService {
    @Autowired
    private AttendeeRepository attendeeRepository;

    public Attendee addAttendee(Attendee attendee) {
        return attendeeRepository.save(attendee);
    }
}
