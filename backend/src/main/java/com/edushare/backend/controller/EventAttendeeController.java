package com.edushare.backend.controller;

import com.edushare.backend.model.EventAttendee;
import com.edushare.backend.service.EventAttendeeService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api")
public class EventAttendeeController {

    @Autowired
    private EventAttendeeService eventAttendeeService;

    @PostMapping("/events/{eventId}/attendees/{attendeeId}")
    public EventAttendee registerAttendeeToEvent(@PathVariable String eventId, @PathVariable String attendeeId) {
        EventAttendee eventAttendee = new EventAttendee();
        eventAttendee.setEventId(eventId);
        eventAttendee.setAttendeeId(attendeeId);
        return eventAttendeeService.registerAttendee(eventAttendee);
    }

    @GetMapping("/events/{eventId}/attendees")
    public List<EventAttendee> getAttendeesByEventId(@PathVariable String eventId) {
        return eventAttendeeService.getAttendeesByEventId(eventId);
    }
}
