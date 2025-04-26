package com.edushare.backend.controller;

import com.edushare.backend.model.Comment;
import com.edushare.backend.service.CommentService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/comments")
public class CommentController {

    private final CommentService commentService;

    @Autowired
    public CommentController(CommentService commentService) {
        this.commentService = commentService;
    }

    // Create a new comment
    @PostMapping
    public ResponseEntity<?> createComment(@RequestBody Comment comment) {
        try {
            Comment savedComment = commentService.createComment(comment);
            return ResponseEntity.status(HttpStatus.CREATED).body(savedComment);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Map.of("error", e.getMessage()));
        }
    }

    // Get all comments
    @GetMapping
    public ResponseEntity<List<Comment>> getAllComments() {
        return ResponseEntity.ok(commentService.getAllComments());
    }

    // Get comment by ID
    @GetMapping("/{id}")
    public ResponseEntity<?> getCommentById(@PathVariable String id) {
        return commentService.getCommentById(id)
                .map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    // Get comments for a specific post
    @GetMapping("/post/{postId}")
    public ResponseEntity<List<Comment>> getCommentsByPostId(@PathVariable String postId) {
        return ResponseEntity.ok(commentService.getCommentsByPostId(postId));
    }

    // Get comments by a specific user
    @GetMapping("/user/{userId}")
    public ResponseEntity<List<Comment>> getCommentsByUserId(@PathVariable String userId) {
        return ResponseEntity.ok(commentService.getCommentsByUserId(userId));
    }

    // Update a comment
    @PutMapping("/{id}")
    public ResponseEntity<?> updateComment(@PathVariable String id, @RequestBody Comment updatedData) {
        try {
            Comment existingComment = commentService.getCommentById(id)
                    .orElseThrow(() -> new RuntimeException("Comment not found"));
            existingComment.setContent(updatedData.getContent());
            Comment updatedComment = commentService.updateComment(existingComment);
            return ResponseEntity.ok(updatedComment);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Map.of("error", e.getMessage()));
        }
    }

    // Delete a comment
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteComment(@PathVariable String id) {
        try {
            commentService.deleteComment(id);
            return ResponseEntity.ok(Map.of("message", "Comment deleted successfully"));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Map.of("error", e.getMessage()));
        }
    }
}

