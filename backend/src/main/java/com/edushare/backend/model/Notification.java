package com.edushare.backend.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.Date;

@Document(collection = "notifications")
public class Notification {

    @Id
    private String id;

    private String recipientId; // Who receives the notification
    private String senderId; // Who triggered the notification
    private String postId; // Related post
    private String type; // "LIKE" or "COMMENT"
    private String message; // Optional message
    private Date timestamp;
    private boolean isRead; // To mark as read/unread

    public Notification() {
    }

    public Notification(String recipientId, String senderId, String postId, String type, String message,
            Date timestamp) {
        this.recipientId = recipientId;
        this.senderId = senderId;
        this.postId = postId;
        this.type = type;
        this.message = message;
        this.timestamp = timestamp;
        this.isRead = false;
    }

    // Getters and setters
    
    // ...
    public String getId() {
        return id;
    }

    public String getRecipientId() {
        return recipientId;
    }

    public void setRecipientId(String recipientId) {
        this.recipientId = recipientId;
    }

    public String getSenderId() {
        return senderId;
    }

    public void setSenderId(String senderId) {
        this.senderId = senderId;
    }

    public String getPostId() {
        return postId;
    }

    public void setPostId(String postId) {
        this.postId = postId;
    }

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public Date getTimestamp() {
        return timestamp;
    }

    public void setTimestamp(Date timestamp) {
        this.timestamp = timestamp;
    }

    public boolean isRead() {
        return isRead;
    }

    public void setRead(boolean read) {
        isRead = read;
    }
}
