package com.edushare.backend.service;

import com.edushare.backend.model.Comment;
import com.edushare.backend.model.Post;
import com.edushare.backend.repository.CommentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class CommentService {

    private final CommentRepository commentRepository;

    @Autowired
    public CommentService(CommentRepository commentRepository) {
        this.commentRepository = commentRepository;
    }
    @Autowired
    private PostService postService;
    
    // Create comment
    public Comment createComment(Comment comment) {
        comment.setCreatedAt(LocalDateTime.now());
        comment.setUpdatedAt(LocalDateTime.now());
        return commentRepository.save(comment);
    }

    // Get all comments
    public List<Comment> getAllComments() {
        return commentRepository.findAll();
    }

    // Get comment by ID
    public Optional<Comment> getCommentById(String id) {
        return commentRepository.findById(id);
    }

    // Get comments by post
    public List<Comment> getCommentsByPostId(String postId) {
        return commentRepository.findByPostId(postId);
    }

    // Get comments by user
    public List<Comment> getCommentsByUserId(String userId) {
        return commentRepository.findByUserId(userId);
    }

    // Update comment
    public Comment updateComment(Comment comment) {
        comment.setUpdatedAt(LocalDateTime.now());
        return commentRepository.save(comment);
    }

    // Delete comment
    public void deleteComment(String id) {
        commentRepository.deleteById(id);
    }

    public String findPostOwnerId(String postId) {
    return postService.getPostById(postId)
            .map(Post::getUserId)
            .orElseThrow(() -> new RuntimeException("Post not found for ID: " + postId));
}

}
