package com.edushare.backend.assembler;

import com.edushare.backend.controller.AttendeeController;
import com.edushare.backend.model.Attendee;
import org.springframework.hateoas.EntityModel;
import org.springframework.hateoas.Link;
import org.springframework.hateoas.server.mvc.WebMvcLinkBuilder;
import org.springframework.stereotype.Component;

@Component
public class AttendeeModelAssembler implements org.springframework.hateoas.server.RepresentationModelAssembler<Attendee, EntityModel<Attendee>> {

    @Override
    public EntityModel<Attendee> toModel(Attendee attendee) {
        // Create an EntityModel for Attendee
        EntityModel<Attendee> attendeeModel = EntityModel.of(attendee);

        // Add a self-link to the resource
        Link selfLink = WebMvcLinkBuilder.linkTo(AttendeeController.class)
                .slash(attendee.getId())
                .withSelfRel();
        attendeeModel.add(selfLink);

        // You can add more links, for example, link to related entities (e.g., events, registration)
        // Example: attendeeModel.add(WebMvcLinkBuilder.linkTo(AttendeeController.class).slash(attendee.getId()).slash("events").withRel("events"));

        return attendeeModel;
    }
}
