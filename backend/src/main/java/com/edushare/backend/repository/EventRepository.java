package com.edushare.backend.repository;

import com.edushare.backend.model.Event;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;

public interface EventRepository extends MongoRepository<Event, String> {
    List<Event> findByNameContainingIgnoreCase(String name);
}
