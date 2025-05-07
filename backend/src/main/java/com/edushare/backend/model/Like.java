package com.edushare.backend.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.Date;

@Document(collection = "likes") // This maps to the "likes" collection in MongoDB
public class Like {

    @Id
    private String id;

    private String postId; // ID of the post being liked
    private String userId; // ID of the user who liked
    private Date likedAt; // Timestamp when the like happened

    // Constructors
    public Like() {
    }

    public Like(String postId, String userId, Date likedAt) {
        this.postId = postId;
        this.userId = userId;
        this.likedAt = likedAt;
    }

    // Getters and Setters
    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getPostId() {
        return postId;
    }

    public void setPostId(String postId) {
        this.postId = postId;
    }

    public String getUserId() {
        return userId;
    }

    public void setUserId(String userId) {
        this.userId = userId;
    }

    public Date getLikedAt() {
        return likedAt;
    }

    public void setLikedAt(Date likedAt) {
        this.likedAt = likedAt;
    }
}
