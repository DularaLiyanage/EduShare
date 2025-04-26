package com.edushare.backend.repository;

import com.edushare.backend.model.LearningPlanModel;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface LearningPlanRepository extends MongoRepository<LearningPlanModel, String> {

}
