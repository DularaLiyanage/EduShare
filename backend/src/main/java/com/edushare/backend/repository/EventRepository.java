package com.edushare.backend.repository;

import java.util.List;

import com.edushare.backend.model.Event;
import com.edushare.backend.model.Post;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface EventRepository extends MongoRepository<Event, Long> {
    List<Event> findByNameContainingIgnoreCase(String name);
}