package com.edushare.backend.assembler;

import com.edushare.backend.controller.EventAttendeeController;
import com.edushare.backend.model.EventAttendee;
import org.springframework.hateoas.EntityModel;
import org.springframework.hateoas.Link;
import org.springframework.hateoas.server.mvc.WebMvcLinkBuilder;
import org.springframework.stereotype.Component;

@Component
public class EventAttendeeModelAssembler implements org.springframework.hateoas.server.RepresentationModelAssembler<EventAttendee, EntityModel<EventAttendee>> {

    @Override
    public EntityModel<EventAttendee> toModel(EventAttendee eventAttendee) {
        // Create an EntityModel for EventAttendee
        EntityModel<EventAttendee> eventAttendeeModel = EntityModel.of(eventAttendee);

        // Add a self-link to the resource
        Link selfLink = WebMvcLinkBuilder.linkTo(EventAttendeeController.class)
                .slash("events")
                .slash(eventAttendee.getEventId())
                .slash("attendees")
                .slash(eventAttendee.getAttendeeId())
                .withSelfRel();
        eventAttendeeModel.add(selfLink);

        return eventAttendeeModel;
    }
}
