package com.edushare.backend.controller;

import com.edushare.backend.model.EventAttendee;
import com.edushare.backend.service.EventAttendeeService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;



@RestController
@RequestMapping("/api/event-attendees")
@CrossOrigin(origins = "http://localhost:3000")
public class EventAttendeeController {
    @Autowired
    private EventAttendeeService eventAttendeeService;

    @PostMapping
    public EventAttendee registerAttendee(@RequestBody EventAttendee eventAttendee) {
        return eventAttendeeService.registerAttendee(eventAttendee);
    }
}
