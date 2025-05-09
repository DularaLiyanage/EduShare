package com.edushare.backend.controller;

import com.edushare.backend.assembler.EventModelAssembler;
import com.edushare.backend.model.Event;
import com.edushare.backend.service.EventService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.hateoas.EntityModel;
import org.springframework.hateoas.Link;
import org.springframework.hateoas.server.mvc.WebMvcLinkBuilder;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.time.LocalDateTime;


import java.util.*;

@RestController
@RequestMapping("/api/events")
@CrossOrigin(origins = "http://localhost:3000")
public class EventController {

    @Autowired
    private EventService eventService;

    @Autowired
    private EventModelAssembler eventModelAssembler;

    @PostMapping
    public ResponseEntity<?> createEvent(@RequestBody Map<String, Object> eventData) {
        try {
            Event event = new Event();
            event.setName((String) eventData.get("name"));
            event.setDescription((String) eventData.get("description"));
            event.setLocation((String) eventData.get("location"));

            String dateStr = (String) eventData.get("date");
            if (dateStr != null && !dateStr.isEmpty()) {
                event.setDate(LocalDateTime.parse(dateStr)); // Parse the date string
            }

            Event savedEvent = eventService.createEvent(event);
            EntityModel<Event> eventModel = eventModelAssembler.toModel(savedEvent);
            return new ResponseEntity<>(eventModel, HttpStatus.CREATED);
        } catch (Exception e) {
            Map<String, String> response = new HashMap<>();
            response.put("error", e.getMessage());
            return new ResponseEntity<>(response, HttpStatus.BAD_REQUEST);
        }
    }

    @GetMapping
    public ResponseEntity<?> getAllEvents() {
        List<Event> events = eventService.getAllEvents();
        List<EntityModel<Event>> eventModels = new ArrayList<>();
        for (Event event : events) {
            EntityModel<Event> eventModel = eventModelAssembler.toModel(event);
            Link selfLink = WebMvcLinkBuilder.linkTo(EventController.class).slash(event.getId()).withSelfRel();
            eventModel.add(selfLink);
            eventModels.add(eventModel);
        }
        return new ResponseEntity<>(eventModels, HttpStatus.OK);
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getEventById(@PathVariable String id) {
        Optional<Event> event = eventService.getEventById(id);
        if (event.isPresent()) {
            EntityModel<Event> eventModel = eventModelAssembler.toModel(event.get());
            Link selfLink = WebMvcLinkBuilder.linkTo(EventController.class).slash(id).withSelfRel();
            eventModel.add(selfLink);
            return new ResponseEntity<>(eventModel, HttpStatus.OK);
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
                Map<String, String> response = new HashMap<>();
                response.put("error", "Event not found");
                return new ResponseEntity<>(response, HttpStatus.NOT_FOUND);
            }

            Event event = existingEvent.get();
            event.setName((String) eventData.get("name"));
            event.setDescription((String) eventData.get("description"));
            event.setLocation((String) eventData.get("location"));

            String dateStr = (String) eventData.get("date");
            if (dateStr != null && !dateStr.isEmpty()) {
                event.setDate(LocalDateTime.parse(dateStr));
            }

            Event updatedEvent = eventService.updateEvent(id, event);
            EntityModel<Event> eventModel = eventModelAssembler.toModel(updatedEvent);
            Link selfLink = WebMvcLinkBuilder.linkTo(EventController.class).slash(id).withSelfRel();
            eventModel.add(selfLink);
            return new ResponseEntity<>(eventModel, HttpStatus.OK);
        } catch (Exception e) {
            Map<String, String> response = new HashMap<>();
            response.put("error", e.getMessage());
            return new ResponseEntity<>(response, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteEvent(@PathVariable String id) {
        try {
            eventService.deleteEvent(id);
            Map<String, String> response = new HashMap<>();
            response.put("message", "Event deleted successfully");
            return new ResponseEntity<>(response, HttpStatus.NO_CONTENT);
        } catch (Exception e) {
            Map<String, String> response = new HashMap<>();
            response.put("error", e.getMessage());
            return new ResponseEntity<>(response, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}
