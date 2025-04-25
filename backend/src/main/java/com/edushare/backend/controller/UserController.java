package com.edushare.backend.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import com.edushare.backend.model.User;
import com.edushare.backend.service.UserService;

import java.util.Optional;

@RestController
@RequestMapping("/api/users")
public class UserController {

    @Autowired
    private UserService userService;

    @PostMapping("/register")
    public User register(@RequestBody User user) {
        return userService.registerUser(user);
    }

    @PostMapping("/login")
    public Optional<User> login(@RequestBody User user) {
        return userService.login(user.getUsername(), user.getPassword());
    }

    @GetMapping("/profile/{username}")
    public Optional<User> getProfile(@PathVariable String username) {
        return userService.getUserProfile(username);
    }
}
