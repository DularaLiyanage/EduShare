package com.edushare.backend.repository;

import com.edushare.backend.model.EventAttendee;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface EventAttendeeRepository extends JpaRepository<EventAttendee, EventAttendee.EventAttendeeKey> {
    List<EventAttendee> findByEventId(Long eventId);
}

