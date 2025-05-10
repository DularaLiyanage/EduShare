package com.edushare.backend.controller;

import com.edushare.backend.model.Comment;
import com.edushare.backend.service.CommentService;
import com.edushare.backend.service.NotificationService;
import com.edushare.backend.repository.UserRepository;
import com.edushare.backend.model.UserModel;


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
    private final UserRepository userRepository;

    private final NotificationService notificationService;


    @Autowired
public CommentController(CommentService commentService, CommentModelAssembler assembler, NotificationService notificationService, UserRepository userRepository) {
    this.commentService = commentService;
    this.assembler = assembler;
    this.notificationService = notificationService;
    this.userRepository = userRepository;

}


@PostMapping
public ResponseEntity<?> createComment(@RequestBody Comment comment) {
    try {
        Comment savedComment = commentService.createComment(comment);

        String postOwnerId = commentService.findPostOwnerId(comment.getPostId());
        if (!postOwnerId.equals(comment.getUserId())) {
            String commenterName = userRepository.findById(comment.getUserId())
                .map(UserModel::getFullName)
                .orElse("Someone");
        
            notificationService.createNotification(
                postOwnerId,
                comment.getUserId(),
                comment.getPostId(),
                "COMMENT",
                commenterName + " commented on your post"
            );
        }
        


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
    List<Comment> rawComments = commentService.getCommentsByPostId(postId);

    // Inject user full names into comments
    for (Comment comment : rawComments) {
        userRepository.findById(comment.getUserId()).ifPresent(user ->
            comment.setUserFullName(user.getFullName())
        );
    }

    List<EntityModel<Comment>> comments = rawComments
            .stream()
            .map(assembler::toModel)
            .collect(Collectors.toList());

    return ResponseEntity.ok(
            CollectionModel.of(comments,
                    linkTo(methodOn(CommentController.class).getCommentsByPostId(postId)).withSelfRel()));
}

    @GetMapping("/user/{userId}")
    public ResponseEntity<CollectionModel<EntityModel<Comment>>> getCommentsByUserId(@PathVariable String userId) {
        List<Comment> comments = commentService.getCommentsByUserId(userId);
        
        // Inject user full names into comments
        for (Comment comment : comments) {
            userRepository.findById(comment.getUserId()).ifPresent(user ->
                comment.setUserFullName(user.getFullName())
            );
        }

        List<EntityModel<Comment>> commentModels = comments
                .stream()
                .map(assembler::toModel)
                .collect(Collectors.toList());

        return ResponseEntity.ok(
                CollectionModel.of(commentModels,
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
