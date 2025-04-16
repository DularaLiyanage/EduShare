package com.edushare.backend.controller;

import com.edushare.backend.model.Attendee;
import com.edushare.backend.model.Event;
import com.edushare.backend.model.EventAttendee;
import com.edushare.backend.service.AttendeeService;
import com.edushare.backend.service.EventAttendeeService;
import com.edushare.backend.service.EventService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "http://localhost:3000")
public class EventAttendeeController {

    @Autowired
    private EventAttendeeService eventAttendeeService;

    @Autowired
    private EventService eventService;

    @Autowired
    private AttendeeService attendeeService;

    @PostMapping("/events/{eventId}/attendees/{attendeeId}")
    public ResponseEntity<?> registerAttendeeToEvent(
            @PathVariable String eventId,
            @PathVariable String attendeeId) {

        try {
            // Verify event exists
            Optional<Event> eventOpt = eventService.getEventById(eventId);
            if (!eventOpt.isPresent()) {
                Map<String, String> response = new HashMap<>();
                response.put("error", "Event not found");
                return new ResponseEntity<>(response, HttpStatus.NOT_FOUND);
            }

            // Verify attendee exists
            Attendee attendee = attendeeService.getAttendeeById(attendeeId);
            if (attendee == null) {
                Map<String, String> response = new HashMap<>();
                response.put("error", "Attendee not found");
                return new ResponseEntity<>(response, HttpStatus.NOT_FOUND);
            }

            EventAttendee eventAttendee = new EventAttendee();
            eventAttendee.setEventId(eventId);
            eventAttendee.setAttendeeId(attendeeId);

            EventAttendee registeredAttendee = eventAttendeeService.registerAttendee(eventAttendee);
            return new ResponseEntity<>(registeredAttendee, HttpStatus.CREATED);
        } catch (Exception e) {
            Map<String, String> response = new HashMap<>();
            response.put("error", e.getMessage());
            return new ResponseEntity<>(response, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @GetMapping("/events/{eventId}/attendees")
    public ResponseEntity<?> getAttendeesByEventId(@PathVariable String eventId) {
        try {
            // Verify event exists
            Optional<Event> eventOpt = eventService.getEventById(eventId);
            if (!eventOpt.isPresent()) {
                Map<String, String> response = new HashMap<>();
                response.put("error", "Event not found");
                return new ResponseEntity<>(response, HttpStatus.NOT_FOUND);
            }

            List<EventAttendee> eventAttendees = eventAttendeeService.getAttendeesByEventId(eventId);
            List<Attendee> attendees = new ArrayList<>();

            // Get full attendee details for each registration
            for (EventAttendee ea : eventAttendees) {
                Attendee attendee = attendeeService.getAttendeeById(ea.getAttendeeId());
                if (attendee != null) {
                    attendees.add(attendee);
                }
            }

            return new ResponseEntity<>(attendees, HttpStatus.OK);
        } catch (Exception e) {
            Map<String, String> response = new HashMap<>();
            response.put("error", e.getMessage());
            return new ResponseEntity<>(response, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}