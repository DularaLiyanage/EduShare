package com.edushare.backend.controller;

import com.edushare.backend.model.UserModel;
import com.edushare.backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/user")
public class UserController {

    @Autowired
    private UserRepository userRepository;

    @PostMapping("/register")
    public String registerUser(@RequestBody UserModel user) {
        userRepository.save(user);
        return "User registered successfully!";
    }

    @PostMapping("/login")
    public ResponseEntity<Object> loginUser(@RequestBody UserModel loginRequest) {
        return userRepository.findByEmail(loginRequest.getEmail())
                .filter(user -> user.getPassword().equals(loginRequest.getPassword()))
                .<ResponseEntity<Object>>map(user -> ResponseEntity.ok(Map.of(
                        "userId", user.getId(),
                        "fullName", user.getFullName()
                )))
                .orElse(ResponseEntity.status(401).body(Map.of(
                        "error", "Invalid email or password"
                )));
    }

}
