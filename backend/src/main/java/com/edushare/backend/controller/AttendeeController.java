package com.edushare.backend.controller;

import com.edushare.backend.model.Attendee;
import com.edushare.backend.service.AttendeeService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/attendees")
@CrossOrigin(origins = "http://localhost:3000")
public class AttendeeController {

    @Autowired
    private AttendeeService attendeeService;

    @PostMapping
    public ResponseEntity<Attendee> addAttendee(@RequestBody Attendee attendee) {
        try {
            Attendee savedAttendee = attendeeService.addAttendee(attendee);
            return new ResponseEntity<>(savedAttendee, HttpStatus.CREATED);
        } catch (Exception e) {
            return new ResponseEntity<>(null, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getAttendee(@PathVariable String id) {
        try {
            Attendee attendee = attendeeService.getAttendeeById(id);
            if (attendee != null) {
                return new ResponseEntity<>(attendee, HttpStatus.OK);
            } else {
                Map<String, String> response = new HashMap<>();
                response.put("error", "Attendee not found");
                return new ResponseEntity<>(response, HttpStatus.NOT_FOUND);
            }
        } catch (Exception e) {
            return new ResponseEntity<>(null, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}