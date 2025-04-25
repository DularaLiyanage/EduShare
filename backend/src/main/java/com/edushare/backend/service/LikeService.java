package com.edushare.backend.service;

import com.edushare.backend.model.Like;
import com.edushare.backend.repository.LikeRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Date;
import java.util.List;
import java.util.Optional;

@Service
public class LikeService {

    @Autowired
    private LikeRepository likeRepository;

    // Like a post
    public String likePost(Like like) {
        Like existingLike = likeRepository.findByUserIdAndPostId(like.getUserId(), like.getPostId());
        if (existingLike != null) {
            return "User already liked this post";
        }
        like.setLikedAt(new Date());
        likeRepository.save(like);
        return "Post liked successfully";
    }

    // Unlike a post
    public String unlikePost(String userId, String postId) {
        Like existingLike = likeRepository.findByUserIdAndPostId(userId, postId);
        if (existingLike == null) {
            return "Like not found";
        }
        likeRepository.delete(existingLike);
        return "Post unliked successfully";
    }

    // Get likes by post ID
    public List<Like> getLikesByPostId(String postId) {
        return likeRepository.findByPostId(postId);
    }

    // Get total like count for a post
    public long countLikesByPostId(String postId) {
        return likeRepository.findByPostId(postId).size();
    }
}
