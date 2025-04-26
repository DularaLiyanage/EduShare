package com.edushare.backend.controller;

import com.edushare.backend.model.LearningPlanModel;
import com.edushare.backend.repository.LearningPlanRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.hateoas.CollectionModel;
import org.springframework.hateoas.EntityModel;
import org.springframework.hateoas.server.mvc.WebMvcLinkBuilder;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

import static org.springframework.hateoas.server.mvc.WebMvcLinkBuilder.*;

@RestController
@RequestMapping("/learningPlan")
public class LearningPlanController {

    @Autowired
    private LearningPlanRepository repository;

    // Create
    @PostMapping
    public EntityModel<LearningPlanModel> createLearningPlan(@RequestBody LearningPlanModel model) {
        LearningPlanModel savedModel = repository.save(model);
        return toModel(savedModel);
    }

    // Get all
    @GetMapping
    public CollectionModel<EntityModel<LearningPlanModel>> getAllLearningPlans() {
        List<EntityModel<LearningPlanModel>> plans = repository.findAll().stream()
                .map(this::toModel)
                .collect(Collectors.toList());

        return CollectionModel.of(plans,
                linkTo(methodOn(LearningPlanController.class).getAllLearningPlans()).withSelfRel());
    }

    // Get by id
    @GetMapping("/{id}")
    public EntityModel<LearningPlanModel> getLearningPlanById(@PathVariable String id) {
        LearningPlanModel model = repository.findById(id).orElse(null);
        if (model == null) {
            return null;
        }
        return toModel(model);
    }

    // Update
    @PutMapping("/{id}")
    public EntityModel<LearningPlanModel> updateLearningPlan(@PathVariable String id, @RequestBody LearningPlanModel updatedModel) {
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

            LearningPlanModel saved = repository.save(existingModel);
            return toModel(saved);
        }).orElse(null);
    }

    // Delete
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteLearningPlan(@PathVariable String id) {
        repository.deleteById(id);
        return ResponseEntity.noContent().build();
    }

    // New! Get learning plans by userId
    @GetMapping("/user/{userId}")
    public CollectionModel<EntityModel<LearningPlanModel>> getLearningPlansByUserId(@PathVariable String userId) {
        List<EntityModel<LearningPlanModel>> plans = repository.findAll().stream()
                .filter(plan -> plan.getUserID().equals(userId))
                .map(this::toModel)
                .collect(Collectors.toList());

        return CollectionModel.of(plans,
                linkTo(methodOn(LearningPlanController.class).getLearningPlansByUserId(userId)).withSelfRel());
    }

    // Helper: Convert Model to HATEOAS EntityModel
    private EntityModel<LearningPlanModel> toModel(LearningPlanModel model) {
        return EntityModel.of(model,
                linkTo(methodOn(LearningPlanController.class).getLearningPlanById(model.getId())).withSelfRel(),
                linkTo(methodOn(LearningPlanController.class).updateLearningPlan(model.getId(), model)).withRel("update"),
                linkTo(methodOn(LearningPlanController.class).deleteLearningPlan(model.getId())).withRel("delete"),
                linkTo(methodOn(LearningPlanController.class).getAllLearningPlans()).withRel("all-learningPlans")
        );
    }
}