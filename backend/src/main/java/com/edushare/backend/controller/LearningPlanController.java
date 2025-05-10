package com.edushare.backend.controller;

import com.edushare.backend.model.LearningPlanModel;
import com.edushare.backend.service.LearningPlanService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/learningPlan")  // <- Make sure this matches
public class LearningPlanController {

    @Autowired
    private LearningPlanService service;

    @PostMapping
    public ResponseEntity<LearningPlanModel> createLearningPlan(@RequestBody LearningPlanModel model) {
        LearningPlanModel savedModel = service.createLearningPlan(model);
        return ResponseEntity.ok(savedModel);
    }

    @GetMapping
    public List<LearningPlanModel> getAllLearningPlans() {
        return service.getAllLearningPlans();
    }

    @GetMapping("/{id}")
    public ResponseEntity<LearningPlanModel> getLearningPlanById(@PathVariable String id) {
        return service.getLearningPlanById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PutMapping("/{id}")
    public ResponseEntity<LearningPlanModel> updateLearningPlan(@PathVariable String id, @RequestBody LearningPlanModel updatedModel) {
        LearningPlanModel updated = service.updateLearningPlan(id, updatedModel);
        if (updated == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(updated);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteLearningPlan(@PathVariable String id) {
        service.deleteLearningPlan(id);
        return ResponseEntity.noContent().build();
    }
}

