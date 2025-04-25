package com.edushare.backend.repository;

import com.edushare.backend.model.Like;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;

public interface LikeRepository extends MongoRepository<Like, String> {
    Like findByUserIdAndPostId(String userId, String postId);

    List<Like> findByPostId(String postId);
}
