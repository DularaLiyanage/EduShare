package com.edushare.backend.repository;

import com.edushare.backend.model.EventAttendee;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;

public interface EventAttendeeRepository extends MongoRepository<EventAttendee, String> {
    List<EventAttendee> findByEventId(String eventId);
}