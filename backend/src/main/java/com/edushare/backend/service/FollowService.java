package com.edushare.backend.service;

import com.edushare.backend.model.Follow;
import com.edushare.backend.repository.FollowRepository;
import com.edushare.backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Map;
import java.util.HashMap;

@Service
public class FollowService {
    
    @Autowired
    private FollowRepository followRepository;
    
    @Autowired
    private UserRepository userRepository;

    public String followUser(String followerId, String followingId) {
        // Check if already following
        if (followRepository.findByFollowerIdAndFollowingId(followerId, followingId) != null) {
            return "Already following this user";
        }

        // Create new follow relationship
        Follow follow = new Follow();
        follow.setFollowerId(followerId);
        follow.setFollowingId(followingId);
        followRepository.save(follow);
        
        return "Successfully followed user";
    }

    public String unfollowUser(String followerId, String followingId) {
        Follow follow = followRepository.findByFollowerIdAndFollowingId(followerId, followingId);
        if (follow == null) {
            return "Not following this user";
        }
        
        followRepository.delete(follow);
        return "Successfully unfollowed user";
    }

    public List<Map<String, String>> getFollowers(String userId) {
        List<Follow> follows = followRepository.findByFollowingId(userId);
        return follows.stream().map(follow -> {
            Map<String, String> userInfo = new HashMap<>();
            userRepository.findById(follow.getFollowerId()).ifPresent(user -> {
                userInfo.put("id", user.getId());
                userInfo.put("fullName", user.getFullName());
                userInfo.put("avatarUrl", user.getAvatarUrl());
            });
            return userInfo;
        }).toList();
    }

    public List<Map<String, String>> getFollowing(String userId) {
        List<Follow> follows = followRepository.findByFollowerId(userId);
        return follows.stream().map(follow -> {
            Map<String, String> userInfo = new HashMap<>();
            userRepository.findById(follow.getFollowingId()).ifPresent(user -> {
                userInfo.put("id", user.getId());
                userInfo.put("fullName", user.getFullName());
                userInfo.put("avatarUrl", user.getAvatarUrl());
            });
            return userInfo;
        }).toList();
    }

    public Map<String, Long> getFollowCounts(String userId) {
        Map<String, Long> counts = new HashMap<>();
        counts.put("followers", followRepository.countByFollowingId(userId));
        counts.put("following", followRepository.countByFollowerId(userId));
        return counts;
    }
}