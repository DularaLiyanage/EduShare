package com.edushare.backend.controller;

import com.edushare.backend.assembler.PostModelAssembler;
import com.edushare.backend.model.Post;
import com.edushare.backend.service.FileUploadService;
import com.edushare.backend.service.PostService;

import org.springframework.http.HttpStatus;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.hateoas.CollectionModel;
import org.springframework.hateoas.EntityModel;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import static org.springframework.hateoas.server.mvc.WebMvcLinkBuilder.linkTo;
import static org.springframework.hateoas.server.mvc.WebMvcLinkBuilder.methodOn;


import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/posts")
public class PostController {

    private final PostService postService;
    private final FileUploadService fileUploadService;
    private final PostModelAssembler assembler;

    @Autowired
    public PostController(PostService postService, FileUploadService fileUploadService, PostModelAssembler assembler) {
        this.postService = postService;
        this.fileUploadService = fileUploadService;
        this.assembler = assembler;
    }

    @PostMapping
    public ResponseEntity<?> createPost(
            @RequestParam("files") List<MultipartFile> files,
            @RequestParam("description") String description,
            @RequestParam("userId") String userId) {
        
        try {
            // Upload files to S3
            List<String> fileUrls = fileUploadService.uploadFiles(files, "posts");
            
            // Create a new post
            Post post = new Post();
            post.setUserId(userId);
            post.setDescription(description);
            post.setMediaUrls(fileUrls);
            
            // Save post to MongoDB
            Post savedPost = postService.createPost(post);
            
            return ResponseEntity
                .created(linkTo(methodOn(PostController.class).getPostById(savedPost.getId())).toUri())
                .body(savedPost);
            
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(Map.of("error", e.getMessage()));
        }
    }

    @GetMapping
    public ResponseEntity<CollectionModel<EntityModel<Post>>> getAllPosts() {
        List<Post> posts = postService.getAllPosts();
        List<EntityModel<Post>> models = posts.stream()
            .map(assembler::toModel)
            .collect(Collectors.toList());

        return ResponseEntity.ok(
            CollectionModel.of(models,
                linkTo(methodOn(PostController.class).getAllPosts()).withSelfRel()));
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getPostById(@PathVariable String id) {
        return postService.getPostById(id)
                .map(assembler::toModel)
                .map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<CollectionModel<EntityModel<Post>>> getPostsByUserId(@PathVariable String userId) {
        List<Post> posts = postService.getPostsByUserId(userId);
        List<EntityModel<Post>> postModels = posts.stream()
            .map(assembler::toModel)
            .collect(Collectors.toList());

        return ResponseEntity.ok(
            CollectionModel.of(postModels,
                linkTo(methodOn(PostController.class).getPostsByUserId(userId)).withSelfRel()));
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updatePost(
            @PathVariable String id,
            @RequestParam(value = "files", required = false) List<MultipartFile> files,
            @RequestParam("description") String description) {
        
        try {
            // Get existing post
            Post existingPost = postService.getPostById(id)
                    .orElseThrow(() -> new RuntimeException("Post not found"));
            
            // Update description
            existingPost.setDescription(description);
            
            // Update files if provided
            if (files != null && !files.isEmpty()) {
                // Delete existing files from S3
                if (existingPost.getMediaUrls() != null) {
                    for (String url : existingPost.getMediaUrls()) {
                        fileUploadService.deleteFile(url);
                    }
                }
                
                // Upload new files
                List<String> fileUrls = fileUploadService.uploadFiles(files, "posts");
                existingPost.setMediaUrls(fileUrls);
            }
            
            // Save updated post
            Post updatedPost = postService.updatePost(existingPost);
            
            return ResponseEntity.ok(assembler.toModel(updatedPost));
            
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(Map.of("error", e.getMessage()));
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deletePost(@PathVariable String id) {
        try {
            // Get post to delete
            Post post = postService.getPostById(id)
                    .orElseThrow(() -> new RuntimeException("Post not found"));
            
            // Delete files from S3
            if (post.getMediaUrls() != null) {
                for (String url : post.getMediaUrls()) {
                    fileUploadService.deleteFile(url);
                }
            }
            
            // Delete post from MongoDB
            postService.deletePost(id);
            
            return ResponseEntity.ok(Map.of(
                "message", "Post deleted successfully",
                "links", List.of(
                    linkTo(methodOn(PostController.class).getAllPosts()).withRel("all-posts").getHref()
                )
            ));
            
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(Map.of("error", e.getMessage()));
        }
    }

}