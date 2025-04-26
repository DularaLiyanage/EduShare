package com.edushare.backend.controller;

import com.edushare.backend.model.Like;
import com.edushare.backend.service.LikeService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/likes")
public class LikeController {

    @Autowired
    private LikeService likeService;

    // Like a post
    @PostMapping
    public ResponseEntity<String> likePost(@RequestBody Like like) {
        String result = likeService.likePost(like);
        if (result.equals("User already liked this post")) {
            return ResponseEntity.badRequest().body(result);
        }
        return ResponseEntity.ok(result);
    }

    // Unlike a post
    @DeleteMapping
    public ResponseEntity<String> unlikePost(@RequestParam String userId, @RequestParam String postId) {
        String result = likeService.unlikePost(userId, postId);
        if (result.equals("Like not found")) {
            return ResponseEntity.badRequest().body(result);
        }
        return ResponseEntity.ok(result);
    }

    // Get all likes for a post
    @GetMapping("/post/{postId}")
    public ResponseEntity<List<Like>> getLikesByPost(@PathVariable String postId) {
        List<Like> likes = likeService.getLikesByPostId(postId);
        return ResponseEntity.ok(likes);
    }

    //  Get total like count
    @GetMapping("/count/{postId}")
    public ResponseEntity<Long> getLikeCount(@PathVariable String postId) {
        long count = likeService.countLikesByPostId(postId);
        return ResponseEntity.ok(count);
    }
}
