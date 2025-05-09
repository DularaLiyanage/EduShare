package com.edushare.backend.service;

import com.edushare.backend.model.LearningPlanModel;
import com.edushare.backend.repository.LearningPlanRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class LearningPlanService {

    @Autowired
    private LearningPlanRepository repository;

    public LearningPlanModel createLearningPlan(LearningPlanModel model) {
        return repository.save(model);
    }

    public List<LearningPlanModel> getAllLearningPlans() {
        return repository.findAll();
    }

    public Optional<LearningPlanModel> getLearningPlanById(String id) {
        return repository.findById(id);
    }

    public List<LearningPlanModel> getLearningPlansByUserId(String userId) {
        return repository.findByUserID(userId);
    }

    public LearningPlanModel updateLearningPlan(String id, LearningPlanModel updatedModel) {
        return repository.findById(id).map(existingModel -> {
            existingModel.setFullName(updatedModel.getFullName());
            existingModel.setUserID(updatedModel.getUserID());
            existingModel.setProjectName(updatedModel.getProjectName());
            existingModel.setProjectLink(updatedModel.getProjectLink());
            existingModel.setWorkingOnStatus(updatedModel.getWorkingOnStatus());
            existingModel.setMilestones(updatedModel.getMilestones());
            existingModel.setSkills(updatedModel.getSkills());
            existingModel.setTimeline(updatedModel.getTimeline());
            existingModel.setProgress(updatedModel.getProgress());
            return repository.save(existingModel);
        }).orElse(null);
    }

    public void deleteLearningPlan(String id) {
        repository.deleteById(id);
    }
}
