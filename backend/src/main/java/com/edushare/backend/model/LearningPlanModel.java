package com.edushare.backend.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "learningPlan")
public class LearningPlanModel {
    @Id
    private String id;
    private String fullName;
    private String userID;
    private String projectName;
    private String projectLink;
    private String workingOnStatus;
    private String milestones;
    private String skills;
    private String timeline;
    private String progress;

    public LearningPlanModel() {

    }

    public LearningPlanModel(String id, String fullName, String userID, String projectName, String projectLink, String workingOnStatus, String milestones, String skills, String timeline, String progress) {
        this.id = id;
        this.fullName = fullName;
        this.userID = userID;
        this.projectName = projectName;
        this.projectLink = projectLink;
        this.workingOnStatus = workingOnStatus;
        this.milestones = milestones;
        this.skills = skills;
        this.timeline = timeline;
        this.progress = progress;
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getFullName() {
        return fullName;
    }

    public void setFullName(String fullName) {
        this.fullName = fullName;
    }

    public String getUserID() {
        return userID;
    }

    public void setUserID(String userID) {
        this.userID = userID;
    }

    public String getProjectName() {
        return projectName;
    }

    public void setProjectName(String projectName) {
        this.projectName = projectName;
    }

    public String getProjectLink() {
        return projectLink;
    }

    public void setProjectLink(String projectLink) {
        this.projectLink = projectLink;
    }

    public String getWorkingOnStatus() {
        return workingOnStatus;
    }

    public void setWorkingOnStatus(String workingOnStatus) {
        this.workingOnStatus = workingOnStatus;
    }

    public String getMilestones() {
        return milestones;
    }

    public void setMilestones(String milestones) {
        this.milestones = milestones;
    }

    public String getSkills() {
        return skills;
    }

    public void setSkills(String skills) {
        this.skills = skills;
    }

    public String getTimeline() {
        return timeline;
    }

    public void setTimeline(String timeline) {
        this.timeline = timeline;
    }

    public String getProgress() {
        return progress;
    }

    public void setProgress(String progress) {
        this.progress = progress;
    }
}
