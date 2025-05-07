package com.edushare.backend.assembler;

import com.edushare.backend.controller.CommentController;
import com.edushare.backend.model.Comment;
import org.springframework.hateoas.EntityModel;
import org.springframework.hateoas.server.RepresentationModelAssembler;
import org.springframework.stereotype.Component;

import static org.springframework.hateoas.server.mvc.WebMvcLinkBuilder.*;

@Component
public class CommentModelAssembler implements RepresentationModelAssembler<Comment, EntityModel<Comment>> {

    @Override
    public EntityModel<Comment> toModel(Comment comment) {
        return EntityModel.of(comment,
                linkTo(methodOn(CommentController.class).getCommentById(comment.getId())).withSelfRel(),
                linkTo(methodOn(CommentController.class).getAllComments()).withRel("all-comments"),
                linkTo(methodOn(CommentController.class).getCommentsByPostId(comment.getPostId())).withRel("post-comments"),
                linkTo(methodOn(CommentController.class).getCommentsByUserId(comment.getUserId())).withRel("user-comments")
        );
    }
}