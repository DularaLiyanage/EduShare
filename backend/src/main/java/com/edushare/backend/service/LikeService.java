package com.edushare.backend.service;

import com.edushare.backend.model.Like;
import com.edushare.backend.model.Post;
import com.edushare.backend.repository.LikeRepository;
import com.edushare.backend.repository.PostRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Date;
import java.util.List;
import java.util.Optional;

@Service
public class LikeService {

    @Autowired
    private LikeRepository likeRepository;

    @Autowired
    private PostRepository postRepository;

    @Autowired
    private NotificationService notificationService;

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
                notificationService.createNotification(
                    recipientId,                       // who receives it
                    like.getUserId(),                  // who liked
                    like.getPostId(),
                    "LIKE",
                    "User " + like.getUserId() + " liked your post"
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
}
