package com.edushare.backend.controller;

import com.edushare.backend.model.Attendee;
import com.edushare.backend.service.AttendeeService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;




@RestController
@RequestMapping("api/attendees")
@CrossOrigin(origins = "http://localhost:3000")
public class AttendeeController {
    @Autowired
    private AttendeeService attendeeService;

    @PostMapping
    public Attendee addAttendee(@RequestBody Attendee attendee) {
        return attendeeService.addAttendee(attendee);
    }
}