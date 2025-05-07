package com.edushare.backend.service;

import com.edushare.backend.model.Like;
import com.edushare.backend.model.Post;
import com.edushare.backend.repository.LikeRepository;
import com.edushare.backend.repository.PostRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import com.edushare.backend.repository.UserRepository;

import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Optional;
import java.util.Map;


@Service
public class LikeService {

    @Autowired
    private LikeRepository likeRepository;

    @Autowired
    private PostRepository postRepository;

    @Autowired
    private NotificationService notificationService;

    @Autowired
private UserRepository userRepository;

    public String likePost(Like like) {
        Like existingLike = likeRepository.findByUserIdAndPostId(like.getUserId(), like.getPostId());
        if (existingLike != null) {
            return "User already liked this post";
        }
    
        like.setLikedAt(new Date());
        likeRepository.save(like);
    
        // ✅ Fetch post owner
        Optional<Post> postOptional = postRepository.findById(like.getPostId());
        if (postOptional.isPresent()) {
            String recipientId = postOptional.get().getUserId();
    
            // ✅ Prevent notifying yourself
            if (!recipientId.equals(like.getUserId())) {
                String fullName = userRepository.findById(like.getUserId())
    .map(user -> user.getFullName())
    .orElse("Someone");

notificationService.createNotification(
    recipientId,
    like.getUserId(),
    like.getPostId(),
    "LIKE",
    fullName + " liked your post"
);

            }
        }
    
        return "Post liked successfully";
    }
    

    public String unlikePost(String userId, String postId) {
        Like existingLike = likeRepository.findByUserIdAndPostId(userId, postId);
        if (existingLike == null) {
            return "Like not found";
        }
        likeRepository.delete(existingLike);
        return "Post unliked successfully";
    }

    public List<Like> getLikesByPostId(String postId) {
        return likeRepository.findByPostId(postId);
    }

    public long countLikesByPostId(String postId) {
        return likeRepository.findByPostId(postId).size();
    }

    public List<String> getLikedPostIdsByUser(String userId) {
        return likeRepository.findByUserId(userId)
                .stream()
                .map(Like::getPostId)
                .toList();
    }

    public List<Map<String, String>> getUsersWhoLikedPost(String postId) {
    List<Like> likes = likeRepository.findByPostId(postId);

    return likes.stream().map(like -> {
        String userId = like.getUserId();
        String fullName = userRepository.findById(userId)
            .map(user -> user.getFullName())
            .orElse("Unknown User");

        Map<String, String> map = new HashMap<>();
        map.put("userId", userId);
        map.put("fullName", fullName);
        return map;
    }).toList();
}
    
}
