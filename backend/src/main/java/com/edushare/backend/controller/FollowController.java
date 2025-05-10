package com.edushare.backend.controller;

import com.edushare.backend.service.FollowService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.Map;

@RestController
@RequestMapping("/api/follows")
public class FollowController {

    @Autowired
    private FollowService followService;

    @PostMapping("/{followerId}/follow/{followingId}")
    public ResponseEntity<?> followUser(
            @PathVariable String followerId,
            @PathVariable String followingId) {
        String result = followService.followUser(followerId, followingId);
        return ResponseEntity.ok(Map.of("message", result));
    }

    @DeleteMapping("/{followerId}/unfollow/{followingId}")
    public ResponseEntity<?> unfollowUser(
            @PathVariable String followerId,
            @PathVariable String followingId) {
        String result = followService.unfollowUser(followerId, followingId);
        return ResponseEntity.ok(Map.of("message", result));
    }

    @GetMapping("/{userId}/followers")
    public ResponseEntity<?> getFollowers(@PathVariable String userId) {
        return ResponseEntity.ok(followService.getFollowers(userId));
    }

    @GetMapping("/{userId}/following")
    public ResponseEntity<?> getFollowing(@PathVariable String userId) {
        return ResponseEntity.ok(followService.getFollowing(userId));
    }

    @GetMapping("/{userId}/counts")
    public ResponseEntity<?> getFollowCounts(@PathVariable String userId) {
        return ResponseEntity.ok(followService.getFollowCounts(userId));
    }
}