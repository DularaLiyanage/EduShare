package com.edushare.backend.controller;

import com.edushare.backend.model.UserModel;
import com.edushare.backend.repository.UserRepository;
import com.edushare.backend.service.FileUploadService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.Map;
import java.util.HashMap;

@RestController
@RequestMapping("/api/user")
public class UserController {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private FileUploadService fileUploadService;

    @PostMapping(value = "/register", consumes = "multipart/form-data")
    public ResponseEntity<?> registerUser(
            @RequestParam("fullName") String fullName,
            @RequestParam("email") String email,
            @RequestParam("password") String password,
            @RequestParam(value = "avatar", required = false) MultipartFile avatar) {
        
        try {
            // Check if email already exists
            if (userRepository.findByEmail(email).isPresent()) {
                return ResponseEntity.badRequest()
                    .body(Map.of("error", "Email already registered"));
            }

            UserModel user = new UserModel();
            user.setFullName(fullName);
            user.setEmail(email);
            user.setPassword(password);

            // Upload avatar if provided
            if (avatar != null && !avatar.isEmpty()) {
                String avatarUrl = fileUploadService.uploadFile(avatar, "avatars");
                user.setAvatarUrl(avatarUrl);
            }

            UserModel savedUser = userRepository.save(user);
            return ResponseEntity.ok(Map.of(
                "message", "User registered successfully!",
                "userId", savedUser.getId(),
                "fullName", savedUser.getFullName(),
                "avatarUrl", savedUser.getAvatarUrl()
            ));
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                .body(Map.of("error", "Registration failed: " + e.getMessage()));
        }
    }

    @PostMapping("/login")
    public ResponseEntity<Object> loginUser(@RequestBody UserModel loginRequest) {
        return userRepository.findByEmail(loginRequest.getEmail())
                .filter(user -> user.getPassword().equals(loginRequest.getPassword()))
                .<ResponseEntity<Object>>map(user -> {
                    // Create a map with null-safe values
                    Map<String, String> response = new HashMap<>();
                    response.put("userId", user.getId() != null ? user.getId() : "");
                    response.put("fullName", user.getFullName() != null ? user.getFullName() : "");
                    response.put("avatarUrl", user.getAvatarUrl() != null ? user.getAvatarUrl() : "");
                    return ResponseEntity.ok(response);
                })
                .orElse(ResponseEntity.status(401).body(Map.of(
                        "error", "Invalid email or password"
                )));
    }

    @GetMapping("/{userId}")
    public ResponseEntity<?> getUserProfile(@PathVariable String userId) {
        return userRepository.findById(userId)
            .map(user -> {
                Map<String, Object> response = new HashMap<>();
                response.put("id", user.getId());
                response.put("fullName", user.getFullName());
                response.put("email", user.getEmail());
                response.put("avatarUrl", user.getAvatarUrl());
                return ResponseEntity.ok(response);
            })
            .orElse(ResponseEntity.notFound().build());
    }
}