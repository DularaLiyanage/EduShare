package com.edushare.backend.assembler;

import org.springframework.hateoas.EntityModel;
import org.springframework.hateoas.server.RepresentationModelAssembler;
import org.springframework.stereotype.Component;

import static org.springframework.hateoas.server.mvc.WebMvcLinkBuilder.linkTo;
import static org.springframework.hateoas.server.mvc.WebMvcLinkBuilder.methodOn;

import com.edushare.backend.controller.PostController;
import com.edushare.backend.model.Post;

@Component
public class PostModelAssembler implements RepresentationModelAssembler<Post, EntityModel<Post>> {

    @Override
    public EntityModel<Post> toModel(Post post) {
        return EntityModel.of(post,
            linkTo(methodOn(PostController.class).getPostById(post.getId())).withSelfRel(),
            linkTo(methodOn(PostController.class).getPostsByUserId(post.getUserId())).withRel("user-posts"));
    }
}