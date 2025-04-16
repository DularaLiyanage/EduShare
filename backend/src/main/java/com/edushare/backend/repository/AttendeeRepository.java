package com.edushare.backend.repository;

import com.edushare.backend.model.Attendee;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface AttendeeRepository extends MongoRepository<Attendee, String> {
}