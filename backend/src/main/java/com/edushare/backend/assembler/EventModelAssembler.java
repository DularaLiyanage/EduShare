package com.edushare.backend.assembler;

import com.edushare.backend.controller.EventController;
import com.edushare.backend.model.Event;
import org.springframework.hateoas.EntityModel;
import org.springframework.hateoas.Link;
import org.springframework.hateoas.server.mvc.WebMvcLinkBuilder;
import org.springframework.stereotype.Component;

@Component
public class EventModelAssembler implements org.springframework.hateoas.server.RepresentationModelAssembler<Event, EntityModel<Event>> {

    @Override
    public EntityModel<Event> toModel(Event event) {
        // Create an EntityModel for Event
        EntityModel<Event> eventModel = EntityModel.of(event);

        // Add a self-link to the resource
        Link selfLink = WebMvcLinkBuilder.linkTo(EventController.class)
                .slash(event.getId())
                .withSelfRel();
        eventModel.add(selfLink);

        return eventModel;
    }
}
