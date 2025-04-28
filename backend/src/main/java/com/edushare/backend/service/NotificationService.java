package com.edushare.backend.service;

import com.edushare.backend.model.Notification;
import com.edushare.backend.repository.NotificationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Date;
import java.util.List;
import java.util.Optional;

@Service
public class NotificationService {

    @Autowired
    private NotificationRepository notificationRepository;

    // Create a notification
    public Notification createNotification(String recipientId, String senderId, String postId, String type, String message) {
        Notification notification = new Notification(recipientId, senderId, postId, type, message, new Date());
        return notificationRepository.save(notification);
    }

    // Get all notifications for a user
    public List<Notification> getNotificationsByUser(String recipientId) {
        return notificationRepository.findByRecipientId(recipientId);
    }

    // Mark as read
    public Notification markAsRead(String notificationId) {
        Optional<Notification> optional = notificationRepository.findById(notificationId);
        if (optional.isPresent()) {
            Notification notification = optional.get();
            notification.setRead(true);
            return notificationRepository.save(notification);
        }
        return null;
    }

    // Delete notification
    public boolean deleteNotification(String id) {
        if (notificationRepository.existsById(id)) {
            notificationRepository.deleteById(id);
            return true;
        }
        return false;
    }
}
