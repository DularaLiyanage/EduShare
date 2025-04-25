package com.edushare.backend.controller;

import com.edushare.backend.model.LearningPlanModel;
import com.edushare.backend.repository.LearningPlanRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/learningPlan")
public class LearningPlanController {

    @Autowired
    private LearningPlanRepository repository;

    @PostMapping
    public LearningPlanModel createLearningPlan(@RequestBody LearningPlanModel model) {
        return repository.save(model);
    }

    @GetMapping
    public List<LearningPlanModel> getAllLearningPlan() {
        return repository.findAll();
    }

    @GetMapping("/{id}")
    public LearningPlanModel getLearningPlanById(@PathVariable String id) {
        return repository.findById(id).orElse(null);
    }

    @PutMapping("/{id}")
    public LearningPlanModel updateLearningPlan(@PathVariable String id, @RequestBody LearningPlanModel updatedModel) {
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

    @DeleteMapping("/{id}")
    public void deleteLearningPlan(@PathVariable String id) {
        repository.deleteById(id);
    }
}
