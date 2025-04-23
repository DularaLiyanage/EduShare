package com.edushare.backend.controller;

import com.edushare.backend.model.Event;
import com.edushare.backend.service.EventService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.time.format.DateTimeFormatter;
import java.time.format.DateTimeParseException;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@CrossOrigin(origins = "http://localhost:3000")
@RestController
@RequestMapping("/api/events")
public class EventController {

    @Autowired
    private EventService eventService;

    @PostMapping
    public ResponseEntity<?> createEvent(@RequestBody Map<String, Object> eventData) {
        try {
            Event event = new Event();
            event.setName((String) eventData.get("name"));
            event.setDescription((String) eventData.get("description"));
            event.setLocation((String) eventData.get("location"));

            // Handle date conversion
            String dateStr = (String) eventData.get("date");
            if (dateStr != null && !dateStr.isEmpty()) {
                LocalDateTime dateTime;

                // Check if it's a full ISO datetime string
                if (dateStr.contains("T")) {
                    dateTime = LocalDateTime.parse(dateStr);
                } else {
                    // It's just a date string like "2025-04-16"
                    LocalDate date = LocalDate.parse(dateStr);
                    // Set time to noon by default
                    dateTime = LocalDateTime.of(date, LocalTime.NOON);
                }
                event.setDate(dateTime);
            }

            return new ResponseEntity<>(eventService.createEvent(event), HttpStatus.CREATED);
        } catch (DateTimeParseException e) {
            Map<String, String> response = new HashMap<>();
            response.put("error", "Invalid date format. Please use YYYY-MM-DD or ISO format.");
            return new ResponseEntity<>(response, HttpStatus.BAD_REQUEST);
        } catch (Exception e) {
            Map<String, String> response = new HashMap<>();
            response.put("error", e.getMessage());
            return new ResponseEntity<>(response, HttpStatus.BAD_REQUEST);
        }
    }

    @GetMapping
    public ResponseEntity<List<Event>> getAllEvents() {
        return new ResponseEntity<>(eventService.getAllEvents(), HttpStatus.OK);
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getEventById(@PathVariable String id) {
        Optional<Event> event = eventService.getEventById(id);
        if (event.isPresent()) {
            return ResponseEntity.ok(event.get());
        } else {
            Map<String, String> response = new HashMap<>();
            response.put("error", "Event not found");
            return new ResponseEntity<>(response, HttpStatus.NOT_FOUND);
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateEvent(@PathVariable String id, @RequestBody Map<String, Object> eventData) {
        try {
            Optional<Event> existingEvent = eventService.getEventById(id);
            if (!existingEvent.isPresent()) {
                throw new RuntimeException("Event not found for this id :: " + id);
            }

            Event event = existingEvent.get();
            event.setName((String) eventData.get("name"));
            event.setDescription((String) eventData.get("description"));
            event.setLocation((String) eventData.get("location"));

            // Handle date conversion
            String dateStr = (String) eventData.get("date");
            if (dateStr != null && !dateStr.isEmpty()) {
                LocalDateTime dateTime;

                // Check if it's a full ISO datetime string
                if (dateStr.contains("T")) {
                    dateTime = LocalDateTime.parse(dateStr);
                } else {
                    // It's just a date string like "2025-04-16"
                    LocalDate date = LocalDate.parse(dateStr);
                    // Set time to noon by default
                    dateTime = LocalDateTime.of(date, LocalTime.NOON);
                }
                event.setDate(dateTime);
            }

            return ResponseEntity.ok(eventService.updateEvent(id, event));
        } catch (DateTimeParseException e) {
            Map<String, String> response = new HashMap<>();
            response.put("error", "Invalid date format. Please use YYYY-MM-DD or ISO format.");
            return new ResponseEntity<>(response, HttpStatus.BAD_REQUEST);
        } catch (Exception e) {
            Map<String, String> response = new HashMap<>();
            response.put("error", e.getMessage());
            return new ResponseEntity<>(response, HttpStatus.BAD_REQUEST);
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteEvent(@PathVariable String id) {
        try {
            eventService.deleteEvent(id);
            Map<String, String> response = new HashMap<>();
            response.put("message", "Event deleted successfully");
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, String> response = new HashMap<>();
            response.put("error", e.getMessage());
            return new ResponseEntity<>(response, HttpStatus.BAD_REQUEST);
        }
    }

    @GetMapping("/search")
    public ResponseEntity<List<Event>> searchEvents(@RequestParam String keyword) {
        return new ResponseEntity<>(eventService.searchEvents(keyword), HttpStatus.OK);
    }
}