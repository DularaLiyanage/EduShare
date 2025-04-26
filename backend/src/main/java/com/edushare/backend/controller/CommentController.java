package com.edushare.backend.controller;

import com.edushare.backend.model.Comment;
import com.edushare.backend.service.CommentService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.hateoas.CollectionModel;
import org.springframework.hateoas.EntityModel;
import org.springframework.hateoas.Link;
import org.springframework.hateoas.server.mvc.WebMvcLinkBuilder;
import org.springframework.http.ResponseEntity;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

import static org.springframework.hateoas.server.mvc.WebMvcLinkBuilder.*;

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
            EntityModel<Comment> resource = EntityModel.of(savedComment);
            addLinks(resource);
            return ResponseEntity.created(linkTo(methodOn(CommentController.class).getCommentById(savedComment.getId())).toUri()).body(resource);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Map.of("error", e.getMessage()));
        }
    }

    // Get all comments with HATEOAS
    @GetMapping
    public ResponseEntity<CollectionModel<EntityModel<Comment>>> getAllComments() {
        List<EntityModel<Comment>> commentResources = commentService.getAllComments().stream()
                .map(comment -> {
                    EntityModel<Comment> resource = EntityModel.of(comment);
                    addLinks(resource);
                    return resource;
                }).collect(Collectors.toList());

        return ResponseEntity.ok(CollectionModel.of(commentResources,
                linkTo(methodOn(CommentController.class).getAllComments()).withSelfRel()));
    }

    // Get comment by ID with HATEOAS
    @GetMapping("/{id}")
    public ResponseEntity<?> getCommentById(@PathVariable String id) {
        Optional<Comment> commentOpt = commentService.getCommentById(id);
        if (commentOpt.isPresent()) {
            EntityModel<Comment> resource = EntityModel.of(commentOpt.get());
            addLinks(resource);
            return ResponseEntity.ok(resource);
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    // Get comments for a specific post
    @GetMapping("/post/{postId}")
    public ResponseEntity<CollectionModel<EntityModel<Comment>>> getCommentsByPostId(@PathVariable String postId) {
        List<EntityModel<Comment>> comments = commentService.getCommentsByPostId(postId).stream()
                .map(comment -> {
                    EntityModel<Comment> resource = EntityModel.of(comment);
                    addLinks(resource);
                    return resource;
                }).collect(Collectors.toList());

        return ResponseEntity.ok(CollectionModel.of(comments,
                linkTo(methodOn(CommentController.class).getCommentsByPostId(postId)).withSelfRel()));
    }

    //Get comments by a specific user
    @GetMapping("/user/{userId}")
    public ResponseEntity<CollectionModel<EntityModel<Comment>>> getCommentsByUserId(@PathVariable String userId) {
        List<EntityModel<Comment>> comments = commentService.getCommentsByUserId(userId).stream()
                .map(comment -> {
                    EntityModel<Comment> resource = EntityModel.of(comment);
                    addLinks(resource);
                    return resource;
                }).collect(Collectors.toList());

        return ResponseEntity.ok(CollectionModel.of(comments,
                linkTo(methodOn(CommentController.class).getCommentsByUserId(userId)).withSelfRel()));
    }

    // Update a comment
    @PutMapping("/{id}")
    public ResponseEntity<?> updateComment(@PathVariable String id, @RequestBody Comment updatedData) {
        try {
            Comment existingComment = commentService.getCommentById(id)
                    .orElseThrow(() -> new RuntimeException("Comment not found"));
            existingComment.setContent(updatedData.getContent());
            Comment updatedComment = commentService.updateComment(existingComment);
            EntityModel<Comment> resource = EntityModel.of(updatedComment);
            addLinks(resource);
            return ResponseEntity.ok(resource);
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

    // Add HATEOAS links
    private void addLinks(EntityModel<Comment> resource) {
        Comment comment = resource.getContent();
        if (comment != null) {
            resource.add(linkTo(methodOn(CommentController.class).getCommentById(comment.getId())).withSelfRel());
            resource.add(linkTo(methodOn(CommentController.class).getCommentsByPostId(comment.getPostId())).withRel("post-comments"));
            resource.add(linkTo(methodOn(CommentController.class).getCommentsByUserId(comment.getUserId())).withRel("user-comments"));
        }
    }
}
