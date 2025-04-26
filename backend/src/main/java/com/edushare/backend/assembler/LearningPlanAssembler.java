package com.edushare.backend.assembler;

import org.springframework.hateoas.EntityModel;
import org.springframework.hateoas.server.RepresentationModelAssembler;
import org.springframework.stereotype.Component;

import com.edushare.backend.controller.LearningPlanController;
import com.edushare.backend.model.LearningPlanModel;

import static org.springframework.hateoas.server.mvc.WebMvcLinkBuilder.*;

@Component
public class LearningPlanAssembler implements RepresentationModelAssembler<LearningPlanModel, EntityModel<LearningPlanModel>> {

    @Override
    public EntityModel<LearningPlanModel> toModel(LearningPlanModel model) {
        return EntityModel.of(model,
                linkTo(methodOn(LearningPlanController.class).getLearningPlanById(model.getId())).withSelfRel(),
                linkTo(methodOn(LearningPlanController.class).updateLearningPlan(model.getId(), model)).withRel("update"),
                linkTo(methodOn(LearningPlanController.class).deleteLearningPlan(model.getId())).withRel("delete"),
                linkTo(methodOn(LearningPlanController.class).getAllLearningPlans()).withRel("all-learningPlans")
        );
    }
}