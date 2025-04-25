package com.edushare.backend.controller;

import com.edushare.backend.model.Notification;
import com.edushare.backend.service.NotificationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/notifications")
public class NotificationController {

    @Autowired
    private NotificationService notificationService;

    // (C) Create Notification - optional endpoint for testing
    @PostMapping("/create")
    public ResponseEntity<Notification> createNotification(@RequestBody Notification notification) {
        Notification saved = notificationService.createNotification(
                notification.getRecipientId(),
                notification.getSenderId(),
                notification.getPostId(),
                notification.getType(),
                notification.getMessage()
        );
        return ResponseEntity.ok(saved);
    }

    // (R) Get all notifications for a user
    @GetMapping("/{recipientId}")
    public ResponseEntity<List<Notification>> getUserNotifications(@PathVariable String recipientId) {
        List<Notification> notifications = notificationService.getNotificationsByUser(recipientId);
        return ResponseEntity.ok(notifications);
    }

    // (U) Mark as read
    @PutMapping("/mark-read/{id}")
    public ResponseEntity<Notification> markAsRead(@PathVariable String id) {
        Notification updated = notificationService.markAsRead(id);
        if (updated == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(updated);
    }

    // (D) Delete notification
    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteNotification(@PathVariable String id) {
        boolean deleted = notificationService.deleteNotification(id);
        if (deleted) {
            return ResponseEntity.ok("Notification deleted successfully");
        } else {
            return ResponseEntity.badRequest().body("Notification not found");
        }
    }
}
