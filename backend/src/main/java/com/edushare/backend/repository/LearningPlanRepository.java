package com.edushare.backend.repository;

import com.edushare.backend.model.LearningPlanModel;
import org.springframework.data.mongodb.repository.MongoRepository;
import java.util.List;

public interface LearningPlanRepository extends MongoRepository<LearningPlanModel, String> {
    List<LearningPlanModel> findByUserID(String userID);
}
