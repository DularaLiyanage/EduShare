package com.edushare.backend.controller;

import com.edushare.backend.assembler.EventAttendeeModelAssembler;
import com.edushare.backend.model.Event;
import com.edushare.backend.model.EventAttendee;
import com.edushare.backend.model.Attendee;
import com.edushare.backend.service.EventAttendeeService;
import com.edushare.backend.service.EventService;
import com.edushare.backend.service.AttendeeService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.hateoas.EntityModel;
import org.springframework.hateoas.Link;
import org.springframework.hateoas.server.mvc.WebMvcLinkBuilder;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.*;

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

    @Autowired
    private EventAttendeeModelAssembler eventAttendeeModelAssembler;

    @PostMapping("/events/{eventId}/attendees/{attendeeId}")
    public ResponseEntity<?> registerAttendeeToEvent(@PathVariable String eventId, @PathVariable String attendeeId) {
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

            // Fetch the attendees for the event
            List<EventAttendee> eventAttendees = eventAttendeeService.getAttendeesByEventId(eventId);
            List<Map<String, Object>> attendeesWithDetails = new ArrayList<>();

            for (EventAttendee ea : eventAttendees) {
                // Fetch full attendee details
                Attendee attendee = attendeeService.getAttendeeById(ea.getAttendeeId());
                if (attendee != null) {
                    Map<String, Object> attendeeDetails = new HashMap<>();
                    attendeeDetails.put("attendee", attendee);
                    attendeeDetails.put("eventAttendee", ea);

                    // Adding HATEOAS link for each attendee
                    Link selfLink = WebMvcLinkBuilder.linkTo(EventAttendeeController.class)
                            .slash("events")
                            .slash(eventId)
                            .slash("attendees")
                            .slash(ea.getId())
                            .withSelfRel();
                    attendeeDetails.put("_links", Collections.singletonMap("self", selfLink));

                    attendeesWithDetails.add(attendeeDetails);
                }
            }

            return new ResponseEntity<>(attendeesWithDetails, HttpStatus.OK);
        } catch (Exception e) {
            Map<String, String> response = new HashMap<>();
            response.put("error", e.getMessage());
            return new ResponseEntity<>(response, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}
