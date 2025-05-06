package com.edushare.backend.controller;

import com.edushare.backend.model.Comment;
import com.edushare.backend.service.CommentService;
import com.edushare.backend.service.NotificationService;

import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import static org.springframework.hateoas.server.mvc.WebMvcLinkBuilder.*;
import com.edushare.backend.assembler.CommentModelAssembler;
import org.springframework.hateoas.EntityModel;
import org.springframework.hateoas.CollectionModel;

import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/comments")
public class CommentController {



    private final CommentService commentService;
    private final CommentModelAssembler assembler;

    private final NotificationService notificationService;


    @Autowired
public CommentController(CommentService commentService, CommentModelAssembler assembler, NotificationService notificationService) {
    this.commentService = commentService;
    this.assembler = assembler;
    this.notificationService = notificationService;
}


    @PostMapping
    public ResponseEntity<?> createComment(@RequestBody Comment comment) {
        try {
            Comment savedComment = commentService.createComment(comment);
            return ResponseEntity
                    .status(HttpStatus.CREATED)
                    .body(assembler.toModel(savedComment));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Map.of("error", e.getMessage()));
        }
    }

    @GetMapping
    public ResponseEntity<CollectionModel<EntityModel<Comment>>> getAllComments() {
        List<EntityModel<Comment>> comments = commentService.getAllComments()
                .stream()
                .map(assembler::toModel)
                .collect(Collectors.toList());

        return ResponseEntity.ok(
                CollectionModel.of(comments,
                        linkTo(methodOn(CommentController.class).getAllComments()).withSelfRel()));
    }

    @GetMapping("/{id}")
    public ResponseEntity<EntityModel<Comment>> getCommentById(@PathVariable String id) {
        return commentService.getCommentById(id)
                .map(assembler::toModel)
                .map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @GetMapping("/post/{postId}")
    public ResponseEntity<CollectionModel<EntityModel<Comment>>> getCommentsByPostId(@PathVariable String postId) {
        List<EntityModel<Comment>> comments = commentService.getCommentsByPostId(postId)
                .stream()
                .map(assembler::toModel)
                .collect(Collectors.toList());

        return ResponseEntity.ok(
                CollectionModel.of(comments,
                        linkTo(methodOn(CommentController.class).getCommentsByPostId(postId)).withSelfRel()));
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<CollectionModel<EntityModel<Comment>>> getCommentsByUserId(@PathVariable String userId) {
        List<EntityModel<Comment>> comments = commentService.getCommentsByUserId(userId)
                .stream()
                .map(assembler::toModel)
                .collect(Collectors.toList());

        return ResponseEntity.ok(
                CollectionModel.of(comments,
                        linkTo(methodOn(CommentController.class).getCommentsByUserId(userId)).withSelfRel()));
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateComment(@PathVariable String id, @RequestBody Comment updatedData) {
        try {
            Comment existingComment = commentService.getCommentById(id)
                    .orElseThrow(() -> new RuntimeException("Comment not found"));
            existingComment.setContent(updatedData.getContent());
            Comment updatedComment = commentService.updateComment(existingComment);
            return ResponseEntity.ok(assembler.toModel(updatedComment));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Map.of("error", e.getMessage()));
        }
    }

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
